const baseUrl = 'https://tweettimely.vercel.app';

export const twitterConfig = {
    // OAuth 2.0 Credentials
    clientId: 'SFdGVUZPcWtTN19FbHNFQ2RXT0s6MTpjaQ',
    
    // OAuth Configuration
    callbackURL: `${baseUrl}/callback.html`,
    redirectUri: `${baseUrl}/callback.html`,
    scope: 'tweet.read tweet.write users.read offline.access',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    
    // Base URL for reference
    baseUrl: baseUrl
};

export { baseUrl }; 