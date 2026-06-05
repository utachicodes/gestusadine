import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GripVertical, ChevronDown, ChevronUp, Star, HelpCircle } from 'lucide-react';
import { useTr, type Loc } from '@/lib/i18n';

type Difficulty = 'easy' | 'medium' | 'advanced';

const DIFFICULTIES: { key: Difficulty; label: Loc }[] = [
  { key: 'easy', label: { en: 'Easy', fr: 'Facile' } },
  { key: 'medium', label: { en: 'Medium', fr: 'Moyen' } },
  { key: 'advanced', label: { en: 'Advanced', fr: 'Avancé' } },
];

const QUIZ_DATA: Record<Difficulty, { question: Loc; options: Loc[]; correct: Loc; hint: Loc }> = {
  easy: {
    question: { en: 'How many obligatory prayers are there each day in Islam?', fr: "Combien de prières obligatoires y a-t-il chaque jour en Islam ?" },
    options: [
      { en: 'Five', fr: 'Cinq' },
      { en: 'Three', fr: 'Trois' },
      { en: 'Seven', fr: 'Sept' },
    ],
    correct: { en: 'Five', fr: 'Cinq' },
    hint: { en: 'They stretch from dawn to night.', fr: "Elles s'étendent de l'aube à la nuit." },
  },
  medium: {
    question: { en: "During which month do Muslims fast from dawn to sunset?", fr: "Pendant quel mois les musulmans jeûnent-ils de l'aube au coucher du soleil ?" },
    options: [
      { en: 'Ramadan', fr: 'Ramadan' },
      { en: "Sha'ban", fr: "Chaʿbān" },
      { en: 'Muharram', fr: 'Mouharram' },
    ],
    correct: { en: 'Ramadan', fr: 'Ramadan' },
    hint: { en: "It is the ninth month of the Islamic calendar.", fr: "C'est le neuvième mois du calendrier islamique." },
  },
  advanced: {
    question: { en: 'In which Hijri year did Ramadan fasting become obligatory?', fr: "En quelle année de l'Hégire le jeûne du Ramadan est-il devenu obligatoire ?" },
    options: [
      { en: '2 AH', fr: 'An 2 H' },
      { en: '1 AH', fr: 'An 1 H' },
      { en: '5 AH', fr: 'An 5 H' },
    ],
    correct: { en: '2 AH', fr: 'An 2 H' },
    hint: { en: "It was prescribed soon after the migration to Madinah.", fr: "Il fut prescrit peu après l'émigration vers Médine." },
  },
};

export const QuizWidget = () => {
  const tr = useTr();
  const { language } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const quiz = QUIZ_DATA[difficulty];
  const resolvedCorrect = tr(quiz.correct);

  const isCorrect = submitted && selectedOption !== null && selectedOption === tr(quiz.correct);

  const handleDifficultyChange = (d: Difficulty) => {
    setDifficulty(d);
    setSelectedOption(null);
    setSubmitted(false);
  };

  const difficultyStyle = (d: Difficulty) => {
    if (d === 'easy') return 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20';
    if (d === 'medium') return 'bg-accent/10 text-accent-foreground border-accent/20 hover:bg-accent/20';
    return 'bg-secondary/10 text-secondary-foreground border-secondary/20 hover:bg-secondary/20';
  };

  const difficultyActiveStyle = (d: Difficulty) => {
    if (d === 'easy') return 'bg-primary text-primary-foreground border-primary';
    if (d === 'medium') return 'bg-accent text-accent-foreground border-accent';
    return 'bg-secondary text-secondary-foreground border-secondary';
  };

  return (
    <div className="w-full lg:w-80 lg:flex-shrink-0">
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 200 }}
        dragElastic={0.1}
        dragMomentum={false}
        className="islamic-card p-4 space-y-3 relative overflow-hidden group lg:sticky lg:top-24 cursor-grab active:cursor-grabbing"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <div className="relative z-10 flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <GripVertical className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold">
                {tr({ en: 'Weekly Quiz', fr: 'Quiz hebdomadaire' })}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <div className="p-1.5 bg-accent/10 rounded-lg flex-shrink-0">
                <HelpCircle className="w-3.5 h-3.5 text-accent-foreground" />
              </div>
              <button
                type="button"
                onClick={() => setCollapsed(!collapsed)}
                className="p-1.5 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
              >
                {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <motion.div
            animate={{ height: collapsed ? 0 : 'auto', opacity: collapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-xs text-muted-foreground mb-2">
              {tr({ en: 'Test your knowledge', fr: 'Testez vos connaissances' })}
            </p>

            <div className="flex flex-wrap gap-1 mb-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => handleDifficultyChange(d.key)}
                  className={`px-2 py-0.5 rounded-full border text-[10px] font-medium transition-colors ${
                    difficulty === d.key ? difficultyActiveStyle(d.key) : difficultyStyle(d.key)
                  }`}
                >
                  {tr(d.label)}
                </button>
              ))}
            </div>

            <p className="text-[11px] leading-tight text-foreground mb-2 line-clamp-2">
              {tr(quiz.question)}
            </p>

            <div className="space-y-1 min-h-0">
              {quiz.options.map((option) => {
                const optText = tr(option);
                const selected = selectedOption === optText;
                const correct = submitted && optText === resolvedCorrect;
                const wrong = submitted && selected && !correct;

                return (
                  <button
                    key={optText}
                    type="button"
                    onClick={() => {
                      setSelectedOption(optText);
                      setSubmitted(false);
                    }}
                    disabled={submitted}
                    className={`w-full text-left text-[10px] px-2 py-1.5 rounded-lg border transition-colors ${
                      correct
                        ? 'border-primary bg-primary/5 dark:bg-primary/20 text-primary dark:text-primary-foreground'
                        : wrong
                          ? 'border-destructive bg-destructive/10 dark:bg-destructive/20 text-destructive dark:text-destructive-foreground'
                          : selected
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border bg-card text-muted-foreground hover:bg-muted'
                    } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <span className="line-clamp-2">{optText}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                if (!selectedOption) return;
                setSubmitted(true);
              }}
              disabled={!selectedOption || submitted}
              className="btn-islamic-outlined w-full mt-2 flex items-center justify-center gap-1 text-[10px] py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Star className="w-3 h-3" />
              {tr({ en: 'Check answer', fr: 'Vérifier' })}
            </button>

            {submitted && (
              <p
                className={`mt-1 text-[10px] leading-tight ${
                  isCorrect ? 'text-primary dark:text-primary-foreground' : 'text-muted-foreground'
                }`}
              >
                {isCorrect
                  ? tr({ en: 'Correct, mashaAllah!', fr: 'Correct, mashaAllah !' })
                  : `${tr({ en: 'Not quite. Hint: ', fr: 'Pas tout à fait. Indice : ' })}${tr(quiz.hint)}`}
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
