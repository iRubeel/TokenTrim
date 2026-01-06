# Publish Script for TokenTrim
# Usage: ./publish.ps1 "Your commit message"

param([string]$Message = "Update extension")

$ErrorActionPreference = "Stop"

Write-Host "--- TOKEN TRIM PUBLISH WORKFLOW ---" -ForegroundColor Cyan

# 1. Build Extension
Write-Host "[1/3] Building extension..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "Build failed"; exit 1 }

# 2. Push to GitHub
Write-Host "[2/3] Syncing with GitHub..." -ForegroundColor Yellow
git add .
if ($(git status --porcelain)) {
    git commit -m "$Message"
    Write-Host "Changes committed."
}
git push origin main
if ($LASTEXITCODE -ne 0) { Write-Error "Git push failed"; exit 1 }

# 3. Publish to Marketplace
Write-Host "[3/3] Publishing to Marketplace..." -ForegroundColor Yellow
vsce publish --no-dependencies
if ($LASTEXITCODE -ne 0) { Write-Error "Publish failed"; exit 1 }

Write-Host "SUCCESS! TokenTrim is updated and published." -ForegroundColor Green
