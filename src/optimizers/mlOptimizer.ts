import { PythonBridge } from '../python/pythonBridge';
import type { OptimizationResult } from '../optimizer';

export class MLOptimizer {
    private pythonBridge: PythonBridge;
    private isAvailable: boolean = false;

    constructor(extensionPath: string) {
        this.pythonBridge = new PythonBridge(extensionPath);
    }

    /**
     * Initialize ML optimizer (check Python + LLMLingua)
     */
    public async initialize(
        progressCallback?: (message: string) => void
    ): Promise<boolean> {
        progressCallback?.('Detecting Python...');

        const pythonInfo = await this.pythonBridge.detectPython();
        if (!pythonInfo) {
            progressCallback?.('Python not found');
            return false;
        }

        progressCallback?.(`Found Python ${pythonInfo.version}`);

        const isInstalled = await this.pythonBridge.isLLMLinguaInstalled();
        if (!isInstalled) {
            progressCallback?.('LLMLingua not installed');

            const shouldInstall = await this.promptInstallation();
            if (!shouldInstall) {
                return false;
            }

            const success = await this.pythonBridge.installLLMLingua(progressCallback);
            if (!success) {
                progressCallback?.('Installation failed');
                return false;
            }
        }

        this.isAvailable = true;
        progressCallback?.('ML Optimizer ready');
        return true;
    }

    /**
     * Optimize prompt using LLMLingua
     */
    public async optimize(
        text: string,
        options: {
            compressionRate?: number;
            model?: string;
        } = {}
    ): Promise<OptimizationResult> {
        if (!this.isAvailable) {
            throw new Error('ML Optimizer not initialized');
        }

        try {
            const result = await this.pythonBridge.compressPrompt(text, {
                rate: options.compressionRate || 0.5,
                // Don't pass model - let pythonBridge use its default LLMLingua 2 model
            });

            return {
                optimized: result.compressed,
                original: text,
                rulesApplied: [
                    `ML compression (${result.saving} reduction)`,
                    `Original: ${result.originalTokens} tokens`,
                    `Compressed: ${result.compressedTokens} tokens`,
                ],
                tokensSaved: result.originalTokens - result.compressedTokens,
            };
        } catch (error) {
            throw new Error(`ML optimization failed: ${error}`);
        }
    }

    /**
     * Check if ML optimizer is available
     */
    public isReady(): boolean {
        return this.isAvailable;
    }

    /**
     * Prompt user to install LLMLingua
     */
    private async promptInstallation(): Promise<boolean> {
        const vscode = await import('vscode');

        const choice = await vscode.window.showInformationMessage(
            'LLMLingua is not installed. Install now for advanced ML compression?',
            'Install',
            'Skip'
        );

        return choice === 'Install';
    }
}
