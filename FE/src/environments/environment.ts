// Development environment configuration - Frontend Only
export const environment = {
    production: false,
    // API URL is not needed anymore - using mock data
    // If you need to restore backend, uncomment below:
    /*
    get apiUrl(): string {
        if (typeof window !== 'undefined') {
            const hostname = window.location.hostname;
            return `http://${hostname}:3000`;
        }
        if (typeof process !== 'undefined' && process.env && process.env['SSR_API_URL']) {
            return process.env['SSR_API_URL'];
        }
        return 'http://localhost:3000';
    }
    */

    // Dummy API URL to prevent errors in services that haven't been updated yet
    get apiUrl(): string {
        return 'http://localhost:9999'; // Non-existent port - will be handled by mock data
    },

    // Firebase configuration
    firebase: {
        apiKey: "AIzaSyDd3EDHpeZFgs3yr6ROa_QqnYoSAYo6Wp0",
        authDomain: "turing-link-205616.firebaseapp.com",
        projectId: "turing-link-205616",
        storageBucket: "turing-link-205616.firebasestorage.app",
        messagingSenderId: "64619082169",
        appId: "1:64619082169:web:246661b76e5b8f9d708668",
        measurementId: "G-X9ZT8R5M0J"
    }
};
