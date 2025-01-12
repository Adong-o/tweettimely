import { twitterConfig } from './twitter-config.js';

class DashboardManager {
    constructor() {
        this.scheduledTweets = [];
        this.init();
        this.initializeTwitterConnect();
    }

    init() {
        this.setupEventListeners();
        this.setupSidebarToggle();
        this.loadScheduledTweets();
        this.updateStats();
        this.setupViewToggle();
    }

    setupEventListeners() {
        const textarea = document.querySelector('.compose-box textarea');
        const charCount = document.querySelector('.char-count');
        const scheduleBtn = document.querySelector('.schedule-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const mediaUpload = document.getElementById('media-upload');

        textarea?.addEventListener('input', (e) => {
            const remaining = 280 - e.target.value.length;
            if (charCount) {
                charCount.textContent = remaining;
                charCount.style.color = remaining < 20 ? '#f44336' : '#666';
            }
        });

        scheduleBtn?.addEventListener('click', () => this.scheduleTweet());
        logoutBtn?.addEventListener('click', () => this.handleLogout());
        mediaUpload?.addEventListener('change', (e) => this.handleMediaUpload(e));
    }

    setupSidebarToggle() {
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebar = document.querySelector('.dashboard-sidebar');

        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', (e) => {
                e.preventDefault();
                sidebar.classList.toggle('active');
                sidebarToggle.setAttribute('aria-expanded', 
                    sidebar.classList.contains('active'));
            });

            // Close sidebar when pressing Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                    sidebarToggle.setAttribute('aria-expanded', 'false');
                }
            });

            // Close sidebar when clicking menu items (on mobile)
            const menuItems = sidebar.querySelectorAll('a');
            menuItems.forEach(item => {
                item.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        sidebar.classList.remove('active');
                        sidebarToggle.setAttribute('aria-expanded', 'false');
                    }
                });
            });
        }
    }

    loadScheduledTweets() {
        const saved = localStorage.getItem('scheduled_tweets');
        this.scheduledTweets = saved ? JSON.parse(saved) : [];
        this.updateScheduledTweets();
    }

    updateScheduledTweets() {
        const tweetsList = document.getElementById('scheduled-tweets-list');
        if (!tweetsList) return;

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
        
        let mediaHtml = '';
        if (tweet.media && tweet.media.length > 0) {
            mediaHtml = `
                <div class="tweet-media">
                    ${tweet.media.map(url => `
                        <div class="media-item">
                            <img src="${url}" alt="Tweet media">
                        </div>
                    `).join('')}
                </div>
            `;
        }

        div.innerHTML = `
            <p>${tweet.text}</p>
            ${mediaHtml}
            <div class="tweet-meta">
                <span>Scheduled for: ${new Date(tweet.scheduleTime).toLocaleString()}</span>
                <button onclick="dashboard.deleteTweet(${tweet.id})" class="delete-btn">Delete</button>
            </div>
        `;
        return div;
    }

    scheduleTweet() {
        const text = document.querySelector('.compose-box textarea').value;
        const scheduleTime = document.getElementById('schedule-time').value;
        const mediaElements = document.querySelectorAll('.media-preview img');
        const mediaUrls = Array.from(mediaElements).map(img => img.src);

        if (!text && mediaUrls.length === 0) {
            alert('Please enter tweet text or add media');
            return;
        }

        const tweet = {
            id: Date.now(),
            text,
            scheduleTime: new Date(scheduleTime),
            status: 'scheduled',
            media: mediaUrls
        };

        this.scheduledTweets.push(tweet);
        this.saveScheduledTweets();
        this.updateScheduledTweets();
        this.updateStats();

        // Clear the form
        document.querySelector('.compose-box textarea').value = '';
        document.getElementById('schedule-time').value = '';
        document.getElementById('media-preview').innerHTML = '';
    }

    handleMediaUpload(event) {
        const files = event.target.files;
        const mediaPreview = document.getElementById('media-preview');
        
        for (let file of files) {
            if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const previewItem = document.createElement('div');
                    previewItem.className = 'preview-item';
                    
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    
                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'remove-media';
                    removeBtn.innerHTML = '×';
                    removeBtn.onclick = () => previewItem.remove();
                    
                    previewItem.appendChild(img);
                    previewItem.appendChild(removeBtn);
                    mediaPreview.appendChild(previewItem);
                };
                reader.readAsDataURL(file);
            }
        }
    }

    deleteTweet(id) {
        this.scheduledTweets = this.scheduledTweets.filter(tweet => tweet.id !== id);
        this.saveScheduledTweets();
        this.updateScheduledTweets();
        this.updateStats();
    }

    saveScheduledTweets() {
        localStorage.setItem('scheduled_tweets', JSON.stringify(this.scheduledTweets));
    }

    updateStats() {
        const scheduledCount = document.getElementById('scheduled-count');
        if (scheduledCount) {
            scheduledCount.textContent = this.scheduledTweets.length;
        }
    }

    handleLogout() {
        localStorage.removeItem('twitter_auth');
        localStorage.removeItem('twitter_access_token');
        window.location.href = './index.html';
    }

    setupViewToggle() {
        const viewBtns = document.querySelectorAll('.view-btn');
        const listView = document.querySelector('.tweets-list-view');
        const calendarView = document.querySelector('.tweets-calendar-view');

        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                
                // Update buttons
                viewBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update views
                if (view === 'list') {
                    listView.classList.add('active');
                    calendarView.classList.remove('active');
                } else {
                    calendarView.classList.add('active');
                    listView.classList.remove('active');
                    this.renderCalendar();
                }
            });
        });

        // Initialize calendar navigation
        this.setupCalendarNavigation();
    }

    setupCalendarNavigation() {
        const prevBtn = document.getElementById('prevMonth');
        const nextBtn = document.getElementById('nextMonth');
        this.currentDate = new Date();

        prevBtn?.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });

        nextBtn?.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });
    }

    renderCalendar() {
        const calendarGrid = document.getElementById('calendar-grid');
        const currentMonth = document.getElementById('currentMonth');
        if (!calendarGrid || !currentMonth) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // Update month display
        currentMonth.textContent = new Date(year, month).toLocaleString('default', { 
            month: 'long', 
            year: 'numeric' 
        });

        // Clear grid
        calendarGrid.innerHTML = '';

        // Add weekday headers
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        weekdays.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-header-day';
            header.textContent = day;
            calendarGrid.appendChild(header);
        });

        // Get first day of month and total days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Add empty cells for days before the first of the month
        for (let i = 0; i < firstDay; i++) {
            calendarGrid.appendChild(this.createCalendarDay(''));
        }

        // Create calendar days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const tweetsForDay = this.getScheduledTweetsForDate(date);
            calendarGrid.appendChild(this.createCalendarDay(day, tweetsForDay));
        }
    }

    createCalendarDay(day, tweets = []) {
        const div = document.createElement('div');
        div.className = 'calendar-day' + (tweets.length ? ' has-tweets' : '');
        
        if (day) {
            div.innerHTML = `
                <div class="day-number">${day}</div>
                ${tweets.length ? `<div class="day-tweets">${tweets.length} tweet${tweets.length > 1 ? 's' : ''}</div>` : ''}
            `;

            div.addEventListener('click', () => {
                if (tweets.length) {
                    // Show tweets for this day
                    this.showTweetsForDay(tweets);
                }
            });
        }

        return div;
    }

    getScheduledTweetsForDate(date) {
        return this.scheduledTweets.filter(tweet => {
            const tweetDate = new Date(tweet.scheduleTime);
            return tweetDate.toDateString() === date.toDateString();
        });
    }

    showTweetsForDay(tweets) {
        // Implement a modal or side panel to show tweets for the selected day
        console.log('Tweets for selected day:', tweets);
    }

    initializeTwitterConnect() {
        const connectButton = document.getElementById('connect-twitter');
        if (connectButton) {
            connectButton.addEventListener('click', () => this.handleTwitterConnect());
            
            // Check URL parameters for connection status
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('connected') === 'true') {
                this.showConnectionSuccess();
                // Remove the query parameter but keep the correct domain
                window.history.replaceState({}, document.title, `${twitterConfig.baseUrl}/dashboard.html`);
            } else if (urlParams.get('error')) {
                this.showConnectionError();
                // Remove the query parameter but keep the correct domain
                window.history.replaceState({}, document.title, `${twitterConfig.baseUrl}/dashboard.html`);
            }
            
            // Check if user is already connected
            const isConnected = localStorage.getItem('twitter_access_token');
            this.updateTwitterConnectionState(!!isConnected);
        }
    }

    async handleTwitterConnect() {
        try {
            console.log('Starting Twitter connection...');
            
            // Generate PKCE values
            const codeVerifier = this.generateRandomString(128);
            const codeChallenge = await this.generateCodeChallenge(codeVerifier);
            
            // Store PKCE verifier and state for verification
            sessionStorage.setItem('twitter_code_verifier', codeVerifier);
            const state = this.generateRandomString(32);
            sessionStorage.setItem('twitter_oauth_state', state);

            // Construct authorization URL
            const params = new URLSearchParams({
                response_type: 'code',
                client_id: twitterConfig.clientId,
                redirect_uri: twitterConfig.redirectUri,
                scope: 'tweet.read tweet.write users.read offline.access',
                state: state,
                code_challenge: codeChallenge,
                code_challenge_method: 'S256'
            });

            const authUrl = `${twitterConfig.authUrl}?${params}`;
            console.log('Redirecting to Twitter auth...');
            window.location.href = authUrl;
        } catch (error) {
            console.error('Connection error:', error);
            this.showConnectionError();
        }
    }

    async generateCodeChallenge(verifier) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(verifier);
            const digest = await crypto.subtle.digest('SHA-256', data);
            const base64 = btoa(String.fromCharCode(...new Uint8Array(digest)));
            return base64
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=/g, '');
        } catch (error) {
            console.error('Code challenge generation error:', error);
            throw error;
        }
    }

    async loadTwitterAnalytics() {
        const token = localStorage.getItem('twitter_access_token');
        if (!token) return;

        try {
            // Fetch user metrics
            const metricsResponse = await fetch('https://api.twitter.com/2/users/me/tweets/metrics', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const metricsData = await metricsResponse.json();

            // Update analytics display
            this.updateAnalyticsDisplay(metricsData);
        } catch (error) {
            console.error('Error loading Twitter analytics:', error);
        }
    }

    updateAnalyticsDisplay(data) {
        // Update engagement rate
        const engagementRate = document.getElementById('engagement-rate');
        if (engagementRate) {
            engagementRate.textContent = `${(data.engagement_rate || 0).toFixed(1)}%`;
        }

        // Update impressions
        const impressions = document.getElementById('impressions');
        if (impressions) {
            impressions.textContent = this.formatNumber(data.impression_count || 0);
        }

        // Update profile visits
        const profileVisits = document.getElementById('profile-visits');
        if (profileVisits) {
            profileVisits.textContent = this.formatNumber(data.profile_visits || 0);
        }
    }

    updateTwitterConnectionState(isConnected) {
        const connectButton = document.getElementById('connect-twitter');
        const userSection = document.querySelector('.user-section');
        
        if (connectButton && userSection) {
            if (isConnected) {
                // Option 1: Hide the button completely
                connectButton.style.display = 'none';
                
                // Option 2: Or show as connected state
                // connectButton.classList.add('connected');
                // connectButton.innerHTML = `<span class="x-logo">𝕏</span> Connected`;
                // connectButton.disabled = true;
                
                // Show user's Twitter info if available
                this.loadTwitterUserInfo();
            } else {
                connectButton.style.display = 'block';
                connectButton.classList.remove('connected');
                connectButton.innerHTML = `<span class="x-logo">𝕏</span> Connect X Account`;
                connectButton.disabled = false;
            }
        }
    }

    // Add this new method to load Twitter user info
    async loadTwitterUserInfo() {
        try {
            const token = localStorage.getItem('twitter_access_token');
            if (!token) return;

            const response = await fetch('https://api.twitter.com/2/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                // Update UI with user info if needed
                console.log('Twitter user data:', userData);
            }
        } catch (error) {
            console.error('Error loading Twitter user info:', error);
        }
    }

    // Utility functions
    generateRandomString(length) {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
        let text = '';
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    showConnectionSuccess() {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            Successfully connected to Twitter!
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
            // Refresh the page or update UI
            this.updateTwitterConnectionState(true);
        }, 3000);
    }

    showConnectionError() {
        const notification = document.createElement('div');
        notification.className = 'notification error';
        
        const urlParams = new URLSearchParams(window.location.search);
        let errorMessage = 'Failed to connect to Twitter. Please try again.';
        
        switch(urlParams.get('error')) {
            case 'no_code':
                errorMessage = 'Authorization code not received from Twitter.';
                break;
            case 'invalid_state':
                errorMessage = 'Security verification failed. Please try again.';
                break;
            case 'token_exchange_failed':
                errorMessage = 'Failed to exchange authorization code. Please try again.';
                break;
        }

        notification.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            ${errorMessage}
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 5000);
    }
}

// Initialize the dashboard
const dashboard = new DashboardManager(); 

// Update any navigation functions
function navigateToSection(section) {
    window.location.href = `${twitterConfig.baseUrl}/${section}`;
} 

// Update any navigation links
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        window.location.href = `${twitterConfig.baseUrl}/${href}`;
    });
}); 