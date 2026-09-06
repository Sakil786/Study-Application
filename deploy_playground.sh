#!/bin/bash

echo "🎮 Deploying AI Playground Feature"
echo "=================================="
echo ""

cd "$(dirname "$0")"

echo "📋 Step 1: Checking files..."
if [ -f "api/chat.js" ]; then
    echo "   ✅ api/chat.js exists"
else
    echo "   ❌ api/chat.js missing!"
    exit 1
fi

if [ -f "index.html" ]; then
    echo "   ✅ index.html exists"
else
    echo "   ❌ index.html missing!"
    exit 1
fi

echo ""
echo "📦 Step 2: Staging files..."
git add api/
git add index.html
git add vercel.json
git add package.json
git add PLAYGROUND_SETUP.md
git add DEPLOYMENT_CHECKLIST.md
git add deploy_playground.sh

echo ""
echo "💬 Step 3: Creating commit..."
git commit -m "feat: Add AI Playground with Groq and NVIDIA models

- Add secure serverless API endpoint at /api/chat
- Integrate Playground UI with floating button
- Support 4 AI models: GPT-OSS, Qwen, Kimi K3, DeepSeek
- Save chat history to Firestore
- Add comprehensive setup documentation"

echo ""
echo "🚀 Step 4: Pushing to trigger deployment..."
git push

echo ""
echo "✅ Code pushed successfully!"
echo ""
echo "⚠️  CRITICAL NEXT STEPS:"
echo "=================================="
echo ""
echo "1. Go to Vercel Dashboard: https://vercel.com/dashboard"
echo ""
echo "2. Select your project: 'study-application'"
echo ""
echo "3. Go to: Settings → Environment Variables"
echo ""
echo "4. Add these TWO environment variables:"
echo ""
echo "   Variable 1:"
echo "   - Name: GROQ_API_KEY"
echo "   - Value: [Get from your .env file - starts with gsk_]"
echo "   - Environments: ✓ All (Production, Preview, Development)"
echo ""
echo "   Variable 2:"
echo "   - Name: NVIDIA_API_KEY"
echo "   - Value: [Get from your .env file - starts with nvapi-]"
echo "   - Environments: ✓ All (Production, Preview, Development)"
echo ""
echo "   📁 Find your API keys in: /Users/sakilansari/Documents/Study-Application/.env"
echo ""
echo "5. After adding variables, go to Deployments tab and click 'Redeploy'"
echo ""
echo "6. Wait for deployment to complete (~2-3 minutes)"
echo ""
echo "7. Test the playground:"
echo "   - Visit your app"
echo "   - Log in"
echo "   - Look for 🎮 button in bottom-right corner"
echo "   - Click and start chatting!"
echo ""
echo "📚 For detailed instructions, see: PLAYGROUND_SETUP.md"
echo ""
echo "Done! 🎉"
