import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Trash2, AlertTriangle, Plus, MessageSquare, X, PanelLeftClose, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { logger } from '@/lib/logger';
import { useTr } from '@/lib/i18n';
import { getErrorMessage } from '@/types/errors';
import { useSubscription } from '@/data/subscription';
import { verifyCitations, type CitationWarning } from '@/lib/verifyCitations';
import { api } from '../../../convex/_generated/api';
import { useAction, useQuery, useMutation } from 'convex/react';
import type { Id } from '../../../convex/_generated/dataModel';

interface LocalMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  citationWarnings?: CitationWarning[];
}

const IDENTITY_LEAK_PATTERNS = [
  /\b(i'?m\s+(a|an)\s+(gpt|gemma|llama|claude|bard|deepseek|mistral|fanar|ai|chatbot|language model))\b/i,
  /\b(openai|anthropic|meta ai|qatar computing)\s+(made|created|built|developed|trained)\s+(me|this|the model)\b/i,
];

const IDENTITY_FALLBACK = "I'm GëstuSaDine, an Islamic chatbot. Ask me about Islam!";

function leaksIdentity(response: string): boolean {
  return IDENTITY_LEAK_PATTERNS.some(p => p.test(response));
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + '...' : text;
}

export const ChatInterface = () => {
  const [activeConversationId, setActiveConversationId] = useState<Id<'conversations'> | null>(null);
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { language } = useLanguage();
  const tr = useTr();
  const navigate = useNavigate();
  const { canAskCouncil, hourlyRemaining, dailyRemaining, hourlyLimit, dailyLimit } = useSubscription();
  const generate = useAction(api.llm.generate);

  const conversations = useQuery(api.conversations.listByUser);
  const serverMessages = useQuery(
    api.conversations.getMessages,
    activeConversationId ? { conversationId: activeConversationId } : 'skip'
  );
  const createConversation = useMutation(api.conversations.create);
  const addMessage = useMutation(api.conversations.addMessage);
  const deleteConversation = useMutation(api.conversations.remove);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (serverMessages) {
      setMessages(
        serverMessages.map((m) => ({
          id: m._id,
          content: m.content,
          role: m.role,
          timestamp: new Date(m.createdAt),
        }))
      );
    }
  }, [serverMessages]);

  const handleNewConversation = useCallback(async () => {
    setActiveConversationId(null);
    setMessages([]);
    inputRef.current?.focus();
  }, []);

  const handleSelectConversation = useCallback((id: Id<'conversations'>) => {
    setActiveConversationId(id);
  }, []);

  const handleDeleteConversation = useCallback(async (id: Id<'conversations'>) => {
    await deleteConversation({ conversationId: id });
    if (activeConversationId === id) {
      setActiveConversationId(null);
      setMessages([]);
    }
    toast({
      title: tr({ en: 'Conversation deleted', fr: 'Conversation supprimée' }),
      description: tr({ en: 'The conversation has been removed.', fr: 'La conversation a été supprimée.' }),
    });
  }, [activeConversationId, deleteConversation, toast, tr]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!canAskCouncil) {
      toast({
        title: tr({ en: 'Monthly limit reached', fr: 'Limite mensuelle atteinte' }),
        description: tr({
          en: "You've used all your questions this month. Upgrade for more.",
          fr: 'Vous avez utilisé toutes vos questions ce mois-ci. Passez à une offre supérieure.',
        }),
        variant: 'destructive',
      });
      return;
    }

    const userInput = input.trim();
    setInput('');
    setIsLoading(true);

    const VALID_MADHABS = ['general', 'hanafi', 'maliki', 'shafii', 'hanbali'] as const;
    type Madhab = (typeof VALID_MADHABS)[number];
    const rawMadhab = localStorage.getItem('GëstuSaDine-madhab') ?? '';
    const madhab: Madhab | undefined = (VALID_MADHABS as readonly string[]).includes(rawMadhab)
      ? (rawMadhab as Madhab)
      : undefined;

    const userMessage: LocalMessage = {
      id: `local-${Date.now()}`,
      content: userInput,
      role: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const response = await generate({
        messages: [...history, { role: 'user', content: userInput }],
        language,
        madhab,
      });

      const finalContent = leaksIdentity(response) ? IDENTITY_FALLBACK : response;
      const citationWarnings = verifyCitations(finalContent);

      const botMessage: LocalMessage = {
        id: `bot-${Date.now()}`,
        content: finalContent,
        role: 'assistant',
        timestamp: new Date(),
        citationWarnings: citationWarnings.length > 0 ? citationWarnings : undefined,
      };

      setMessages((prev) => [...prev, botMessage]);

      let conversationId = activeConversationId;
      if (!conversationId) {
        const title = truncate(userInput, 60);
        conversationId = await createConversation({ title });
        setActiveConversationId(conversationId);
      }

      await addMessage({ conversationId, role: 'user', content: userInput });
      await addMessage({ conversationId, role: 'assistant', content: finalContent });
    } catch (error) {
      logger.error('Chat error:', { error, message: userInput });
      const displayMsg = getErrorMessage(
        error,
        tr({ en: 'Sorry, something went wrong. Please try again.', fr: 'Désolé, une erreur est survenue. Veuillez réessayer.' })
      );
      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== userMessage.id),
        {
          id: `err-${Date.now()}`,
          content: displayMsg,
          role: 'assistant',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full">
      {sidebarOpen && (
        <div className="w-72 border-r border-border/60 bg-muted/20 flex flex-col flex-shrink-0">
          <div className="p-3 border-b border-border/60">
            <Button variant="outline" size="sm" className="w-full" onClick={handleNewConversation}>
              <Plus className="h-4 w-4 mr-2" />
              {tr({ en: 'New conversation', fr: 'Nouvelle conversation' })}
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {conversations && conversations.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-8 px-4">
                {tr({ en: 'No conversations yet. Start one below.', fr: 'Aucune conversation. Commencez-en une.' })}
              </p>
            )}
            {conversations?.map((conv) => (
              <div
                key={conv._id}
                className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-sm ${
                  activeConversationId === conv._id
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted/60'
                }`}
                onClick={() => handleSelectConversation(conv._id)}
              >
                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                <span className="truncate flex-1">{conv.title}</span>
                <button
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConversation(conv._id);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/60">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="h-8 w-8 p-0"
            >
              {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <img src="/logofinal.png" alt="Logo" className="w-4 h-4 object-contain" />
              </div>
              <span className="text-sm font-semibold text-foreground">GëstuSaDine</span>
            </div>
          </div>
          {activeConversationId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteConversation(activeConversationId)}
              className="text-muted-foreground hover:text-destructive text-xs"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              {tr({ en: 'Delete', fr: 'Supprimer' })}
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-3xl mx-auto w-full px-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 mb-6">
                  <img src="/logofinal.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <h1 className="text-2xl font-semibold text-foreground mb-2">
                  {tr({ en: 'What can I help you with?', fr: 'En quoi puis-je vous aider ?' })}
                </h1>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  {tr({
                    en: "Ask any question about Islam — creed, jurisprudence, spirituality, or daily life.",
                    fr: "Posez toute question sur l'islam — croyance, jurisprudence, spiritualité ou vie quotidienne.",
                  })}
                </p>
                <div className="flex flex-wrap gap-2 mt-6 max-w-md justify-center">
                  {[
                    { en: 'What is the ruling on music?', fr: 'Quel est l\'avis sur la musique ?' },
                    { en: 'Quote Ayat al-Kursi', fr: 'Cite Ayat al-Kursi' },
                    { en: 'Du\'a for entering the mosque', fr: 'Du\'a pour entrer à la mosquée' },
                  ].map((q) => (
                    <button
                      key={q.en}
                      type="button"
                      onClick={() => { setInput(q[language === 'fr' ? 'fr' : 'en']); inputRef.current?.focus(); }}
                      className="px-3 py-1.5 text-xs rounded-full border border-border bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      {q[language === 'fr' ? 'fr' : 'en']}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-6 space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {message.role === 'assistant' && (
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <img src="/logofinal.png" alt="Logo" className="w-4 h-4 object-contain" />
                          </div>
                        </div>
                      )}

                      <div
                        className={`px-4 py-3 text-sm leading-relaxed ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm'
                            : 'bg-secondary text-secondary-foreground rounded-2xl rounded-tl-sm'
                        }`}
                      >
                        {message.role === 'assistant' ? (
                          <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-strong:font-semibold prose-em:italic">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        )}
                      </div>

                      {message.role === 'assistant' && message.citationWarnings && message.citationWarnings.length > 0 && (
                        <div className="mt-2 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700 px-3 py-2 text-xs space-y-1.5">
                          <div className="flex items-center gap-1.5 font-semibold text-amber-800 dark:text-amber-200">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>{tr({ en: 'Unverified citation warning', fr: 'Citation non vérifiée' })}</span>
                          </div>
                          {message.citationWarnings.map((w, i) => (
                            <div key={i} className="text-amber-700 dark:text-amber-300">
                              <span className="font-mono font-semibold">{w.text}</span>
                              <span className="mx-1">&mdash;</span>
                              <span>{w.detail}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {message.role === 'user' && (
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-8 h-8 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs font-semibold text-muted-foreground">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <img src="/logofinal.png" alt="Logo" className="w-4 h-4 object-contain" />
                        </div>
                      </div>
                      <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3">
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                          <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border/60 bg-background">
          <div className="max-w-3xl mx-auto w-full px-4 py-4">
            <div className={`mb-3 flex items-center justify-between rounded-xl border px-4 py-2 text-xs font-medium ${
              canAskCouncil ? 'border-border bg-muted/50 text-muted-foreground' : 'border-amber-200 bg-amber-50 text-amber-800'
            }`}>
              <span>
                {canAskCouncil
                  ? tr({ en: `${hourlyRemaining}/${hourlyLimit} this hour · ${dailyRemaining}/${dailyLimit} today`, fr: `${hourlyRemaining}/${hourlyLimit} cette heure · ${dailyRemaining}/${dailyLimit} aujourd'hui` })
                  : tr({ en: 'Rate limit reached. Please wait a moment.', fr: 'Limite atteinte. Veuillez patienter.' })}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="relative">
              <div className={`flex items-end gap-2 rounded-2xl border bg-muted/30 px-4 py-3 transition-colors ${
                isLoading ? 'opacity-60' : 'focus-within:border-primary/50'
              }`}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={tr({ en: 'Ask a question...', fr: 'Posez une question...' })}
                  rows={1}
                  className="flex-1 bg-transparent border-0 focus:ring-0 resize-none py-1 text-base text-foreground placeholder:text-muted-foreground min-h-[24px] max-h-[200px] outline-none"
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
                  className="h-9 w-9 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-30 transition-all flex items-center justify-center flex-shrink-0 text-primary-foreground"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </form>

            <p className="text-center mt-3 text-[10px] text-muted-foreground">
              {tr({ en: 'Always verify important rulings with a qualified scholar.', fr: "Vérifiez toujours les avis importants auprès d'un savant qualifié." })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
