const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

// Middleware
const app = require('express')();
app.use(cors());
app.use(bodyParser.json());

// Voiceflow API Key and Project Details
const API_KEY = 'VF.DM.678d3225db80fb6a72c1e4ff.p6Gr5egiKC2nOpuP';
const PROJECT_ID = '678d1fdbc2593b028d023b6d';
const VERSION_ID = 'production';

// Endpoint for interacting with the bot
app.post('/interact', async (req, res) => {
  const { user_id, message } = req.body;

  try {
    const response = await axios.post(
      `https://general-runtime.voiceflow.com/state/user/${user_id}/interact`,
      { request: { type: 'text', payload: message } },
      {
        headers: {
          Authorization: API_KEY,
          versionID: VERSION_ID,
        },
      }
    );

    const traces = response.data;
    let botResponse = '';

    for (let trace of traces) {
      if (trace.type === 'text') {
        botResponse += trace.payload.message + '\n';
      }
    }

    res.json({ success: true, response: botResponse.trim() });
  } catch (error) {
    console.error('Error interacting with Voiceflow:', error);
    res.status(500).json({ success: false, error: 'Failed to interact with the bot.' });
  }
});

// Export the handler as a serverless function for Vercel
module.exports = app;
