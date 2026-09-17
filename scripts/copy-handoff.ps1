# Copies docs/ai/AI_HANDOFF.md to the Windows clipboard for pasting into ChatGPT.
$ErrorActionPreference = "Stop"
$handoffPath = Join-Path $PSScriptRoot "..\docs\ai\AI_HANDOFF.md"
$content = Get-Content -Raw -Encoding UTF8 -Path $handoffPath
Set-Clipboard -Value $content
Write-Output "AI handoff copied to clipboard."
