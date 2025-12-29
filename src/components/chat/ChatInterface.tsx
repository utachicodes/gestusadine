import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiFetch } from '@/lib/api';
import { logger } from '@/lib/logger';

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

const STORAGE_KEY = 'xamsadine_chat_history';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { language, t } = useLanguage();

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
      title: 'History Cleared',
      description: 'Chat history has been cleared',
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
    const madhab = localStorage.getItem('xamsadine-madhab') || 'maliki';

    try {
      const response = await apiFetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ 
          message: userInput,
          language: language,
          madhab: madhab
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
    } catch (error) {
      logger.error('Chat error:', { error, message: userInput });
      
      // Remove the user message if the request failed
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
      
      toast({
        title: 'Error',
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
    <div className="flex-1 flex flex-col h-screen bg-[#efefec] dark:bg-slate-900">
      {/* Messages - Claude-inspired clean design */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center min-h-[60vh] px-4 dark:bg-slate-900">
              <div className="text-center max-w-2xl">
                <img 
                  src="/logo.png" 
                  alt="Anisah" 
                  className="h-16 w-auto object-contain mx-auto mb-8 brightness-110 dark:brightness-0 dark:invert"
                />
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-2">
                  {t('chat.welcome')}
                </h3>
                <p className="text-base text-gray-600 dark:text-slate-300 mb-8">
                  {t('chat.welcome.subtitle')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700">
                    <div className="font-medium text-gray-900 dark:text-slate-100 mb-1">{t('chat.feature1.title')}</div>
                    <p className="text-gray-600 dark:text-slate-400 text-xs">{t('chat.feature1.desc')}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700">
                    <div className="font-medium text-gray-900 dark:text-slate-100 mb-1">{t('chat.feature2.title')}</div>
                    <p className="text-gray-600 dark:text-slate-400 text-xs">{t('chat.feature2.desc')}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700">
                    <div className="font-medium text-gray-900 dark:text-slate-100 mb-1">{t('chat.feature3.title')}</div>
                    <p className="text-gray-600 dark:text-slate-400 text-xs">{t('chat.feature3.desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-6">
              {messages.length > 0 && (
                <div className="flex justify-end mb-4 px-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="text-gray-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 text-xs"
                  >
                    <Trash2 className="h-3 w-3 mr-1.5" />
                    {t('chat.clear_history')}
                  </Button>
                </div>
              )}
              <div className="space-y-1">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`group px-4 py-4 hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors ${
                      message.role === 'user' ? 'bg-gray-50/30 dark:bg-slate-800/30' : 'dark:bg-slate-900'
                    }`}
                  >
                    <div className="max-w-3xl mx-auto flex gap-4">
                      {message.role === 'assistant' && (
                        <div className="flex-shrink-0 mt-1">
                          <img 
                            src="/logo.png" 
                            alt="Anisah" 
                            className="h-8 w-8 object-contain brightness-110 dark:brightness-0 dark:invert"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="prose prose-sm max-w-none">
                          <div className="whitespace-pre-wrap leading-relaxed text-[15px] text-gray-900 dark:text-slate-100">
                            {message.content}
                          </div>
                          {message.council && message.council.members.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                              <div className="text-xs font-semibold mb-2 text-gray-700 dark:text-slate-300">
                                {t('chat.council_consensus')}
                              </div>
                              <div className="text-xs space-y-2 text-gray-600 dark:text-slate-300">
                                <div>
                                  <strong className="dark:text-slate-200">{t('chat.council_members')}:</strong> <span className="dark:text-slate-300">{message.council.members.join(', ')}</span>
                                </div>
                                {message.council.reasoning && message.council.reasoning.length > 0 && (
                                  <div>
                                    <strong className="dark:text-slate-200">{t('chat.council_reasoning')}:</strong>
                                    <ul className="list-disc list-inside ml-2 mt-1 space-y-1 dark:text-slate-300">
                                      {message.council.reasoning.map((point, idx) => (
                                        <li key={idx}>{point}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {message.role === 'user' && (
                        <div className="flex-shrink-0 mt-1">
                          <div className="h-8 w-8 rounded-full bg-islamic-primary-green flex items-center justify-center text-white text-sm font-medium">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="group px-4 py-4 hover:bg-gray-50/50 dark:hover:bg-slate-800/50 dark:bg-slate-900 transition-colors">
                    <div className="max-w-3xl mx-auto flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <img 
                          src="/logo.png" 
                          alt="XamSaDine AI" 
                          className="h-8 w-8 object-contain brightness-110 dark:brightness-0 dark:invert"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="h-1.5 w-1.5 bg-gray-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="h-1.5 w-1.5 bg-gray-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="h-1.5 w-1.5 bg-gray-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-slate-400">{t('chat.thinking')}</span>
                        </div>
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

      {/* Input - Claude-inspired */}
      <div className="border-t border-gray-200 dark:border-slate-700 bg-[#efefec] dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-end gap-2 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 focus-within:border-islamic-primary-green focus-within:ring-1 focus-within:ring-islamic-primary-green/20 transition-all">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('chat.placeholder')}
                className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[52px] text-[15px] px-4 text-gray-900 dark:text-slate-100 placeholder:text-gray-500 dark:placeholder:text-slate-400"
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
                className="m-2 h-8 w-8 rounded-lg bg-islamic-primary-green hover:bg-islamic-primary-green/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="h-4 w-4 text-white" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

