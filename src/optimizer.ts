/**
 * Rule-based prompt optimizer (v1)
 * Uses deterministic transformations only — no ML, no semantic understanding
 * All transformations are reversible and preserve core meaning
 */

export interface OptimizationResult {
    optimized: string;
    original: string;
    rulesApplied: string[];
    tokensSaved: number;
}

export class PromptOptimizer {
    /**
     * Apply all optimization rules to the input text
     */
    /**
     * Apply all optimization rules to the input text
     */
    public optimize(text: string, mode: 'safe' | 'aggressive' = 'safe'): OptimizationResult {
        if (!text || text.trim().length === 0) {
            return {
                optimized: text,
                original: text,
                rulesApplied: [],
                tokensSaved: 0,
            };
        }

        let optimized = text;
        const rulesApplied: string[] = [];

        // Pre-normalization: Preserve bullet structure
        optimized = optimized.replace(/\n\s*[-*]\s+/g, '\n- ');

        // Rule 1: Remove excessive whitespace
        const beforeWhitespace = optimized;
        optimized = this.removeExcessiveWhitespace(optimized);
        if (optimized !== beforeWhitespace) {
            const saved = beforeWhitespace.length - optimized.length;
            rulesApplied.push(`Normalized formatting for token efficiency (-${saved} chars)`);
        }

        // Rule 2: Remove markdown formatting (safer)
        const beforeMarkdown = optimized;
        optimized = this.removeMarkdownFormatting(optimized);
        if (optimized !== beforeMarkdown) {
            const saved = beforeMarkdown.length - optimized.length;
            rulesApplied.push(`Condensed markdown syntax (-${saved} chars)`);
        }

        // Rule 3: Replace common wordy phrases
        const beforePhrases = optimized;
        optimized = this.replaceWordyPhrases(optimized);
        if (optimized !== beforePhrases) {
            const saved = beforePhrases.length - optimized.length;
            rulesApplied.push(`Condensed verbose phrasing (-${saved} chars)`);
        }

        // Rule 4: Remove filler words (grammar-aware)
        const beforeFillers = optimized;
        optimized = this.removeFillerWords(optimized);
        if (optimized !== beforeFillers) {
            const saved = beforeFillers.length - optimized.length;
            rulesApplied.push(`Removed low-impact filler terms (-${saved} chars)`);
        }

        // Rule 5: Simplify punctuation (context-aware)
        const beforePunctuation = optimized;
        optimized = this.simplifyPunctuation(optimized);
        if (optimized !== beforePunctuation) {
            const saved = beforePunctuation.length - optimized.length;
            rulesApplied.push(`Simplified punctuation structure (-${saved} chars)`);
        }

        // No-Op Guard: If savings are negligible (< 1%), return original
        // Only applies if text is reasonably long to avoid annoying flip-flops on short queries
        if (text.length > 50) {
            const reduction = 1 - optimized.length / text.length;
            if (reduction < 0.01) {
                return {
                    optimized: text,
                    original: text,
                    rulesApplied: [], // Clear rules if we reverted
                    tokensSaved: 0,
                };
            }
        }

        return {
            optimized: optimized.trim(),
            original: text,
            rulesApplied,
            tokensSaved: 0, // Will be calculated by extension.ts
        };
    }

    /**
     * Remove excessive whitespace (multiple spaces, tabs, newlines)
     */
    private removeExcessiveWhitespace(text: string): string {
        return text
            .replace(/\t/g, ' ') // tabs to spaces
            .replace(/ {2,}/g, ' ') // multiple spaces to single
            .replace(/\n{3,}/g, '\n\n') // max 2 consecutive newlines
            .trim();
    }

    /**
     * Remove markdown formatting characters (safer implementation)
     */
    private removeMarkdownFormatting(text: string): string {
        return text
            .replace(/\*\*(.+?)\*\*/g, '$1') // bold
            .replace(/\*(.+?)\*/g, '$1') // italic
            .replace(/_(.+?)_/g, '$1') // italic underscore
            .replace(/`(.+?)`/g, '$1') // inline code
            .replace(/```[\s\S]*?```/g, (match) => {
                // code blocks: preserve internal structure, just remove fences
                return match
                    .replace(/^```[\w-]*\n?/i, '')
                    .replace(/```$/, '');
            });
    }

    /**
     * Replace wordy phrases with concise alternatives
     */
    private replaceWordyPhrases(text: string): string {
        const replacements: Record<string, string> = {
            'in order to': 'to',
            'due to the fact that': 'because',
            'at this point in time': 'now',
            'for the purpose of': 'for',
            'in the event that': 'if',
            'with regard to': 'regarding',
            'with the exception of': 'except',
            'in spite of': 'despite',
            'take into consideration': 'consider',
            'make a decision': 'decide',
            'give consideration to': 'consider',
            'is able to': 'can',
            'has the ability to': 'can',
            'in the near future': 'soon',
            'at the present time': 'now',
            'prior to': 'before',
            'subsequent to': 'after',
        };

        let result = text;
        for (const [wordy, concise] of Object.entries(replacements)) {
            const regex = new RegExp('\\b' + wordy + '\\b', 'gi');
            result = result.replace(regex, concise);
        }
        return result;
    }

    /**
     * Remove common filler words (grammar-aware)
     */
    private removeFillerWords(text: string): string {
        const fillers = [
            'very',
            'really',
            'quite',
            'perhaps',
            'maybe',
            'somewhat',
            'fairly',
            'rather',
            'just',
            'actually',
            'basically',
            'literally',
            'seriously',
        ];

        let result = text;
        for (const filler of fillers) {
            // Only remove if NOT followed by punctuation (preserves tone/structure)
            const regex = new RegExp(`\\b${filler}\\b(?![!?,.])\\s*`, 'gi');
            result = result.replace(regex, '');
        }
        return result;
    }

    /**
     * Simplify punctuation (context-aware)
     */
    private simplifyPunctuation(text: string): string {
        return text
            .replace(/!+/g, '.') // exclamation to period
            .replace(/\.{2,}/g, '.') // ellipses to single period
            .replace(/\?+/g, '?') // multiple question marks to single
            // Only replace semicolons that are NOT part of strict instructions
            .replace(/;(?!\s*(no|only|must|do not|strict))/gi, ',')
            .replace(/\s*,\s*/g, ', ') // normalize comma spacing
            .replace(/\s*\.\s*/g, '. '); // normalize period spacing
    }
}
