# Check MongoDB Data Script
# This script shows what data is stored in MongoDB

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "MONGODB DATA CHECK" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# You can use MongoDB Compass or mongosh to check data
# Or use this PowerShell script to query via API

$baseUrl = "http://localhost:5000"

Write-Host "Checking data in MongoDB via API calls...`n" -ForegroundColor Yellow

# Check Jobs
Write-Host "1. USER JOBS (jobs collection):" -ForegroundColor Green
try {
    $jobs = Invoke-RestMethod -Uri "$baseUrl/api/jobs/browse?limit=100" -Method Get
    Write-Host "   Total Jobs in MongoDB: $($jobs.data.total)" -ForegroundColor White
    if ($jobs.data.jobs.Count -gt 0) {
        Write-Host "   Latest Job:" -ForegroundColor Cyan
        $job = $jobs.data.jobs[0]
        Write-Host "     - ID: $($job._id)" -ForegroundColor White
        Write-Host "     - Title: $($job.jobTitle)" -ForegroundColor White
        Write-Host "     - City: $($job.city)" -ForegroundColor White
        Write-Host "     - Created: $($job.createdAt)" -ForegroundColor White
    }
} catch {
    Write-Host "   Error fetching jobs" -ForegroundColor Red
}

Write-Host "`n2. LABOUR CARDS (labours collection):" -ForegroundColor Green
try {
    $labours = Invoke-RestMethod -Uri "$baseUrl/api/labour/browse?limit=100" -Method Get
    Write-Host "   Total Labour Cards in MongoDB: $($labours.data.total)" -ForegroundColor White
    if ($labours.data.labours.Count -gt 0) {
        Write-Host "   Latest Labour Card:" -ForegroundColor Cyan
        $labour = $labours.data.labours[0]
        Write-Host "     - ID: $($labour._id)" -ForegroundColor White
        Write-Host "     - Skill: $($labour.skillType)" -ForegroundColor White
        Write-Host "     - Experience: $($labour.experience)" -ForegroundColor White
        Write-Host "     - Created: $($labour.createdAt)" -ForegroundColor White
    }
} catch {
    Write-Host "   Error fetching labour cards" -ForegroundColor Red
}

Write-Host "`n3. CONTRACTORS (contractors collection):" -ForegroundColor Green
try {
    $contractors = Invoke-RestMethod -Uri "$baseUrl/api/contractor/browse?limit=100" -Method Get
    Write-Host "   Total Contractors in MongoDB: $($contractors.data.pagination.total)" -ForegroundColor White
    if ($contractors.data.contractors.Count -gt 0) {
        Write-Host "   Latest Contractor:" -ForegroundColor Cyan
        $contractor = $contractors.data.contractors[0]
        Write-Host "     - ID: $($contractor.contractor._id)" -ForegroundColor White
        Write-Host "     - Business: $($contractor.contractor.businessName)" -ForegroundColor White
        Write-Host "     - Type: $($contractor.contractor.businessType)" -ForegroundColor White
        Write-Host "     - Created: $($contractor.contractor.createdAt)" -ForegroundColor White
    }
} catch {
    Write-Host "   Error fetching contractors" -ForegroundColor Red
}

Write-Host "`n4. CONTRACTOR JOBS (contractorjobs collection):" -ForegroundColor Green
try {
    $contractorJobs = Invoke-RestMethod -Uri "$baseUrl/api/contractor/jobs/browse?limit=100" -Method Get
    Write-Host "   Total Contractor Jobs in MongoDB: $($contractorJobs.data.pagination.total)" -ForegroundColor White
    if ($contractorJobs.data.jobs.Count -gt 0) {
        Write-Host "   Latest Contractor Job:" -ForegroundColor Cyan
        $cJob = $contractorJobs.data.jobs[0]
        Write-Host "     - ID: $($cJob._id)" -ForegroundColor White
        Write-Host "     - Contractor: $($cJob.contractorName)" -ForegroundColor White
        Write-Host "     - Skill: $($cJob.labourSkill)" -ForegroundColor White
        Write-Host "     - Created: $($cJob.createdAt)" -ForegroundColor White
    }
} catch {
    Write-Host "   Error fetching contractor jobs" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "DATA CHECK COMPLETE" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "All data shown above is stored in MongoDB!" -ForegroundColor Green
Write-Host "localStorage is only used for caching (fast display)" -ForegroundColor Yellow
Write-Host "`nTo view in MongoDB Compass:" -ForegroundColor Cyan
Write-Host "  1. Open MongoDB Compass" -ForegroundColor White
Write-Host "  2. Connect to: mongodb://localhost:27017" -ForegroundColor White
Write-Host "  3. Select database: rajghar" -ForegroundColor White
Write-Host "  4. View collections: users, jobs, labours, contractors, contractorjobs" -ForegroundColor White
