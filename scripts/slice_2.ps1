Add-Type -AssemblyName System.Drawing
$poolDir = "c:\GitHub\life-quest\public\staged_images\pool"
$gridPath = "c:\GitHub\life-quest\scripts\sheets_164\reframe_2.png"
$files = @('donald_duck_sailor.jpg', 'authentic_item_153_פצצה_שחורה_עגולה_עם_פתיל_בוער__מסמלת.jpg')
$master = [System.Drawing.Image]::FromFile($gridPath)
$W = 560; $H = 340
for ($i = 0; $i -lt 2; $i++) {
  $bmp = New-Object System.Drawing.Bitmap($W, $H)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $srcRect = New-Object System.Drawing.Rectangle(($i * $W), 0, $W, $H)
  $destRect = New-Object System.Drawing.Rectangle(0, 0, $W, $H)
  $g.DrawImage($master, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  $bmp.Save((Join-Path $poolDir $files[$i]), [System.Drawing.Imaging.ImageFormat]::Jpeg)
  $bmp.Dispose()
}
$master.Dispose()
Write-Output "Sliced Donald Duck and Bomb!"

