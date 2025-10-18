# Android Environment Variables Setup Script
# Run this as Administrator

Write-Host "Setting up Android environment variables..." -ForegroundColor Green

# Set ANDROID_HOME
$ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
[Environment]::SetEnvironmentVariable("ANDROID_HOME", $ANDROID_HOME, "User")
[Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $ANDROID_HOME, "User")

Write-Host "Set ANDROID_HOME to: $ANDROID_HOME" -ForegroundColor Yellow

# Get current PATH
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")

# Define Android paths to add
$androidPaths = @(
    "$ANDROID_HOME\platform-tools",
    "$ANDROID_HOME\emulator", 
    "$ANDROID_HOME\cmdline-tools\latest\bin",
    "$ANDROID_HOME\tools"
)

# Add Android paths to PATH if not already present
$newPath = $currentPath
foreach ($path in $androidPaths) {
    if ($newPath -notlike "*$path*") {
        $newPath += ";$path"
        Write-Host "Added to PATH: $path" -ForegroundColor Cyan
    } else {
        Write-Host "Already in PATH: $path" -ForegroundColor Gray
    }
}

# Set the updated PATH
[Environment]::SetEnvironmentVariable("PATH", $newPath, "User")

# Set environment variables for current session
$env:ANDROID_HOME = $ANDROID_HOME
$env:ANDROID_SDK_ROOT = $ANDROID_HOME
$env:PATH = $newPath

Write-Host "Environment variables set successfully!" -ForegroundColor Green
Write-Host "Please restart your terminal for changes to take effect." -ForegroundColor Yellow

# Test if adb is accessible
try {
    $adbVersion = & "$ANDROID_HOME\platform-tools\adb.exe" version 2>$null
    if ($adbVersion) {
        Write-Host "✅ ADB is working: $($adbVersion[0])" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ ADB not accessible yet. Please restart terminal." -ForegroundColor Red
}
