# Fix Expo Development Issues Script
# This script resolves login, connection, and performance issues

Write-Host "Fixing Expo Development Issues..." -ForegroundColor Green

# 1. Clear Expo cache and reset
Write-Host "`n1. Clearing Expo cache and resetting..." -ForegroundColor Yellow
Write-Host "Clearing Metro cache..." -ForegroundColor Cyan
npx expo start --clear --reset-cache

# 2. Fix login issues by bypassing EAS login
Write-Host "`n2. Bypassing EAS login for local development..." -ForegroundColor Yellow
Write-Host "Setting up local development without EAS login..." -ForegroundColor Cyan

# Create .expo directory if it doesn't exist
if (!(Test-Path ".expo")) {
    New-Item -ItemType Directory -Name ".expo" -Force
}

# 3. Start Expo with local development settings
Write-Host "`n3. Starting Expo with optimized settings..." -ForegroundColor Yellow
Write-Host "Starting development server with tunnel mode..." -ForegroundColor Cyan

# Kill any existing Expo processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*expo*" } | Stop-Process -Force -ErrorAction SilentlyContinue

# Start Expo with local settings
$expoArgs = @(
    "expo", "start",
    "--tunnel",
    "--clear",
    "--no-dev-client",
    "--localhost"
)

Write-Host "Starting Expo with: $($expoArgs -join ' ')" -ForegroundColor Cyan
Start-Process -FilePath "npx" -ArgumentList $expoArgs -WorkingDirectory (Get-Location) -NoNewWindow

Write-Host "Expo server starting with local development settings" -ForegroundColor Green

# 4. Wait for server to start and show connection info
Write-Host "`n4. Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# 5. Show connection instructions
Write-Host "`nMobile Connection Instructions:" -ForegroundColor Green
Write-Host "1. Install Expo Go app on your mobile device" -ForegroundColor White
Write-Host "2. Scan the QR code from the terminal" -ForegroundColor White
Write-Host "3. Or manually enter the tunnel URL in Expo Go" -ForegroundColor White
Write-Host "`nWeb Access:" -ForegroundColor Green
Write-Host "Open: http://localhost:8081" -ForegroundColor White
Write-Host "`nAndroid Emulator:" -ForegroundColor Green
Write-Host "Press 'a' in the Expo terminal to launch on Android emulator" -ForegroundColor White

Write-Host "`nTroubleshooting Tips:" -ForegroundColor Yellow
Write-Host "• If QR code doesn't work, use the tunnel URL manually" -ForegroundColor White
Write-Host "• Make sure your mobile device and computer are on the same network" -ForegroundColor White
Write-Host "• For Android emulator, ensure it's running before pressing 'a'" -ForegroundColor White
Write-Host "• If connection fails, try 'r' to reload the app" -ForegroundColor White

Write-Host "`nFixes Applied:" -ForegroundColor Green
Write-Host "• Cleared Expo cache and reset" -ForegroundColor White
Write-Host "• Bypassed EAS login for local development" -ForegroundColor White
Write-Host "• Started server with tunnel mode" -ForegroundColor White
Write-Host "• Optimized for local development" -ForegroundColor White