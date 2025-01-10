const getBaseUrl = () => {
    if (window.location.hostname === 'tweettimely.vercel.app') {
        return 'https://tweettimely.vercel.app';
    }
    return `http://localhost:${window.location.port}`;
};

const baseUrl = getBaseUrl();

export const twitterConfig = {
    // OAuth 2.0 Credentials
    clientId: 'SFdGVUZPcWtTN19FbHNFQ2RXT0s6MTpjaQ',
    clientSecret: 'bNXdGlYnGJjOM8afzSMueADGuey-ejJcb7a86BYYuX6RA5gF',
    
    // API v1.1 Credentials
    apiKey: 'SXgnQkxkHcsbMsYBmM8OVyfDw',
    apiKeySecret: '1OsmW21jf4LOUHSkEGTs5SzMjRX2ggvPumCn5QqDSLTEwtpjnK',
    
    // Authentication Tokens
    bearerToken: 'AAAAAAAAAAAAAAAAAAAAAK%2FExwEAAAAAhFiVpHYVM%2FofrwDBbxeBnt3iNyQ%3DSjhh9ag6ALWBXcQ7ju2KPQdF0SBFhWFSWMCGFaTDv2gfQz6HIo',
    accessToken: '1525406526608969728-Mr848svohPOnjt5dpaEFPFzl6vVLjj',
    accessTokenSecret: 'AtgxxqmMB9X5aeDZI0Nup3EjdFcDSUKCq8fIAvLWDrRW8',
    
    // OAuth Configuration
    callbackURL: `${baseUrl}/callback.html`,
    redirectUri: `${baseUrl}/callback.html`,
    scope: 'tweet.read tweet.write users.read offline.access',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token'
}; 