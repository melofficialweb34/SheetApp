import axios from 'axios';

export default async function handler(req, res) {
  const accessToken = process.env.ACCESS_TOKEN;
  const spreadsheetId = process.env.SPREADSHEET_ID;
  const sheetName = 'Responses';

  try {
    const response = await axios.get(`https://sheet.zohoapis.in/api/v2/${spreadsheetId}/sheet/${sheetName}/data`, {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`
      }
    });

    res.status(200).json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Error reading sheet data');
  }
}
