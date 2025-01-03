# ──────────────────────────────────────────────────────────────────────────────
# Metaverse User Profiling — single-command startup
# Builds the frontend then serves everything from http://localhost:8000
# ──────────────────────────────────────────────────────────────────────────────

$ROOT = $PSScriptRoot

Write-Host ""
Write-Host "=== Building frontend ===" -ForegroundColor Cyan
Set-Location "$ROOT\frontend"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend build failed." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== Starting server ===" -ForegroundColor Cyan
Write-Host "Open http://localhost:8000 in your browser" -ForegroundColor Green
Write-Host "API docs: http://localhost:8000/docs" -ForegroundColor Gray
Write-Host ""

Set-Location "$ROOT\backend"
& ".\.venv\Scripts\python.exe" -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
