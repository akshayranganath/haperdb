// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const { connect } = require('http2');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// HarperDB configuration
const harperDBConfig = {
  url: process.env.HARPERDB_URL,
  username: process.env.HARPERDB_USERNAME,
  password: process.env.HARPERDB_PASSWORD,
  schema: process.env.HARPERDB_SCHEMA || 'analytics',
  table: process.env.HARPERDB_TABLE || 'events'
};

// Function to send data to HarperDB
async function sendToHarperDB(data) {
  try {
    const response = await axios({
      method: 'post',
      url: harperDBConfig.url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(
          `${harperDBConfig.username}:${harperDBConfig.password}`
        ).toString('base64')
      },
      data: {
        operation: 'insert',
        schema: harperDBConfig.schema,
        table: harperDBConfig.table,
        records: Array.isArray(data) ? data : [data]
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error sending data to HarperDB:', error.message);
    throw error;
  }
}

// Endpoint to receive analytics events
app.post('/api/analytics', async (req, res) => {
  try {
    // Add timestamp if not provided
    //console.log('Received body:', req.body);
     
    const eventData = {
      ...req.body,
      timestamp: req.body.timestamp || new Date().toISOString()
    };

    // if percent is present, convert to a number
    if (eventData.percent) {
      eventData.percent = parseInt(eventData.percent);
    } 
    
    // Log received event (optional)
    console.log('Received analytics event:', JSON.stringify(eventData));
    
    // Send to HarperDB
    const result = await sendToHarperDB(eventData);
    
    res.status(200).json({ success: true, message: 'Event recorded' });
  } catch (error) {
    console.error('Failed to process analytics event:', error);
    res.status(500).json({ success: false, message: 'Failed to record event' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Analytics server running on port ${PORT}`);
});