import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mic, MicOff, RefreshCw, AlertCircle, CheckCircle2, Play, Pause, Settings, ChevronRight, ChevronLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from '@/lib/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Tarteel = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAyah, setCurrentAyah] = useState(0);
  const [feedback, setFeedback] = useState<null | 'success' | 'error'>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [mistakes, setMistakes] = useState<number[]>([]);
  const [transcription, setTranscription] = useState<string>("");
  
  // Data State
  type Verse = {
    id: number;
    text: string;
    translation: string;
    transliteration: string;
  };
  type Surah = {
    id: number;
    name: string;
    transliteration: string;
    translation: string;
    total_verses: number;
    verses: Verse[];
  };
  type SurahSummary = {
    id: number;
    name: string;
    transliteration: string;
    translation: string;
    totalVerses: number;
  };
  const [surahs, setSurahs] = useState<SurahSummary[]>([]);
  const [selectedSurahId, setSelectedSurahId] = useState<string>("78"); // Default to An-Naba
  const [currentSurahData, setCurrentSurahData] = useState<Surah | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const { toast } = useToast();

  // Web Audio API refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  type RecognitionType = {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    start: () => void;
    stop: () => void;
    onresult: (event: RecognitionEvent) => void;
    onerror: (event: unknown) => void;
    onend: () => void;
  };
  type RecognitionEvent = {
    resultIndex: number;
    results: Array<{
      0: { transcript: string };
      isFinal: boolean;
      length: number;
    }>;
  };
  const recognitionRef = useRef<RecognitionType | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<string>("");

  const normalizeArabic = (text: string) => {
    return text
      .replace(/[^\u0600-\u06FF\s]/g, "")
      .replace(/[\u064B-\u065F]/g, "")
      .replace(/[\u06D6-\u06ED]/g, "")
      .replace(/ٱ/g, "ا")
      .replace(/آ/g, "ا")
      .replace(/أ/g, "ا")
      .replace(/إ/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ة/g, "ه")
      .trim();
  };

  useEffect(() => {
    // Fetch Surah List
    apiFetch('/api/tarteel/surahs')
       .then(async res => {
         const data = await res.json();
         setSurahs(data);
       })
       .catch(err => {
         console.error("Failed to fetch surahs", err);
         toast({
           variant: "destructive",
           title: "Error",
           description: "Failed to load Surah list.",
         });
       });
  }, []);

  useEffect(() => {
    if (selectedSurahId) {
        setIsProcessing(true);
        apiFetch(`/api/tarteel/surahs/${selectedSurahId}`)
           .then(async res => {
               const data = await res.json();
               setCurrentSurahData(data);
               setCurrentAyah(0);
               setFeedback(null);
               setTranscription("");
           })
           .catch(err => {
               console.error("Failed to fetch surah details", err);
           })
           .finally(() => setIsProcessing(false));
    }
  }, [selectedSurahId]);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      const AudioContextCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!;
      const audioContext = new AudioContextCtor();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start(1000);
      
      // Real-time STT (Web Speech API) fallback
      type SRWindow = {
        SpeechRecognition?: new () => RecognitionType;
        webkitSpeechRecognition?: new () => RecognitionType;
      };
      const SpeechRecognition =
        (window as unknown as SRWindow).SpeechRecognition ||
        (window as unknown as SRWindow).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition() as RecognitionType;
        recognitionRef.current = recognition;
        recognition.lang = 'ar';
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onresult = (event: RecognitionEvent) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              setLiveTranscript(prev => (prev ? `${prev} ${transcript}` : transcript));
            } else {
              interim += transcript;
            }
          }
          const currentText = (liveTranscript || interim).trim();
          setTranscription(currentText);
          if (currentSurahData) {
            const expected = currentSurahData.verses[currentAyah].text;
            const isOk = normalizeArabic(currentText).includes(normalizeArabic(expected));
            setFeedback(isOk ? 'success' : null);
          }
        };
        recognition.onerror = () => { setFeedback(null); };
        recognition.onend = () => {
          if (isListening) recognition.start();
        };
        recognition.start();
      }
      
      setIsListening(true);
      setFeedback(null);
      setMistakes([]);
      setTranscription("");
      visualize();
      
      toast({
        title: "Listening...",
        description: "Please recite the highlighted verse.",
      });

    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast({
        variant: "destructive",
        title: "Microphone Error",
        description: "Could not access microphone. Please ensure permissions are granted.",
      });
    }
  };

  const stopListening = async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      
      // Wait for the stop event/data available
      await new Promise(resolve => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.onstop = resolve;
        } else {
            resolve(null);
        }
      });
    }
    
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setIsListening(false);
    setAudioLevel(0);
    
    if (chunksRef.current.length > 0) {
      processAudio();
    }
  };

  const processAudio = async () => {
    setIsProcessing(true);
    try {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      
      // Validate file size (10MB limit)
      if (blob.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "Recording exceeds the 10MB limit. Please try a shorter recitation.",
        });
        setIsProcessing(false);
        return;
      }

      const formData = new FormData();
      formData.append('audio', blob, 'recitation.webm');
      if (currentSurahData) {
          formData.append('surahNumber', currentSurahData.id.toString());
          formData.append('ayahNumber', currentSurahData.verses[currentAyah].id.toString());
      } else {
          // Fallback or error
          console.error("No surah data loaded");
          setIsProcessing(false);
          return;
      }
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/tarteel/analyze`, {
          method: 'POST',
          body: formData, // No Content-Type header needed for FormData
        });

        if (!response.ok) {
          // Fallback to local comparison using live transcript
          if (currentSurahData && liveTranscript) {
            const expected = currentSurahData.verses[currentAyah].text;
            const isOk = normalizeArabic(liveTranscript).includes(normalizeArabic(expected));
            setTranscription(liveTranscript);
            setFeedback(isOk ? 'success' : 'error');
            if (isOk) {
              toast({ title: "MashaAllah!", description: "Your recitation was correct.", className: "bg-green-500 text-white border-none" });
            } else {
              setMistakes([currentAyah]);
              toast({ variant: "destructive", title: "Correction Needed", description: `We heard: ${liveTranscript}` });
            }
            return;
          }
          throw new Error('Analysis failed');
        }

        const result = await response.json();
        
        setTranscription(result.transcription);
        
        if (result.isCorrect) {
          setFeedback('success');
          toast({
            title: "MashaAllah!",
            description: "Your recitation was correct.",
            className: "bg-green-500 text-white border-none",
          });
        } else {
          setFeedback('error');
          setMistakes([currentAyah]);
          toast({
            variant: "destructive",
            title: "Correction Needed",
            description: `We heard: ${result.transcription}`,
          });
        }
      } catch (error) {
        console.error("API Error:", error);
        if (!liveTranscript) {
          toast({
            variant: "destructive",
            title: "Analysis Error",
            description: "Could not process your recitation. Please try again.",
          });
        }
      } finally {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Processing Error:", error);
      setIsProcessing(false);
    }
  };

  const visualize = () => {
    if (!analyserRef.current) return;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      if (!analyserRef.current) return;
      
      animationRef.current = requestAnimationFrame(draw);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;
      setAudioLevel(average);
    };
    
    draw();
  };

  const nextAyah = () => {
    if (currentSurahData && currentAyah < currentSurahData.verses.length - 1) {
      setCurrentAyah(prev => prev + 1);
      setFeedback(null);
      setMistakes([]);
      setTranscription("");
    }
  };

  const prevAyah = () => {
    if (currentAyah > 0) {
      setCurrentAyah(prev => prev - 1);
      setFeedback(null);
      setMistakes([]);
      setTranscription("");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-8 min-h-screen flex flex-col justify-center">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gradient">Qirah</h1>
      </div>

      <div className="flex justify-center">
          <Select value={selectedSurahId} onValueChange={setSelectedSurahId}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a Surah" />
            </SelectTrigger>
            <SelectContent>
              {surahs.map((surah) => (
                <SelectItem key={surah.id} value={surah.id.toString()}>
                  {surah.id}. {surah.name} ({surah.transliteration})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
      </div>

      <Card className="border-2 shadow-lg relative overflow-hidden backdrop-blur-sm bg-card/50">
        <div className="absolute top-0 left-0 w-full h-1 bg-hero-gradient" />
        
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span className="font-semibold text-primary">{currentSurahData?.name} ({currentSurahData?.transliteration})</span>
            <span>•</span>
            <span>Ayah {(currentSurahData?.verses[currentAyah]?.id) || currentAyah + 1}</span>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-12 py-10">
          {/* Quran Text Display */}
          <div className="text-center space-y-8">
            {currentSurahData ? (
                <>
                <div 
                  className={cn(
                    "text-4xl md:text-5xl font-arabic leading-relaxed py-4 transition-colors duration-500",
                    isListening ? "text-primary" : "text-foreground",
                    feedback === 'error' && "text-red-500",
                    feedback === 'success' && "text-emerald-500"
                  )}
                  dir="rtl"
                >
                  {currentSurahData.verses[currentAyah].text}
                </div>
                
                <p className="text-lg text-muted-foreground font-light">
                  {currentSurahData.verses[currentAyah].translation}
                </p>
                </>
            ) : (
                <div className="py-10">Loading Surah...</div>
            )}
            
            {transcription && feedback === 'error' && (
               <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-sm text-muted-foreground mb-1">We heard:</p>
                  <p className="text-xl font-arabic text-red-600 dark:text-red-400" dir="rtl">{transcription}</p>
               </div>
            )}
          </div>

          {/* Audio Visualizer */}
          <div className="h-24 flex items-center justify-center space-x-1">
            {isListening ? (
              Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full transition-all duration-75"
                  style={{
                    height: `${Math.max(4, Math.min(100, audioLevel * (Math.random() + 0.5)))}%`,
                    opacity: 0.8
                  }}
                />
              ))
            ) : (
              <div className="text-muted-foreground text-sm flex items-center space-x-2">
                {isProcessing ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : feedback === 'success' ? (
                  <CheckCircle2 className="h-8 w-8 text-islamic-green-600" />
                ) : feedback === 'error' ? (
                  <AlertCircle className="h-8 w-8 text-red-500" />
                ) : (
                  <span>Tap microphone to start reciting</span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-6">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={prevAyah} 
          disabled={currentAyah === 0 || isListening}
          className="h-12 w-12 rounded-full"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          size="lg"
          variant={isListening ? "destructive" : "default"}
          className={cn(
            "h-20 w-20 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105",
            isListening && "animate-pulse ring-4 ring-red-500/20"
          )}
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
        >
          {isListening ? (
            <MicOff className="h-8 w-8" />
          ) : (
            <Mic className="h-8 w-8" />
          )}
        </Button>

        <Button 
          variant="outline" 
          size="icon" 
          onClick={nextAyah} 
          disabled={!currentSurahData || currentAyah === currentSurahData.verses.length - 1 || isListening}
          className="h-12 w-12 rounded-full"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Processing State */}
      {isProcessing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4 max-w-sm mx-4">
            <div className="relative">
              <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Mic className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-lg font-medium">Analyzing Recitation...</p>
            <p className="text-sm text-muted-foreground text-center">
              Checking pronunciation, tajweed, and memorization accuracy.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tarteel;
