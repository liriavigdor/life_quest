Add-Type -AssemblyName System.Drawing
$poolDir = "c:\GitHub\life-quest\public\staged_images\pool"
$gridPath = "c:\GitHub\life-quest\scripts\sheets_164\reframe_6_fix.png"
$files = @(
  'donald_duck_sailor.jpg',
  'leaning_tower_of_pisa.jpg',
  'item_446_מגדל_פיזה_הנוטה.jpg',
  'neon_motel_sign.jpg',
  'authentic_item_153_פצצה_שחורה_עגולה_עם_פתיל_בוער__מסמלת.jpg',
  'item_196_מטאטא_זרדים_ישן__מסמל.jpg'
)
$master = [System.Drawing.Image]::FromFile($gridPath)
$W = 560; $H = 340; $cols = 3
for ($i = 0; $i -lt $files.Count; $i++) {
  $col = $i % $cols
  $row = [math]::Floor($i / $cols)
  $bmp = New-Object System.Drawing.Bitmap($W, $H)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $srcRect = New-Object System.Drawing.Rectangle(($col * $W), ($row * $H), $W, $H)
  $destRect = New-Object System.Drawing.Rectangle(0, 0, $W, $H)
  $g.DrawImage($master, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  $bmp.Save((Join-Path $poolDir $files[$i]), [System.Drawing.Imaging.ImageFormat]::Jpeg)
  $bmp.Dispose()
}
$master.Dispose()
Write-Output "Sliced 6 fixed images!"

