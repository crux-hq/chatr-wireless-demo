# Configures ANDROID_HOME and adb for Expo / Android emulator on Windows.
# Run after Android Studio finishes its first-time SDK setup.

$SdkPath = Join-Path $env:LOCALAPPDATA "Android\Sdk"
$PlatformTools = Join-Path $SdkPath "platform-tools"

if (-not (Test-Path $SdkPath)) {
  Write-Host "Android SDK not found at: $SdkPath"
  Write-Host ""
  Write-Host "1. Install Android Studio: winget install Google.AndroidStudio"
  Write-Host "2. Open Android Studio -> More Actions -> SDK Manager"
  Write-Host "3. Install Android SDK Platform-Tools and at least one system image"
  Write-Host "4. Device Manager -> Create/start a virtual device"
  Write-Host "5. Re-run: .\scripts\setup-android-env.ps1"
  exit 1
}

if (-not (Test-Path $PlatformTools)) {
  Write-Host "platform-tools missing. Open Android Studio SDK Manager and install 'Android SDK Platform-Tools'."
  exit 1
}

[Environment]::SetEnvironmentVariable("ANDROID_HOME", $SdkPath, "User")
[Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $SdkPath, "User")

$studioJbr = "C:\Program Files\Android\Android Studio\jbr"
if (Test-Path $studioJbr) {
  [Environment]::SetEnvironmentVariable("JAVA_HOME", $studioJbr, "User")
}

$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
$pathsToAdd = @(
  $PlatformTools,
  (Join-Path $SdkPath "emulator"),
  (Join-Path $SdkPath "cmdline-tools\latest\bin")
)
if (Test-Path $studioJbr) {
  $pathsToAdd = @((Join-Path $studioJbr "bin")) + $pathsToAdd
}
foreach ($entry in $pathsToAdd) {
  if ((Test-Path $entry) -and ($userPath -notlike "*$entry*")) {
    $userPath = if ($userPath) { "$userPath;$entry" } else { $entry }
  }
}
[Environment]::SetEnvironmentVariable("Path", $userPath, "User")

$env:ANDROID_HOME = $SdkPath
$env:ANDROID_SDK_ROOT = $SdkPath
if (Test-Path $studioJbr) {
  $env:JAVA_HOME = $studioJbr
  $env:Path = "$(Join-Path $studioJbr 'bin');$env:Path"
}
$env:Path = "$PlatformTools;$env:Path"

Write-Host "ANDROID_HOME set to: $SdkPath"
Write-Host "adb version:"
& "$PlatformTools\adb.exe" version
if (Test-Path (Join-Path $SdkPath "emulator\emulator.exe")) {
  Write-Host "emulator version:"
  & (Join-Path $SdkPath "emulator\emulator.exe") -version 2>&1 | Select-Object -First 1
}
Write-Host ""
Write-Host "Environment configured for this user account."
Write-Host "Open a NEW terminal, then run: npm run android:dev"
