import { twitterConfig } from './twitter-config.js';

const redirectToDashboard = (params = '') => {
    const baseUrl = twitterConfig.callbackURL.split('/callback.html')[0];
    window.location.replace(`${baseUrl}/dashboard.html${params}`);
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');
        
        if (!code) {
            console.error('No authorization code received');
            redirectToDashboard('?error=no_code');
            return;
        }

        const codeVerifier = sessionStorage.getItem('twitter_code_verifier');
        const storedState = sessionStorage.getItem('twitter_oauth_state');

        if (state !== storedState) {
            console.error('State mismatch');
            redirectToDashboard('?error=invalid_state');
            return;
        }

        // Exchange code for tokens
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
            const errorText = await tokenResponse.text();
            console.error('Token exchange failed:', errorText);
            redirectToDashboard('?error=token_exchange_failed');
            return;
        }

        const tokenData = await tokenResponse.json();
        
        // Store all tokens
        localStorage.setItem('twitter_access_token', tokenData.access_token);
        if (tokenData.refresh_token) {
            localStorage.setItem('twitter_refresh_token', tokenData.refresh_token);
        }
        localStorage.setItem('twitter_bearer_token', twitterConfig.bearerToken);
        localStorage.setItem('twitter_api_key', twitterConfig.apiKey);
        localStorage.setItem('twitter_api_secret', twitterConfig.apiKeySecret);

        // Clean up
        sessionStorage.removeItem('twitter_code_verifier');
        sessionStorage.removeItem('twitter_oauth_state');

        // Redirect with success
        redirectToDashboard('?connected=true');
    } catch (error) {
        console.error('Error in callback:', error);
        redirectToDashboard('?error=true');
    }
}); 