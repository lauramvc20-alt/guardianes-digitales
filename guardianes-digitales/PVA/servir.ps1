# ==========================================================================
# PVA · Servidor estático local (solo para desarrollo/pruebas)
# Uso:  powershell -ExecutionPolicy Bypass -File .\servir.ps1
# Luego abre: http://localhost:8137/
# No requiere Node, Python ni instalación alguna.
# ==========================================================================
param(
  [int]$Port = 8137
)

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Sirviendo $root"
Write-Host "Abre http://localhost:$Port/ en tu navegador. Ctrl+C para detener."

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".ico"  = "image/x-icon"
  ".woff" = "font/woff"
  ".woff2" = "font/woff2"
}

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    try {
      $req = $ctx.Request
      $res = $ctx.Response
      $rel = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath).TrimStart("/")
      if ([string]::IsNullOrWhiteSpace($rel)) { $rel = "index.html" }
      $full = [System.IO.Path]::GetFullPath((Join-Path $root $rel))

      if (-not $full.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
        $res.StatusCode = 403
        $res.Close()
        continue
      }

      if (Test-Path -LiteralPath $full -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($full).ToLowerInvariant()
        $res.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" }
        $res.Headers.Add("Cache-Control", "no-store")
        $bytes = [System.IO.File]::ReadAllBytes($full)
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
      } else {
        $res.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("404 · Archivo no encontrado")
        $res.ContentLength64 = $msg.Length
        $res.OutputStream.Write($msg, 0, $msg.Length)
      }
      $res.Close()
    } catch {
      try { $ctx.Response.StatusCode = 500; $ctx.Response.Close() } catch { }
    }
  }
} finally {
  $listener.Stop()
  $listener.Close()
}
