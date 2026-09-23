import { AIService } from './provider';
import { GroqAIService } from './groqProvider';
import { MockAIService } from './mockProvider';

export function getAIService(): AIService {
  if (process.env.AI_PROVIDER === 'demo') return new MockAIService();
  return new GroqAIService();
}

export * from './types';
export * from './provider';
