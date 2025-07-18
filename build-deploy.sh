#!/bin/bash

# Build the application
echo "Building the application..."
npm run build

# Copy static files to where the server expects them
echo "Copying static files..."
cp -r dist/public server/

echo "Build completed successfully!"
echo "Production files are ready for deployment."