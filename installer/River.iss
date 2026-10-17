#define RiverVersion "0.1.0"

[Setup]
AppId={{A83D5A77-29B6-4CB9-9A17-8D6A7B2F41E3}
AppName=River Helpdesk
AppVersion={#RiverVersion}
AppPublisher=FarshadDev
DefaultDirName={autopf}\River
DefaultGroupName=River Helpdesk
OutputDir=output
OutputBaseFilename=River-Setup
Compression=lzma2
SolidCompression=yes
PrivilegesRequired=admin
ArchitecturesInstallIn64BitMode=x64
UninstallDisplayIcon={app}\RiverService.exe
WizardStyle=modern
CloseApplications=yes

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Dirs]
Name: "{commonappdata}\River"
Name: "{commonappdata}\River\config"
Name: "{commonappdata}\River\MongoDB\data"
Name: "{commonappdata}\River\MongoDB\logs"

[Files]
Source: "payload\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "mongod.cfg.template"; DestDir: "{app}"; Flags: ignoreversion
Source: "Install-River.ps1"; DestDir: "{app}"; Flags: ignoreversion
Source: "RiverService.xml.template"; DestDir: "{app}"; Flags: ignoreversion
Source: "mongodb-windows-x64.msi"; DestDir: "{app}"; Flags: ignoreversion

[Tasks]
Name: "desktopicon"; Description: "Create a &desktop shortcut"; GroupDescription: "Additional shortcuts:"

[Icons]
Name: "{group}\River Helpdesk"; Filename: "http://127.0.0.1:5000"
Name: "{autodesktop}\River Helpdesk"; Filename: "http://127.0.0.1:5000"; Tasks: desktopicon
Name: "{group}\Uninstall River Helpdesk"; Filename: "{uninstallexe}"

[Run]
; Open River only after the installation script succeeds.
Filename: "http://127.0.0.1:5000"; Flags: shellexec

[Code]
function PrepareToInstall(var NeedsRestart: Boolean): String;
var
  ResultCode: Integer;
  ServiceExe: String;
begin
  Result := '';
  ServiceExe := ExpandConstant('{app}\RiverService.exe');

  { Stop the existing service before application files are replaced. }
  if FileExists(ServiceExe) then begin
    if not Exec(ExpandConstant('{sys}\sc.exe'), 'query River', '',
      SW_HIDE, ewWaitUntilTerminated, ResultCode) then begin
      Result := 'Could not check the existing River service.';
      exit;
    end;

    if ResultCode = 0 then begin
      if not Exec(ServiceExe, 'stop', '', SW_HIDE,
        ewWaitUntilTerminated, ResultCode) then begin
        Result := 'Could not run the River service wrapper to stop the service.';
        exit;
      end;

      if ResultCode <> 0 then begin
        Result := 'Could not stop the existing River service. Exit code: ' +
          IntToStr(ResultCode);
        exit;
      end;
    end;
  end;
end;

procedure CurStepChanged(CurStep: TSetupStep);
var
  ResultCode: Integer;
  PowerShellExe: String;
  ScriptPath: String;
begin
  if CurStep = ssPostInstall then begin
    PowerShellExe := ExpandConstant(
      '{sys}\WindowsPowerShell\v1.0\powershell.exe');
    ScriptPath := ExpandConstant('{app}\Install-River.ps1');

    if not Exec(PowerShellExe,
      '-NoProfile -ExecutionPolicy Bypass -File "' + ScriptPath + '"',
      '', SW_HIDE, ewWaitUntilTerminated, ResultCode) then
      RaiseException('Could not launch the River installation script.');

    if ResultCode <> 0 then
      RaiseException('River installation failed with exit code ' +
        IntToStr(ResultCode) +
        '. The browser will not be opened. Check the installer log and retry.');
  end;
end;

[UninstallRun]
Filename: "{app}\RiverService.exe"; Parameters: "stop"; Flags: runhidden waituntilterminated; RunOnceId: "StopRiver"
Filename: "{app}\RiverService.exe"; Parameters: "uninstall"; Flags: runhidden waituntilterminated; RunOnceId: "UninstallRiverService"

[UninstallDelete]
; Customer database and configuration are intentionally retained.
