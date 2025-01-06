class TweetScheduler {
    constructor() {
        this.isAuthenticated = false;
        this.scheduledTweets = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        const loginButton = document.getElementById('twitter-login');
        loginButton.addEventListener('click', () => {
            if (this.isAuthenticated) {
                this.handleLogout();
            } else {
                this.handleLogin();
            }
        });

        const scheduleButton = document.querySelector('.schedule-btn');
        scheduleButton.addEventListener('click', () => this.scheduleTweet());

        const getStartedButton = document.getElementById('get-started');
        if (getStartedButton) {
            getStartedButton.addEventListener('click', () => {
                const loginButton = document.getElementById('twitter-login');
                loginButton.click();
            });
        }

        // Pricing toggle functionality
        const billingToggle = document.getElementById('billing-toggle');
        if (billingToggle) {
            billingToggle.addEventListener('change', () => {
                const monthlyPrices = document.querySelectorAll('.price.monthly');
                const yearlyPrices = document.querySelectorAll('.price.yearly');
                
                monthlyPrices.forEach(price => price.classList.toggle('hidden'));
                yearlyPrices.forEach(price => price.classList.toggle('hidden'));
            });
        }
    }

    checkAuthStatus() {
        // This would normally check if the user is authenticated with Twitter
        // For now, we'll just use a mock implementation
        this.isAuthenticated = localStorage.getItem('twitter_auth') === 'true';
        this.updateUI();
    }

    handleLogin() {
        this.isAuthenticated = true;
        localStorage.setItem('twitter_auth', 'true');
        window.location.href = '/dashboard';
    }

    handleLogout() {
        this.isAuthenticated = false;
        localStorage.removeItem('twitter_auth');
        this.scheduledTweets = [];
        this.updateUI();
    }

    updateUI() {
        const dashboard = document.getElementById('dashboard');
        const heroSection = document.querySelector('.hero-section');
        const loginButton = document.getElementById('twitter-login');

        if (this.isAuthenticated) {
            dashboard.classList.remove('hidden');
            heroSection.classList.add('hidden');
            loginButton.textContent = 'Logout';
            this.loadAnalytics();
            this.loadScheduledTweets();
        } else {
            dashboard.classList.add('hidden');
            heroSection.classList.remove('hidden');
            loginButton.textContent = 'Login with X';
        }
    }

    scheduleTweet() {
        const tweetText = document.querySelector('.tweet-composer textarea').value;
        const scheduleTime = document.getElementById('schedule-time').value;

        if (!tweetText || !scheduleTime) {
            alert('Please enter tweet text and schedule time');
            return;
        }

        const tweet = {
            id: Date.now(),
            text: tweetText,
            scheduleTime: new Date(scheduleTime),
            status: 'scheduled'
        };

        this.scheduledTweets.push(tweet);
        this.saveScheduledTweets();
        this.loadScheduledTweets();
        
        // Clear the form
        document.querySelector('.tweet-composer textarea').value = '';
        document.getElementById('schedule-time').value = '';
    }

    loadAnalytics() {
        // Mock analytics data
        document.getElementById('engagement-rate').textContent = '2.4%';
        document.getElementById('impressions').textContent = '12.5K';
        document.getElementById('scheduled-count').textContent = 
            this.scheduledTweets.length.toString();
    }

    loadScheduledTweets() {
        const tweetsList = document.getElementById('scheduled-tweets-list');
        tweetsList.innerHTML = '';

        this.scheduledTweets
            .sort((a, b) => new Date(a.scheduleTime) - new Date(b.scheduleTime))
            .forEach(tweet => {
                const tweetElement = this.createTweetElement(tweet);
                tweetsList.appendChild(tweetElement);
            });
    }

    createTweetElement(tweet) {
        const div = document.createElement('div');
        div.className = 'scheduled-tweet';
        div.innerHTML = `
            <p>${tweet.text}</p>
            <small>Scheduled for: ${new Date(tweet.scheduleTime).toLocaleString()}</small>
        `;
        return div;
    }

    saveScheduledTweets() {
        localStorage.setItem('scheduled_tweets', JSON.stringify(this.scheduledTweets));
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new TweetScheduler();
});

// Example of JavaScript redirects
function redirectToDashboard() {
    window.location.href = '/dashboard';  // not '/dashboard.html'
}

function redirectToAuth() {
    window.location.href = '/auth';  // not '/auth.html'
}
