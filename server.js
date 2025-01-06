const express = require('express');
const app = express();
const path = require('path');

// Serve static files
app.use(express.static(path.join(__dirname)));

// Handle clean URLs
app.get('/:page', (req, res, next) => {
    const filePath = path.join(__dirname, `${req.params.page}.html`);
    res.sendFile(filePath, err => {
        if (err) next();
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// For Vercel, we need to export the app
module.exports = app;

// Only listen if running directly (not on Vercel)
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
} 