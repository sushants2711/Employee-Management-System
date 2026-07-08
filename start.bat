@echo off

echo === Starting Backend ===
if exist backend\ (
  cd backend
  start "Backend" cmd /k "npm run dev"
  cd ..
) else (
  echo Backend folder not found!
)

echo === Starting Frontend ===
if exist frontend\ (
  cd frontend
  start "Frontend" cmd /k "npm run dev"
  cd ..
) else (
  echo Frontend folder not found!
)

echo Both servers are starting in new windows...
pause
