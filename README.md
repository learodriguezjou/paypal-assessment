# PayPal Checkout Web Application

This project is a simple PayPal Checkout integration built using Node.js, Express, and the PayPal API. The web application allows users to select a product, input buyer details, and complete a transaction using PayPal's payment gateway. The application handles order creation and payment capture through PayPal's sandbox environment.

## Author
Lea Rodriguez Jouault

## Features
- Product selection with dynamic pricing.
- Buyer information form, including shipping details.
- Integration with PayPal API for processing payments.
- PayPal order creation and capture endpoints using Express.
- A working demo hosted on a public cloud service (Google Cloud)

## Prerequisites
Before you begin, ensure you have met the following requirements:
- Node.js (v12.x or higher)
- npm (Node Package Manager)
- PayPal Developer Account (for client credentials), if not go to https://developer.paypal.com/home/ 
- `.env` file with the following variables:
  - `CLIENT_ID`: Your PayPal client ID.
  - `SECRET`: Your PayPal secret.
  - `PORT`: The port on which you want the server to run.

## Getting Started

- Make sure to have an account on Paypal Developer
- You will need to create a PayPal sandbox account for testing payments to obtain the CLIENT ID and SECRET
- For simple paying tests, generate a credir card here: https://developer.paypal.com/api/rest/sandbox/card-testing/#link-creditcardgeneratorfortesting
- To access the web application directly, go to: http://34.31.145.96:3000/