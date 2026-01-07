import * as React from 'react';

interface ModelCost {
    model: string;
    provider: string;
    tokens: number;
    cost: number;
}

interface Props {
    text: string;
    models: ModelCost[];
    onSelectModel: (modelId: string) => void;
}

export const ModelComparison: React.FC<Props> = ({ text, models, onSelectModel }) => {
    return (
        <div className="model-comparison">
            <h3>Model Cost Comparison</h3>
            <div className="comparison-grid">
                {models.map((model, idx) => (
                    <div
                        key={idx}
                        className="model-card"
                        onClick={() => onSelectModel(model.model)}
                    >
                        <div className="model-header">
                            <span className="model-name">{model.model}</span>
                            <span className="model-provider">{model.provider}</span>
                        </div>
                        <div className="model-stats">
                            <div className="stat">
                                <span className="label">Tokens:</span>
                                <span className="value">{model.tokens.toLocaleString()}</span>
                            </div>
                            <div className="stat">
                                <span className="label">Cost:</span>
                                <span className="value cost">${model.cost.toFixed(6)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
