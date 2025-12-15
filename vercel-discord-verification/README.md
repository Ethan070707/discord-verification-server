# Discord Verification Server for n8n

This is a lightweight verification server that handles Discord Interactions signature verification and forwards validated requests to n8n.

## 🎯 What This Does

1. Receives Discord Interactions requests
2. Verifies ed25519 signatures using Discord's public key
3. Responds to PING requests immediately
4. Forwards button interactions to n8n webhook

## 🚀 Quick Deploy to Vercel

### Step 1: Prerequisites

- GitHub account
- Vercel account (free tier is enough)
- Your Discord Application Public Key

### Step 2: Deploy

1. **Create a new GitHub repository**
   - Go to https://github.com/new
   - Name it: `discord-verification-server`
   - Make it Public or Private
   - Don't initialize with README

2. **Upload these files to GitHub**
   - `api/discord-interactions.js`
   - `package.json`
   - `vercel.json`
   - `README.md`

3. **Deploy to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Click "Deploy"
   - Wait for deployment to complete

### Step 3: Get Your Vercel URL

After deployment, Vercel will give you a URL like:
```
https://your-project-name.vercel.app
```

Your Discord Interactions Endpoint URL will be:
```
https://your-project-name.vercel.app/discord-interactions
```

### Step 4: Configure Discord

1. Go to Discord Developer Portal
2. Navigate to your application → General Information
3. Set **Interactions Endpoint URL** to:
   ```
   https://your-project-name.vercel.app/discord-interactions
   ```
4. Click "Save Changes"

### Step 5: Update n8n Webhook

1. Go to your n8n workflow
2. Change the Webhook path to: `discord-verified`
3. This creates a new webhook URL:
   ```
   https://ctlee0712.app.n8n.cloud/webhook/discord-verified
   ```
4. This URL is already configured in the verification server

## 🔧 Configuration

### Update Public Key

Edit `api/discord-interactions.js` line 6:
```javascript
const PUBLIC_KEY = 'YOUR_DISCORD_PUBLIC_KEY';
```

### Update n8n Webhook URL

Edit `api/discord-interactions.js` line 9:
```javascript
const N8N_WEBHOOK_URL = 'https://ctlee0712.app.n8n.cloud/webhook/discord-verified';
```

## 📊 How It Works

```
Discord
  ↓ (PING or Interaction)
Vercel Server
  ↓ Verify Signature
  ├─ PING → Return PONG immediately
  └─ Button → Forward to n8n
           ↓
         n8n Workflow
           ↓
         Process & Respond
```

## 🐛 Troubleshooting

### Discord says "could not be verified"

1. Check Vercel logs for errors
2. Verify PUBLIC_KEY is correct
3. Make sure deployment was successful
4. Try redeploying

### n8n not receiving interactions

1. Check N8N_WEBHOOK_URL is correct
2. Verify n8n webhook is active
3. Check n8n Executions for errors

### Vercel deployment failed

1. Check all files are uploaded
2. Verify package.json syntax
3. Check Vercel build logs

## 📝 Files Structure

```
vercel-discord-verification/
├── api/
│   └── discord-interactions.js    # Main verification logic
├── package.json                    # Dependencies
├── vercel.json                     # Vercel configuration
└── README.md                       # This file
```

## 🔐 Security

- Signature verification using Discord's ed25519 algorithm
- Only forwards verified requests to n8n
- Rejects invalid signatures with 401 error
- No sensitive data stored

## 💰 Cost

**Free Forever!**
- Vercel Free Tier: 100GB bandwidth/month
- More than enough for Discord bot interactions

## 🎉 Success!

Once deployed and configured, your Discord Interactions Endpoint URL will be verified and working!

## 📞 Support

If you encounter issues:
1. Check Vercel logs: https://vercel.com/dashboard
2. Check n8n Executions
3. Verify all URLs are correct
