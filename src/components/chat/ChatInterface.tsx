import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiFetch } from '@/lib/api';
import { logger } from '@/lib/logger';
import { ModeSelector, SpecializedMode } from './ModeSelector';
import { TemplateLibrary } from './TemplateLibrary';

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

// Helper functions for localStorage
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

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<SpecializedMode>('general');
  const [userTier, setUserTier] = useState<'free' | 'core' | 'pro'>('free');
  const [showTemplates, setShowTemplates] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { language, t } = useLanguage();

  // Fetch user tier on mount
  useEffect(() => {
    const fetchUserTier = async () => {
      try {
        const response = await apiFetch('/api/subscription/me');
        const data = await response.json();
        setUserTier(data.subscription?.tier || 'free');
      } catch (error) {
        logger.error('Failed to fetch user tier:', { error });
      }
    };
    if (user) {
      fetchUserTier();
    }
  }, [user]);

  // Load message history on mount
  useEffect(() => {
    const savedMessages = loadMessages();
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    }
  }, []);

  // Save messages whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages);
    }
  }, [messages]);

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    toast({
      title: t('chat.history_cleared'),
      description: t('chat.history_cleared_desc'),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

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

    // Get madhab from localStorage
    const madhab = localStorage.getItem('GëstuSaDine-madhab') || 'maliki';

    try {
      const response = await apiFetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: userInput,
          language: language,
          madhab: madhab,
          mode: selectedMode, // Include selected mode
        }),
      });

      const data = await response.json();

      if (!data.response) {
        throw new Error('Invalid response from server');
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: data.response,
        role: 'assistant',
        timestamp: new Date(),
        council: data.council,
      };

      setMessages(prev => [...prev, botMessage]);

      // Track credit usage
      try {
        await apiFetch('/api/subscription/track-usage', {
          method: 'POST',
        });
      } catch (trackError) {
        logger.warn('Failed to track usage:', { trackError });
      }
    } catch (error) {
      logger.error('Chat error:', { error, message: userInput });

      // Remove the user message if the request failed
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));

      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('chat.error'),
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
    <div className="flex-1 flex flex-col h-screen bg-slate-50/50 transition-colors duration-300">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto pt-20 pb-10 custom-scrollbar">
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
                  The <span className="text-brand-600">Council</span> awaits.
                </h1>
                <p className="text-xl text-slate-500 mb-12 font-medium leading-relaxed">
                  Submit your inquiry and let our specialized agents formulate a consensus based on authentic sources.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  {[
                    { title: t('chat.feature1.title'), desc: t('chat.feature1.desc'), color: 'brand' },
                    { title: t('chat.feature3.title'), desc: t('chat.feature3.desc'), color: 'blue' }
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
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Council Deliberation</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 text-xs font-bold uppercase tracking-widest transition-all rounded-xl"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    {t('chat.clear_history')}
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
                              <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Scholarly Consensus</span>
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

      {/* Input area */}
      <div className="bg-white/80 backdrop-blur-xl border-t border-slate-100 pb-10 pt-6 px-4">
        <div className="max-w-4xl mx-auto w-full">
           <div className="flex items-center justify-between mb-4">
               <ModeSelector
                selectedMode={selectedMode}
                onModeChange={setSelectedMode}
                userTier={userTier}
              />

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowTemplates(!showTemplates)}
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-600 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                {showTemplates ? 'Hide' : 'Show'} templates
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
                userTier={userTier}
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
            Always verify important rulings with locally recognized scholars.
          </p>
        </div>
      </div>
    </div>
  );
};

