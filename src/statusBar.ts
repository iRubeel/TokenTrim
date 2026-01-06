import * as vscode from 'vscode';
import type { ModelConfig } from './models';

export class StatusBarManager {
    private statusBarItem: vscode.StatusBarItem;

    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
        this.statusBarItem.command = 'tokentrim.showSidebar';
        this.statusBarItem.show();
    }

    /**
     * Update status bar with token and cost info
     */
    public update(tokens: number, cost: number, model: ModelConfig) {
        this.statusBarItem.text = `$(graph) ${tokens} tokens | $${cost.toFixed(6)}`;
        this.statusBarItem.tooltip = `Model: ${model.name}\nClick to open TokenTrim sidebar`;
    }

    /**
     * Clear status bar
     */
    public clear() {
        this.statusBarItem.text = '$(graph) TokenTrim';
        this.statusBarItem.tooltip = 'Select text to see token count';
    }

    public dispose() {
        this.statusBarItem.dispose();
    }
}
