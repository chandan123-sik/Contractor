# Check Hire Requests in Database
$baseUrl = "http://localhost:5000/api"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "CHECK HIRE REQUESTS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Login
$mobile = Read-Host "Enter mobile number"

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body (@{
    mobileNumber = $mobile
} | ConvertTo-Json) -ContentType "application/json"

$token = $loginResponse.data.accessToken
$userId = $loginResponse.data.user._id

Write-Host "✅ Logged in" -ForegroundColor Green
Write-Host "   User ID: $userId`n" -ForegroundColor Gray

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Check labour profile
Write-Host "Checking Labour Profile..." -ForegroundColor Yellow
try {
    $labourProfile = Invoke-RestMethod -Uri "$baseUrl/labour/profile" -Method Get -Headers $headers
    $labourId = $labourProfile.data.labour._id
    Write-Host "✅ Labour ID: $labourId`n" -ForegroundColor Green
} catch {
    Write-Host "❌ No labour profile`n" -ForegroundColor Red
    $labourId = $null
}

# Get sent requests (as user)
Write-Host "Sent Requests (as User):" -ForegroundColor Yellow
try {
    $sentRequests = Invoke-RestMethod -Uri "$baseUrl/labour/hire-requests/sent?requesterModel=User" -Method Get -Headers $headers
    Write-Host "   Count: $($sentRequests.data.count)" -ForegroundColor Gray
    
    if ($sentRequests.data.count -gt 0) {
        foreach ($req in $sentRequests.data.hireRequests) {
            Write-Host "   - To Labour ID: $($req.labourId)" -ForegroundColor Gray
            Write-Host "     Status: $($req.status)" -ForegroundColor Gray
            Write-Host "     Created: $($req.createdAt)" -ForegroundColor Gray
            Write-Host ""
        }
    }
} catch {
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Get received requests (as labour)
if ($labourId) {
    Write-Host "`nReceived Requests (as Labour):" -ForegroundColor Yellow
    try {
        $receivedRequests = Invoke-RestMethod -Uri "$baseUrl/labour/hire-requests?status=pending" -Method Get -Headers $headers
        Write-Host "   Count: $($receivedRequests.data.count)" -ForegroundColor Gray
        
        if ($receivedRequests.data.count -gt 0) {
            foreach ($req in $receivedRequests.data.hireRequests) {
                Write-Host "   - From User ID: $($req.requesterId)" -ForegroundColor Gray
                Write-Host "     Requester: $($req.requesterName)" -ForegroundColor Gray
                Write-Host "     Status: $($req.status)" -ForegroundColor Gray
                Write-Host ""
            }
        } else {
            Write-Host "   No pending requests for this labour" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
