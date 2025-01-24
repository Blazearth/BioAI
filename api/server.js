const axios = require('axios');

module.exports = async (req, res) => {
  console.log('Received request:', req.body);

  if (req.method === 'POST') {
    const { user_id, message } = req.body;

    try {
      const response = await axios.post(
        `https://general-runtime.voiceflow.com/state/user/${user_id}/interact`,
        { request: { type: 'text', payload: message } },
        {
          headers: {
            Authorization: 'VF.DM.678d3225db80fb6a72c1e4ff.p6Gr5egiKC2nOpuP',  // Your Voiceflow API Key
            versionID: 'production',  // Change if needed
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

      res.status(200).json({ success: true, response: botResponse.trim() });
    } catch (error) {
      console.error('Error interacting with Voiceflow:', error);
      res.status(500).json({ success: false, error: 'Failed to interact with the bot.' });
    }
  } else {
    res.status(404).json({ success: false, error: 'Endpoint not found.' });
  }
};
