$ErrorActionPreference = "Stop"

# Persist installation diagnostics on the customer's Windows PC.
$InstallLogDir = Join-Path $env:ProgramData "River\MongoDB\logs"
New-Item -ItemType Directory -Force -Path $InstallLogDir | Out-Null

$InstallLog = Join-Path $InstallLogDir "river-install.log"
Start-Transcript -Path $InstallLog -Append | Out-Null

trap {
    Write-Host ("INSTALLATION FAILED: " + $_.Exception.Message)
    Write-Host ($_ | Out-String)
    try { Stop-Transcript | Out-Null } catch {}
    exit 1
}

$AppDir = Join-Path $env:ProgramFiles "River"
$DataRoot = Join-Path $env:ProgramData "River"
$ConfigDir = Join-Path $DataRoot "config"
$MongoRoot = Join-Path $DataRoot "MongoDB"
$MongoData = Join-Path $MongoRoot "data"
$MongoLogs = Join-Path $MongoRoot "logs"
$MongoConfig = Join-Path $MongoRoot "mongod.cfg"
$MongoService = "RiverMongoDB"
$EnvFile = Join-Path $ConfigDir ".env"
$MongoMsi = Join-Path $AppDir "mongodb-windows-x64.msi"
$RiverServiceExe = Join-Path $AppDir "RiverService.exe"
$RiverServiceXml = Join-Path $AppDir "RiverService.xml"
$MongoLogFile = Join-Path $MongoLogs "mongod.log"

New-Item -ItemType Directory -Force -Path @(
    $ConfigDir
    $MongoData
    $MongoLogs
) | Out-Null

# Locate an installed MongoDB server binary.
# Reuse an existing installation instead of installing another version.
$mongoExe = Get-ChildItem `
    -Path (Join-Path $env:ProgramFiles "MongoDB\Server\*\bin\mongod.exe") `
    -ErrorAction SilentlyContinue |
    Sort-Object FullName -Descending |
    Select-Object -First 1

if (-not $mongoExe) {
    if (-not (Test-Path -LiteralPath $MongoMsi)) {
        throw "Bundled MongoDB MSI is missing: $MongoMsi"
    }

    Write-Output "Installing the bundled MongoDB server..."

    $msiArguments = @(
        "/i"
        "`"$MongoMsi`""
        "/qn"
        "/norestart"
        "ADDLOCAL=ServerNoService"
        "SHOULD_INSTALL_COMPASS=0"
    )

    $process = Start-Process `
        -FilePath "msiexec.exe" `
        -ArgumentList $msiArguments `
        -Wait `
        -PassThru

    if ($process.ExitCode -notin @(0, 3010)) {
        throw "MongoDB installation failed with exit code $($process.ExitCode)."
    }

    $mongoExe = Get-ChildItem `
        -Path (Join-Path $env:ProgramFiles "MongoDB\Server\*\bin\mongod.exe") `
        -ErrorAction SilentlyContinue |
        Sort-Object FullName -Descending |
        Select-Object -First 1
}

if (-not $mongoExe) {
    throw "MongoDB server executable was not found under $env:ProgramFiles\MongoDB\Server."
}

Write-Output "MongoDB executable: $($mongoExe.FullName)"

# Create the MongoDB configuration only on first installation.
# Preserve existing configuration and data during upgrades.
if (-not (Test-Path -LiteralPath $MongoConfig)) {
    $templatePath = Join-Path $AppDir "mongod.cfg.template"

    if (-not (Test-Path -LiteralPath $templatePath)) {
        throw "MongoDB configuration template is missing: $templatePath"
    }

    $template = Get-Content -LiteralPath $templatePath -Raw

    $config = $template.Replace(
        "__RIVER_DATA_PATH__",
        ($MongoData -replace '\\', '/')
    )

    $config = $config.Replace(
        "__RIVER_LOG_PATH__",
        ($MongoLogFile -replace '\\', '/')
    )

    Set-Content -LiteralPath $MongoConfig -Value $config -Encoding ascii
}

Write-Output "MongoDB configuration: $MongoConfig"

# Validate the configuration before registering or starting the service.
# mongod --config <path> --outputConfig prints the effective configuration.
# Do not use --install for this validation step.
Write-Output "Validating MongoDB configuration..."

& $mongoExe.FullName --config "$MongoConfig" --outputConfig 2>&1 |
    ForEach-Object { Write-Output $_ }

if ($LASTEXITCODE -ne 0) {
    throw "MongoDB configuration validation failed with exit code $LASTEXITCODE. Check the configuration and installer log."
}

# Register River's dedicated MongoDB service if it does not exist.
# Use direct invocation so PowerShell handles the executable arguments.
# The existing default MongoDB service is not modified.
$mongoService = Get-Service -Name $MongoService -ErrorAction SilentlyContinue

if (-not $mongoService) {
    Write-Output "Registering the $MongoService Windows service..."

    & $mongoExe.FullName `
        --config "$MongoConfig" `
        --install `
        --serviceName "$MongoService"

    $mongoExitCode = $LASTEXITCODE

    if ($mongoExitCode -ne 0) {
        throw "Could not register the $MongoService service. MongoDB exit code: $mongoExitCode. Review the MongoDB command output above."
    }
}

# Confirm Windows can see the newly registered service.
$mongoService = Get-Service -Name $MongoService -ErrorAction SilentlyContinue

if (-not $mongoService) {
    throw "MongoDB reported successful registration, but Windows cannot find the $MongoService service."
}

Set-Service -Name $MongoService -StartupType Automatic

$mongoService = Get-Service -Name $MongoService

if ($mongoService.Status -ne "Running") {
    Write-Output "Starting the $MongoService service..."
    Start-Service -Name $MongoService
}

# Generate customer configuration only on first installation.
# Keep the existing JWT secret and connection settings on upgrades.
if (-not (Test-Path -LiteralPath $EnvFile)) {
    Write-Output "Creating the initial River environment configuration..."

    $bytes = New-Object byte[] 48
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()

    try {
        $rng.GetBytes($bytes)
    }
    finally {
        $rng.Dispose()
    }

    $secret = [Convert]::ToBase64String($bytes)

    @(
        "PORT=5000"
        "MONGODB_URI=mongodb://127.0.0.1:27017/river"
        "JWT_SECRET=$secret"
    ) | Set-Content -LiteralPath $EnvFile -Encoding ascii
}

# Restrict the JWT secret to SYSTEM and local Administrators.
& icacls.exe $EnvFile /inheritance:r /grant:r `
    "*S-1-5-18:(F)" `
    "*S-1-5-32-544:(F)" 2>&1 |
    ForEach-Object { Write-Output $_ }

$aclExitCode = $LASTEXITCODE

if ($aclExitCode -ne 0) {
    throw "Could not secure the River configuration file. icacls exit code: $aclExitCode"
}

# Wait for MongoDB to accept local TCP connections.
Write-Output "Waiting for MongoDB on localhost:27017..."

$deadline = (Get-Date).AddMinutes(2)
$mongoReady = $false

do {
    $tcp = $null

    try {
        $tcp = New-Object System.Net.Sockets.TcpClient
        $connect = $tcp.BeginConnect("127.0.0.1", 27017, $null, $null)

        if ($connect.AsyncWaitHandle.WaitOne(1000)) {
            $tcp.EndConnect($connect)
            $mongoReady = $true
        }

        $connect.AsyncWaitHandle.Close()
    }
    catch {
        # MongoDB may still be starting; retry until timeout.
    }
    finally {
        if ($tcp) {
            $tcp.Close()
        }
    }

    if (-not $mongoReady) {
        Start-Sleep -Seconds 2
    }
}
until ($mongoReady -or (Get-Date) -ge $deadline)

if (-not $mongoReady) {
    $mongoService = Get-Service -Name $MongoService -ErrorAction SilentlyContinue

    if ($mongoService) {
        Write-Output "MongoDB service status: $($mongoService.Status)"
    }

    throw "River MongoDB did not become ready on localhost:27017 within two minutes. Check $MongoLogFile."
}

# Verify the River service wrapper and its configuration template.
if (-not (Test-Path -LiteralPath $RiverServiceExe)) {
    throw "River service wrapper is missing: $RiverServiceExe"
}

$serviceTemplatePath = Join-Path $AppDir "RiverService.xml.template"

if (-not (Test-Path -LiteralPath $serviceTemplatePath)) {
    throw "River service template is missing: $serviceTemplatePath"
}

# Generate WinSW service configuration using the persistent .env path.
$xml = Get-Content -LiteralPath $serviceTemplatePath -Raw
$xml = $xml.Replace("__RIVER_CONFIG_PATH__", $EnvFile)

Set-Content -LiteralPath $RiverServiceXml -Value $xml -Encoding utf8

# Stop an existing River service before refreshing its registration.
$existingRiverService = Get-Service -Name "River" -ErrorAction SilentlyContinue

if ($existingRiverService) {
    Write-Output "Stopping the existing River service..."

    & $RiverServiceExe stop 2>&1 |
        ForEach-Object { Write-Output $_ }

    $stopExitCode = $LASTEXITCODE

    if ($stopExitCode -ne 0) {
        throw "Could not stop the existing River service. WinSW exit code: $stopExitCode"
    }

    & $RiverServiceExe uninstall 2>&1 |
        ForEach-Object { Write-Output $_ }

    $uninstallExitCode = $LASTEXITCODE

    if ($uninstallExitCode -ne 0) {
        throw "Could not unregister the existing River service. WinSW exit code: $uninstallExitCode"
    }
}

# Register the River application service.
Write-Output "Registering the River application service..."

& $RiverServiceExe install 2>&1 |
    ForEach-Object { Write-Output $_ }

$riverInstallExitCode = $LASTEXITCODE

if ($riverInstallExitCode -ne 0) {
    throw "Could not register the River application service. WinSW exit code: $riverInstallExitCode"
}

# Configure automatic startup and start River.
Set-Service -Name "River" -StartupType Automatic

Write-Output "Starting the River application service..."

& $RiverServiceExe start 2>&1 |
    ForEach-Object { Write-Output $_ }

$riverStartExitCode = $LASTEXITCODE

if ($riverStartExitCode -ne 0) {
    throw "Could not start the River application service. WinSW exit code: $riverStartExitCode"
}

# Wait until River responds to its health endpoint.
Write-Output "Waiting for River at http://127.0.0.1:5000/api/health..."

$deadline = (Get-Date).AddMinutes(2)
$riverReady = $false

do {
    try {
        $response = Invoke-WebRequest `
            -Uri "http://127.0.0.1:5000/api/health" `
            -UseBasicParsing `
            -TimeoutSec 5

        if ($response.StatusCode -eq 200) {
            $riverReady = $true
        }
    }
    catch {
        # The service may still be starting; retry until timeout.
    }

    if (-not $riverReady) {
        Start-Sleep -Seconds 2
    }
}
until ($riverReady -or (Get-Date) -ge $deadline)

if (-not $riverReady) {
    $riverService = Get-Service -Name "River" -ErrorAction SilentlyContinue

    if ($riverService) {
        Write-Output "River service status: $($riverService.Status)"
    }

    throw "River did not become healthy at http://127.0.0.1:5000/api/health within two minutes. Check the River service logs and configuration."
}

Write-Output "River and its local database service are installed and healthy."

try {
    Stop-Transcript | Out-Null
}
catch {
    # The installation is already complete.
}

exit 0
