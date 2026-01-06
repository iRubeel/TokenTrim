import * as vscode from 'vscode';
import { SidebarProvider } from './webview/SidebarProvider';
import { StatusBarManager } from './statusBar';
import { TokenCounter } from './tokenCounter';
import { CostCalculator } from './costCalculator';
import { PromptOptimizer } from './optimizer';
import { OPENAI_MODELS, getModelById, getDefaultModel, type ModelConfig } from './models';

let sidebarProvider: SidebarProvider;
let statusBarManager: StatusBarManager;
let tokenCounter: TokenCounter;
let costCalculator: CostCalculator;
let optimizer: PromptOptimizer;
let currentModel: ModelConfig;

export function activate(context: vscode.ExtensionContext) {
    console.log('TokenTrim activated');

    // Initialize services
    tokenCounter = new TokenCounter();
    costCalculator = new CostCalculator();
    optimizer = new PromptOptimizer();
    statusBarManager = new StatusBarManager();
    context.subscriptions.push(statusBarManager);
    currentModel = getDefaultModel();

    // Register sidebar provider
    sidebarProvider = new SidebarProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(SidebarProvider.viewType, sidebarProvider)
    );

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('tokentrim.optimizeSelection', optimizeSelection),
        vscode.commands.registerCommand('tokentrim.showSidebar', showSidebar),
        vscode.commands.registerCommand('tokentrim.selectModel', selectModel)
    );

    // Listen to selection changes
    context.subscriptions.push(
        vscode.window.onDidChangeTextEditorSelection(handleSelectionChange)
    );

    // Initial update
    handleSelectionChange();
}

export function deactivate() {
    tokenCounter?.dispose();
}

/**
 * Handle text selection changes
 */
/**
 * Handle text selection changes
 */
let debounceTimer: NodeJS.Timeout | undefined;

function handleSelectionChange() {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.selection.isEmpty) {
        // Clear immediately if no selection
        if (debounceTimer) clearTimeout(debounceTimer);
        statusBarManager.clear();
        sidebarProvider.postMessage({
            type: 'selectionUpdate',
            data: null,
        });
        return;
    }

    // Debounce updates for performance (especially on large selections)
    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
        const selectedText = editor.document.getText(editor.selection);

        // Prevent blocking UI with massive selections
        if (selectedText.length > 1000000) {
            vscode.window.setStatusBarMessage("Selection too large for real-time analysis", 3000);
            return;
        }

        const tokens = tokenCounter.countTokens(selectedText, currentModel);
        const cost = costCalculator.calculateInputCost(tokens, currentModel);

        // Update status bar
        statusBarManager.update(tokens, cost, currentModel);

        // Update sidebar
        sidebarProvider.postMessage({
            type: 'selectionUpdate',
            data: {
                text: selectedText, // Webview will truncate preview if needed
                tokens,
                cost,
                model: currentModel.name,
            },
        });
    }, 300); // 300ms delay
}

/**
 * Optimize selected text
 */
async function optimizeSelection() {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.selection.isEmpty) {
        vscode.window.showWarningMessage('Please select text to optimize');
        return;
    }

    // Indicate processing
    vscode.window.setStatusBarMessage('$(sync~spin) Optimizing prompt...', 2000);

    try {
        const selectedText = editor.document.getText(editor.selection);
        const originalTokens = tokenCounter.countTokens(selectedText, currentModel);
        const originalCost = costCalculator.calculateInputCost(originalTokens, currentModel);

        // Run optimization
        const result = optimizer.optimize(selectedText);
        const optimizedTokens = tokenCounter.countTokens(result.optimized, currentModel);
        const optimizedCost = costCalculator.calculateInputCost(optimizedTokens, currentModel);
        const savings = costCalculator.calculateSavings(originalTokens, optimizedTokens, currentModel);

        // Update sidebar with results
        sidebarProvider.postMessage({
            type: 'selectionUpdate',
            data: {
                text: selectedText,
                tokens: originalTokens,
                cost: originalCost,
                model: currentModel.name,
                optimized: {
                    text: result.optimized,
                    tokens: optimizedTokens,
                    cost: optimizedCost,
                    rulesApplied: result.rulesApplied,
                    savings: savings.savedTokens,
                    savingsPercent: savings.savingsPercent,
                },
            },
        });

        vscode.window.showInformationMessage(
            `Optimized: ${savings.savedTokens} tokens saved (${savings.savingsPercent.toFixed(1)}%)`
        );
    } catch (error) {
        console.error('Optimization failed:', error);
        vscode.window.showErrorMessage('Optimization failed. See Developer Tools console for details.');
    }
}

/**
 * Show sidebar
 */
async function showSidebar() {
    await vscode.commands.executeCommand('workbench.view.extension.tokentrim-sidebar');
}

/**
 * Select model from quick pick
 */
async function selectModel() {
    const items = OPENAI_MODELS.map((model) => ({
        label: model.name,
        description: `${model.contextWindow.toLocaleString()} tokens | $${model.costPer1kInput}/1k input`,
        modelId: model.id,
    }));

    const selected = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select OpenAI model for token counting and cost estimation',
    });

    if (selected) {
        const model = getModelById(selected.modelId);
        if (model) {
            currentModel = model;
            vscode.window.showInformationMessage(`Model changed to ${model.name}`);
            handleSelectionChange(); // Refresh UI
        }
    }
}
