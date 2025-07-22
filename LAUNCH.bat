@echo off
title Career Compass Launcher

echo.
echo =================================================
echo    🎯 CAREER COMPASS - AI Resume Analyzer
echo =================================================
echo.
echo Starting your application...
echo.

REM Start Backend
echo [1/2] Starting Backend Server...
cd /d "%~dp0\backend"
start /min "Career Compass Backend" cmd /c "call venv\Scripts\activate.bat && python simple_server.py"

REM Wait a moment for backend to start
echo    Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

REM Start Frontend
echo [2/2] Starting Frontend...
cd /d "%~dp0\frontend"
start "Career Compass Frontend" cmd /c "npm start"

echo.
echo ✅ Application is starting!
echo.
echo 📱 Your Career Compass will open at:
echo    👉 http://localhost:3000
echo.
echo 🔧 Backend API running at:
echo    👉 http://localhost:8000
echo.
echo 📚 API Documentation:
echo    👉 http://localhost:8000/docs
echo.
echo 💡 Instructions:
echo    1. Wait for both servers to fully load
echo    2. Your browser should open automatically
echo    3. Choose "Upload Files" or "Paste Text" option
echo    4. Upload your resume and job description
echo    5. Get AI-powered career insights with beautiful analysis!
echo.
echo 🛑 To stop: Close both command windows
echo.
echo Press any key to exit this launcher...
pause >nul
