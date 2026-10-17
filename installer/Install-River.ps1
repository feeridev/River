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

New-Item -ItemType Directory -Force -Path $ConfigDir, $MongoData, $MongoLogs | Out-Null
# Install MongoDB binaries if needed.
$mongoExe = Get-ChildItem "$env:ProgramFiles\MongoDB\Server\*\bin\mongod.exe" `
    -ErrorAction SilentlyContinue |
    Sort-Object FullName -Descending |
    Select-Object -First 1

if (-not $mongoExe) {
    if (-not (Test-Path $MongoMsi)) {
        throw "Bundled MongoDB MSI is missing."
    }

    $process = Start-Process -FilePath "msiexec.exe" `
        -ArgumentList @(
            "/i", "`"$MongoMsi`"",
            "/qn", "/norestart",
            "ADDLOCAL=ServerNoService",
            "SHOULD_INSTALL_COMPASS=0"
        ) -Wait -PassThru

    if ($process.ExitCode -notin @(0, 3010)) {
        throw "MongoDB installation failed with exit code $($process.ExitCode)."
    }

    $mongoExe = Get-ChildItem "$env:ProgramFiles\MongoDB\Server\*\bin\mongod.exe" `
        -ErrorAction SilentlyContinue |
        Sort-Object FullName -Descending |
        Select-Object -First 1
}

if (-not $mongoExe) {
    throw "MongoDB server executable was not found."
}

# Preserve MongoDB configuration and data across upgrades.
if (-not (Test-Path $MongoConfig)) {
    $templatePath = Join-Path $AppDir "mongod.cfg.template"
    if (-not (Test-Path $templatePath)) {
        throw "MongoDB configuration template is missing."
    }

    $template = Get-Content $templatePath -Raw
    $config = $template.Replace("__RIVER_DATA_PATH__", ($MongoData -replace '\\','/'))
    $config = $config.Replace("__RIVER_LOG_PATH__", ((Join-Path $MongoLogs "mongod.log") -replace '\\','/'))
    Set-Content -Path $MongoConfig -Value $config -Encoding ascii
}


# Create the dedicated MongoDB Windows service if needed.
$mongoService = Get-Service -Name $MongoService -ErrorAction SilentlyContinue

if (-not $mongoService) {
    # These arguments contain no spaces, avoiding ambiguous native argument quoting.
    $mongoArguments = @(
        '--config'
        $MongoConfig
        '--install'
        '--serviceName'
        $MongoService
    )

    $mongoProcess = Start-Process `
        -FilePath $mongoExe.FullName `
        -ArgumentList $mongoArguments `
        -Wait `
        -PassThru `
        -NoNewWindow

    if ($mongoProcess.ExitCode -ne 0) {
        throw "Could not register the River MongoDB service. MongoDB exit code: $($mongoProcess.ExitCode)"
    }
}

Set-Service -Name $MongoService -StartupType Automatic
Start-Service -Name $MongoService

# Generate customer configuration only on first installation.
if (-not (Test-Path $EnvFile)) {
    $bytes = New-Object byte[] 48
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    try {
        $rng.GetBytes($bytes)
    } finally {
        $rng.Dispose()
    }

    $secret = [Convert]::ToBase64String($bytes)
    @(
        "PORT=5000"
        "MONGODB_URI=mongodb://127.0.0.1:27017/river"
        "JWT_SECRET=$secret"
    ) | Set-Content -Path $EnvFile -Encoding ascii
}

# Restrict the JWT secret to SYSTEM and local Administrators.
& icacls.exe $EnvFile /inheritance:r /grant:r `
    "*S-1-5-18:(F)" "*S-1-5-32-544:(F)" | Out-Null

if ($LASTEXITCODE -ne 0) {
    throw "Could not secure the River configuration file."
}

# Wait for MongoDB to accept local TCP connections.
$deadline = (Get-Date).AddMinutes(2)
$ready = $false

do {
    $tcp = $null
    try {
        $tcp = New-Object System.Net.Sockets.TcpClient
        $connect = $tcp.BeginConnect("127.0.0.1", 27017, $null, $null)
        if ($connect.AsyncWaitHandle.WaitOne(1000)) {
            $tcp.EndConnect($connect)
            $ready = $true
        }
    } catch {
        # Retry until timeout.
    } finally {
        if ($tcp) { $tcp.Close() }
    }

    if (-not $ready) { Start-Sleep -Seconds 2 }
} until ($ready -or (Get-Date) -ge $deadline)

if (-not $ready) {
    throw "River MongoDB did not become ready on localhost:27017."
}

# Generate WinSW service configuration using the persistent .env path.
if (-not (Test-Path $RiverServiceExe)) {
    throw "River service wrapper is missing."
}

$serviceTemplatePath = Join-Path $AppDir "RiverService.xml.template"
if (-not (Test-Path $serviceTemplatePath)) {
    throw "River service template is missing."
}

$xml = Get-Content $serviceTemplatePath -Raw
$xml = $xml.Replace("__RIVER_CONFIG_PATH__", $EnvFile)
Set-Content -Path $RiverServiceXml -Value $xml -Encoding utf8

# Install or refresh the River Windows service.
$existingRiverService = Get-Service -Name "River" -ErrorAction SilentlyContinue

if ($existingRiverService) {
    & $RiverServiceExe stop
    & $RiverServiceExe uninstall
}

& $RiverServiceExe install
if ($LASTEXITCODE -ne 0) {
    throw "Could not register the River application service."
}

& $RiverServiceExe start
if ($LASTEXITCODE -ne 0) {
    throw "Could not start the River application service."
}

# Wait until River responds to its health endpoint.
$deadline = (Get-Date).AddMinutes(2)
$ready = $false

do {
    try {
        $response = Invoke-WebRequest `
            -Uri "http://127.0.0.1:5000/api/health" `
            -UseBasicParsing `
            -TimeoutSec 5

        if ($response.StatusCode -eq 200) {
            $ready = $true
        }
    } catch {
        # The service may still be starting; retry until timeout.
    }

    if (-not $ready) {
        Start-Sleep -Seconds 2
    }
} until ($ready -or (Get-Date) -ge $deadline)

if (-not $ready) {
    throw "River did not become healthy at http://127.0.0.1:5000/api/health within two minutes."
}

Write-Output "River and its local database service are installed and healthy."
