#!/usr/bin/env bash
set -e

echo "Building frontend..."
cd Frontend
# install deps and build the production bundle
npm ci
npm run build

cd ..

echo "Installing backend dependencies..."
cd Backend
npm ci

echo "Starting backend (it will serve the built frontend if present)..."
# Ensure .env is present in Backend/ for production values
node index.js
