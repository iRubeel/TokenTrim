#!/usr/bin/env python3
"""
LLMLingua compression wrapper for TokenTrim
Reads prompt from stdin, outputs compressed prompt to stdout
"""

import sys
import json
import traceback
from llmlingua import PromptCompressor
import llmlingua

# Verify llmlingua version compatibility
MIN_LLMLINGUA_VERSION = "0.2.1"
try:
    from packaging import version
    if version.parse(llmlingua.__version__) < version.parse(MIN_LLMLINGUA_VERSION):
        print(f"ERROR: llmlingua {MIN_LLMLINGUA_VERSION}+ required for LLMLingua-2 support. Current version: {llmlingua.__version__}", file=sys.stderr)
        print(f"Please upgrade: pip install 'llmlingua>={MIN_LLMLINGUA_VERSION}'", file=sys.stderr)
        sys.exit(1)
except ImportError:
    # packaging not available, skip version check
    pass

def clean_text(text):
    """Clean text while preserving content"""
    # Only remove null bytes
    text = text.replace('\x00', '')
    
    # Fix encoding issues by replacing invalid UTF-8
    try:
        # Encode and decode, replacing errors with a space
        text_bytes = text.encode('utf-8', errors='replace')
        text = text_bytes.decode('utf-8', errors='replace')
        # Replace the replacement character with space
        text = text.replace('�', ' ')
    except Exception:
        pass
    
    # Only remove control characters (except newlines, tabs, carriage returns)
    # Keep all printable characters including punctuation
    cleaned = ''
    for char in text:
        code = ord(char)
        # Keep: newline (10), tab (9), carriage return (13), and all printable chars (32-126 and extended 128-255)
        if code in (9, 10, 13) or (32 <= code <= 126) or (code >= 128):
            cleaned += char
        else:
            cleaned += ' '
    
    # Normalize excessive whitespace but keep structure
    lines = cleaned.split('\n')
    lines = [' '.join(line.split()) for line in lines]
    text = '\n'.join(lines)
    
    return text.strip()

def main():
    try:
        # Read configuration from first line
        config_line = sys.stdin.readline()
        config = json.loads(config_line)
        
        # Read prompt from remaining input
        prompt = sys.stdin.read().strip()
        
        if not prompt:
            raise ValueError("Empty prompt received")
        
        # Clean the text to remove encoding issues
        original_length = len(prompt)
        prompt = clean_text(prompt)
        cleaned_length = len(prompt)
        
        if not prompt:
            raise ValueError("Prompt became empty after cleaning. Original text may have invalid encoding.")
        
        # Log cleaning info
        if original_length != cleaned_length:
            print(f"DEBUG: Cleaned text from {original_length} to {cleaned_length} chars", file=sys.stderr)
        
        # Check prompt size (limit to 50,000 chars for performance)
        if len(prompt) > 50000:
            raise ValueError(f"Prompt too large: {len(prompt)} chars (max 50,000). Please select smaller text.")
        
        # Log what we received (to stderr for debugging)
        print(f"DEBUG: Config: {config}", file=sys.stderr)
        print(f"DEBUG: Prompt length: {len(prompt)} chars", file=sys.stderr)
        print(f"DEBUG: Prompt preview: {prompt[:100]}...", file=sys.stderr)
        
        # Initialize compressor with LLMLingua 2
        try:
            compressor = PromptCompressor(
                model_name="microsoft/llmlingua-2-xlm-roberta-large-meetingbank",
                use_llmlingua2=True,
                device_map='cpu'
            )
        except TypeError as e:
            if 'use_llmlingua2' in str(e):
                raise ValueError(
                    f"Incompatible llmlingua version detected. "
                    f"The 'use_llmlingua2' parameter requires llmlingua >= 0.2.1. "
                    f"Current version: {llmlingua.__version__}. "
                    f"Please upgrade: pip install 'llmlingua>=0.2.1'"
                ) from e
            raise
        
        # Compress prompt - LLMLingua 2 expects a single string
        result = compressor.compress_prompt(
            prompt,
            rate=config.get('rate', 0.5),
            force_tokens=['\n', '.', '!', '?', ',']
        )
        
        # Output result as JSON
        output = {
            'compressed_prompt': result['compressed_prompt'],
            'original_tokens': result.get('origin_tokens', len(prompt.split())),
            'compressed_tokens': result.get('compressed_tokens', len(result['compressed_prompt'].split())),
            'ratio': result.get('ratio', '50%'),
            'saving': result.get('saving', '50%')
        }
        
        print(json.dumps(output))
        sys.exit(0)
        
    except Exception as e:
        # Detailed error output
        error = {
            'error': str(e),
            'type': type(e).__name__,
            'traceback': traceback.format_exc()
        }
        print(json.dumps(error), file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
