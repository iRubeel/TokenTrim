import * as vscode from 'vscode';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);

export interface PythonInfo {
    executable: string;
    version: string;
    isValid: boolean;
}

export class PythonBridge {
    private pythonPath: string | null = null;
    private extensionPath: string;

    constructor(extensionPath: string) {
        this.extensionPath = extensionPath;
    }

    /**
     * Detect Python installation
     */
    public async detectPython(): Promise<PythonInfo | null> {
        const candidates = ['python3', 'python', 'py'];

        for (const cmd of candidates) {
            try {
                const { stdout } = await execAsync(`${cmd} --version`);
                const version = this.parseVersion(stdout);

                if (this.isVersionValid(version)) {
                    this.pythonPath = cmd;
                    return {
                        executable: cmd,
                        version,
                        isValid: true,
                    };
                }
            } catch (error) {
                continue; // Try next candidate
            }
        }

        return null;
    }

    /**
     * Parse Python version from output
     */
    private parseVersion(output: string): string {
        const match = output.match(/Python (\d+\.\d+\.\d+)/);
        return match ? match[1] : '';
    }

    /**
     * Check if version is 3.8+
     */
    private isVersionValid(version: string): boolean {
        const [major, minor] = version.split('.').map(Number);
        return major === 3 && minor >= 8;
    }

    /**
     * Get Python executable path
     */
    public getPythonPath(): string | null {
        return this.pythonPath;
    }

    /**
     * Check if LLMLingua is installed
     */
    public async isLLMLinguaInstalled(): Promise<boolean> {
        if (!this.pythonPath) {
            return false;
        }

        try {
            const { stdout } = await execAsync(
                `${this.pythonPath} -c "import llmlingua; print('OK')"`
            );
            return stdout.trim() === 'OK';
        } catch {
            return false;
        }
    }

    /**
     * Install LLMLingua dependencies
     */
    public async installLLMLingua(
        progressCallback?: (message: string) => void
    ): Promise<boolean> {
        if (!this.pythonPath) {
            throw new Error('Python not found');
        }

        const requirementsPath = path.join(this.extensionPath, 'python', 'requirements.txt');

        try {
            progressCallback?.('Installing LLMLingua...');

            const { stdout, stderr } = await execAsync(
                `${this.pythonPath} -m pip install -r "${requirementsPath}"`,
                { timeout: 300000 } // 5 minute timeout
            );

            progressCallback?.('Installation complete');
            return true;
        } catch (error) {
            console.error('LLMLingua installation failed:', error);
            return false;
        }
    }

    /**
     * Compress prompt using LLMLingua
     */
    public async compressPrompt(
        prompt: string,
        options: {
            rate?: number;
            model?: string;
            forceTokens?: string[];
        } = {}
    ): Promise<{
        compressed: string;
        originalTokens: number;
        compressedTokens: number;
        ratio: number;
        saving: string;
    }> {
        if (!this.pythonPath) {
            throw new Error('Python not found');
        }

        const scriptPath = path.join(this.extensionPath, 'python', 'compress.py');

        return new Promise((resolve, reject) => {
            const config = JSON.stringify({
                rate: options.rate || 0.5,
                model: options.model || 'microsoft/llmlingua-2-xlm-roberta-large-meetingbank',
                force_tokens: options.forceTokens || [],
            });

            const child = spawn(this.pythonPath!, [scriptPath]);

            let stdout = '';
            let stderr = '';

            child.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            child.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            child.on('close', (code) => {
                if (code !== 0) {
                    try {
                        const error = JSON.parse(stderr);
                        reject(new Error(error.error || 'Compression failed'));
                    } catch {
                        reject(new Error(stderr || 'Unknown error'));
                    }
                    return;
                }

                try {
                    const result = JSON.parse(stdout);
                    resolve({
                        compressed: result.compressed_prompt,
                        originalTokens: result.original_tokens,
                        compressedTokens: result.compressed_tokens,
                        ratio: result.ratio,
                        saving: result.saving,
                    });
                } catch (error) {
                    reject(new Error('Failed to parse compression result'));
                }
            });

            // Send config and prompt to stdin with proper encoding
            child.stdin.write(config + '\n', 'utf8');
            child.stdin.write(prompt, 'utf8');
            child.stdin.end();
        });
    }
}
