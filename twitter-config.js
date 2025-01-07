const getBaseUrl = () => {
    const hostname = window.location.hostname;
    
    // Production Vercel URL (primary)
    if (hostname === 'tweettimely.vercel.app') {
        return 'https://tweettimely.vercel.app';
    }
    
    // GitHub Pages (backup)
    if (hostname.includes('github.io')) {
        return 'https://adong-o.github.io/tweettimely';
    }
    
    // Local development
    return 'http://localhost:3000';
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