# Script: Apply Timer Layout to All Components
# Timer ở giữa: [Câu hỏi] [⏱️ Timer] [🔊 Audio]

Write-Host "🎨 Applying new timer layout to all components..." -ForegroundColor Cyan
Write-Host ""

$components = @(
    @{Name="addition"; Path="d:\ThuyChi\ProjectThuyChi\FE\src\app\features\math-modules\addition"},
    @{Name="subtraction"; Path="d:\ThuyChi\ProjectThuyChi\FE\src\app\features\math-modules\subtraction"},
    @{Name="sorting"; Path="d:\ThuyChi\ProjectThuyChi\FE\src\app\features\math-modules\sorting"},
    @{Name="fill-in-blank"; Path="d:\ThuyChi\ProjectThuyChi\FE\src\app\features\math-modules\fill-in-blank"},
    @{Name="spelling"; Path="d:\ThuyChi\ProjectThuyChi\FE\src\app\features\vietnamese-modules\spelling"}
)

foreach ($comp in $components) {
    Write-Host "📝 Processing: $($comp.Name)" -ForegroundColor Yellow
    
    $htmlFile = Join-Path $comp.Path "$($comp.Name).component.html"
    
    if (Test-Path $htmlFile) {
        $content = Get-Content $htmlFile -Raw
        
        # Pattern 1: Tìm và thay thế phần question info
        # Từ: <div class="flex items-center gap-4...">
        #      <div...>Câu hỏi...</div>
        #      <kid-button...audio...>
        # Thành: <div class="flex items-center justify-center gap-4...">
        #        <div...>Câu hỏi...</div>
        #        <app-lesson-timer [compact]="true"></app-lesson-timer>
        #        <kid-button...audio...>
        
        # Tìm pattern: flex items-center gap-4 (không có justify-center)
        if ($content -match '(<div class="flex items-center gap-4[^"]*"[^>]*>)') {
            # Thêm justify-center
            $content = $content -replace 'flex items-center gap-4', 'flex items-center justify-center gap-4'
            Write-Host "  ✅ Added justify-center" -ForegroundColor Green
        }
        
        # Tìm vị trí giữa question counter và audio button
        # Pattern: </div>\s*<kid-button.*volume-2
        if ($content -match '(</div>\s*)(<kid-button[^>]*volume-2[^>]*>)') {
            $timer = "`n            `n            <!-- Timer in Center -->`n            <app-lesson-timer [compact=`"true`"></app-lesson-timer>`n            `n            <!-- Audio Button -->`n            "
            $content = $content -replace '(</div>)(\s*)(<kid-button[^>]*volume-2)', "`$1$timer`$3"
            Write-Host "  ✅ Added timer in center" -ForegroundColor Green
        }
        
        Set-Content $htmlFile -Value $content
        Write-Host "  ✅ Updated $($comp.Name)" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  File not found: $htmlFile" -ForegroundColor Yellow
    }
    
    Write-Host ""
}

Write-Host "✨ Layout update complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 New Layout:" -ForegroundColor Cyan
Write-Host "  [Câu hỏi 1/5]  [⏱️ 00:05]  [🔊]" -ForegroundColor White
Write-Host ""
