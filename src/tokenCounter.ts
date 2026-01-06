import { get_encoding } from 'tiktoken';
import type { ModelConfig } from './models';

export class TokenCounter {
    private encodingCache: Map<string, ReturnType<typeof get_encoding>> = new Map();

    /**
     * Count tokens in text using the specified model's encoding
     */
    public countTokens(text: string, model: ModelConfig): number {
        if (!text || text.length === 0) {
            return 0;
        }

        try {
            const encoding = this.getEncoding(model.encoding);
            const tokens = encoding.encode(text);
            return tokens.length;
        } catch (error) {
            console.error('Error counting tokens:', error);
            // Fallback: rough estimation (1 token ≈ 4 characters for English)
            return Math.ceil(text.length / 4);
        }
    }

    /**
     * Get or create encoding instance (cached for performance)
     */
    private getEncoding(encodingName: string): ReturnType<typeof get_encoding> {
        if (!this.encodingCache.has(encodingName)) {
            const encoding = get_encoding(encodingName);
            this.encodingCache.set(encodingName, encoding);
        }
        return this.encodingCache.get(encodingName)!;
    }

    /**
     * Clean up encodings on disposal
     */
    public dispose(): void {
        this.encodingCache.forEach((encoding) => encoding.free());
        this.encodingCache.clear();
    }
}
