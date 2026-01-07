export interface ModelConfig {
    id: string;
    name: string;
    provider: 'openai' | 'anthropic' | 'google';
    costPer1kInput: number;
    costPer1kOutput: number;
    contextWindow: number;
    encoding: string;
}

export const ALL_MODELS: ModelConfig[] = [
    // OpenAI Models
    {
        id: 'gpt-4-turbo-preview',
        name: 'GPT-4 Turbo',
        provider: 'openai',
        costPer1kInput: 0.01,
        costPer1kOutput: 0.03,
        contextWindow: 128000,
        encoding: 'cl100k_base',
    },
    {
        id: 'gpt-4',
        name: 'GPT-4',
        provider: 'openai',
        costPer1kInput: 0.03,
        costPer1kOutput: 0.06,
        contextWindow: 8192,
        encoding: 'cl100k_base',
    },
    {
        id: 'gpt-4-32k',
        name: 'GPT-4 32K',
        provider: 'openai',
        costPer1kInput: 0.06,
        costPer1kOutput: 0.12,
        contextWindow: 32768,
        encoding: 'cl100k_base',
    },
    {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        costPer1kInput: 0.0005,
        costPer1kOutput: 0.0015,
        contextWindow: 16385,
        encoding: 'cl100k_base',
    },
    {
        id: 'gpt-3.5-turbo-16k',
        name: 'GPT-3.5 Turbo 16K',
        provider: 'openai',
        costPer1kInput: 0.001,
        costPer1kOutput: 0.002,
        contextWindow: 16385,
        encoding: 'cl100k_base',
    },

    // Anthropic Models
    {
        id: 'claude-opus-4-5',
        name: 'Claude Opus 4.5',
        provider: 'anthropic',
        costPer1kInput: 0.005,
        costPer1kOutput: 0.025,
        contextWindow: 200000,
        encoding: 'claude',
    },
    {
        id: 'claude-sonnet-4-5',
        name: 'Claude Sonnet 4.5',
        provider: 'anthropic',
        costPer1kInput: 0.003,
        costPer1kOutput: 0.015,
        contextWindow: 200000,
        encoding: 'claude',
    },
    {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet',
        provider: 'anthropic',
        costPer1kInput: 0.003,
        costPer1kOutput: 0.015,
        contextWindow: 200000,
        encoding: 'claude',
    },
    {
        id: 'claude-3-5-haiku-20241022',
        name: 'Claude 3.5 Haiku',
        provider: 'anthropic',
        costPer1kInput: 0.0008,
        costPer1kOutput: 0.004,
        contextWindow: 200000,
        encoding: 'claude',
    },
    {
        id: 'claude-3-opus-20240229',
        name: 'Claude 3 Opus',
        provider: 'anthropic',
        costPer1kInput: 0.015,
        costPer1kOutput: 0.075,
        contextWindow: 200000,
        encoding: 'claude',
    },
    {
        id: 'claude-3-sonnet-20240229',
        name: 'Claude 3 Sonnet',
        provider: 'anthropic',
        costPer1kInput: 0.003,
        costPer1kOutput: 0.015,
        contextWindow: 200000,
        encoding: 'claude',
    },
    {
        id: 'claude-3-haiku-20240307',
        name: 'Claude 3 Haiku',
        provider: 'anthropic',
        costPer1kInput: 0.00025,
        costPer1kOutput: 0.00125,
        contextWindow: 200000,
        encoding: 'claude',
    },

    // Google Models
    {
        id: 'gemini-3-pro',
        name: 'Gemini 3 Pro',
        provider: 'google',
        costPer1kInput: 0.002,
        costPer1kOutput: 0.012,
        contextWindow: 2000000,
        encoding: 'gemini',
    },
    {
        id: 'gemini-3-flash',
        name: 'Gemini 3 Flash',
        provider: 'google',
        costPer1kInput: 0.0001,
        costPer1kOutput: 0.0004,
        contextWindow: 1000000,
        encoding: 'gemini',
    },
    {
        id: 'gemini-2.0-flash-exp',
        name: 'Gemini 2.0 Flash (Experimental)',
        provider: 'google',
        costPer1kInput: 0, // Free during preview
        costPer1kOutput: 0,
        contextWindow: 1000000,
        encoding: 'gemini',
    },
    {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        provider: 'google',
        costPer1kInput: 0.00125,
        costPer1kOutput: 0.005,
        contextWindow: 2000000,
        encoding: 'gemini',
    },
    {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        provider: 'google',
        costPer1kInput: 0.000075,
        costPer1kOutput: 0.0003,
        contextWindow: 1000000,
        encoding: 'gemini',
    },
    {
        id: 'gemini-1.5-flash-8b',
        name: 'Gemini 1.5 Flash-8B',
        provider: 'google',
        costPer1kInput: 0.0000375,
        costPer1kOutput: 0.00015,
        contextWindow: 1000000,
        encoding: 'gemini',
    },
];

export function getModelById(id: string): ModelConfig | undefined {
    return ALL_MODELS.find((m) => m.id === id);
}

export function getDefaultModel(): ModelConfig {
    return ALL_MODELS[0]; // GPT-4 Turbo
}

export function getModelsByProvider(provider: string): ModelConfig[] {
    return ALL_MODELS.filter((m) => m.provider === provider);
}
