# Restart Backend Server Script
Write-Host ""
Write-Host "RESTARTING BACKEND SERVER..." -ForegroundColor Cyan
Write-Host ""

# Find and stop the process running on port 5000
$port = 5000
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($process) {
    Write-Host "Found server running on port $port (PID: $process)" -ForegroundColor Yellow
    Write-Host "Stopping server..." -ForegroundColor Yellow
    Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "Server stopped" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "No server found running on port $port" -ForegroundColor Yellow
    Write-Host ""
}

# Start the server
Write-Host "Starting server..." -ForegroundColor Cyan
Write-Host "Running: node server.js" -ForegroundColor Gray
Write-Host ""

# Check if we're in the backend directory
if (Test-Path "server.js") {
    Start-Process -FilePath "node" -ArgumentList "server.js" -NoNewWindow
    Start-Sleep -Seconds 3
    
    # Verify server started
    $newProcess = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    
    if ($newProcess) {
        Write-Host "Server started successfully on port $port (PID: $newProcess)" -ForegroundColor Green
        Write-Host ""
        Write-Host "New routes available:" -ForegroundColor Cyan
        Write-Host "   - GET  /api/contractor/my-applications" -ForegroundColor White
        Write-Host "   - GET  /api/contractor/job-applications" -ForegroundColor White
        Write-Host "   - POST /api/contractor/jobs/:id/apply" -ForegroundColor White
        Write-Host "   - PATCH /api/contractor/jobs/:jobId/applications/:applicationId" -ForegroundColor White
        Write-Host "   - GET  /api/contractor/application-history" -ForegroundColor White
        Write-Host ""
        Write-Host "You can now test the labour application flow!" -ForegroundColor Green
        Write-Host ""
    } else {
        Write-Host "Failed to start server" -ForegroundColor Red
        Write-Host "Please start manually with: node server.js" -ForegroundColor Yellow
        Write-Host ""
    }
} else {
    Write-Host "Error: server.js not found in current directory" -ForegroundColor Red
    Write-Host "Please run this script from the backend directory" -ForegroundColor Yellow
    Write-Host ""
}
