import { Injectable, inject, signal } from '@angular/core';
import { GamificationStore } from '../store/gamification.store';

export interface ShopItem {
    id: string;
    name: string;
    type: 'avatar_frame' | 'mascot_skin' | 'sticker';
    cost: number;
    icon: string;
    owned: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ShopService {
    private gameStore = inject(GamificationStore);

    readonly items = signal<ShopItem[]>([
        { id: 'frame_gold', name: 'Khung Vàng', type: 'avatar_frame', cost: 50, icon: '🖼️', owned: false },
        { id: 'skin_superhero', name: 'Áo Siêu Nhân', type: 'mascot_skin', cost: 100, icon: '🦸', owned: false },
        { id: 'sticker_cat', name: 'Sticker Mèo', type: 'sticker', cost: 20, icon: '🐱', owned: false }
    ]);

    buyItem(itemId: string) {
        const item = this.items().find(i => i.id === itemId);
        const currentStars = this.gameStore.stars();

        if (!item) return { success: false, message: 'Vật phẩm không tồn tại' };
        if (item.owned) return { success: false, message: 'Bé đã có món này rồi' };
        if (currentStars < item.cost) return { success: false, message: 'Chưa đủ sao bé ơi!' };

        // Deduct stars
        this.gameStore.earnStars(-item.cost);

        // Mark as owned
        this.items.update(list =>
            list.map(i => i.id === itemId ? { ...i, owned: true } : i)
        );

        return { success: true, message: 'Mua thành công!' };
    }
}
