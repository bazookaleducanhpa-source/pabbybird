param(
    [string]$SourceDirectory = "build/web-mobile",
    [string]$OutputZip = "build/flappybird-playturbo.zip"
)

$ErrorActionPreference = "Stop"
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$sourcePath = (Resolve-Path (Join-Path $projectRoot $SourceDirectory)).Path
$outputPath = Join-Path $projectRoot $OutputZip

if (-not (Test-Path -LiteralPath $sourcePath -PathType Container)) {
    throw "Build directory not found: $sourcePath"
}

$outputDirectory = Split-Path -Parent $outputPath
New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
if (Test-Path -LiteralPath $outputPath) {
    Remove-Item -LiteralPath $outputPath -Force
}

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::Open(
    $outputPath,
    [System.IO.Compression.ZipArchiveMode]::Create
)

try {
    Get-ChildItem -LiteralPath $sourcePath -Recurse -File |
        Where-Object { $_.FullName -ne (Join-Path $sourcePath "assets.zip") } |
        ForEach-Object {
            $entryName = $_.FullName.Substring($sourcePath.Length + 1).Replace([char]92, [char]47)
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
                $archive,
                $_.FullName,
                $entryName,
                [System.IO.Compression.CompressionLevel]::Optimal
            ) | Out-Null
        }
}
finally {
    $archive.Dispose()
}

Write-Output "Created: $outputPath"
Write-Output "ZIP size: $((Get-Item -LiteralPath $outputPath).Length) bytes"
