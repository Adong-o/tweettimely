import { twitterConfig } from './twitter-config.js';

const redirectToDashboard = (params = '') => {
    window.location.replace(`${twitterConfig.baseUrl}/dashboard.html${params}`);
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Processing callback...');
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');
        const error = params.get('error');
        const errorDescription = params.get('error_description');
        
        // Check for Twitter-provided errors
        if (error) {
            console.error('Twitter auth error:', error, errorDescription);
            redirectToDashboard(`?error=${error}&description=${errorDescription}`);
            return;
        }

        if (!code) {
            console.error('No authorization code received');
            redirectToDashboard('?error=no_code');
            return;
        }

        // Verify state
        const storedState = sessionStorage.getItem('twitter_oauth_state');
        if (!storedState) {
            console.error('No stored state found');
            redirectToDashboard('?error=no_stored_state');
            return;
        }
        
        if (state !== storedState) {
            console.error('State mismatch', { received: state, stored: storedState });
            redirectToDashboard('?error=invalid_state');
            return;
        }

        // Get code verifier
        const codeVerifier = sessionStorage.getItem('twitter_code_verifier');
        if (!codeVerifier) {
            console.error('No code verifier found');
            redirectToDashboard('?error=no_code_verifier');
            return;
        }

        console.log('Callback URL:', window.location.href);
        console.log('Stored state:', sessionStorage.getItem('twitter_oauth_state'));
        console.log('Stored verifier:', sessionStorage.getItem('twitter_code_verifier'));

        console.log('Exchanging code for tokens...');
        const tokenResponse = await Promise.race([
            fetch(twitterConfig.tokenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                    'Origin': twitterConfig.baseUrl
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: twitterConfig.redirectUri,
                    client_id: twitterConfig.clientId,
                    code_verifier: codeVerifier
                }).toString()
            }),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timeout')), 10000)
            )
        ]);

        console.log('Token request payload:', {
            code,
            redirect_uri: twitterConfig.redirectUri,
            client_id: twitterConfig.clientId,
            code_verifier: codeVerifier
        });

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('Token exchange failed:', {
                status: tokenResponse.status,
                statusText: tokenResponse.statusText,
                error: errorText,
                headers: Object.fromEntries([...tokenResponse.headers])
            });
            redirectToDashboard('?error=token_exchange_failed');
            return;
        }

        const tokenData = await tokenResponse.json();
        console.log('Token exchange successful');
        
        if (!tokenData.access_token) {
            console.error('No access token in response');
            redirectToDashboard('?error=no_access_token');
            return;
        }

        // Store tokens
        localStorage.setItem('twitter_access_token', tokenData.access_token);
        if (tokenData.refresh_token) {
            localStorage.setItem('twitter_refresh_token', tokenData.refresh_token);
        }

        // Clean up
        sessionStorage.removeItem('twitter_code_verifier');
        sessionStorage.removeItem('twitter_oauth_state');

        // Redirect with success
        redirectToDashboard('?connected=true');
    } catch (error) {
        console.error('Callback error:', error);
        redirectToDashboard(`?error=callback_error&message=${encodeURIComponent(error.message)}`);
    }
}); 