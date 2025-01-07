import { twitterConfig } from './twitter-config.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');
        
        if (!code) {
            window.location.href = './dashboard.html';
            return;
        }

        const codeVerifier = sessionStorage.getItem('twitter_code_verifier');
        const storedState = sessionStorage.getItem('twitter_oauth_state');

        if (state !== storedState) {
            window.location.href = './dashboard.html';
            return;
        }

        const tokenResponse = await fetch(twitterConfig.tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${btoa(`${twitterConfig.clientId}:${twitterConfig.clientSecret}`)}`
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: twitterConfig.redirectUri,
                code_verifier: codeVerifier
            }).toString()
        });

        if (!tokenResponse.ok) {
            throw new Error('Token exchange failed');
        }

        const data = await tokenResponse.json();
        localStorage.setItem('twitter_access_token', data.access_token);
        
        // Clean up
        sessionStorage.removeItem('twitter_oauth_state');
        sessionStorage.removeItem('twitter_code_verifier');

        // Use window.location.replace for a cleaner redirect
        window.location.replace('./dashboard.html');
    } catch (error) {
        console.error('Error:', error);
        window.location.replace('./dashboard.html');
    }
}); 