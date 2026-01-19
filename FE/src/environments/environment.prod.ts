// Production environment configuration
export const environment = {
    production: true,
    // In production, use the same host as the frontend
    get apiUrl(): string {
        if (typeof window !== 'undefined') {
            const hostname = window.location.hostname;
            return `http://${hostname}:3000`;
        }
        // SSR Context
        if (typeof process !== 'undefined' && process.env && process.env['SSR_API_URL']) {
            return process.env['SSR_API_URL'];
        }
        return 'http://localhost:3000';
    }
};
