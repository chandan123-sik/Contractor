# Debug Labour Profile
$baseUrl = "http://localhost:5000/api"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "DEBUG LABOUR PROFILE" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Get mobile number from user
$mobileNumber = Read-Host "Enter labour mobile number (e.g., 9876543210)"

Write-Host "`nStep 1: Login as Labour..." -ForegroundColor Yellow
try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body (@{
        mobileNumber = $mobileNumber
    } | ConvertTo-Json) -ContentType "application/json"
    
    $token = $loginResponse.data.accessToken
    $userId = $loginResponse.data.user._id
    $userType = $loginResponse.data.user.userType
    
    Write-Host "✅ Login successful" -ForegroundColor Green
    Write-Host "   User ID: $userId" -ForegroundColor Gray
    Write-Host "   User Type: $userType" -ForegroundColor Gray
    Write-Host "   Mobile: $mobileNumber" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Login failed" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit
}

Write-Host "`nStep 2: Get Labour Profile..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $profileResponse = Invoke-RestMethod -Uri "$baseUrl/labour/profile" -Method Get -Headers $headers
    
    Write-Host "✅ Labour profile found" -ForegroundColor Green
    Write-Host "`nProfile Details:" -ForegroundColor Cyan
    Write-Host "   Labour ID: $($profileResponse.data.labour._id)" -ForegroundColor Gray
    Write-Host "   Skill Type: $($profileResponse.data.labour.skillType)" -ForegroundColor Gray
    Write-Host "   Experience: $($profileResponse.data.labour.experience)" -ForegroundColor Gray
    Write-Host "   Has Labour Card: $($profileResponse.data.labour.hasLabourCard)" -ForegroundColor Gray
    
    $labourId = $profileResponse.data.labour._id
    
    Write-Host "`nStep 3: Check Hire Requests..." -ForegroundColor Yellow
    try {
        $requestsResponse = Invoke-RestMethod -Uri "$baseUrl/labour/hire-requests?status=pending" -Method Get -Headers $headers
        
        Write-Host "✅ Found $($requestsResponse.data.count) pending requests" -ForegroundColor Green
        
        if ($requestsResponse.data.count -gt 0) {
            Write-Host "`nPending Requests:" -ForegroundColor Cyan
            foreach ($req in $requestsResponse.data.hireRequests) {
                Write-Host "   - From: $($req.requesterName)" -ForegroundColor Gray
                Write-Host "     Phone: $($req.requesterPhone)" -ForegroundColor Gray
                Write-Host "     Location: $($req.requesterLocation)" -ForegroundColor Gray
                Write-Host "     Status: $($req.status)" -ForegroundColor Gray
                Write-Host ""
            }
        }
        
    } catch {
        Write-Host "❌ Failed to get hire requests" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Labour profile not found" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    Write-Host "`nStep 3: Create Labour Profile..." -ForegroundColor Yellow
    $createProfile = Read-Host "Do you want to create labour profile? (y/n)"
    
    if ($createProfile -eq 'y') {
        $skillType = Read-Host "Enter skill type (e.g., Electrician, Plumber)"
        $experience = Read-Host "Enter experience in years"
        
        try {
            $createResponse = Invoke-RestMethod -Uri "$baseUrl/labour/create-profile" -Method Post -Body (@{
                mobileNumber = $mobileNumber
                skillType = $skillType
                experience = $experience
            } | ConvertTo-Json) -ContentType "application/json"
            
            Write-Host "✅ Labour profile created" -ForegroundColor Green
            Write-Host "   Labour ID: $($createResponse.data.labour._id)" -ForegroundColor Gray
            
        } catch {
            Write-Host "❌ Failed to create profile" -ForegroundColor Red
            Write-Host $_.Exception.Message -ForegroundColor Red
        }
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "DEBUG COMPLETE" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan
