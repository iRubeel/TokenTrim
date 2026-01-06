# Change Log

All notable changes to the "TokenTrim" extension will be documented in this file.

## [1.0.2] - 2026-01-06

### Fixed
- 🐛 Fixed "Infinite Loading" issue by replacing `tiktoken` (WASM) with `js-tiktoken` (Pure JS) for better VS Code compatibility.

## [1.0.1] - 2026-01-06

### Changed
- ⚡ Optimized activation events (`onStartupFinished`) to improve VS Code startup performance.

## [1.0.0] - 2026-01-06

### Added
- 🚀 Initial release of TokenTrim (formerly PromptCost Optimizer)
- 📊 Real-time token counting with `tiktoken`
- 💰 Cost estimation for GPT-4 and GPT-3.5 models
- ✂️ Rule-based local prompt optimization
- 🎨 Modern webview UI with before/after comparison
- 🔒 Privacy-first local processing
