const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize the Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Voiceflow API Key and Project Details
const API_KEY = 'VF.DM.678d3225db80fb6a72c1e4ff.p6Gr5egiKC2nOpuP'; // Replace with your API key
const PROJECT_ID = '678d1fdbc2593b028d023b6d'; // Replace with your project ID
const VERSION_ID = 'production'; // Typically 'production', replace if using another version

// Endpoint for interacting with the bot
app.post('/interact', async (req, res) => {
  const { user_id, message } = req.body;

  try {
    // Send request to Voiceflow API
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

    // Process the bot's response
    for (let trace of traces) {
      if (trace.type === 'text') {
        botResponse += trace.payload.message + '\n';
      }
    }

    // Send the response back to the client
    res.json({ success: true, response: botResponse.trim() });
  } catch (error) {
    console.error('Error interacting with Voiceflow:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: 'Failed to interact with the bot.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
