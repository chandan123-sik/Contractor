# Verify New Routes Script
Write-Host ""
Write-Host "VERIFYING NEW CONTRACTOR JOB APPLICATION ROUTES..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000"
$routes = @(
    @{Method="GET"; Path="/api/contractor/my-applications"; Description="Get labour's applications"},
    @{Method="GET"; Path="/api/contractor/job-applications"; Description="Get contractor's job applications"},
    @{Method="GET"; Path="/api/contractor/application-history"; Description="Get contractor's application history"}
)

Write-Host "Testing routes (without authentication)..." -ForegroundColor Yellow
Write-Host ""

foreach ($route in $routes) {
    $url = "$baseUrl$($route.Path)"
    Write-Host "Testing: $($route.Method) $($route.Path)" -ForegroundColor White
    Write-Host "Description: $($route.Description)" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method $route.Method -ErrorAction Stop
        Write-Host "Status: $($response.StatusCode) - Route exists!" -ForegroundColor Green
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 401) {
            Write-Host "Status: 401 - Route exists! (Authentication required)" -ForegroundColor Green
        } elseif ($statusCode -eq 404) {
            Write-Host "Status: 404 - Route NOT FOUND!" -ForegroundColor Red
        } else {
            Write-Host "Status: $statusCode - Route exists but returned error" -ForegroundColor Yellow
        }
    }
    Write-Host ""
}

Write-Host "VERIFICATION COMPLETE!" -ForegroundColor Cyan
Write-Host ""
Write-Host "If all routes show 401 (Authentication required), the routes are working correctly!" -ForegroundColor Green
Write-Host "The 404 errors in the browser should now be gone." -ForegroundColor Green
Write-Host ""
