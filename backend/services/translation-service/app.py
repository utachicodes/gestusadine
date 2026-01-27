"""
Translation Service API
Provides REST endpoints for Wolof translation
"""

import sys
import io

# Reconfigure stdout/stderr to handle subprocess environment
# This prevents "I/O operation on closed file" errors when spawned
try:
    if sys.stdout.closed:
        sys.stdout = io.TextIOWrapper(open(sys.stdout.fileno(), 'wb', 0), write_through=True)
    if sys.stderr.closed:
        sys.stderr = io.TextIOWrapper(open(sys.stderr.fileno(), 'wb', 0), write_through=True)
except:
    # If that fails, redirect to a safe default
    sys.stdout = io.StringIO()
    sys.stderr = io.StringIO()

import logging
from flask import Flask, request, jsonify
from wolof_translator import get_translator
import os
from typing import Dict, Any

# Configure logging AFTER fixing stdout/stderr
logging.basicConfig(
    level=logging.INFO,
    format='[TranslationAPI] %(message)s',
    handlers=[logging.StreamHandler(sys.stderr)],
    force=True  # Force reconfiguration
)

app = Flask(__name__)

# Lazy initialization - translator will be initialized on first use
translator = None


def ensure_translator():
    """Lazy initialization of translator to avoid startup issues"""
    global translator
    if translator is None:
        translator = get_translator()
    return translator


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    trans = ensure_translator()
    return jsonify({
        'status': 'healthy',
        'service': 'translation-service',
        'model': os.getenv('TRANSLATION_MODEL', 'galsenai/wolofToFrenchTranslator_nllb'),
        'device': 'cuda' if trans.device == 'cuda' else 'cpu'
    })


@app.route('/translate', methods=['POST'])
def translate():
    """
    Translate text between French and Wolof
    
    Request body:
    {
        "text": "Text to translate",
        "source_lang": "fr" or "wo" (optional, auto-detected if omitted),
        "target_lang": "fr" or "wo" (optional, opposite of source if omitted)
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Missing text field'}), 400
        
        text = data['text']
        source_lang = data.get('source_lang')  # 'fr' or 'wo'
        target_lang = data.get('target_lang')
        
        # Translate
        trans = ensure_translator()
        result = trans.translate(text, source_lang, target_lang)
        
        # Detect actual source language if not provided
        if not source_lang:
            source_lang = trans.detect_language(text)
        if not target_lang:
            target_lang = 'wo' if source_lang == 'fr' else 'fr'
        
        return jsonify({
            'success': True,
            'original': text,
            'translated': result,
            'source_language': source_lang,
            'target_language': target_lang
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/translate-batch', methods=['POST'])
def translate_batch():
    """
    Translate multiple texts at once
    
    Request body:
    {
        "texts": ["Text 1", "Text 2", ...],
        "source_lang": "fr" or "wo" (optional)
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'texts' not in data:
            return jsonify({'error': 'Missing texts field'}), 400
        
        texts = data['texts']
        source_lang = data.get('source_lang')
        
        if not isinstance(texts, list):
            return jsonify({'error': 'texts must be a list'}), 400
        
        # Translate all texts
        trans = ensure_translator()
        translations = trans.batch_translate(texts, source_lang)
        
        return jsonify({
            'success': True,
            'count': len(texts),
            'translations': translations
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/detect-language', methods=['POST'])
def detect_language():
    """
    Detect if text is French or Wolof
    
    Request body:
    {
        "text": "Text to detect"
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Missing text field'}), 400
        
        text = data['text']
        trans = ensure_translator()
        lang = trans.detect_language(text)
        language_names = {'fr': 'French', 'wo': 'Wolof'}
        
        return jsonify({
            'success': True,
            'text': text,
            'detected_language': lang,
            'language_name': language_names.get(lang, 'Unknown')
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


if __name__ == '__main__':
    port = int(os.getenv('TRANSLATION_PORT', 5000))
    logging.info(f"Translation service starting on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
