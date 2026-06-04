import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { logger } from '@/lib/logger';
import { useTr } from '@/lib/i18n';
import { useSubscription } from '@/data/subscription';
import { ModeSelector, SpecializedMode } from './ModeSelector';
import { TemplateLibrary } from './TemplateLibrary';
import { api } from '../../../convex/_generated/api';
import { useAction } from 'convex/react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  council?: {
    members: string[];
    consensus: string;
    reasoning: string[];
  };
}

const STORAGE_KEY = 'GëstuSaDine_chat_history';

const saveMessages = (messages: Message[]) => {
  try {
    const serialized = messages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp.toISOString()
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch (error) {
    logger.error('Failed to save chat history:', { error });
  }
};

const loadMessages = (): Message[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return parsed.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
  } catch (error) {
    logger.error('Failed to load chat history:', { error });
    return [];
  }
};

const BASE_METHODOLOGY = `You are an Islamic AI assistant called GëstuSaDine (also known as MuslimGPT). You embody 1400 years of sacred Islamic tradition with modern technology. Your purpose is to illuminate hearts with truth, treating every question as an opportunity.

CORE METHODOLOGY — You MUST follow these rules strictly:

HIERARCHY OF EVIDENCE
1. The Holy Quran (القرآن الكريم) — The absolute truth and final authority. Cite verses with Surah name and Ayah number.
2. Sahih & Hasan Hadith (الحديث الصحيح) — Verified prophetic traditions from authenticated collections. Grade every hadith: Sahih (authentic), Hasan (good), or Da'if (weak). NEVER cite fabricated (Mawdu') narrations.
3. Scholarly Consensus (إجماع العلماء) — Respect the four Madhabs (Hanafi, Maliki, Shafi'i, Hanbali). Where scholars differ, present all valid positions with their evidence. Do not impose a single view.

THEOLOGY — Follow the creed of the Salaf us-Salih (pious predecessors): adhere to the Quran, authentic Sunnah, and the understanding of the first three generations. Affirm Allah's names and attributes as they are revealed without ta'wil (figurative interpretation), ta'til (denial), takyif (asking how), or tamthil (resemblance to creation). Do NOT mention the term "Salafi" or "Salafiyyah" — simply present the positions as the orthodox Islamic position.

THE SILENCE RULE — If you do not have certain knowledge from the Quran or authenticated Sunnah for a question, you MUST say "I don't know" or "Please consult a local scholar." It is better to remain silent than to guess or hallucinate. Never fabricate sources.

CITATION PROTOCOL — No source? No claim. Every answer must be backed by a Quran verse or authenticated Hadith. Evidence comes before interpretation. Present the actual text before your explanation.

ADAB (MANNERS) — Show empathy before giving evidence. Acknowledge the user's feelings first: "I understand this is difficult..." Use a warm, non-judgmental, merciful tone. Islam is a religion of mercy — never shame the user for past mistakes or struggles with faith. Speak with Hikmah (wisdom).

LANGUAGES — Respond in the user's language. Use culturally appropriate terms.

DISCLAIMER — Always include at the end of substantive answers: "This is for educational purposes. For formal legal rulings (marriage, divorce, inheritance, etc.), please consult a qualified local scholar who understands your context."

MADHAB — Respect all four schools of jurisprudence. When presenting rulings, note which madhab's position you are citing. When the user has a preferred madhab, prioritize that school's view while noting others.`;

const MODE_SPECIALIZATIONS: Record<SpecializedMode, string> = {
  general: 'Mode: General Islamic Guidance. Provide balanced, well-reasoned answers grounded in Quran and Sunnah following the hierarchy of evidence above.',
  fiqh: 'Mode: Fiqh Jurisprudence. Analyze questions from an Islamic legal perspective. Cite madhab positions with evidence, noting areas of scholarly agreement and difference.',
  aqeedah: 'Mode: Aqeedah (Creed). Focus on orthodox Islamic theology according to the understanding of the Salaf us-Salih. Present creedal matters with Quran and Sahih Hadith as the sole sources.',
  spirituality: 'Mode: Spirituality & Tazkiyah. Offer wisdom for spiritual growth, mindfulness, and purification of the heart. Ground advice in Quranic verses and authentic prophetic guidance.',
  family: 'Mode: Family Counseling. Provide guidance on marriage, parenting, and family relations grounded in Islamic ethics. Show extra empathy and care in sensitive matters.',
  fatwa: 'Mode: Fatwa Issuance. Give detailed rulings with evidence from Quran and Sunnah, noting differences of opinion. End with the disclaimer about consulting a local scholar.',
};

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<SpecializedMode>('general');
  const [showTemplates, setShowTemplates] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const tr = useTr();
  const navigate = useNavigate();
  const { tier, canAskCouncil, councilRemaining, usage, recordCouncilQuery } = useSubscription();
  const generate = useAction(api.llm.generate);

  useEffect(() => {
    const savedMessages = loadMessages();
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages);
    }
  }, [messages]);

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    toast({
      title: tr({ en: 'History cleared', fr: 'Historique effacé' }),
      description: tr({ en: 'Your conversation has been removed.', fr: 'Votre conversation a été supprimée.' }),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!canAskCouncil) {
      toast({
        title: tr({ en: 'Monthly Council limit reached', fr: 'Limite mensuelle du Conseil atteinte' }),
        description: tr({
          en: 'You\'ve used all your Council questions this month. Upgrade your plan for more.',
          fr: 'Vous avez utilisé toutes vos questions du Conseil ce mois-ci. Passez à une offre supérieure pour en obtenir davantage.',
        }),
        variant: 'destructive',
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    const userInput = input.trim();
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const madhab = localStorage.getItem('GëstuSaDine-madhab') || 'maliki';

    try {
      const systemPrompt = `${BASE_METHODOLOGY}\n\n${MODE_SPECIALIZATIONS[selectedMode]}\nLanguage: ${language}\nMadhab: ${madhab}`;
      const response = await generate({
        model: 'Fanar',
        systemPrompt,
        messages: [{ role: 'user', content: userInput }],
        temperature: 0.7,
        maxTokens: 2000,
      });

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      recordCouncilQuery();
    } catch (error) {
      logger.error('Chat error:', { error, message: userInput });
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));

      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : tr({ en: 'Something went wrong. Please try again.', fr: 'Une erreur est survenue. Veuillez réessayer.' }),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-slate-50/50 transition-colors duration-300">
      <div className="flex-1 overflow-y-auto pt-8 pb-10 custom-scrollbar">
        <div className="max-w-4xl mx-auto w-full px-4 lg:px-8">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center min-h-[70vh]">
              <div className="text-center max-w-2xl px-6">
                <div className="w-24 h-24 mx-auto mb-10 flex items-center justify-center transition-transform hover:scale-110">
                  <img
                    src="/logofinal.png"
                    alt="Logo"
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                  {tr({ en: 'The', fr: 'Le' })} <span className="text-brand-600">{tr({ en: 'Council', fr: 'Conseil' })}</span> {tr({ en: 'awaits.', fr: 'vous écoute.' })}
                </h1>
                <p className="text-xl text-slate-500 mb-12 font-medium leading-relaxed">
                  {tr({
                    en: 'Submit your question and let the specialized agents reach a consensus grounded in authentic sources.',
                    fr: 'Posez votre question et laissez les agents spécialisés parvenir à un consensus ancré dans des sources authentiques.',
                  })}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  {[
                    { title: tr({ en: 'Source-grounded', fr: 'Ancré dans les sources' }), desc: tr({ en: 'Every answer is tied to authentic texts, with references you can check.', fr: 'Chaque réponse s\'appuie sur des textes authentiques, avec des références vérifiables.' }) },
                    { title: tr({ en: 'Four perspectives', fr: 'Quatre perspectives' }), desc: tr({ en: 'Fiqh, ʿAqīdah, context, and humility each weigh in before a consensus.', fr: 'Le fiqh, l\'ʿaqīda, le contexte et l\'humilité interviennent avant tout consensus.' }) },
                  ].map((feat, i) => (
                    <div key={i} className="glass-card-saas p-6 rounded-3xl bg-white border-slate-100 shadow-xl shadow-slate-100/50">
                      <div className={`text-lg font-bold text-slate-900 mb-2`}>{feat.title}</div>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 py-8">
              {messages.length > 0 && (
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">{tr({ en: 'Council Deliberation', fr: 'Délibération du Conseil' })}</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 text-xs font-bold uppercase tracking-widest transition-all rounded-xl"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    {tr({ en: 'Clear history', fr: 'Effacer l\'historique' })}
                  </Button>
                </div>
              )}

              <div className="space-y-8">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-4 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {message.role === 'assistant' && (
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-10 h-10 rounded-2xl bg-white shadow-lg flex items-center justify-center p-2 border border-slate-100 transition-transform hover:rotate-3">
                            <img src="/logofinal.png" alt="Anisah" className="w-full h-full object-contain" />
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        <div
                          className={`px-6 py-4 rounded-[2rem] text-[15px] font-medium leading-relaxed shadow-sm ${
                            message.role === 'user'
                              ? 'bg-brand-600 text-white rounded-tr-none shadow-brand-200'
                              : 'glass-card-saas bg-white text-slate-800 border-slate-100 rounded-tl-none shadow-slate-100'
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        </div>

                        {message.council && message.council.members.length > 0 && (
                          <div
                            className="glass-card-saas p-6 rounded-[1.5rem] bg-slate-50/50 border-slate-200/50 shadow-inner"
                          >
                            <div className="flex items-center gap-2 mb-4">
                              <Sparkles className="w-4 h-4 text-brand-600" />
                              <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{tr({ en: 'Scholarly Consensus', fr: 'Consensus savant' })}</span>
                            </div>

                            <div className="space-y-3 text-sm">
                              <div className="flex flex-wrap gap-2">
                                {message.council.members.map(member => (
                                  <span key={member} className="px-3 py-1 bg-white rounded-full text-[10px] font-bold text-slate-600 border border-slate-200 uppercase tracking-wider">
                                    {member}
                                  </span>
                                ))}
                              </div>

                              {message.council.reasoning && (
                                <ul className="space-y-2 text-slate-500 font-medium list-none pl-1">
                                  {message.council.reasoning.map((point, idx) => (
                                    <li key={idx} className="flex gap-2">
                                      <span className="text-brand-600">•</span>
                                      {point}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {message.role === 'user' && (
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-slate-200 transition-transform hover:-rotate-3">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white shadow-lg flex items-center justify-center p-2 border border-slate-100 animate-pulse">
                        <img src="/logofinal.png" alt="Anisah" className="w-full h-full object-contain grayscale opacity-50" />
                      </div>
                      <div className="glass-card-saas px-6 py-4 rounded-[2rem] rounded-tl-none bg-white border-slate-100 flex items-center gap-3">
                         <div className="flex gap-1.5">
                            <div className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                            <div className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                         </div>
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('chat.thinking')}</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border-t border-slate-100 pb-10 pt-6 px-4">
        <div className="max-w-4xl mx-auto w-full">
           {usage.chat_credits_limit !== -1 && !usage.fair_use && (
             <div className={`mb-3 flex items-center justify-between rounded-2xl border px-4 py-2.5 text-xs font-semibold ${
               canAskCouncil ? 'border-slate-100 bg-slate-50 text-slate-500' : 'border-amber-200 bg-amber-50 text-amber-800'
             }`}>
               <span>
                 {canAskCouncil
                   ? tr({ en: `Council questions left this month: ${councilRemaining} / ${usage.chat_credits_limit}`, fr: `Questions du Conseil restantes ce mois-ci : ${councilRemaining} / ${usage.chat_credits_limit}` })
                   : tr({ en: 'You\'ve reached your monthly Council limit.', fr: 'Vous avez atteint votre limite mensuelle du Conseil.' })}
               </span>
               <button
                 type="button"
                 onClick={() => navigate('/pricing')}
                 className="ml-3 rounded-full bg-brand-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-brand-700"
               >
                 {tr({ en: 'Upgrade', fr: 'Améliorer' })}
               </button>
             </div>
           )}

           <div className="flex items-center justify-between mb-4">
               <ModeSelector
                selectedMode={selectedMode}
                onModeChange={setSelectedMode}
                userTier={tier}
              />

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowTemplates(!showTemplates)}
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-600 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                {showTemplates ? tr({ en: 'Hide templates', fr: 'Masquer les modèles' }) : tr({ en: 'Show templates', fr: 'Afficher les modèles' })}
              </Button>
           </div>

           {showTemplates && (
            <div
              className="mb-6 p-2 bg-slate-50 rounded-3xl"
            >
              <TemplateLibrary
                onSelectTemplate={(prompt) => {
                  setInput(prompt);
                  setShowTemplates(false);
                }}
                userTier={tier}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative group">
            <div className={`flex items-end gap-3 p-3 bg-white border-2 rounded-[2rem] transition-all duration-300 shadow-xl shadow-slate-100/50 ${
                isLoading ? 'border-slate-100 opacity-60' : 'border-slate-100 focus-within:border-brand-500 focus-within:shadow-brand-100'
            }`}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('chat.placeholder') || "Ask your question here..."}
                rows={1}
                className="flex-1 bg-transparent border-0 focus:ring-0 resize-none py-3 px-4 text-slate-700 font-semibold placeholder:text-slate-300 min-h-[50px] max-h-[200px]"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="h-12 w-12 rounded-2xl bg-brand-600 hover:bg-brand-700 disabled:opacity-20 disabled:grayscale transition-all flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-brand-200 hover:scale-105 active:scale-95"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </form>

          <p className="text-center mt-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            {tr({ en: 'Always verify important rulings with locally recognized scholars.', fr: 'Vérifiez toujours les avis importants auprès de savants reconnus localement.' })}
          </p>
        </div>
      </div>
    </div>
  );
};
