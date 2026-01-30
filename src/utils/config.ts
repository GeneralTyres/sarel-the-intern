import { config as loadEnv } from 'dotenv';
import type { LLMConfig } from '../types/index.js';

loadEnv();

export function getConfig(): LLMConfig {
  const baseURL = process.env.LLM_BASE_URL || 'http://localhost:11434/v1';
  const model = process.env.LLM_MODEL || 'qwen2.5-coder:7b';
  const apiKey = process.env.LLM_API_KEY || 'ollama';

  return {
    baseURL,
    model,
    apiKey,
  };
}

export function validateConfig(config: LLMConfig): void {
  if (!config.baseURL) {
    throw new Error('LLM_BASE_URL is required');
  }
  if (!config.model) {
    throw new Error('LLM_MODEL is required');
  }
}
