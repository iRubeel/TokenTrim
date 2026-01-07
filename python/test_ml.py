"""
Test script to verify Python bridge and LLMLingua detection
Run this to test the ML optimization feature locally
"""

import sys
import json

def test_python_detection():
    """Test 1: Python version detection"""
    print(f"✓ Python {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro} detected")
    return True

def test_llmlingua_import():
    """Test 2: LLMLingua import"""
    try:
        import llmlingua
        print("✓ LLMLingua is installed")
        return True
    except ImportError:
        print("✗ LLMLingua not installed")
        print("  Install with: py -m pip install llmlingua torch transformers")
        return False

def test_compression(sample_text):
    """Test 3: Actual compression"""
    try:
        from llmlingua import PromptCompressor
        
        compressor = PromptCompressor(
            model_name="microsoft/llmlingua-2-xlm-roberta-large-meetingbank",
            use_llmlingua2=True
        )
        
        result = compressor.compress_prompt(
            sample_text,
            rate=0.5,
            force_tokens=['\n', '?', '!', '.']
        )
        
        print(f"✓ Compression successful")
        print(f"  Original: {len(sample_text)} chars")
        print(f"  Compressed: {len(result['compressed_prompt'])} chars")
        print(f"  Ratio: {result['ratio']:.2%}")
        return True
        
    except Exception as e:
        print(f"✗ Compression failed: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("TokenTrim ML Feature Test")
    print("=" * 60)
    
    # Test 1: Python detection
    test_python_detection()
    
    # Test 2: LLMLingua availability
    llmlingua_available = test_llmlingua_import()
    
    # Test 3: Compression (only if LLMLingua is installed)
    if llmlingua_available:
        sample = """
        This is a sample prompt that we want to compress using LLMLingua.
        The compression should preserve the semantic meaning while reducing
        the token count significantly. This helps reduce API costs when
        working with large language models like GPT-4, Claude, or Gemini.
        """
        test_compression(sample)
    
    print("=" * 60)
    print("Test complete!")
    print("=" * 60)
