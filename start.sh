#!/bin/bash

echo "=== Starting Backend ==="
if [ -d "backend" ]; then
  cd backend
  npm run dev &
  BACKEND_PID=$!
  cd ..
else
  echo "Backend folder not found!"
fi

echo "=== Starting Frontend ==="
if [ -d "frontend" ]; then
  cd frontend
  npm run dev &
  FRONTEND_PID=$!
  cd ..
else
  echo "Frontend folder not found!"
fi

echo "Servers are running! Press Ctrl+C to stop."

# Wait for Ctrl+C to stop both
trap 'kill $BACKEND_PID $FRONTEND_PID 2>/dev/null' INT
wait $BACKEND_PID $FRONTEND_PID
