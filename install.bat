@echo off

echo === Installing Backend Dependencies ===
if exist backend\ (
  cd backend
  call npm install
  cd ..
) else (
  echo Backend folder not found!
)

echo === Installing Frontend Dependencies ===
if exist frontend\ (
  cd frontend
  call npm install
  cd ..
) else (
  echo Frontend folder not found!
)

echo === Installation Complete ===
pause
