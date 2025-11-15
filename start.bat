@echo off
echo ========================================
echo   CV Website Generator - Quick Start
echo ========================================
echo.

REM Check if .env file exists
if not exist .env (
    echo [ERROR] .env file not found!
    echo.
    echo Please create a .env file with your Grok API key:
    echo   GROK_API_KEY=your_api_key_here
    echo.
    echo You can copy .env.example to .env and add your key.
    pause
    exit /b 1
)

echo Starting the application...
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Press Ctrl+C to stop the servers
echo.

npm run dev
