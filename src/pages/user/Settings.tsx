import React from "react";
import { SlidersHorizontal, Volume2, Globe2, Shield } from "lucide-react";
import LanguageToggle from "@/components/common/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

const Settings: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex-1">
      <section className="container py-10 md:py-16 space-y-10">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-islamic-dark/60 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-islamic-gold mr-2" />
              Settings
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-islamic-dark">
              Tune GëstuSaDine to{" "}
              <span className="text-gradient">your rhythm</span>
            </h1>
            <p className="mt-2 text-islamic-dark/70 max-w-xl">
              Language, voice, and privacy that respect your pace and your
              context in Senegal and beyond.
            </p>
          </div>

          <LanguageToggle value={language} onChange={setLanguage} />
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="islamic-card p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-islamic-green/10 flex items-center justify-center text-islamic-green">
                <Globe2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-islamic-dark">
                  Language & locale
                </p>
                <p className="text-xs text-islamic-dark/70">
                  Choose your primary language and regional flavour.
                </p>
              </div>
            </div>

            <p className="text-sm text-islamic-dark/80">
              Wolof, French, and English can be mixed â€“ GëstuSaDine will follow
              your speech gently.
            </p>
          </div>

          <div className="islamic-card p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-islamic-blue/10 flex items-center justify-center text-islamic-blue">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-islamic-dark">
                  Voice & recitation
                </p>
                <p className="text-xs text-islamic-dark/70">
                  Whisper + TTS, tuned for clear, warm delivery.
                </p>
              </div>
            </div>

            <p className="text-sm text-islamic-dark/80">
              Adjust speed, tone, and whether you prefer full recitation or
              short excerpts for ayat and ahadith.
            </p>
          </div>

          <div className="islamic-card p-6 space-y-4 md:col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-islamic-gold/10 flex items-center justify-center text-islamic-gold">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-islamic-dark">
                  Privacy & adab
                </p>
                <p className="text-xs text-islamic-dark/70">
                  Your questions are sensitive. We treat them like a private
                  conversation with a trusted teacher.
                </p>
              </div>
            </div>

            <p className="text-sm text-islamic-dark/80">
              Clear controls for deleting sessions, exporting your notes, and
              understanding how RAG uses Qur&apos;an, Hadith, Maliki texts, and
              Senegalese fatawa.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;


