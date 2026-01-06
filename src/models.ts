export interface ModelConfig {
    id: string;
    name: string;
    costPer1kInput: number;   // USD per 1k input tokens
    costPer1kOutput: number;  // USD per 1k output tokens
    contextWindow: number;     // max tokens
    encoding: string;          // tiktoken encoding name
}

export const OPENAI_MODELS: ModelConfig[] = [
    {
        id: 'gpt-4-turbo-preview',
        name: 'GPT-4 Turbo',
        costPer1kInput: 0.01,
        costPer1kOutput: 0.03,
        contextWindow: 128000,
        encoding: 'cl100k_base',
    },
    {
        id: 'gpt-4',
        name: 'GPT-4',
        costPer1kInput: 0.03,
        costPer1kOutput: 0.06,
        contextWindow: 8192,
        encoding: 'cl100k_base',
    },
    {
        id: 'gpt-4-32k',
        name: 'GPT-4 32K',
        costPer1kInput: 0.06,
        costPer1kOutput: 0.12,
        contextWindow: 32768,
        encoding: 'cl100k_base',
    },
    {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        costPer1kInput: 0.0005,
        costPer1kOutput: 0.0015,
        contextWindow: 16385,
        encoding: 'cl100k_base',
    },
    {
        id: 'gpt-3.5-turbo-16k',
        name: 'GPT-3.5 Turbo 16K',
        costPer1kInput: 0.001,
        costPer1kOutput: 0.002,
        contextWindow: 16385,
        encoding: 'cl100k_base',
    },
];

export function getModelById(id: string): ModelConfig | undefined {
    return OPENAI_MODELS.find((m) => m.id === id);
}

export function getDefaultModel(): ModelConfig {
    return OPENAI_MODELS[0]; // GPT-4 Turbo
}
