$env:JAVA_HOME = 'D:\aboutwork\soft\jdk\jdk-17.0.10'
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
Write-Host "JAVA_HOME=$env:JAVA_HOME"
Set-Location 'backend'
mvn spring-boot:run '-Dspring-boot.run.profiles=local'