export interface MathLevel {
    id: string;
    levelNumber: number;
    title: string;
    subtitle: string;
    icon: string;
    color: string;
    gradient: string;
    route: string;
    isLocked: boolean;
    stars: number;
    colorRgb?: string; // For CSS variables requiring RGB format (e.g. 255, 99, 71)
}
