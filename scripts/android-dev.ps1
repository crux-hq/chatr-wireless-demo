# Starts Android emulator (if needed) and Expo dev server with SDK env loaded.
param(
  [string]$AvdName = "Expo_Pixel_7"
)

$ErrorActionPreference = "Stop"
$sdkRoot = Join-Path $env:LOCALAPPDATA "Android\Sdk"
$studioJbr = "C:\Program Files\Android\Android Studio\jbr"
$emulatorExe = Join-Path $sdkRoot "emulator\emulator.exe"
$adbExe = Join-Path $sdkRoot "platform-tools\adb.exe"

if (-not (Test-Path $adbExe)) {
  Write-Host "Android SDK not ready. Run: .\scripts\setup-android-env.ps1"
  exit 1
}

$env:JAVA_HOME = $studioJbr
$env:ANDROID_HOME = $sdkRoot
$env:ANDROID_SDK_ROOT = $sdkRoot
$env:Path = @(
  (Join-Path $studioJbr "bin"),
  (Join-Path $sdkRoot "emulator"),
  (Join-Path $sdkRoot "platform-tools"),
  (Join-Path $sdkRoot "cmdline-tools\latest\bin"),
  $env:Path
) -join ";"

$devices = & $adbExe devices 2>&1 | Select-String "device$"
if (-not $devices -and (Test-Path $emulatorExe)) {
  Write-Host "Starting emulator: $AvdName"
  Start-Process -FilePath $emulatorExe -ArgumentList @("-avd", $AvdName, "-netdelay", "none", "-netspeed", "full", "-gpu", "swiftshader_indirect", "-no-metrics") -WindowStyle Normal
  Write-Host "Waiting for emulator to boot..."
  & $adbExe wait-for-device | Out-Null
  $deadline = (Get-Date).AddMinutes(3)
  do {
    Start-Sleep -Seconds 3
    $booted = & $adbExe shell getprop sys.boot_completed 2>$null
  } while ($booted.Trim() -ne "1" -and (Get-Date) -lt $deadline)
  Write-Host "Emulator ready."
}

Set-Location (Split-Path $PSScriptRoot -Parent)
Write-Host "Starting Expo..."
npm start
