# Start the FastAPI backend
Set-Location "$PSScriptRoot\backend"
& ".\.venv\Scripts\python.exe" -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
