const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Voiceflow API Key and Project Details
const API_KEY = 'VF.DM.678d3225db80fb6a72c1e4ff.p6Gr5egiKC2nOpuP';
const PROJECT_ID = '678d1fdbc2593b028d023b6d';
const VERSION_ID = 'production';

// Middleware
app.use(cors());
app.use(bodyParser.json());

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
