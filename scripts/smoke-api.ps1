$baseUrl = 'http://127.0.0.1:8080/api/v1'
$phone = '13' + (Get-Random -Minimum 100000000 -Maximum 999999999)
$password = '123456'
$nickname = 'SmokeUser'

function Assert-Success($response, $label) {
  if ($response.code -ne 0) {
    throw "$label failed: $($response.message)"
  }
  Write-Host "$label passed"
}

$registerBody = @{ phone = $phone; password = $password; nickname = $nickname } | ConvertTo-Json
$register = Invoke-RestMethod -Method Post -Uri "$baseUrl/auth/register" -ContentType 'application/json' -Body $registerBody
Assert-Success $register 'register'

$loginBody = @{ phone = $phone; password = $password } | ConvertTo-Json
$login = Invoke-RestMethod -Method Post -Uri "$baseUrl/auth/login" -ContentType 'application/json' -Body $loginBody
Assert-Success $login 'login'
$token = $login.data.token
$headers = @{ Authorization = "Bearer $token" }

$tools = Invoke-RestMethod -Method Get -Uri "$baseUrl/tools"
Assert-Success $tools 'tools'

$favorite = Invoke-RestMethod -Method Post -Uri "$baseUrl/favorites" -Headers $headers -ContentType 'application/json' -Body (@{ toolCode = 'calculator' } | ConvertTo-Json)
Assert-Success $favorite 'favorite'

$history = Invoke-RestMethod -Method Post -Uri "$baseUrl/histories" -Headers $headers -ContentType 'application/json' -Body (@{ toolCode = 'calculator'; toolName = 'Calculator'; summary = '1+1=2' } | ConvertTo-Json)
Assert-Success $history 'history'

$me = Invoke-RestMethod -Method Get -Uri "$baseUrl/users/me" -Headers $headers
Assert-Success $me 'profile'

$stats = Invoke-RestMethod -Method Get -Uri "$baseUrl/users/me/stats" -Headers $headers
Assert-Success $stats 'stats'

Write-Host 'Smoke API passed.'