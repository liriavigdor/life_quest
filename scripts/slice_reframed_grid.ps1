Add-Type -AssemblyName System.Drawing

$poolDir = "c:\GitHub\life-quest\public\staged_images\pool"
$gridPath = "c:\GitHub\life-quest\scripts\sheets\reframe_grid.png"

$files = @(
  'statue_of_liberty_ny.jpg',
  'star_of_david.jpg',
  'item_151_נורה_דולקת__מסמלת.jpg',
  'item_157_שק_כסף_שקשור_בחוט_עם_סימן____מסמל.jpg',
  'item_351_פטיש_מסמרים_קלאסי.jpg',
  'item_364_נר_דולק_נוטף_שעווה.jpg',
  'item_396_ארגז_כלים_אדום.jpg',
  'item_409_הפחיות_של_קוקה_קולה.jpg',
  'item_412_שרלוק_הולמס.jpg',
  'item_442_פסל_דוד__מיכלאנג_לו_.jpg',
  'item_447_פסל_ישו_הגואל_בריו.jpg',
  'item_470_מדליית_זהב.jpg',
  'item_476_שחמט__כלי_המלך_או_הרץ_.jpg',
  'item_479_מטה_הרפואה__נחש_כרוך_סביב_מוט_.jpg',
  'item_484_בודהה_מחייך.jpg',
  'item_486_מודל_האטום__גרעין_ומסלולי_אלקטרונים_אליפטיים_.jpg',
  'item_488_סמל_הקרינה_הרדיואקטיבית__שלוש_מניפות_שחורות_על_רקע_צהוב_.jpg',
  'item_498_סמל_ה_wi_fi__קשתות_מתרחבות_.jpg',
  'authentic_barbie_doll.jpg',
  'authentic_sonic_the_hedgehog.jpg',
  'authentic_super_mario.jpg',
  'spider_man.jpg',
  'batman.jpg',
  'superman.jpg',
  'iron_man.jpg',
  'the_joker.jpg',
  'robin_hood.jpg',
  'cinderella.jpg',
  'harry_potter.jpg',
  'terminator.jpg',
  'gandalf.jpg',
  'robocop.jpg',
  'predator.jpg',
  'degas_little_ballerina.jpg',
  'native_dreamcatcher.jpg',
  'item_255_אריה.jpg',
  'item_257_ג_ירפה.jpg',
  'item_263_פינגווין_קיסרי.jpg',
  'item_268_ינשוף_על_ענף.jpg',
  'item_269_נשר_דואה.jpg',
  'item_270_קנגורו.jpg',
  'item_271_גמל_דו_דבשתי.jpg',
  'item_296_נחש_קוברה.jpg',
  'item_343_חליפת_חלל.jpg',
  'item_367_מצית_זיפו.jpg',
  'item_401_דארת__ויידר.jpg',
  'item_402_באטמן.jpg',
  'item_403_סופרמן.jpg',
  'item_406_הלו_קיטי.jpg',
  'item_410_מרלין_מונרו.jpg',
  'item_435_חליפת_חלל.jpg',
  'item_441_פסל_החושב__רודן_.jpg',
  'item_485_מלאך_המוות__grim_reaper_.jpg',
  'item_491_רובוט_מתכתי__קופסתי_עם_עיניים_מאירות_.jpg',
  'item_495_איש_קו_על_כיסא_גלגלים.jpg'
)

$master = [System.Drawing.Image]::FromFile($gridPath)
$W = 560
$H = 340
$cols = 5

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
Write-Output "Sliced and saved all $($files.Count) reframed images!"

