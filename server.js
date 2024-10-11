const express = require('express'); // Import express framework
const axios = require('axios'); // Import axios for making HTTP requests
const app = express(); // Initialize express app
const path = require('path'); // Import path module for working with file paths
const cors = require('cors'); // Import cors to handle cross-origin requests
require('dotenv').config(); // Import dotenv to load environment variables from .env file

app.use(cors());
app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the index.html file on the root endpoint
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));  // Serve the HTML file
});

// PayPal credentials loaded from environment variables
const CLIENT_ID = process.env.CLIENT_ID;
const SECRET = process.env.SECRET;

// Function to get PayPal Access Token
async function getAccessToken() {
    try {
        const response = await axios({
            url: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',  // PayPal sandbox endpoint for access token
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + SECRET).toString('base64')  // Basic authentication using PayPal Client ID and Secret
            },
            data: 'grant_type=client_credentials'  // Grant type for OAuth2 access token
        });
        return response.data.access_token;  // Return the access token
    } catch (error) {
        // Log the error and throw a new error if access token fetch fails
        console.error('Error getting PayPal access token:', error.response ? error.response.data : error.message);
        throw new Error('Unable to get PayPal access token');
    }
}

// Route to create a PayPal order
app.post('/create-order', async (req, res) => {
    try {
        const accessToken = await getAccessToken();  // Get PayPal access token
        const order = await axios.post('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
            intent: 'CAPTURE',  // Specify that the payment will be captured immediately
            purchase_units: [{
                amount: {
                    currency_code: 'USD', 
                    value: req.body.productPrice  // Use product price passed from the frontend
                },
                description: `Item Number: ${req.body.itemNumber}`,  // Include item number in the order description
                shipping: {  // Include shipping details provided by the user
                    name: {
                        full_name: `${req.body.firstName} ${req.body.lastName}`
                    },
                    address: {
                        address_line_1: req.body.address1,
                        address_line_2: req.body.address2,
                        neighborhood_quarter: req.body.neighborhood,
                        admin_area_2: req.body.city,  
                        admin_area_1: req.body.state,
                        postal_code: req.body.zip,
                        country_code: req.body.country
                    }
                }
            }],
            payer: {  // Payer's information
                email_address: req.body.email,
                name: {
                    given_name: req.body.firstName,
                    surname: req.body.lastName
                }
            }
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`  // Include access token in the request headers
            }
        });

        // Respond with the order data from PayPal
        res.json(order.data);
    } catch (error) {
        // Handle and log errors related to creating a PayPal order
        console.error('Error creating PayPal order:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error creating PayPal order', details: error.response ? error.response.data : error.message });
    }
});

// Route to capture the PayPal order after approval
app.post('/capture-order', async (req, res) => {
    try {
        const accessToken = await getAccessToken();  // Get PayPal access token
        const capture = await axios.post(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${req.body.orderID}/capture`, {}, {
            headers: {
                'Authorization': `Bearer ${accessToken}`  // Include access token in the request headers
            }
        });

        // Respond with the capture details including transaction ID and status
        res.json({
            id: capture.data.id,
            status: capture.data.status
        });
    } catch (error) {
        console.error('Error capturing PayPal order:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error capturing PayPal order', details: error.response ? error.response.data : error.message });
    }
});

// Start the server on the specified port
app.listen(process.env.PORT, () => {
    console.log('Server running on http://34.31.145.96:3000');  // Log the server's URL when it starts
});
