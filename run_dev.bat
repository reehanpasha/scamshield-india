@echo off
title ScamShield India - Production Dev Launcher
echo ========================================================
echo   SCAMSHIELD INDIA
echo   Advanced AI Cybersecurity & Digital Fraud Platform
echo ========================================================
echo.

echo Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "ScamShield Backend" cmd /k "cd backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo Starting Vite Frontend on http://localhost:5173 ...
start "ScamShield Frontend" cmd /k "cd frontend && npm.cmd run dev"

echo.
echo ========================================================
echo   Services Launched!
echo   Frontend: http://localhost:5173
echo   Backend API Docs: http://127.0.0.1:8000/docs
echo ========================================================
pause
