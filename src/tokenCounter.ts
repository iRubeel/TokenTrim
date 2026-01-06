import { encodingForModel, getEncoding } from 'js-tiktoken';
import type { ModelConfig } from './models';

export class TokenCounter {
    // js-tiktoken is lightweight and doesn't explicitly require disposal of WASM memory,
    // but we'll keep the structure for compatibility.

    /**
     * Count tokens in text using the specified model's encoding
     */
    public countTokens(text: string, model: ModelConfig): number {
        if (!text || text.length === 0) {
            return 0;
        }

        try {
            // js-tiktoken handles caching internally
            const encoding = getEncoding(model.encoding as any);
            const tokens = encoding.encode(text);
            return tokens.length;
        } catch (error) {
            console.error('Error counting tokens:', error);
            // Fallback: rough estimation
            return Math.ceil(text.length / 4);
        }
    }

    /**
     * Clean up encodings on disposal (no-op for js-tiktoken but kept for API)
     */
    public dispose(): void {
        // No explicit cleanup needed for JS version
    }
}
