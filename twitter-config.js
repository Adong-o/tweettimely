const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const baseUrl = isDevelopment ? 'http://localhost:3000' : 'https://tweettimely.vercel.app';

export const twitterConfig = {
    clientId: 'SFdGVUZPcWtTN19FbHNFQ2RXT0s6MTpjaQ',
    clientSecret: 'NupqbzCnXSC0_DKmFHuMRz_-pp42I2_eGR0Hipt3R3KCdCsip6',
    redirectUri: `${baseUrl}/callback`,
    scope: 'tweet.read tweet.write users.read offline.access',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token'
}; 