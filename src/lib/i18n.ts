import { useLanguage } from '@/contexts/LanguageContext';

/** A string available in both supported languages. */
export type Loc = { en: string; fr: string };

/**
 * Hook returning a translator for inline bilingual content.
 *
 * For short, shared UI strings prefer the keyed `t()` from LanguageContext.
 * For page/section copy that lives next to its component, define the English
 * and French inline and resolve with this:
 *
 *   const tr = useTr();
 *   <h1>{tr({ en: 'Welcome', fr: 'Bienvenue' })}</h1>
 */
export function useTr() {
  const { language } = useLanguage();
  return (l: Loc) => l[language] ?? l.en;
}
