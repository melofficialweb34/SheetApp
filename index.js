const express = require('express');
const axios = require('axios');
require('dotenv').config();
console.log("Loaded .env variables:");
console.log("CLIENT_ID:", process.env.CLIENT_ID);
console.log("CLIENT_SECRET:", process.env.CLIENT_SECRET);
console.log("REDIRECT_URI:", process.env.REDIRECT_URI);

const app = express();

const port = 3000;

// Redirect to Zoho OAuth consent page
app.get('/auth', (req, res) => {
  const authUrl = `https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id=${process.env.CLIENT_ID}&scope=ZohoSheet.dataAPI.READ,ZohoSheet.dataAPI.UPDATE&redirect_uri=${process.env.REDIRECT_URI}&access_type=offline&prompt=consent`;
  res.redirect(authUrl);
});

// Callback URL after consent
app.get('/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const tokenResponse = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
      params: {
        code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: 'authorization_code'
      }
    });

    console.log("Full Token Response:");
    console.log(tokenResponse.data); // Log everything received

    const access_token = tokenResponse.data.access_token;
    const refresh_token = tokenResponse.data.refresh_token;

    console.log("Access Token:", access_token);
    console.log("Refresh Token:", refresh_token);

    res.send('Authorization successful! Tokens printed on server.');
  } catch (err) {
    console.error("Error fetching token:", err.response?.data || err.message);
    res.status(500).send("Failed to get access token.");
  }
});

app.get('/read-sheet', async (req, res) => {
  const accessToken = '1000.ae1dc6db39d0f6f0c3a90569f39f9028.94f446c67d693af61096f93be4ea5e08';
  const spreadsheetId = '1ufi93b86d41466c3492d9829264e17c0dbb2';
  const sheetName = 'Responses';

  try {
    const response = await axios.get(`https://sheet.zohoapis.in/api/v2/${spreadsheetId}/${sheetName}`, {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`
      }
    });

    res.json(response.data);
  } catch (err) {
  console.error("Error reading sheet data:", err.response?.data || err.message);
  res.status(500).send('Error reading sheet data');
}


});


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
