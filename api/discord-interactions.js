// Discord Interactions Verification Server
// Deploy to Vercel
const { verifyKey } = require('discord-interactions');

// Your Discord Application Public Key
const PUBLIC_KEY = 'd2a5d73af62f88dce750fd3903d9c61a6b4df15d9ee1297a00e8ac4f4333b6cd';

// Your n8n webhook URL
const N8N_WEBHOOK_URL = 'https://ctlee0712.app.n8n.cloud/webhook/discord-interactions';

module.exports = async (req, res) => {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];
  const body = JSON.stringify(req.body);

  console.log('='.repeat(50));
  console.log('Discord Request Received');
  console.log('Signature:', signature);
  console.log('Timestamp:', timestamp);
  console.log('Body type:', req.body.type);
  console.log('='.repeat(50));

  // Verify Discord signature
  const isValidRequest = verifyKey(body, signature, timestamp, PUBLIC_KEY);
  
  if (!isValidRequest) {
    console.log('❌ Invalid signature');
    return res.status(401).json({ error: 'Invalid request signature' });
  }

  console.log('✅ Signature valid');

  // Handle PING (type 1) - respond immediately
  if (req.body.type === 1) {
    console.log('✅ PING detected - Responding with PONG');
    return res.status(200).json({ type: 1 });
  }

  // For button interactions (type 3), acknowledge and forward to n8n
  if (req.body.type === 3) {
    console.log('🔵 Button interaction detected');
    
    // Forward to n8n in background (don't await)
    fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    }).then(() => {
      console.log('✅ Forwarded to n8n successfully');
    }).catch((error) => {
      console.error('❌ Error forwarding to n8n:', error);
    });

    // Return type 6 - Acknowledge the interaction without showing "thinking"
    // n8n will update the message via PATCH request
    return res.status(200).json({
      type: 6
    });
  }

  // For other interactions, forward to n8n
  console.log('🔵 Other interaction type:', req.body.type);
  
  try {
    fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });

    return res.status(200).json({
      type: 6
    });
  } catch (error) {
    console.error('❌ Error:', error);
    return res.status(200).json({
      type: 4,
      data: {
        content: '❌ Error processing request. Please try again.',
        flags: 64
      }
    });
  }
};
