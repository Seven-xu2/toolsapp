$mysql = 'E:\mysql\bin\mysql.exe'
$root = 'root'
$password = 'root'
$hostName = '127.0.0.1'
$port = 3306

function Invoke-SqlFile([string]$filePath) {
  $fullPath = (Resolve-Path $filePath).Path
  $command = '"' + $mysql + '" --default-character-set=utf8mb4 --host=' + $hostName + ' --port=' + $port + ' --user=' + $root + ' --password=' + $password + ' < "' + $fullPath + '"'
  cmd.exe /c $command
  if ($LASTEXITCODE -ne 0) {
    throw "Failed to execute: $filePath"
  }
}

Write-Host 'Initializing database...'
Invoke-SqlFile 'sql/01-create-database.sql'
Invoke-SqlFile 'sql/02-create-tables.sql'
Invoke-SqlFile 'sql/03-seed-tools.sql'
Write-Host 'Database initialization completed.'