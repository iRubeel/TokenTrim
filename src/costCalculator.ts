import type { ModelConfig } from './models';

export interface CostEstimate {
    inputCost: number;
    outputCost: number;
    totalCost: number;
    inputTokens: number;
    outputTokens: number;
}

export class CostCalculator {
    /**
     * Calculate cost for input-only scenario (e.g., prompt compression)
     */
    public calculateInputCost(tokens: number, model: ModelConfig): number {
        return (tokens / 1000) * model.costPer1kInput;
    }

    /**
     * Calculate full round-trip cost (input + estimated output)
     * @param inputTokens - number of input tokens
     * @param estimatedOutputTokens - estimated output tokens (default: 1/3 of input)
     * @param model - model configuration
     */
    public calculateFullCost(
        inputTokens: number,
        estimatedOutputTokens: number,
        model: ModelConfig
    ): CostEstimate {
        const inputCost = (inputTokens / 1000) * model.costPer1kInput;
        const outputCost = (estimatedOutputTokens / 1000) * model.costPer1kOutput;

        return {
            inputCost,
            outputCost,
            totalCost: inputCost + outputCost,
            inputTokens,
            outputTokens: estimatedOutputTokens,
        };
    }

    /**
     * Calculate savings between two token counts
     */
    public calculateSavings(
        originalTokens: number,
        optimizedTokens: number,
        model: ModelConfig
    ): { savedTokens: number; savedCost: number; savingsPercent: number } {
        const savedTokens = originalTokens - optimizedTokens;
        const originalCost = this.calculateInputCost(originalTokens, model);
        const optimizedCost = this.calculateInputCost(optimizedTokens, model);
        const savedCost = originalCost - optimizedCost;
        const savingsPercent = originalTokens > 0 ? (savedTokens / originalTokens) * 100 : 0;

        return {
            savedTokens,
            savedCost,
            savingsPercent,
        };
    }
}
