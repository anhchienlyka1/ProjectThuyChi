import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MascotService } from '../../../core/services/mascot.service';
import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';

interface AlphabetChar {
    upper: string;
    lower: string;
    example: string;
    emoji: string;
    color: string;
}

@Component({
    selector: 'app-alphabet',
    standalone: true,
    imports: [CommonModule, KidButtonComponent],
    templateUrl: './alphabet.component.html',
    styleUrls: ['./alphabet.component.css']
})
export class AlphabetComponent implements OnInit {
    private router = inject(Router);
    mascot = inject(MascotService);

    alphabet: AlphabetChar[] = [
        { upper: 'A', lower: 'a', example: 'Con cá', emoji: '🐟', color: '#FF6B6B' },
        { upper: 'Ă', lower: 'ă', example: 'Mặt trăng', emoji: '🌙', color: '#4ECDC4' },
        { upper: 'Â', lower: 'â', example: 'Cây nấm', emoji: '🍄', color: '#45B7D1' },
        { upper: 'B', lower: 'b', example: 'Bánh chưng', emoji: '🍱', color: '#96CEB4' },
        { upper: 'C', lower: 'c', example: 'Con cò', emoji: '🦢', color: '#FFEEAD' },
        { upper: 'D', lower: 'd', example: 'Con dê', emoji: '🐐', color: '#D4A5A5' },
        { upper: 'Đ', lower: 'đ', example: 'Đu quay', emoji: '🎡', color: '#9B59B6' },
        { upper: 'E', lower: 'e', example: 'Em bé', emoji: '👶', color: '#3498DB' },
        { upper: 'Ê', lower: 'ê', example: 'Con ếch', emoji: '🐸', color: '#2ECC71' },
        { upper: 'G', lower: 'g', example: 'Con gà', emoji: '🐔', color: '#F1C40F' },
        { upper: 'H', lower: 'h', example: 'Hoa hồng', emoji: '🌹', color: '#E74C3C' },
        { upper: 'I', lower: 'i', example: 'Con khỉ', emoji: '🐒', color: '#34495E' },
        { upper: 'K', lower: 'k', example: 'Cái kéo', emoji: '✂️', color: '#16A085' },
        { upper: 'L', lower: 'l', example: 'Con lợn', emoji: '🐷', color: '#FF9F43' },
        { upper: 'M', lower: 'm', example: 'Con mèo', emoji: '🐱', color: '#A78BFA' },
        { upper: 'N', lower: 'n', example: 'Quả na', emoji: '🍐', color: '#F368E0' },
        { upper: 'O', lower: 'o', example: 'Con ong', emoji: '🐝', color: '#00D2D3' },
        { upper: 'Ô', lower: 'ô', example: 'Cái ô', emoji: '☂️', color: '#54A0FF' },
        { upper: 'Ơ', lower: 'ơ', example: 'Cái nơ', emoji: '🎀', color: '#5F27CD' },
        { upper: 'P', lower: 'p', example: 'Đèn pin', emoji: '🔦', color: '#FF9FF3' },
        { upper: 'Q', lower: 'q', example: 'Quả quýt', emoji: '🍊', color: '#48DBFB' },
        { upper: 'R', lower: 'r', example: 'Con rùa', emoji: '🐢', color: '#1DD1A1' },
        { upper: 'S', lower: 's', example: 'Ngôi sao', emoji: '⭐', color: '#FECA57' },
        { upper: 'T', lower: 't', example: 'Con tôm', emoji: '🦐', color: '#FF6B6B' },
        { upper: 'U', lower: 'u', example: 'Chiếc mũ', emoji: '🎩', color: '#4ECDC4' },
        { upper: 'Ư', lower: 'ư', example: 'Lá thư', emoji: '✉️', color: '#48DBFB' },
        { upper: 'V', lower: 'v', example: 'Con voi', emoji: '🐘', color: '#FF9F43' },
        { upper: 'X', lower: 'x', example: 'Xe bus', emoji: '🚌', color: '#54A0FF' },
        { upper: 'Y', lower: 'y', example: 'Y tá', emoji: '👩‍⚕️', color: '#A78BFA' }
    ];

    selectedChar: AlphabetChar | null = null;

    ngOnInit() {
        this.mascot.setEmotion('happy', 'Cùng khám phá bảng chữ cái Tiếng Việt nhé! 🍎', 3000);
        this.selectedChar = this.alphabet[0];
    }

    selectChar(char: AlphabetChar) {
        this.selectedChar = char;
        this.mascot.setEmotion('happy', `${char.upper} là trong từ "${char.example}" đó!`, 2000);
        this.playAudio(char);
    }

    playAudio(char: AlphabetChar) {
        // Logic for playing audio pronunciation
        console.log(`Pronouncing: ${char.upper}`);
    }

    goBack() {
        this.router.navigate(['/vietnamese']);
    }
}
