"""
Wolof Translation Service
Integrates Galsen AI's FrenchWolofTranslator for bidirectional translation
"""

import sys
import logging
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
import os
from typing import Optional, Dict, List

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='[TranslationService] %(message)s',
    handlers=[logging.StreamHandler(sys.stderr)]
)


class FrenchWolofTranslator:
    """
    Wolof translation service using Galsen AI's model
    Supports French <-> Wolof bidirectional translation
    """

    def __init__(self, model_checkpoint: str = "galsenai/wolofToFrenchTranslator_nllb"):
        """Initialize translator with Galsen AI model checkpoint"""
        self.model_checkpoint = model_checkpoint
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
        try:
            logging.info(f"🔄 Loading Wolof translation model: {model_checkpoint}")
            self.tokenizer = AutoTokenizer.from_pretrained(model_checkpoint)
            self.model = AutoModelForSeq2SeqLM.from_pretrained(model_checkpoint)
            self.model.to(self.device)
            self.model.eval()
            logging.info(f"✅ Model loaded successfully on {self.device}")
        except Exception as e:
            logging.error(f"❌ Error loading model: {e}")
            raise

    def detect_language(self, text: str) -> str:
        """
        Detect if text is French or Wolof
        Simple heuristic-based detection
        """
        text_lower = text.lower()
        
        # Common French words
        french_indicators = ['le', 'la', 'de', 'et', 'est', 'un', 'une', 'je', 'tu', 'il', 'elle']
        
        # Common Wolof words
        wolof_indicators = ['naka', 'def', 'ak', 'jaam', 'bu', 'li', 'ñu', 'ko', 'am', 'ba']
        
        french_count = sum(1 for word in french_indicators if word in text_lower)
        wolof_count = sum(1 for word in wolof_indicators if word in text_lower)
        
        if french_count > wolof_count:
            return "fr"
        elif wolof_count > french_count:
            return "wo"
        else:
            # Default to French if ambiguous
            return "fr"

    def translate_french_to_wolof(self, text: str) -> str:
        """Translate French text to Wolof using convenience method"""
        return self._translate(text, source_lang="fra_Latn", target_lang="wol_Latn")

    def translate_wolof_to_french(self, text: str) -> str:
        """Translate Wolof text to French using convenience method"""
        return self._translate(text, source_lang="wol_Latn", target_lang="fra_Latn")

    def translate(self, text: str, source_lang: Optional[str] = None, target_lang: Optional[str] = None) -> str:
        """
        Generic translation method with language detection
        Matches official API: translate(text, source_lang="fr")
        
        Args:
            text: Text to translate
            source_lang: Source language code ('fr' or 'wo'). Auto-detected if None.
            target_lang: Target language code ('fr' or 'wo'). Defaults to opposite of source.
        
        Returns:
            Translated text
        """
        if not text or not text.strip():
            return ""
        
        if not source_lang:
            source_lang = self.detect_language(text)
        
        if not target_lang:
            target_lang = "wo" if source_lang == "fr" else "fr"
        
        if source_lang == "fr":
            return self.translate_french_to_wolof(text)
        else:
            return self.translate_wolof_to_french(text)

    def _translate(self, text: str, source_lang: str, target_lang: str) -> str:
        """Internal translation method using transformer model"""
        try:
            # Prepare input with language tags
            input_text = f"{source_lang} {text}"
            
            # Tokenize
            inputs = self.tokenizer.encode(input_text, return_tensors="pt").to(self.device)
            
            # Generate translation
            with torch.no_grad():
                outputs = self.model.generate(
                    inputs,
                    forced_bos_token_id=self.tokenizer.convert_tokens_to_ids(target_lang),
                    max_length=512,
                    num_beams=4,
                    early_stopping=True
                )
            
            # Decode
            translated_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            return translated_text
        except Exception as e:
            logging.error(f"❌ Translation error: {e}")
            return text

    def batch_translate(self, texts: List[str], source_lang: Optional[str] = None) -> List[str]:
        """Translate multiple texts efficiently"""
        if not texts:
            return []
        return [self.translate(text, source_lang) for text in texts]


# Global translator instance
_translator = None


def get_translator() -> FrenchWolofTranslator:
    """Get or initialize global translator instance"""
    global _translator
    if _translator is None:
        model_checkpoint = os.getenv("TRANSLATION_MODEL", "galsenai/wolofToFrenchTranslator_nllb")
        _translator = FrenchWolofTranslator(model_checkpoint)
    return _translator


if __name__ == "__main__":
    # Test the translator
    import os
    translator = get_translator()
    
    # Test French to Wolof
    french_text = "Bonjour"
    wolof_text = translator.translate_french_to_wolof(french_text)
    logging.info(f"French: {french_text}")
    logging.info(f"Wolof: {wolof_text}")
    
    # Test Wolof to French
    wolof_text = "Naka nga def?"
    french_text = translator.translate_wolof_to_french(wolof_text)
    logging.info(f"Wolof: {wolof_text}")
    logging.info(f"French: {french_text}")

