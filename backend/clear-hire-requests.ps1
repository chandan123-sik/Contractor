# Clear all hire requests from database

$baseUrl = "http://localhost:5000"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "CLEAR HIRE REQUESTS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "This will delete ALL hire requests from the database." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to cancel, or Enter to continue..." -ForegroundColor Yellow
Read-Host

# You need to run this directly in MongoDB
Write-Host "`nRun this command in MongoDB:" -ForegroundColor Green
Write-Host "db.hirerequests.deleteMany({})" -ForegroundColor White

Write-Host "`nOr use MongoDB Compass to delete all documents from 'hirerequests' collection" -ForegroundColor Yellow

Write-Host "`n========================================" -ForegroundColor Cyan
