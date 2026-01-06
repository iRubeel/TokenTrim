import * as React from 'react';

interface Message {
    type: string;
    data?: any;
}

interface SelectionData {
    text: string;
    tokens: number;
    cost: number;
    model: string;
    optimized?: {
        text: string;
        tokens: number;
        cost: number;
        rulesApplied: string[];
        savings: number;
        savingsPercent: number;
    };
}

export const App: React.FC = () => {
    const [selection, setSelection] = React.useState<SelectionData | null>(null);
    const [hasOptimized, setHasOptimized] = React.useState(false);

    // Initialize VS Code API once
    const vscode = React.useMemo(() => {
        try {
            return (window as any).acquireVsCodeApi();
        } catch (e) {
            console.error("Failed to acquire VS Code API", e);
            return { postMessage: () => { } };
        }
    }, []);

    React.useEffect(() => {
        const handleMessage = (event: MessageEvent<Message>) => {
            const message = event.data;
            if (message.type === 'selectionUpdate') {
                setSelection(message.data);
                setHasOptimized(!!message.data?.optimized);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const postMessage = (type: string, data?: any) => {
        vscode.postMessage({ type, ...data });
    };

    const handleOptimize = () => {
        postMessage('optimize');
    };

    const handleSelectModel = () => {
        postMessage('selectModel');
    };

    const handleReplace = () => {
        if (selection?.optimized) {
            postMessage('replaceSelection', { text: selection.optimized.text });
        }
    };

    // Helper to truncate long text for preview
    const renderPreview = (text: string) => {
        const maxLength = 1000;
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + `\n\n... (preview truncated, ${text.length - maxLength} chars hidden)`;
    };

    if (!selection || !selection.text) {
        return (
            <div className="container">
                <div className="empty-state">
                    <h2>No Selection</h2>
                    <p>Select text in your editor to analyze tokens and optimize cost.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="header">
                <h2>TokenTrim</h2>
                <button className="btn-secondary" onClick={handleSelectModel} title="Change Model">
                    {selection.model}
                </button>
            </div>

            <div className="section">
                <h3>Original Analysis</h3>
                <div className="stats">
                    <div className="stat-item">
                        <span className="stat-label">Token Count</span>
                        <span className="stat-value">{selection.tokens.toLocaleString()}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Est. Cost</span>
                        <span className="stat-value">${selection.cost.toFixed(6)}</span>
                    </div>
                </div>
            </div>

            {!hasOptimized && (
                <button className="btn-primary" onClick={handleOptimize}>
                    Optimize Prompt
                </button>
            )}

            {hasOptimized && selection.optimized && (
                <>
                    <div className="section optimized">
                        <h3>Optimized Analysis</h3>
                        <div className="stats">
                            <div className="stat-item">
                                <span className="stat-label">Token Count</span>
                                <span className="stat-value">{selection.optimized.tokens.toLocaleString()}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Est. Cost</span>
                                <span className="stat-value">${selection.optimized.cost.toFixed(6)}</span>
                            </div>
                        </div>

                        <div className="savings">
                            <div className="savings-badge">
                                <span className="savings-label">Tokens Saved</span>
                                <span className="savings-value">
                                    {selection.optimized.savings.toLocaleString()} ({selection.optimized.savingsPercent.toFixed(1)}%)
                                </span>
                            </div>
                            <div className="savings-badge">
                                <span className="savings-label">Cost Savings</span>
                                <span className="savings-value">
                                    ${(selection.cost - selection.optimized.cost).toFixed(6)}
                                </span>
                            </div>
                        </div>

                        <div className="rules-applied">
                            <ul>
                                {selection.optimized.rulesApplied.map((rule, idx) => (
                                    <li key={idx}>{rule}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="comparison">
                        <div className="text-box">
                            <h4>Original Preview</h4>
                            <pre>{renderPreview(selection.text)}</pre>
                        </div>
                        <div className="text-box">
                            <h4>Optimized Preview</h4>
                            <pre>{renderPreview(selection.optimized.text)}</pre>
                        </div>
                    </div>

                    <button className="btn-primary" onClick={handleReplace}>
                        Replace Selection
                    </button>
                </>
            )}
        </div>
    );
};
