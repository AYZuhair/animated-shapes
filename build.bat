@echo off
echo Building and running Animated Shapes Generator...

:: Check if MinGW is installed and in PATH
where gcc >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: GCC not found! Please install MinGW and add it to your PATH
    pause
    exit /b 1
)

:: Store the root directory
set ROOT_DIR=%CD%

:: Compile the server
cd server
gcc main.c -o server.exe -lws2_32
if %ERRORLEVEL% NEQ 0 (
    echo Error: Build failed!
    cd %ROOT_DIR%
    pause
    exit /b 1
)

:: Copy the executable to the root directory
copy server.exe ..\server.exe
cd %ROOT_DIR%

:: Start the server
echo Starting server...
start server.exe

:: Open the default browser
timeout /t 2 >nul
start http://localhost:8080

echo Server is running at http://localhost:8080
echo Press Ctrl+C to stop the server
pause