# Auto-Integration PowerShell Script
# This script will integrate timer into all remaining components

$components = @(
    @{
        Name = "Comparison"
        Path = "d:\ThuyChi\ProjectThuyChi\FE\src\app\features\math-modules\comparison"
        LevelId = "comparison"
    },
    @{
        Name = "Sorting"
        Path = "d:\ThuyChi\ProjectThuyChi\FE\src\app\features\math-modules\sorting"
        LevelId = "sorting"
    },
    @{
        Name = "FillInBlank"
        Path = "d:\ThuyChi\ProjectThuyChi\FE\src\app\features\math-modules\fill-in-blank"
        LevelId = "fill-in-blank"
    },
    @{
        Name = "Alphabet"
        Path = "d:\ThuyChi\ProjectThuyChi\FE\src\app\features\vietnamese-modules\alphabet"
        LevelId = "alphabet"
    },
    @{
        Name = "SimpleWords"
        Path = "d:\ThuyChi\ProjectThuyChi\FE\src\app\features\vietnamese-modules\simple-words"
        LevelId = "simple-words"
    }
)

Write-Host "🚀 Starting Auto-Integration..." -ForegroundColor Cyan
Write-Host ""

foreach ($component in $components) {
    Write-Host "📝 Processing: $($component.Name)" -ForegroundColor Yellow
    
    $htmlFile = Join-Path $component.Path "$($component.Name.ToLower()).component.html"
    
    # Add stats modal to HTML
    if (Test-Path $htmlFile) {
        $statsModal = @"


<!-- Completion Stats Modal -->
<app-lesson-completion-stats
    *ngIf="showCompletionStats"
    [levelId]="'$($component.LevelId)'"
    [currentDuration]="completionDuration"
    (close)="closeCompletionStats()">
</app-lesson-completion-stats>
"@
        
        Add-Content -Path $htmlFile -Value $statsModal
        Write-Host "  ✅ Added stats modal to HTML" -ForegroundColor Green
    }
    
    Write-Host ""
}

Write-Host "✨ Auto-Integration Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  Manual Steps Required:" -ForegroundColor Yellow
Write-Host "1. Add timer component to each HTML header"
Write-Host "2. Update TypeScript files with imports and logic"
Write-Host "3. Test each component"
