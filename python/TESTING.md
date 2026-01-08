# Testing Guide for LLMLingua Fix

## Quick Test Commands

### 1. Test in Current Environment
```bash
cd "d:\Vibe Coded Apps\PromptOptimizer\TokenTrim\python"
python test_llmlingua.py
```

### 2. Test in Clean Virtual Environment (Recommended)

**Windows PowerShell:**
```powershell
# Navigate to project
cd "d:\Vibe Coded Apps\PromptOptimizer\TokenTrim\python"

# Create clean virtual environment
python -m venv test_env

# Activate it
.\test_env\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run compatibility tests
python test_llmlingua.py

# Deactivate when done
deactivate
```

**Expected Output:**
```
============================================================
LLMLingua Compatibility Test Suite
============================================================

Running: Import Test
------------------------------------------------------------
✅ llmlingua imported successfully
   Version: 0.2.1 (or higher)

Running: Version Test
------------------------------------------------------------
✅ llmlingua version 0.2.1 is compatible (>= 0.2.1)

Running: API Compatibility Test
------------------------------------------------------------
✅ PromptCompressor supports 'use_llmlingua2' parameter

Running: Initialization Test
------------------------------------------------------------
✅ PromptCompressor initialized successfully with use_llmlingua2=True

============================================================
Test Summary
============================================================
✅ PASS: Import Test
✅ PASS: Version Test
✅ PASS: API Compatibility Test
✅ PASS: Initialization Test

Results: 4/4 tests passed

🎉 All tests passed! llmlingua is properly configured.
```

## What Changed

### Files Modified:
1. **requirements.txt** - Updated llmlingua version constraint
2. **compress.py** - Added version checking and error handling
3. **test_llmlingua.py** (NEW) - Automated compatibility tests

### Changes Summary:
- ✅ Updated `llmlingua==0.2.0` → `llmlingua>=0.2.1,<0.3.0`
- ✅ Added `urllib3<2.0.0` to fix OpenSSL warnings on macOS
- ✅ Added `packaging>=21.0` for version comparison
- ✅ Added version validation on script startup
- ✅ Added graceful error handling with helpful messages

## Next Steps

1. Run the test script to verify the fix works
2. Update extension version in package.json
3. Test the extension in VS Code
4. Deploy to marketplace
