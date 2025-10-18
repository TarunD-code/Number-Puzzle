@echo off
echo Installing Android SDK...
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Running as Administrator - Good!
) else (
    echo Please run this script as Administrator
    echo Right-click and select "Run as administrator"
    pause
    exit /b 1
)

REM Set installation directory
set SDK_DIR=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set SDK_MANAGER=%SDK_DIR%\cmdline-tools\latest\bin\sdkmanager.bat

REM Create directory if it doesn't exist
if not exist "%SDK_DIR%" (
    mkdir "%SDK_DIR%"
    echo Created Android SDK directory: %SDK_DIR%
)

REM Download command line tools
set CMD_TOOLS_URL=https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip
set CMD_TOOLS_ZIP=%TEMP%\commandlinetools.zip

echo Downloading Android Command Line Tools...
powershell -Command "Invoke-WebRequest -Uri '%CMD_TOOLS_URL%' -OutFile '%CMD_TOOLS_ZIP%'"

REM Extract command line tools
echo Extracting Command Line Tools...
powershell -Command "Expand-Archive -Path '%CMD_TOOLS_ZIP%' -DestinationPath '%SDK_DIR%\cmdline-tools' -Force"

REM Rename to 'latest'
if exist "%SDK_DIR%\cmdline-tools\cmdline-tools" (
    move "%SDK_DIR%\cmdline-tools\cmdline-tools" "%SDK_DIR%\cmdline-tools\latest"
)

REM Accept licenses and install essential packages
echo Installing Android SDK packages...
echo y | "%SDK_MANAGER%" --licenses
"%SDK_MANAGER%" "platform-tools" "platforms;android-34" "build-tools;34.0.0"

REM Set environment variables
echo Setting environment variables...
setx ANDROID_HOME "%SDK_DIR%" /M
setx ANDROID_SDK_ROOT "%SDK_DIR%" /M

REM Add to PATH
for /f "tokens=2*" %%A in ('reg query "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v PATH') do set SYSTEM_PATH=%%B
setx PATH "%SDK_DIR%\platform-tools;%SDK_DIR%\tools;%SDK_DIR%\cmdline-tools\latest\bin;%SYSTEM_PATH%" /M

echo.
echo Android SDK installation completed!
echo SDK Location: %SDK_DIR%
echo Please restart your computer for environment variables to take effect.
echo.

REM Clean up
del "%CMD_TOOLS_ZIP%"

pause
