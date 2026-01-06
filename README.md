# TokenTrim

> **Trim tokens. Cut costs. Code smarter.**

Stop overpaying for LLM APIs. TokenTrim optimizes your prompts locally—right in VS Code, fully private, fully free.

## ✨ Features

- **📊 Real-Time Token Counting**: Instant token analysis using tiktoken
- **💰 Cost Estimation**: Accurate pricing for OpenAI models (GPT-4, GPT-3.5)
- **✂️ One-Click Optimization**: Rule-based compression reduces tokens by 30-50%
- **🔒 Privacy-First**: 100% local processing, your prompts never leave your machine
- **⚡ Lightning Fast**: Optimizations complete in under 500ms

## 🚀 Quick Start

1. **Select text** in any editor
2. Open the **TokenTrim sidebar** (or check the status bar for token count)
3. Click **"Optimize Prompt"** to compress your text
4. Review the before/after comparison
5. Click **"Replace Selection"** to save tokens and money

## ⌨️ Keyboard Shortcuts

- `Ctrl+Shift+O` (Windows/Linux) or `Cmd+Shift+O` (Mac): Optimize selected text

## 📋 Commands

- `TokenTrim: Optimize Selected Text`
- `TokenTrim: Show Sidebar`
- `TokenTrim: Select Model`

## 🤖 Supported Models

- **GPT-4 Turbo** (128k context)
- **GPT-4** (8k context)
- **GPT-4 32K**
- **GPT-3.5 Turbo** (16k context)
- **GPT-3.5 Turbo 16K**

*More models coming soon: Claude, Gemini, and custom models*

## 🛠️ How It Works

TokenTrim uses intelligent rule-based compression:

- ✂️ **Whitespace normalization** - Remove excessive spacing
- 📝 **Markdown stripping** - Clean unnecessary formatting
- 🎯 **Phrase condensing** - Replace verbose phrases with concise alternatives
- 🧹 **Filler removal** - Strip words that don't add value
- ⚡ **Punctuation optimization** - Simplify without losing meaning

**All transformations preserve semantic meaning and are fully reversible.**

## 🔒 Privacy Guarantee

TokenTrim runs **100% locally**. Your prompts never leave your machine. No telemetry, no external API calls, no data collection.

## 📦 Requirements

- VS Code 1.85.0 or higher

## 🗺️ Roadmap

**v1.0** (Current) - Core token counting and rule-based optimization  
**v2.0** (Coming Soon) - Multi-model support (Claude, Gemini)  
**v3.0** (Planned) - ML-based compression with LLMLingua

## 📄 License

MIT - Free forever, open source

---

**Made with ❤️ for developers who care about LLM costs**
