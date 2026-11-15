$dest = "$env:USERPROFILE\node-bin"
if (!(Test-Path $dest)) {
    New-Item -ItemType Directory -Path $dest -Force | Out-Null
}
$zip = "$env:TEMP\node.zip"
Write-Host "Downloading portable Node.js LTS..."
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
(New-Object System.Net.WebClient).DownloadFile("https://nodejs.org/dist/v20.18.0/node-v20.18.0-win-x64.zip", $zip)
Write-Host "Extracting portable Node.js..."
Expand-Archive -Path $zip -DestinationPath $env:TEMP\node-extract -Force
Copy-Item -Path "$env:TEMP\node-extract\node-v20.18.0-win-x64\*" -Destination $dest -Recurse -Force
Remove-Item $zip -Force -ErrorAction SilentlyContinue
Remove-Item "$env:TEMP\node-extract" -Recurse -Force -ErrorAction SilentlyContinue

# Add to user PATH permanently
$userPath = [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::User)
if ($userPath -notlike "*$dest*") {
    [Environment]::SetEnvironmentVariable("Path", "$dest;$userPath", [EnvironmentVariableTarget]::User)
}

Write-Host "Node successfully installed!"
& "$dest\node.exe" -v
& "$dest\npm.cmd" -v
