import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';

interface Cell {
    id: number;
    status: 'locked' | 'unlocked' | 'treasure' | 'failed';
    question?: Question;
    hasTreasure: boolean;
}

interface Question {
    text: string;
    answer: number;
    options: number[];
}

@Component({
    selector: 'app-treasure-hunt',
    standalone: true,
    imports: [CommonModule, RouterModule, KidButtonComponent],
    templateUrl: './treasure-hunt.component.html',
    styleUrls: ['./treasure-hunt.component.css']
})
export class TreasureHuntComponent implements OnInit {
    cells: Cell[] = [];
    treasuresFound = 0;
    readonly TOTAL_TREASURES = 3;
    gameStatus: 'playing' | 'won' | 'lost' = 'playing';

    selectedCell: Cell | null = null;
    showQuestion = false;

    ngOnInit() {
        this.initializeGame();
    }

    initializeGame() {
        // Create 9 cells
        this.cells = Array.from({ length: 9 }, (_, i) => ({
            id: i,
            status: 'locked' as const,
            hasTreasure: false
        }));

        // Randomly place 3 treasures
        const treasureIndices = new Set<number>();
        while (treasureIndices.size < this.TOTAL_TREASURES) {
            treasureIndices.add(Math.floor(Math.random() * 9));
        }

        treasureIndices.forEach(index => {
            this.cells[index].hasTreasure = true;
        });

        this.treasuresFound = 0;
        this.gameStatus = 'playing';
        this.selectedCell = null;
        this.showQuestion = false;
    }

    onCellClick(cell: Cell) {
        if (this.gameStatus !== 'playing') return;
        if (cell.status !== 'locked') return;

        this.selectedCell = cell;
        this.selectedCell.question = this.generateQuestion();
        this.showQuestion = true;
    }

    generateQuestion(): Question {
        const isAddition = Math.random() > 0.5;
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        let answer = 0;
        let text = '';

        if (isAddition) {
            answer = a + b;
            text = `${a} + ${b} = ?`;
        } else {
            const max = Math.max(a, b);
            const min = Math.min(a, b);
            answer = max - min;
            text = `${max} - ${min} = ?`;
        }

        const options = new Set<number>();
        options.add(answer);
        while (options.size < 4) {
            const wrong = Math.floor(Math.random() * 20);
            if (wrong !== answer) options.add(wrong);
        }

        return {
            text,
            answer,
            options: Array.from(options).sort(() => Math.random() - 0.5)
        };
    }

    handleAnswer(selectedOption: number) {
        if (!this.selectedCell || !this.selectedCell.question) return;

        const isCorrect = selectedOption === this.selectedCell.question.answer;

        if (isCorrect) {
            if (this.selectedCell.hasTreasure) {
                this.selectedCell.status = 'treasure';
                this.treasuresFound++;

                if (this.treasuresFound === this.TOTAL_TREASURES) {
                    this.gameStatus = 'won';
                }
            } else {
                this.selectedCell.status = 'unlocked';
            }
        } else {
            this.selectedCell.status = 'failed';
        }

        this.showQuestion = false;
        this.selectedCell = null;

        // Check lose condition: all cells opened but not enough treasures
        this.checkLoseCondition();
    }

    checkLoseCondition() {
        const lockedCells = this.cells.filter(c => c.status === 'locked').length;
        const remainingTreasures = this.TOTAL_TREASURES - this.treasuresFound;

        // If no locked cells left and still missing treasures, game is lost
        if (lockedCells === 0 && remainingTreasures > 0) {
            this.gameStatus = 'lost';
        }

        // Or if remaining locked cells < remaining treasures needed, also lost
        if (lockedCells < remainingTreasures && lockedCells > 0) {
            // Check if all remaining locked cells have treasures
            const lockedWithTreasure = this.cells.filter(c => c.status === 'locked' && c.hasTreasure).length;
            if (lockedWithTreasure < remainingTreasures) {
                this.gameStatus = 'lost';
            }
        }
    }

    closeQuestion() {
        this.showQuestion = false;
        this.selectedCell = null;
    }

    restartGame() {
        this.initializeGame();
    }
}
