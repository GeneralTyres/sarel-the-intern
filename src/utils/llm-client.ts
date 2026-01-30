import OpenAI from 'openai';
import { getConfig, validateConfig } from './config.js';

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    const config = getConfig();
    validateConfig(config);
    
    client = new OpenAI({
      baseURL: config.baseURL,
      apiKey: config.apiKey,
    });
  }
  return client;
}

export interface LLMCallOptions {
  temperature?: number;
  maxTokens?: number;
}

export async function callLLM(
  prompt: string,
  systemPrompt?: string,
  options: LLMCallOptions = {}
): Promise<string> {
  const client = getClient();
  const config = getConfig();

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
  
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  
  messages.push({ role: 'user', content: prompt });

  try {
    const response = await client.chat.completions.create({
      model: config.model,
      messages,
      temperature: options.temperature ?? 0.3,
      max_tokens: options.maxTokens,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('LLM API call failed:', error);
    throw error;
  }
}
