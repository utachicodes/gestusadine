# Firebase Service Account JSON Converter
# This script converts a multi-line Firebase service account JSON to a single line for .env

param(
    [Parameter(Mandatory=$true)]
    [string]$JsonFilePath
)

if (-not (Test-Path $JsonFilePath)) {
    Write-Error "File not found: $JsonFilePath"
    exit 1
}

try {
    # Read the JSON file
    $jsonContent = Get-Content -Path $JsonFilePath -Raw
    
    # Parse and minify (remove whitespace)
    $jsonObject = $jsonContent | ConvertFrom-Json
    $minifiedJson = $jsonObject | ConvertTo-Json -Compress -Depth 10
    
    Write-Host "`n✅ Successfully converted JSON to single line!" -ForegroundColor Green
    Write-Host "`nCopy the following line and paste it in your .env file:" -ForegroundColor Yellow
    Write-Host "FIREBASE_SERVICE_ACCOUNT_KEY=$minifiedJson" -ForegroundColor Cyan
    Write-Host "`n"
    
    # Also copy to clipboard if possible
    try {
        "FIREBASE_SERVICE_ACCOUNT_KEY=$minifiedJson" | Set-Clipboard
        Write-Host "✅ Also copied to clipboard! You can paste it directly." -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Could not copy to clipboard, but you can copy from above." -ForegroundColor Yellow
    }
    
} catch {
    Write-Error "Failed to process JSON file: $_"
    exit 1
}
