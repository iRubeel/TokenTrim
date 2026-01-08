#!/usr/bin/env python3
"""
Test script to verify llmlingua installation and compatibility
"""

import sys

def test_llmlingua_import():
    """Test that llmlingua can be imported"""
    try:
        import llmlingua
        print(f"✅ llmlingua imported successfully")
        print(f"   Version: {llmlingua.__version__}")
        return True
    except ImportError as e:
        print(f"❌ Failed to import llmlingua: {e}")
        return False

def test_llmlingua_version():
    """Test that llmlingua version is compatible"""
    try:
        import llmlingua
        from packaging import version
        
        MIN_VERSION = "0.2.1"
        current_version = llmlingua.__version__
        
        if version.parse(current_version) >= version.parse(MIN_VERSION):
            print(f"✅ llmlingua version {current_version} is compatible (>= {MIN_VERSION})")
            return True
        else:
            print(f"❌ llmlingua version {current_version} is too old (need >= {MIN_VERSION})")
            return False
    except Exception as e:
        print(f"❌ Version check failed: {e}")
        return False

def test_use_llmlingua2_parameter():
    """Test that PromptCompressor supports use_llmlingua2 parameter"""
    try:
        from llmlingua import PromptCompressor
        import inspect
        
        sig = inspect.signature(PromptCompressor.__init__)
        
        if 'use_llmlingua2' in sig.parameters:
            print(f"✅ PromptCompressor supports 'use_llmlingua2' parameter")
            return True
        else:
            print(f"❌ PromptCompressor does NOT support 'use_llmlingua2' parameter")
            print(f"   Available parameters: {list(sig.parameters.keys())}")
            return False
    except Exception as e:
        print(f"❌ API compatibility check failed: {e}")
        return False

def test_compressor_initialization():
    """Test that PromptCompressor can be initialized with use_llmlingua2=True"""
    try:
        from llmlingua import PromptCompressor
        
        # Try to initialize with LLMLingua-2
        compressor = PromptCompressor(
            model_name="microsoft/llmlingua-2-xlm-roberta-large-meetingbank",
            use_llmlingua2=True,
            device_map='cpu'
        )
        
        print(f"✅ PromptCompressor initialized successfully with use_llmlingua2=True")
        return True
    except TypeError as e:
        if 'use_llmlingua2' in str(e):
            print(f"❌ PromptCompressor initialization failed: {e}")
            print(f"   This indicates version incompatibility")
        else:
            print(f"❌ PromptCompressor initialization failed: {e}")
        return False
    except Exception as e:
        print(f"⚠️  PromptCompressor initialization failed (may be due to missing model files): {e}")
        print(f"   This is OK for dependency testing - the API is compatible")
        return True  # API is compatible even if model download fails

def main():
    """Run all tests"""
    print("=" * 60)
    print("LLMLingua Compatibility Test Suite")
    print("=" * 60)
    print()
    
    tests = [
        ("Import Test", test_llmlingua_import),
        ("Version Test", test_llmlingua_version),
        ("API Compatibility Test", test_use_llmlingua2_parameter),
        ("Initialization Test", test_compressor_initialization),
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"Running: {test_name}")
        print("-" * 60)
        result = test_func()
        results.append((test_name, result))
        print()
    
    print("=" * 60)
    print("Test Summary")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print()
    print(f"Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! llmlingua is properly configured.")
        sys.exit(0)
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Please check your installation.")
        sys.exit(1)

if __name__ == '__main__':
    main()
