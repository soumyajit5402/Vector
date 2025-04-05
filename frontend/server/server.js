const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the frontend root directory
app.use(express.static(path.join(__dirname, '..')));

// Handle all routes by sending the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Frontend server is running on http://localhost:${PORT}`);
}); 