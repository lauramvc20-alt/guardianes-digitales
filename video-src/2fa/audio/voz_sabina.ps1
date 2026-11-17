# Voz gratuita de Windows (Microsoft Sabina, español de México). Sin conexión ni instalación.
# Uso (PowerShell, desde video-src/2fa):  powershell -ExecutionPolicy Bypass -File .\audio\voz_sabina.ps1
Add-Type -AssemblyName System.Speech
$base = Split-Path -Parent $MyInvocation.MyCommand.Path
$dir = Join-Path $base "lines"; New-Item -ItemType Directory -Force $dir | Out-Null
$guion = Get-Content (Join-Path $base "guion.json") -Raw -Encoding UTF8 | ConvertFrom-Json
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
$voz = $s.GetInstalledVoices() | Where-Object { $_.VoiceInfo.Culture.Name -eq "es-MX" } | Select-Object -First 1
if (-not $voz) { throw "No hay voz es-MX instalada (Configuración > Hora e idioma > Voz)." }
$s.SelectVoice($voz.VoiceInfo.Name); $s.Rate = 1
foreach ($l in $guion) {
  $s.SetOutputToWaveFile((Join-Path $dir ($l.id + ".wav")))
  $s.Speak($l.texto); Write-Host "ok" $l.id
}
$s.Dispose()
