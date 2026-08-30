import { AIService } from './provider';
import { GeminiAIService } from './geminiProvider';
import { MockAIService } from './mockProvider';

export function getAIService(): AIService {
  const hasKey = !!(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  if (hasKey) {
    return new GeminiAIService();
  }
  return new MockAIService();
}

export * from './types';
export * from './provider';
