import { 
    auth, 
    googleProvider, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup,
    sendEmailVerification,
    updateProfile 
} from './firebase-config.js';

// Update redirect URLs
const successRedirect = '/dashboard';  // not 'dashboard.html'
const verifyEmailPath = '/verify-email';  // not 'verify-email.html'

document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.auth-form');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show corresponding form
            forms.forEach(form => {
                if (form.id === `${tab}-form`) {
                    form.classList.add('active');
                } else {
                    form.classList.remove('active');
                }
            });
        });
    });

    // Password visibility toggle
    const toggleBtns = document.querySelectorAll('.toggle-password');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('input');
            const icon = btn.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Google Sign In
    const googleSignInBtn = document.getElementById('google-signin');
    googleSignInBtn?.addEventListener('click', async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            // User signed in successfully
            console.log('Google Sign in successful:', result.user);
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error('Google Sign in error:', error);
            alert(error.message);
        }
    });

    // Form submission
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (!userCredential.user.emailVerified) {
                window.location.href = 'verify-email.html';
                return;
            }
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error('Login error:', error);
            alert(error.message);
        }
    });

    signupForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirm = document.getElementById('signup-confirm').value;

        if (password !== confirm) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, {
                displayName: name
            });
            await sendEmailVerification(userCredential.user);
            window.location.href = 'verify-email.html';
        } catch (error) {
            console.error('Signup error:', error);
            alert(error.message);
        }
    });
}); 