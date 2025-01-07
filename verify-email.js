import { auth, sendEmailVerification } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    const resendBtn = document.getElementById('resend-email');
    const checkBtn = document.getElementById('check-status');
    const refreshBtn = document.getElementById('refresh-page');

    // Check if user is logged in
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = './auth.html';
            return;
        }

        if (user.emailVerified) {
            window.location.href = './dashboard.html';
        }
    });

    resendBtn?.addEventListener('click', async () => {
        const user = auth.currentUser;
        if (user && !user.emailVerified) {
            try {
                await sendEmailVerification(user);
                alert('Verification email sent! Please check your inbox.');
                resendBtn.disabled = true;
                setTimeout(() => {
                    resendBtn.disabled = false;
                }, 60000); // Enable after 1 minute
            } catch (error) {
                console.error('Error sending verification email:', error);
                alert(error.message);
            }
        }
    });

    checkBtn?.addEventListener('click', async () => {
        const user = auth.currentUser;
        if (user) {
            await user.reload();
            if (user.emailVerified) {
                window.location.href = './dashboard.html';
            } else {
                alert('Email not verified yet. Please check your inbox and click the verification link.');
            }
        }
    });

    refreshBtn?.addEventListener('click', () => {
        window.location.reload();
    });
}); 