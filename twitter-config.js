const getBaseUrl = () => {
    // Check if running on GitHub Pages
    if (window.location.hostname.includes('github.io')) {
        return 'https://adong-o.github.io/tweettimely/';
    }
    // Check if running locally
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3000';
    }
    // Default to Vercel
    return 'https://tweettimely.vercel.app';
};

const baseUrl = getBaseUrl();

export const twitterConfig = {
    clientId: 'SFdGVUZPcWtTN19FbHNFQ2RXT0s6MTpjaQ',
    clientSecret: 'NupqbzCnXSC0_DKmFHuMRz_-pp42I2_eGR0Hipt3R3KCdCsip6',
    redirectUri: `${baseUrl}/callback`,
    scope: 'tweet.read tweet.write users.read offline.access',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token'
}; 