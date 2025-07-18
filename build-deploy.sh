#!/bin/bash

# Deploy database schema first
echo "Deploying database schema..."
npm run db:push

# Build the application
echo "Building the application..."
vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Copy static files to where the server expects them
echo "Copying static files..."
cp -r dist/public server/

echo "Build completed successfully!"
echo "Production files are ready for deployment."