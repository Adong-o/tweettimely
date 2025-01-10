import { twitterConfig } from './twitter-config.js';

export class TwitterAuth {
    static isAuthenticated() {
        return !!localStorage.getItem('twitter_access_token');
    }

    static getAuthHeaders() {
        const accessToken = localStorage.getItem('twitter_access_token');
        return {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        };
    }

    static async refreshToken() {
        const refreshToken = localStorage.getItem('twitter_refresh_token');
        if (!refreshToken) return false;

        try {
            const response = await fetch(twitterConfig.tokenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${btoa(`${twitterConfig.apiKey}:${twitterConfig.apiKeySecret}`)}`
                },
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                    client_id: twitterConfig.clientId
                }).toString()
            });

            if (!response.ok) throw new Error('Failed to refresh token');

            const data = await response.json();
            localStorage.setItem('twitter_access_token', data.access_token);
            if (data.refresh_token) {
                localStorage.setItem('twitter_refresh_token', data.refresh_token);
            }
            return true;
        } catch (error) {
            console.error('Error refreshing token:', error);
            return false;
        }
    }
} 