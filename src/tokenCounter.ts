import { getEncoding } from 'js-tiktoken';
import type { ModelConfig } from './models';

export class TokenCounter {
    private encodingCache: Map<string, ReturnType<typeof getEncoding>> = new Map();

    /**
     * Count tokens in text using the specified model's encoding
     */
    public countTokens(text: string, model: ModelConfig): number {
        if (!text || text.length === 0) {
            return 0;
        }

        try {
            switch (model.provider) {
                case 'openai':
                    return this.countOpenAITokens(text, model.encoding);
                case 'anthropic':
                    return this.countClaudeTokens(text);
                case 'google':
                    return this.countGeminiTokens(text);
                default:
                    return this.estimateTokens(text);
            }
        } catch (error) {
            console.error('Error counting tokens:', error);
            return this.estimateTokens(text);
        }
    }

    /**
     * Count tokens using tiktoken (OpenAI)
     */
    private countOpenAITokens(text: string, encodingName: string): number {
        const encoding = this.getEncoding(encodingName);
        const tokens = encoding.encode(text);
        return tokens.length;
    }

    /**
     * Estimate Claude tokens (approximation)
     * Claude uses a similar tokenizer to GPT-4, so we use cl100k_base as approximation
     */
    private countClaudeTokens(text: string): number {
        // Use cl100k_base as approximation (±5% accuracy)
        const encoding = this.getEncoding('cl100k_base');
        const tokens = encoding.encode(text);
        // Claude tends to tokenize slightly differently, add 3% buffer
        return Math.ceil(tokens.length * 1.03);
    }

    /**
     * Estimate Gemini tokens
     * Gemini uses SentencePiece, approximate with character-based estimation
     */
    private countGeminiTokens(text: string): number {
        // Gemini: ~4 characters per token for English
        // More conservative estimate: 3.5 chars/token
        return Math.ceil(text.length / 3.5);
    }

    /**
     * Fallback estimation (rough)
     */
    private estimateTokens(text: string): number {
        return Math.ceil(text.length / 4);
    }

    /**
     * Get or create encoding instance (cached for performance)
     */
    private getEncoding(encodingName: string): ReturnType<typeof getEncoding> {
        if (!this.encodingCache.has(encodingName)) {
            const encoding = getEncoding(encodingName as any);
            this.encodingCache.set(encodingName, encoding);
        }
        return this.encodingCache.get(encodingName)!;
    }

    /**
     * Clean up encodings on disposal
     */
    public dispose(): void {
        // js-tiktoken doesn't require explicit cleanup (no WASM memory)
        this.encodingCache.clear();
    }
}
