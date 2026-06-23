import React, { useState } from 'react';
import { Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTr } from '@/lib/i18n';

export const ChatInterface = () => {
  const { language } = useLanguage();
  const tr = useTr();
  const [readMore, setReadMore] = useState(false);

  return (
    <div className="flex h-full items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mx-auto">
          <Shield className="w-10 h-10 text-amber-600 dark:text-amber-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            {tr({
              en: 'The Council is Currently Unavailable',
              fr: 'Le Conseil est actuellement indisponible',
            })}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {tr({
              en: 'Our AI assistant is temporarily offline while our scholars verify its responses for authenticity and accuracy.',
              fr: 'Notre assistant IA est temporairement hors ligne pendant que nos savants vérifient ses réponses pour leur authenticité et leur précision.',
            })}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setReadMore(!readMore)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {readMore
            ? tr({ en: 'Read less', fr: 'Lire moins' })
            : tr({ en: 'Read more', fr: 'En savoir plus' })}
          {readMore ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {readMore && (
          <div className="text-left text-sm text-muted-foreground space-y-3 bg-muted/30 rounded-xl p-4 border border-border/60">
            <p>
              {tr({
                en: 'Islam is not a joke. The answers provided by our AI must reflect the authenticity of Quran and Sunnah with proper scholarly methodology.',
                fr: 'L\'islam n\'est pas une blague. Les réponses fournies par notre IA doivent refléter l\'authenticité du Coran et de la Sunna selon une méthodologie savante appropriée.',
              })}
            </p>
            <p>
              {tr({
                en: 'To ensure this, the AI model is currently being reviewed and tested by qualified Islamic scholars. This process verifies that responses align with established fiqh, correct aqeedah, and authentic hadith references.',
                fr: 'Pour garantir cela, le modèle IA est actuellement en cours de révision et de test par des savants islamiques qualifiés. Ce processus vérifie que les réponses sont conformes au fiqh établi, à l\'aqeedah correcte et aux références de hadith authentiques.',
              })}
            </p>
            <p>
              {tr({
                en: 'We appreciate your patience. The Council will return once this verification is complete, insha\'Allah.',
                fr: 'Nous apprécions votre patience. Le Conseil reviendra une fois cette vérification terminée, incha\'Allah.',
              })}
            </p>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          {tr({
            en: 'In the meantime, you can explore other features of GëstuSaDine.',
            fr: 'En attendant, vous pouvez explorer les autres fonctionnalités de GëstuSaDine.',
          })}
        </p>
      </div>
    </div>
  );
};
