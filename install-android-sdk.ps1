# Android SDK Installation Script
# Run this as Administrator

Write-Host "Installing Android SDK..." -ForegroundColor Green

# Set installation directory
$SDK_DIR = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$SDK_MANAGER = "$SDK_DIR\cmdline-tools\latest\bin\sdkmanager.bat"

# Create directory if it doesn't exist
if (!(Test-Path $SDK_DIR)) {
    New-Item -ItemType Directory -Path $SDK_DIR -Force
    Write-Host "Created Android SDK directory: $SDK_DIR" -ForegroundColor Yellow
}

# Download command line tools
$CMD_TOOLS_URL = "https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip"
$CMD_TOOLS_ZIP = "$env:TEMP\commandlinetools.zip"

Write-Host "Downloading Android Command Line Tools..." -ForegroundColor Yellow
Invoke-WebRequest -Uri $CMD_TOOLS_URL -OutFile $CMD_TOOLS_ZIP

# Extract command line tools
Write-Host "Extracting Command Line Tools..." -ForegroundColor Yellow
Expand-Archive -Path $CMD_TOOLS_ZIP -DestinationPath "$SDK_DIR\cmdline-tools" -Force

# Rename to 'latest'
if (Test-Path "$SDK_DIR\cmdline-tools\cmdline-tools") {
    Move-Item "$SDK_DIR\cmdline-tools\cmdline-tools" "$SDK_DIR\cmdline-tools\latest" -Force
}

# Accept licenses and install essential packages
Write-Host "Installing Android SDK packages..." -ForegroundColor Yellow
& $SDK_MANAGER --licenses
& $SDK_MANAGER "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# Set environment variables
Write-Host "Setting environment variables..." -ForegroundColor Yellow
[Environment]::SetEnvironmentVariable("ANDROID_HOME", $SDK_DIR, "User")
[Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $SDK_DIR, "User")

# Add to PATH
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
$newPath = "$SDK_DIR\platform-tools;$SDK_DIR\tools;$SDK_DIR\cmdline-tools\latest\bin;$currentPath"
[Environment]::SetEnvironmentVariable("PATH", $newPath, "User")

Write-Host "Android SDK installation completed!" -ForegroundColor Green
Write-Host "SDK Location: $SDK_DIR" -ForegroundColor Cyan
Write-Host "Please restart your terminal/IDE for environment variables to take effect." -ForegroundColor Yellow

# Clean up
Remove-Item $CMD_TOOLS_ZIP -Force
