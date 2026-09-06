# AI Playground Setup Guide

This guide will help you configure the AI Playground feature for your Study Log application.

## Overview

The AI Playground allows users to chat with different AI models to get study assistance. It uses:
- **Groq API**: For `openai/gpt-oss-120b` and `qwen/qwen3.6-27b` models
- **NVIDIA API**: For `moonshotai/kimi-k3` and `deepseek-ai/deepseek-v4-pro-0813` models

## Security Architecture

```
User Browser → Vercel Serverless Function → AI APIs
              (API keys stored securely)
```

Your API keys are **never exposed** to the browser. They are stored as environment variables on Vercel's servers.

---

## Setup Instructions

### Step 1: Deploy to Vercel

First, commit and push your changes:

```bash
cd ~/Documents/Study-Application/Study-Application
git add .
git commit -m "Add AI Playground feature with secure backend"
git push
```

Vercel will automatically detect the new `/api/chat.js` file and deploy it as a serverless function.

### Step 2: Configure Environment Variables in Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/
   - Select your project: `study-application`

2. **Navigate to Settings**
   - Click on your project
   - Go to **Settings** tab
   - Click **Environment Variables** in the left sidebar

3. **Add API Keys**

   Add these two environment variables:

   **Variable 1:**
   - **Name**: `GROQ_API_KEY`
   - **Value**: `[Your Groq API Key from .env file]`
   - **Environments**: Select all (Production, Preview, Development)
   - Click **Save**

   **Variable 2:**
   - **Name**: `NVIDIA_API_KEY`
   - **Value**: `[Your NVIDIA API Key from .env file]`
   - **Environments**: Select all (Production, Preview, Development)
   - Click **Save**

   > **Note**: Get your actual API keys from the `.env` file in your local project.
   > The keys should start with `gsk_` for Groq and `nvapi-` for NVIDIA.

4. **Redeploy** (if needed)
   - Go to **Deployments** tab
   - Click the three dots on the latest deployment
   - Click **Redeploy**
   - Or just push a new commit to trigger automatic deployment

---

## Testing the Playground

### 1. Access Your App

Visit your deployed URL: https://study-application-879t.vercel.app/ (or your specific deployment URL)

### 2. Sign In

Log in with your Firebase account.

### 3. Open Playground

- Look for the **🎮 floating button** in the bottom-right corner
- Click it to open the AI Study Assistant

### 4. Test Different Models

Try each model:

**Groq Models:**
- GPT-OSS 120B (Groq) - Good for general questions
- Qwen 3.6 27B (Groq) - Good for detailed explanations

**NVIDIA Models:**
- Kimi K3 (Moonshot AI) - Advanced reasoning
- DeepSeek V4 Pro - Code and technical topics

### 5. Example Questions

Try asking:
- "Explain the concept of derivatives in calculus"
- "Help me understand photosynthesis"
- "What's the difference between mitosis and meiosis?"
- "Explain Newton's three laws of motion"

---

## API Endpoint Details

### POST `/api/chat`

**Request Body:**
```json
{
  "message": "Your question here",
  "model": "openai/gpt-oss-120b",
  "conversationHistory": [],
  "firebaseToken": "optional-firebase-token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "AI response here",
  "model": "openai/gpt-oss-120b",
  "provider": "groq",
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 50,
    "total_tokens": 60
  }
}
```

---

## Troubleshooting

### Issue: "API configuration error"

**Solution**: Check that environment variables are properly set in Vercel:
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Verify `GROQ_API_KEY` and `NVIDIA_API_KEY` are present
3. Redeploy the application

### Issue: "Failed to send message"

**Possible causes:**
1. API key is invalid or expired
2. API rate limit reached
3. Network connectivity issue

**Solution**:
- Check Vercel Function Logs: Dashboard → Deployments → View Function Logs
- Verify API keys are valid on provider's dashboard

### Issue: Playground button not showing

**Solution**: Make sure you're logged in. The playground is only available to authenticated users.

### Issue: Slow responses

**Note**: AI model responses can take 5-15 seconds depending on:
- Model complexity
- Response length
- API server load

This is normal behavior.

---

## Features

✅ **Secure API Key Storage** - Keys never exposed to browser  
✅ **Multiple AI Models** - Choose from 4 different models  
✅ **Conversation History** - Maintains context within session  
✅ **Firebase Integration** - Chats saved to Firestore  
✅ **User Authentication** - Only available to logged-in users  
✅ **Responsive Design** - Works on desktop and mobile  
✅ **Real-time Loading States** - Visual feedback during API calls  

---

## Rate Limits & Costs

### Groq API
- Check your limits at: https://console.groq.com/
- Generally offers generous free tier

### NVIDIA API
- Check your limits at: https://build.nvidia.com/
- Monitor usage to avoid unexpected charges

**Recommendation**: Set up billing alerts on your API provider dashboards.

---

## Future Enhancements

Potential improvements:
- [ ] Streaming responses for faster perceived performance
- [ ] Chat history persistence across sessions
- [ ] Model comparison (side-by-side responses)
- [ ] Custom system prompts per subject
- [ ] File upload for homework help
- [ ] Voice input/output
- [ ] Usage analytics dashboard

---

## Security Notes

🔒 **API Keys**: Stored server-side only, never in browser  
🔒 **Authentication**: Firebase token validation (optional, currently disabled)  
🔒 **Rate Limiting**: Consider implementing per-user quotas  
🔒 **CORS**: Configured to accept requests from your domain  

---

## Support

If you encounter issues:
1. Check Vercel Function Logs
2. Verify environment variables are set
3. Test API keys directly on provider dashboards
4. Check browser console for errors

---

**Last Updated**: September 6, 2026  
**Version**: 1.0.0
