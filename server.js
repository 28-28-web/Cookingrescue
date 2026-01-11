const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Brevo Configuration - Use environment variables
const BREVO_CONFIG = {
    apiKey: process.env.BREVO_API_KEY,
    listId: process.env.BREVO_LIST_ID || '9',
    apiUrl: 'https://api.brevo.com/v3/contacts'
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// API endpoint for form submission
app.post('/api/subscribe', async (req, res) => {
    const { firstName, email } = req.body;

    // Validation
    if (!firstName || !email) {
        return res.status(400).json({
            success: false,
            message: 'First name and email are required'
        });
    }

    try {
        // Call Brevo API
        const response = await fetch(BREVO_CONFIG.apiUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api-key': BREVO_CONFIG.apiKey
            },
            body: JSON.stringify({
                email: email,
                attributes: {
                    FIRSTNAME: firstName
                },
                listIds: [parseInt(BREVO_CONFIG.listId)],
                updateEnabled: true
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Brevo API Error:', data);
            return res.status(response.status).json({
                success: false,
                message: data.message || 'Failed to subscribe'
            });
        }

        return res.json({
            success: true,
            message: 'Successfully subscribed!'
        });

    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Lead magnet page available at: http://localhost:${PORT}');
});
