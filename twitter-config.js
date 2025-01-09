const getBaseUrl = () => {
    return 'http://localhost:54725';  // Must match exactly
};

const baseUrl = getBaseUrl();

export const twitterConfig = {
    clientId: 'SFdGVUZPcWtTN19FbHNFQ2RXT0s6MTpjaQ',
    clientSecret: 'NupqbzCnXSC0_DKmFHuMRz_-pp42I2_eGR0Hipt3R3KCdCsip6',
    callbackURL: `${baseUrl}/callback.html`,
    redirectUri: `${baseUrl}/callback.html`,
    scope: 'tweet.read tweet.write users.read offline.access',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token'
}; 