@echo off
echo Starting SEC EDGAR React Application...
echo.
echo Step 1: Starting backend server...
start cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo Step 2: Starting React development server...
start cmd /k "npm run dev:client"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3000
echo Frontend: http://localhost:3001
echo.
echo Please wait a few seconds for both servers to be ready.
pause