#!/bin/bash
# This script imports your database to Render
# Run this in Render Shell

echo "Downloading backup file..."
curl -o backup.sql "https://your-replit-url/render-postgresql-backup.sql"

echo "Importing to database..."
psql $DATABASE_URL < backup.sql

echo "Done! Database imported successfully."
