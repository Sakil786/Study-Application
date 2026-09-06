// Vercel Serverless Function for AI Chat
// Supports Groq and NVIDIA API models

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

// Model configuration
const MODEL_CONFIGS = {
  // Groq models
  'openai/gpt-oss-120b': { provider: 'groq', name: 'llama-3.3-70b-versatile' },
  'qwen/qwen3.6-27b': { provider: 'groq', name: 'llama3-groq-70b-8192-tool-use-preview' },
  
  // NVIDIA models
  'moonshotai/kimi-k3': { provider: 'nvidia', name: 'moonshotai/kimi-k3' },
  'deepseek-ai/deepseek-v4-pro-0813': { provider: 'nvidia', name: 'deepseek/deepseek-r1' }
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, model, conversationHistory = [], firebaseToken } = req.body;

    // Validate input
    if (!message || !model) {
      return res.status(400).json({ error: 'Message and model are required' });
    }

    // Optional: Verify Firebase token for authentication
    // if (!firebaseToken) {
    //   return res.status(401).json({ error: 'Authentication required' });
    // }

    // Get model configuration
    const modelConfig = MODEL_CONFIGS[model];
    if (!modelConfig) {
      return res.status(400).json({ error: 'Invalid model selected' });
    }

    // Get API key based on provider
    const apiKey = modelConfig.provider === 'groq' 
      ? process.env.GROQ_API_KEY 
      : process.env.NVIDIA_API_KEY;

    if (!apiKey) {
      console.error(`Missing API key for provider: ${modelConfig.provider}`);
      return res.status(500).json({ error: 'API configuration error' });
    }

    // Prepare API URL
    const apiUrl = modelConfig.provider === 'groq' ? GROQ_API_URL : NVIDIA_API_URL;

    // Build messages array
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful AI study assistant. Help students understand concepts, explain topics clearly, and provide study guidance. Be concise, accurate, and encouraging.'
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    // Make API request
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelConfig.name,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', response.status, errorData);
      return res.status(response.status).json({ 
        error: `AI API error: ${errorData.error?.message || response.statusText}` 
      });
    }

    const data = await response.json();

    // Extract the AI response
    const aiMessage = data.choices?.[0]?.message?.content || 'No response generated';

    // Return the response
    return res.status(200).json({
      success: true,
      message: aiMessage,
      model: model,
      provider: modelConfig.provider,
      usage: data.usage
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}
