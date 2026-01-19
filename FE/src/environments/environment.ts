// Development environment configuration
export const environment = {
    production: false,
    // Automatically detect API URL based on current host
    // When running on localhost, use localhost:3000
    // When running on network IP (e.g., from iPad), use the same IP with port 3000
    get apiUrl(): string {
        if (typeof window !== 'undefined') {
            const hostname = window.location.hostname;
            // If accessing via IP address, use that IP for API
            // Otherwise default to localhost
            return `http://${hostname}:3000`;
        }
        // SSR Context
        // Check for Docker environment variable
        if (typeof process !== 'undefined' && process.env && process.env['SSR_API_URL']) {
            return process.env['SSR_API_URL'];
        }
        return 'http://localhost:3000';
    }
};
