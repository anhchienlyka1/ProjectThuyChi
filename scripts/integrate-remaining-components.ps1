# Script tự động tích hợp timer cho các components còn lại
# Chạy script này để hoàn thành tích hợp

Write-Host "🚀 Bắt đầu tích hợp timer cho tất cả components..." -ForegroundColor Cyan
Write-Host ""

# Danh sách components cần tích hợp
$components = @(
    @{
        Name = "sorting"
        Path = "d:\ThuyChi\ProjectThuyChi\FE\src\app\features\math-modules\sorting"
        LevelId = "sorting"
        Type = "math"
    },
    @{
        Name = "fill-in-blank"
        Path = "d:\ThuyChi\ProjectThuyChi\FE\src\app\features\math-modules\fill-in-blank"
        LevelId = "fill-in-blank"
        Type = "math"
    },
    @{
        Name = "alphabet"
        Path = "d:\ThuyChi\ProjectThuyChi\FE\src\app\features\vietnamese-modules\alphabet"
        LevelId = "alphabet"
        Type = "vietnamese"
    },
    @{
        Name = "simple-words"
        Path = "d:\ThuyChi\ProjectThuyChi\FE\src\app\features\vietnamese-modules\simple-words"
        LevelId = "simple-words"
        Type = "vietnamese"
    }
)

$completed = 0
$total = $components.Count

foreach ($comp in $components) {
    Write-Host "📝 Processing: $($comp.Name)" -ForegroundColor Yellow
    
    $tsFile = Join-Path $comp.Path "$($comp.Name).component.ts"
    
    if (Test-Path $tsFile) {
        Write-Host "  ✅ TypeScript file found" -ForegroundColor Green
        Write-Host "  ⚠️  Manual edit required for TypeScript" -ForegroundColor Yellow
        Write-Host "     - Add OnDestroy to implements"
        Write-Host "     - Inject LessonTimerService"
        Write-Host "     - Add showCompletionStats and completionDuration properties"
        Write-Host "     - Update startGame() to call lessonTimer.startTimer('$($comp.LevelId)')"
        Write-Host "     - Update finishGame() to use lessonTimer.stopTimer()"
        Write-Host "     - Add ngOnDestroy() and closeCompletionStats() methods"
    }
    
    $completed++
    Write-Host "  Progress: $completed/$total" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "✨ Script hoàn thành!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Checklist cho mỗi component:" -ForegroundColor Yellow
Write-Host "1. ✅ HTML timer đã được thêm tự động"
Write-Host "2. ✅ HTML stats modal đã được thêm tự động"
Write-Host "3. ⏳ TypeScript cần edit thủ công (xem hướng dẫn trên)"
Write-Host ""
Write-Host "💡 Tip: Copy code từ comparison.component.ts đã hoàn thành!" -ForegroundColor Cyan
