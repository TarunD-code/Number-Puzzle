# Create Android Virtual Device (AVD) Script
# Run this as Administrator

Write-Host "Creating Android Virtual Device..." -ForegroundColor Green

$SDK_DIR = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$AVD_MANAGER = "$SDK_DIR\cmdline-tools\latest\bin\avdmanager.bat"

# Create AVD
Write-Host "Creating AVD for Android 34..." -ForegroundColor Yellow
& $AVD_MANAGER create avd -n "Pixel_7_API_34" -k "system-images;android-34;google_apis;x86_64" -d "pixel_7"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ AVD created successfully!" -ForegroundColor Green
    Write-Host "AVD Name: Pixel_7_API_34" -ForegroundColor Cyan
    
    # List available AVDs
    Write-Host "`nAvailable AVDs:" -ForegroundColor Yellow
    & $AVD_MANAGER list avd
} else {
    Write-Host "❌ Failed to create AVD. Installing system image first..." -ForegroundColor Red
    
    # Install system image first
    Write-Host "Installing Android 34 system image..." -ForegroundColor Yellow
    & "$SDK_DIR\cmdline-tools\latest\bin\sdkmanager.bat" "system-images;android-34;google_apis;x86_64"
    
    # Try creating AVD again
    Write-Host "Creating AVD again..." -ForegroundColor Yellow
    & $AVD_MANAGER create avd -n "Pixel_7_API_34" -k "system-images;android-34;google_apis;x86_64" -d "pixel_7"
}

Write-Host "`nTo start the emulator, run:" -ForegroundColor Cyan
Write-Host "emulator -avd Pixel_7_API_34" -ForegroundColor White
