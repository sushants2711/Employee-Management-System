#!/bin/bash

echo "Running Prettier and ESLint checks..."
npm run check-all

if [ $? -eq 0 ]; then
  echo "✅ All good! No issues found."
  exit 0
else
  echo "❌ Issues found! Attempting to fix automatically..."
  
  # Run the auto-fix scripts
  npm run format
  npm run lint:fix
  
  echo "Running checks again to verify..."
  npm run check-all
  
  if [ $? -eq 0 ]; then
    echo "✅ All issues were successfully fixed!"
    exit 0
  else
    echo "❌ Some issues could not be fixed automatically. Please fix them manually in your code."
    exit 1
  fi
fi
