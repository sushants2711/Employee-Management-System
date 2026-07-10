@echo off
echo Running Prettier and ESLint checks...
call npm run check-all

if %ERRORLEVEL% == 0 (
  echo ✅ All good! No issues found.
  exit /b 0
) else (
  echo ❌ Issues found! Attempting to fix automatically...
  
  REM Run the auto-fix scripts
  call npm run format
  call npm run lint:fix
  
  echo Running checks again to verify...
  call npm run check-all
  
  if %ERRORLEVEL% == 0 (
    echo ✅ All issues were successfully fixed!
    exit /b 0
  ) else (
    echo ❌ Some issues could not be fixed automatically. Please fix them manually in your code.
    exit /b 1
  )
)
