# Change Log

All notable changes to the "TokenTrim" extension will be documented in this file.

## [2.0.1] - 2026-01-08

### Fixed
- 🐛 **CRITICAL**: Fixed LLMLingua dependency version incompatibility causing 100% ML compression failure
  - Updated `llmlingua` from `==0.2.0` to `>=0.2.1,<0.3.0` to support `use_llmlingua2` parameter
  - Added version validation to fail fast with clear error messages
  - Added graceful error handling for version incompatibility
  - Fixed OpenSSL warning on macOS by constraining `urllib3<2.0.0`
- 🧪 Added automated compatibility test suite (`test_llmlingua.py`)

## [2.0.0] - 2026-01-07

### Added
- **LLMLingua ML Compression**: Advanced ML-based optimization with adjustable compression rate (30-70%)
- **Compression Rate Slider**: User-controlled compression intensity with visual feedback (Aggressive/Balanced/Conservative)
- **18 Model Support**: Expanded from 9 to 18 models across 3 providers
  - **New Google Models**: Gemini 3 Pro, Gemini 3 Flash, Gemini 2.0 Flash, Gemini 1.5 Flash-8B
  - **New Claude Models**: Claude 4.5 Opus, Claude 4.5 Sonnet, Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku
- **Model Comparison View**: Compare costs across all 18 supported models
- **Dual Optimization Modes**: Choose between Quick Compress (rule-based) and ML Optimize
- **Python Bridge**: Automatic Python environment detection and LLMLingua setup
- **Progress Indicators**: Real-time feedback during ML compression
- **Intelligent Fallbacks**: Automatic fallback to rule-based if ML unavailable
- **New Keyboard Shortcut**: Ctrl+Shift+M (Cmd+Shift+M on Mac) for ML optimization
- **Mode Selector UI**: Toggle between rule-based and ML optimization in sidebar
- **Text Encoding Cleanup**: Robust handling of various text encodings

### Changed
- Improved token counting with provider-specific logic (OpenAI exact, Claude ±5%, Gemini char-based)
- Enhanced UI with mode selector, compression slider, and better visual hierarchy
- Updated model pricing (January 2026 rates)
- Refactored optimizer architecture for extensibility
- Improved performance with encoding cache
- Gemini 1.5 Pro context window increased to 2M tokens

### Fixed
- Fixed token counting for non-OpenAI models
- Fixed extension activation performance
- Fixed text encoding issues that caused garbled output
- Fixed ML compression quality (tested at 3 compression levels)

## [1.0.6] - 2026-01-06

### Changed
- 🎨 Removed color from Sidebar icon (now monochrome) for native VS Code look.

## [1.0.5] - 2026-01-06

### Changed
- 🎨 Updated Sidebar icon to a simpler, high-contrast SVG for better visibility.

## [1.0.4] - 2026-01-06

### Changed
- 🎨 Switched Sidebar icon to PNG format for better compatibility.

## [1.0.3] - 2026-01-06

### Fixed
- 🐛 Fixed Marketplace icon display issue.

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
