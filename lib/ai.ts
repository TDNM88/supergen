import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function generateContent(prompt: string, category: string, type: string) {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3-0324:free',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant specialized in generating ${category} content. Your task is to create ${type} based on the user's requirements.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

export async function analyzeImage(imageUrl: string, industry: string) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Analyze this image for the ${industry} industry and describe what you see. The image is at: ${imageUrl}`,
      maxTokens: 500,
    })

    return text
  } catch (error) {
    console.error("Error analyzing image:", error)
    throw new Error("Failed to analyze image. Please try again.")
  }
}

