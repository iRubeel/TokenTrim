# TokenTrim

> **Trim tokens. Cut costs. Code smarter.**

Stop overpaying for LLM APIs. TokenTrim optimizes your prompts locally right in VS Code with dual optimization modes: instant rule-based compression or advanced ML-powered optimization.

## ✨ Features

### Core Features
- **📊 Token Counting**: Real-time token count using tiktoken (OpenAI), approximations for Claude/Gemini
- **💰 Cost Estimation**: Accurate cost calculation across 9+ LLM models
- **✂️ Dual Optimization Modes**:
  - **Quick Compress** (Rule-Based): 30-50% reduction, instant
  - **ML Optimize** (LLMLingua): 50-80% reduction, 2-3 seconds
- **🌐 Multi-Provider Support**: OpenAI, Anthropic Claude, Google Gemini
- **🔒 Privacy-First**: 100% local processing, no data sent to external servers

### Advanced Features (v2.0)
- **🤖 LLMLingua Integration**: State-of-the-art ML compression
- **📊 Multi-Model Comparison**: Compare costs across all supported models
- **🔄 Intelligent Fallbacks**: Automatic fallback to rule-based if ML unavailable
- **⏱️ Progress Indicators**: Real-time feedback during ML compression

## 🚀 Quick Start

1. **Select text** in any editor
2. Open the **TokenTrim sidebar** (or check the status bar for token count)
3. Choose your optimization mode:
   - Click **"Quick Compress"** for instant results
   - Click **"ML Optimize"** for maximum compression
4. Review the before/after comparison
5. Click **"Replace Selection"** to save tokens and money

## ⌨️ Keyboard Shortcuts

- `Ctrl+Shift+O` (Windows/Linux) or `Cmd+Shift+O` (Mac): Optimize with rules
- `Ctrl+Shift+M` (Windows/Linux) or `Cmd+Shift+M` (Mac): Optimize with ML

## 📋 Commands

- `TokenTrim: Optimize Selected Text` - Rule-based optimization
- `TokenTrim: Optimize with ML (LLMLingua)` - ML-powered compression
- `TokenTrim: Show Sidebar`
- `TokenTrim: Select Model`

## Supported Models

**18 models across 3 providers:**

**OpenAI** (5 models):
- GPT-4 Turbo
- GPT-4
- GPT-4 32K
- GPT-3.5 Turbo
- GPT-3.5 Turbo 16K

**Anthropic Claude** (7 models):
- Claude Opus 4.5 
- Claude Sonnet 4.5 
- Claude 3.5 Sonnet
- Claude 3.5 Haiku
- Claude 3 Opus
- Claude 3 Sonnet
- Claude 3 Haiku

**Google Gemini** (6 models):
- Gemini 3 Pro 
- Gemini 3 Flash 
- Gemini 2.0 Flash 
- Gemini 1.5 Pro
- Gemini 1.5 Flash
- Gemini 1.5 Flash-8B

**Note:** Claude and Gemini token counts are approximations (±5% accuracy).

## 🤖 LLMLingua Setup (Optional)

For advanced ML compression, install LLMLingua:

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Installation
1. The extension will prompt you to install LLMLingua on first use
2. Click "Install" to automatically install dependencies
3. Wait 2-3 minutes for model download (~500MB)

### Manual Installation
```bash
pip install llmlingua torch transformers
```

### Troubleshooting
- **Python not found**: Install from [python.org](https://python.org)
- **Installation fails**: Try `pip install --upgrade pip` first
- **Model download slow**: Use a VPN if in restricted regions

**Note:** LLMLingua is optional. Rule-based optimization works without it.

## 🛠️ How It Works

### Rule-Based Optimization (Quick Compress)
- ✂️ **Whitespace normalization** - Remove excessive spacing
- 📝 **Markdown stripping** - Clean unnecessary formatting
- 🎯 **Phrase condensing** - Replace verbose phrases with concise alternatives
- 🧹 **Filler removal** - Strip words that don't add value
- ⚡ **Punctuation optimization** - Simplify without losing meaning

### ML Optimization (LLMLingua)
- 🧠 **Semantic compression** - Preserves meaning while removing redundancy
- 📉 **Token-level optimization** - Intelligent token selection
- 🎯 **Context-aware** - Understands prompt structure
- ⚡ **50-80% reduction** - Superior compression ratios

**All transformations preserve semantic meaning.**

## 📦 Requirements

- VS Code 1.85.0 or higher
- Python 3.8+ (optional, for ML optimization)

## 📄 License

MIT - Free forever, open source

---

**Made with ❤️ for developers who care about LLM costs**
