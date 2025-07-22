@echo off
echo 🚀 Starting Career Compass - Full Stack Application
echo.

echo Starting Backend API Server...
start "Backend API" cmd /k "cd /d %~dp0\backend && call venv\Scripts\activate.bat && python start_server.py"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo Starting Frontend React App...
start "Frontend React" cmd /k "cd /d %~dp0\frontend && npm start"

echo.
echo ✅ Both servers are starting!
echo.
echo 📡 Access your application at:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:8000
echo    API Docs: http://localhost:8000/docs
echo.
echo 🛑 To stop both servers, close their respective command windows
echo.

pause
