Add-Type -AssemblyName System.Drawing
$poolDir = "c:\GitHub\life-quest\public\staged_images\pool"
$gridPath = "c:\GitHub\life-quest\scripts\sheets\reframe_6.png"
$files = @('iron_man_tony.jpg', 'robin_hood_bow_arrow.jpg', 'harry_potter_hero.jpg', 'arnold_terminator.jpg', 'gandalf_the_grey.jpg', 'predator_hunter_mask.jpg')

$master = [System.Drawing.Image]::FromFile($gridPath)
$W = 560
$H = 340
$cols = 3

for ($i = 0; $i -lt $files.Count; $i++) {
  $col = $i % $cols
  $row = [math]::Floor($i / $cols)
  $x = $col * $W
  $y = $row * $H

  $bmp = New-Object System.Drawing.Bitmap($W, $H)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $srcRect = New-Object System.Drawing.Rectangle($x, $y, $W, $H)
  $destRect = New-Object System.Drawing.Rectangle(0, 0, $W, $H)
  $g.DrawImage($master, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()

  $outPath = Join-Path $poolDir $files[$i]
  $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
  $bmp.Dispose()
}
$master.Dispose()
Write-Output "Sliced 6 hero portraits!"

