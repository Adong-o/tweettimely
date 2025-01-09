import { twitterConfig } from './twitter-config.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');
        
        console.log('Callback received:', { code, state }); // Debug log

        if (!code) {
            console.error('No authorization code received');
            window.location.replace('./dashboard.html?error=no_code');
            return;
        }

        const codeVerifier = sessionStorage.getItem('twitter_code_verifier');
        const storedState = sessionStorage.getItem('twitter_oauth_state');

        console.log('Stored values:', { codeVerifier, storedState }); // Debug log

        if (state !== storedState) {
            console.error('State mismatch:', { received: state, stored: storedState });
            window.location.replace('./dashboard.html?error=invalid_state');
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

        console.log('Token response status:', tokenResponse.status); // Debug log

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('Token exchange failed:', errorText);
            window.location.replace('./dashboard.html?error=token_exchange_failed');
            return;
        }

        const data = await tokenResponse.json();
        console.log('Token received successfully'); // Debug log
        
        localStorage.setItem('twitter_access_token', data.access_token);
        
        // Clean up
        sessionStorage.removeItem('twitter_oauth_state');
        sessionStorage.removeItem('twitter_code_verifier');

        window.location.replace('./dashboard.html?connected=true');
    } catch (error) {
        console.error('Detailed error in callback:', error);
        window.location.replace('./dashboard.html?error=true');
    }
}); 