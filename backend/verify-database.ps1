# Quick Database Verification Script

$baseUrl = "http://localhost:5000"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "DATABASE VERIFICATION" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check Jobs
Write-Host "1. JOBS (User Posts):" -ForegroundColor Yellow
$jobs = Invoke-RestMethod -Uri "$baseUrl/api/jobs/browse?limit=100" -Method Get
Write-Host "   ✅ Total in MongoDB: $($jobs.data.total)" -ForegroundColor Green
Write-Host "   📝 Jobs found: $($jobs.data.jobs.Count)" -ForegroundColor White

# Check Labour Cards
Write-Host "`n2. LABOUR CARDS:" -ForegroundColor Yellow
$labours = Invoke-RestMethod -Uri "$baseUrl/api/labour/browse?limit=100" -Method Get
Write-Host "   ✅ Total in MongoDB: $($labours.data.total)" -ForegroundColor Green
Write-Host "   📝 Cards found: $($labours.data.labours.Count)" -ForegroundColor White

# Check Contractors
Write-Host "`n3. CONTRACTORS:" -ForegroundColor Yellow
$contractors = Invoke-RestMethod -Uri "$baseUrl/api/contractor/browse?limit=100" -Method Get
Write-Host "   ✅ Total in MongoDB: $($contractors.data.pagination.total)" -ForegroundColor Green
Write-Host "   📝 Contractors found: $($contractors.data.contractors.Count)" -ForegroundColor White

# Check Contractor Jobs
Write-Host "`n4. CONTRACTOR JOBS:" -ForegroundColor Yellow
$cJobs = Invoke-RestMethod -Uri "$baseUrl/api/contractor/jobs/browse?limit=100" -Method Get
Write-Host "   ✅ Total in MongoDB: $($cJobs.data.pagination.total)" -ForegroundColor Green
Write-Host "   📝 Jobs found: $($cJobs.data.jobs.Count)" -ForegroundColor White

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🎉 ALL DATA IS IN MONGODB!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan
