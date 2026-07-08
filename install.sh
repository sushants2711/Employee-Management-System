#!/bin/bash

echo "=== Installing Backend Dependencies ==="
if [ -d "backend" ]; then
  cd backend
  npm install
  cd ..
else
  echo "Backend folder not found!"
fi

echo "=== Installing Frontend Dependencies ==="
if [ -d "frontend" ]; then
  cd frontend
  npm install
  cd ..
else
  echo "Frontend folder not found!"
fi

echo "=== Installation Complete ==="
