import { Router } from "express";
import multer from "multer";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { configService } from "../../../config-service/config.service.js";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/juz-amma.json');

// Load Data
let QURAN_DATA: any[] = [];
try {
  if (fs.existsSync(dataPath)) {
    QURAN_DATA = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    console.log(`Loaded ${QURAN_DATA.length} Surahs from file.`);
  } else {
    console.warn("Juz Amma data file not found at " + dataPath);
  }
} catch (err) {
  console.error("Failed to load Quran data:", err);
}

// Configure Multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Normalize Arabic text for comparison
const normalizeArabic = (text: string) => {
  return text
    .replace(/[^\u0600-\u06FF\s]/g, "") // Remove non-Arabic characters
    .replace(/[\u064B-\u065F]/g, "") // Remove Tashkeel (diacritics)
    .replace(/[\u06D6-\u06ED]/g, "") // Remove Quranic symbols
    .replace(/ٱ/g, "ا")
    .replace(/آ/g, "ا")
    .replace(/أ/g, "ا")
    .replace(/إ/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .trim();
};

// Get list of available Surahs
router.get('/surahs', (req, res) => {
    const list = QURAN_DATA.map(s => ({
        id: s.id,
        name: s.name,
        transliteration: s.transliteration,
        translation: s.translation,
        totalVerses: s.total_verses
    }));
    res.json(list);
});

// Get specific Surah details
router.get('/surahs/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const surah = QURAN_DATA.find(s => s.id === id);
    if (!surah) return res.status(404).json({ error: "Surah not found" });
    res.json(surah);
});

router.post("/analyze", upload.single('audio'), async (req, res) => {
  try {
    const surahNumber = parseInt(req.body.surahNumber);
    const ayahNumber = parseInt(req.body.ayahNumber);
    const audioFile = req.file;

    if (!audioFile || !surahNumber || !ayahNumber) {
      return res.status(400).json({ error: "Missing audio file, surah number, or ayah number" });
    }

    const surah = QURAN_DATA.find(s => s.id === surahNumber);
    if (!surah) {
        return res.status(404).json({ error: "Surah not found" });
    }

    const expectedAyah = surah.verses.find((v: any) => v.id === ayahNumber);
    if (!expectedAyah) {
        return res.status(404).json({ error: "Ayah not found" });
    }

    console.log(`Processing recitation for Surah ${surahNumber}, Ayah ${ayahNumber}, File size: ${audioFile.size} bytes`);

    // Check for API Key
    const apiKey = process.env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error("API Key missing");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Prepare audio for AI
    // We can convert webm to wav if needed using wavefile, or just pass the buffer if the AI supports it.
    // Gemini 1.5 Flash supports various audio formats.
    const base64Audio = audioFile.buffer.toString('base64');
    const mimeType = audioFile.mimetype;

    // Call OpenRouter (Gemini Flash 1.5) with audio input
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://xamsadine.ai", 
        "X-Title": "XamSaDine AI"
      },
      body: JSON.stringify({
        model: "google/gemini-flash-1.5", 
        messages: [
          {
            role: "user",
            content: [
              {
                type: "input_audio",
                input_audio: {
                  data: base64Audio,
                  format: mimeType.includes("webm") ? "webm" : "wav"
                }
              },
              {
                type: "text",
                text: "Transcribe this Quranic recitation exactly into Arabic text. Output ONLY the Arabic text, nothing else."
              }
            ]
          }
        ]
      })
    });

    let transcribedText = "";
    
    if (response.ok) {
        const data = await response.json();
        transcribedText = data.choices[0]?.message?.content || "";
        console.log("Transcription:", transcribedText);
    } else {
        const errText = await response.text();
        console.error("OpenRouter API Error:", errText);
        return res.status(502).json({ error: "Failed to transcribe audio via AI service." });
    }

    // Compare with Expected Text
    // expectedAyah is already found above

    const normalizedTranscribed = normalizeArabic(transcribedText);
    const normalizedExpected = normalizeArabic(expectedAyah.text);

    // Comparison Logic
    const isMatch = normalizedTranscribed.includes(normalizedExpected) || normalizedExpected.includes(normalizedTranscribed);
    
    // Calculate simple accuracy score
    const accuracy = isMatch ? 100 : 0; 

    res.json({
        transcription: transcribedText,
        expected: expectedAyah.text,
        isCorrect: isMatch,
        accuracy: accuracy
    });

  } catch (error) {
    console.error("Processing error:", error);
    res.status(500).json({ error: "Internal processing error" });
  }
});

export const tarteelRoutes = router;
