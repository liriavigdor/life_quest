Add-Type -AssemblyName System.Drawing

$manifestPath = "public/data/ai_curated_manifest.json"
$items = Get-Content -Raw -Encoding UTF8 $manifestPath | ConvertFrom-Json

$outDir = "scripts/sheets"
if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Force -Path $outDir | Out-Null
}

$cols = 5
$rows = 5
$perSheet = $cols * $rows
$cellW = 260
$cellH = 210
$imgH = 155
$sheetW = $cols * $cellW
$sheetH = $rows * $cellH

$total = $items.Count
$sheetCount = [math]::Ceiling($total / $perSheet)

$bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(15, 23, 42))
$cardBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 41, 59))
$textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(148, 163, 184))
$borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(71, 85, 105), 2)
$fontBold = New-Object System.Drawing.Font("Arial", 11, [System.Drawing.FontStyle]::Bold)
$fontSmall = New-Object System.Drawing.Font("Consolas", 8, [System.Drawing.FontStyle]::Regular)

for ($s = 0; $s -lt $sheetCount; $s++) {
    $bmp = New-Object System.Drawing.Bitmap($sheetW, $sheetH)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.FillRectangle($bgBrush, 0, 0, $sheetW, $sheetH)

    $startIdx = $s * $perSheet
    $endIdx = [math]::Min($startIdx + $perSheet - 1, $total - 1)

    for ($i = $startIdx; $i -le $endIdx; $i++) {
        $localIdx = $i - $startIdx
        $r = [math]::Floor($localIdx / $cols)
        $c = $localIdx % $cols

        $x = $c * $cellW
        $y = $r * $cellH

        $g.FillRectangle($cardBrush, $x + 4, $y + 4, $cellW - 8, $cellH - 8)
        $g.DrawRectangle($borderPen, $x + 4, $y + 4, $cellW - 8, $cellH - 8)

        $item = $items[$i]
        $relPath = $item.imageUrl.TrimStart('/')
        $fullPath = Join-Path "public" $relPath

        if (Test-Path $fullPath) {
            try {
                $srcImg = [System.Drawing.Image]::FromFile($fullPath)
                # Simulate object-fit: cover into ($cellW - 12) x $imgH
                $targetW = $cellW - 12
                $targetH = $imgH
                $srcRatio = $srcImg.Width / [double]$srcImg.Height
                $dstRatio = $targetW / [double]$targetH

                if ($srcRatio -gt $dstRatio) {
                    # wider than target: crop left/right
                    $cropH = $srcImg.Height
                    $cropW = [int]($srcImg.Height * $dstRatio)
                    $cropX = [int](($srcImg.Width - $cropW) / 2)
                    $cropY = 0
                } else {
                    # taller than target: crop top/bottom
                    $cropW = $srcImg.Width
                    $cropH = [int]($srcImg.Width / $dstRatio)
                    $cropX = 0
                    $cropY = [int](($srcImg.Height - $cropH) / 2)
                }

                $destRect = New-Object System.Drawing.Rectangle(($x + 6), ($y + 6), $targetW, $targetH)
                $srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
                $g.DrawImage($srcImg, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
                $srcImg.Dispose()
            } catch {
                $g.DrawString("ERR LOAD", $fontBold, $textBrush, ($x + 20), ($y + 60))
            }
        } else {
            $g.DrawString("MISSING", $fontBold, $textBrush, ($x + 20), ($y + 60))
        }

        $label1 = "#$($i+1) $($item.name)"
        $label2 = "$($item.id)"
        if ($label2.Length -gt 30) { $label2 = $label2.Substring(0, 30) }
        $g.DrawString($label1, $fontBold, $textBrush, ($x + 8), ($y + $imgH + 10))
        $g.DrawString($label2, $fontSmall, $subBrush, ($x + 8), ($y + $imgH + 30))
    }

    $sheetNum = ($s + 1).ToString("00")
    $outFile = Join-Path $outDir "sheet_$sheetNum.jpg"
    $bmp.Save($outFile, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Saved $outFile ($($startIdx+1) to $($endIdx+1))"
}

