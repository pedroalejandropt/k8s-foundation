const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// Loki endpoint
const LOKI_URL = 'http://loki-logger:3100';

app.set("view engine", "ejs");
app.use(express.static("public"));
// Middleware parse body from URL-encoded requests (such as forms)
app.use(express.urlencoded({ extended: true }));
// Middleware to parse body from JSON requests
app.use(express.json());

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/api/send-log', async (req, res) => {
  const logEntry = {
    streams: [
      {
        stream: { job: 'loki-test-app' },
        values: [[`${Date.now()}000000`, 'Test log sent from app']]
      }
    ]
  };

  try {
    console.log('sending logs...')
    await axios.post(`${LOKI_URL}/loki/api/v1/push`, logEntry);
    res.json({ success: true, message: 'Log sent' });
  } catch (error) {
    console.error('Error sending log:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/get-logs', async (req, res) => {
  const query = `{job="loki-test-app"}`;
  try {
    console.log('getting logs...')
    const response = await axios.get(`${LOKI_URL}/loki/api/v1/query`, {
      params: { query }
    });

    const results = response.data.data.result;
    res.json({ success: true, logs: results });
  } catch (error) {
    console.error('Error getting logs:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ App running on http://localhost:${PORT}`);
});

// how to running on k8s:
// docker build . -t <docker-user>/loki-app:latest 
// docker push <docker-user>/loki-app:latest  
// kubectl run loki-web-app --image=<docker-user>/loki-app:latest  
// kubectl expose pod loki-web-app --type=NodePort --port=3000 --target-port=3000