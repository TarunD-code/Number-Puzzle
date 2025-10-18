# Complete Android Development Setup Script
# This script sets up everything needed for React Native/Expo development

Write-Host "🚀 Setting up Complete Android Development Environment..." -ForegroundColor Green

# 1. Set up environment variables
Write-Host "`n1. Setting up environment variables..." -ForegroundColor Yellow
$ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
[Environment]::SetEnvironmentVariable("ANDROID_HOME", $ANDROID_HOME, "User")
[Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $ANDROID_HOME, "User")

# Add to PATH
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
$androidPaths = @(
    "$ANDROID_HOME\platform-tools",
    "$ANDROID_HOME\emulator", 
    "$ANDROID_HOME\cmdline-tools\latest\bin",
    "$ANDROID_HOME\tools"
)

$newPath = $currentPath
foreach ($path in $androidPaths) {
    if ($newPath -notlike "*$path*") {
        $newPath += ";$path"
    }
}
[Environment]::SetEnvironmentVariable("PATH", $newPath, "User")

# Set for current session
$env:ANDROID_HOME = $ANDROID_HOME
$env:ANDROID_SDK_ROOT = $ANDROID_HOME
$env:PATH = $newPath

Write-Host "✅ Environment variables configured" -ForegroundColor Green

# 2. Install essential SDK components
Write-Host "`n2. Installing essential SDK components..." -ForegroundColor Yellow
$SDK_MANAGER = "$ANDROID_HOME\cmdline-tools\latest\bin\sdkmanager.bat"

# Accept licenses
Write-Host "Accepting SDK licenses..." -ForegroundColor Cyan
echo y | & $SDK_MANAGER --licenses

# Install essential packages
$packages = @(
    "platform-tools",
    "platforms;android-34",
    "build-tools;34.0.0",
    "emulator",
    "system-images;android-34;google_apis;x86_64"
)

foreach ($package in $packages) {
    Write-Host "Installing $package..." -ForegroundColor Cyan
    & $SDK_MANAGER $package
}

Write-Host "✅ SDK components installed" -ForegroundColor Green

# 3. Create Android Virtual Device
Write-Host "`n3. Creating Android Virtual Device..." -ForegroundColor Yellow
$AVD_MANAGER = "$ANDROID_HOME\cmdline-tools\latest\bin\avdmanager.bat"

# Create AVD
& $AVD_MANAGER create avd -n "Pixel_7_API_34" -k "system-images;android-34;google_apis;x86_64" -d "pixel_7" --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ AVD created successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to create AVD" -ForegroundColor Red
}

# 4. Test ADB connection
Write-Host "`n4. Testing ADB connection..." -ForegroundColor Yellow
try {
    $adbVersion = & "$ANDROID_HOME\platform-tools\adb.exe" version 2>$null
    if ($adbVersion) {
        Write-Host "✅ ADB is working: $($adbVersion[0])" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ ADB not accessible" -ForegroundColor Red
}

# 5. Start Expo server
Write-Host "`n5. Starting Expo development server..." -ForegroundColor Yellow
Write-Host "Starting server with tunnel mode for better mobile access..." -ForegroundColor Cyan

# Start Expo in background
$expoProcess = Start-Process -FilePath "npx" -ArgumentList "expo", "start", "--tunnel" -WorkingDirectory (Get-Location) -PassThru -WindowStyle Hidden

Write-Host "✅ Expo server started (PID: $($expoProcess.Id))" -ForegroundColor Green

# 6. Instructions
Write-Host "`n🎉 Setup Complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Install Expo Go app on your mobile device" -ForegroundColor White
Write-Host "2. Scan the QR code from the terminal" -ForegroundColor White
Write-Host "3. Or manually enter the tunnel URL" -ForegroundColor White
Write-Host "`nTo start emulator manually:" -ForegroundColor Cyan
Write-Host "emulator -avd Pixel_7_API_34" -ForegroundColor White
Write-Host "`nTo stop Expo server:" -ForegroundColor Cyan
Write-Host "taskkill /F /PID $($expoProcess.Id)" -ForegroundColor White

Write-Host "`n📱 Mobile Access Methods:" -ForegroundColor Yellow
Write-Host "• QR Code: Scan with Expo Go app" -ForegroundColor White
Write-Host "• Manual URL: Enter the tunnel URL in Expo Go" -ForegroundColor White
Write-Host "• Web: Open the local URL in browser" -ForegroundColor White
