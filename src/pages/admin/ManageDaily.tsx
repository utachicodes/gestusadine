import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Plus, Edit, Trash2, Sparkles, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { apiFetch } from '@/lib/api';

interface DailyAyah {
  id?: string;
  reference: string;
  arabic: string;
  translation_en: string;
  translation_fr: string;
  translation_wo: string;
}

interface DailyDua {
  id?: string;
  arabic: string;
  translation_en: string;
  translation_fr: string;
  translation_wo: string;
}

interface DailyFact {
  id?: string;
  fact_en: string;
  fact_fr: string;
  fact_wo: string;
}

interface QuizQuestion {
  id?: string;
  language: 'en' | 'fr' | 'wo';
  difficulty: 'easy' | 'medium' | 'advanced';
  question: string;
  options: string[];
  correct: string;
  hint: string;
}

export default function ManageDaily() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'ayah' | 'dua' | 'fact' | 'quiz'>('ayah');
  const [ayahs, setAyahs] = useState<DailyAyah[]>([]);
  const [duas, setDuas] = useState<DailyDua[]>([]);
  const [facts, setFacts] = useState<DailyFact[]>([]);
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [ayahForm, setAyahForm] = useState<DailyAyah>({
    reference: '',
    arabic: '',
    translation_en: '',
    translation_fr: '',
    translation_wo: '',
  });

  const [duaForm, setDuaForm] = useState<DailyDua>({
    arabic: '',
    translation_en: '',
    translation_fr: '',
    translation_wo: '',
  });

  const [factForm, setFactForm] = useState<DailyFact>({
    fact_en: '',
    fact_fr: '',
    fact_wo: '',
  });

  const [quizForm, setQuizForm] = useState<QuizQuestion>({
    language: 'en',
    difficulty: 'easy',
    question: '',
    options: ['', '', ''],
    correct: '',
    hint: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Load today's content or most recent
      const { data: content, error } = await supabase
        .from('daily_content')
        .select('*')
        .order('date', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Separate by content type
      const ayahsData = (content || [])
        .filter(c => c.content_type === 'ayah')
        .map(c => ({
          id: c.id,
          reference: c.reference || '',
          arabic: c.arabic || '',
          translation_en: c.translation_en || '',
          translation_fr: c.translation_fr || '',
          translation_wo: c.translation_wo || '',
        }));

      const duasData = (content || [])
        .filter(c => c.content_type === 'dua')
        .map(c => ({
          id: c.id,
          arabic: c.arabic || '',
          translation_en: c.translation_en || '',
          translation_fr: c.translation_fr || '',
          translation_wo: c.translation_wo || '',
        }));

      const factsData = (content || [])
        .filter(c => c.content_type === 'fact')
        .map(c => ({
          id: c.id,
          fact_en: c.fact_en || '',
          fact_fr: c.fact_fr || '',
          fact_wo: c.fact_wo || '',
        }));

      const quizzesData = (content || [])
        .filter(c => c.content_type === 'quiz')
        .map(c => ({
          id: c.id,
          language: c.language || 'en',
          difficulty: c.difficulty || 'easy',
          question: c.question || '',
          options: Array.isArray(c.options) ? c.options : [],
          correct: c.correct || '',
          hint: c.hint || '',
        }));

      setAyahs(ayahsData);
      setDuas(duasData);
      setFacts(factsData);
      setQuizzes(quizzesData);
    } catch (error: any) {
      console.error('Failed to load daily content:', error);
      toast.error('Failed to load daily content');
    } finally {
      setLoading(false);
    }
  };

  const handleAyahSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const today = new Date().toISOString().split('T')[0];
      const contentData = {
        content_type: 'ayah',
        date: today,
        reference: ayahForm.reference,
        arabic: ayahForm.arabic,
        translation_en: ayahForm.translation_en,
        translation_fr: ayahForm.translation_fr,
        translation_wo: ayahForm.translation_wo,
      };

      if (editingId) {
        const { error } = await supabase
          .from('daily_content')
          .update(contentData)
          .eq('id', editingId);
        if (error) throw error;
        toast.success('Ayah updated successfully');
      } else {
        const { error } = await supabase
          .from('daily_content')
          .insert([contentData]);
        if (error) throw error;
        toast.success('Ayah added successfully');
      }
      await loadData();
      setIsCreating(false);
      setEditingId(null);
      setAyahForm({ reference: '', arabic: '', translation_en: '', translation_fr: '', translation_wo: '' });
    } catch (error: any) {
      console.error('Failed to save ayah:', error);
      toast.error(error.message || 'Failed to save ayah');
    }
  };

  const handleDuaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setDuas(duas.map(d => d.id === editingId ? { ...duaForm, id: editingId } : d));
      toast.success('Dua updated successfully');
    } else {
      setDuas([...duas, { ...duaForm, id: Date.now().toString() }]);
      toast.success('Dua added successfully');
    }
    setIsCreating(false);
    setEditingId(null);
    setDuaForm({ arabic: '', translation_en: '', translation_fr: '', translation_wo: '' });
  };

  const handleFactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setFacts(facts.map(f => f.id === editingId ? { ...factForm, id: editingId } : f));
      toast.success('Fact updated successfully');
    } else {
      setFacts([...facts, { ...factForm, id: Date.now().toString() }]);
      toast.success('Fact added successfully');
    }
    setIsCreating(false);
    setEditingId(null);
    setFactForm({ fact_en: '', fact_fr: '', fact_wo: '' });
  };

  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const today = new Date().toISOString().split('T')[0];
      const contentData = {
        content_type: 'quiz',
        date: today,
        language: quizForm.language,
        difficulty: quizForm.difficulty,
        question: quizForm.question,
        options: quizForm.options,
        correct: quizForm.correct,
        hint: quizForm.hint,
      };

      if (editingId) {
        const { error } = await supabase
          .from('daily_content')
          .update(contentData)
          .eq('id', editingId);
        if (error) throw error;
        toast.success('Quiz updated successfully');
      } else {
        const { error } = await supabase
          .from('daily_content')
          .insert([contentData]);
        if (error) throw error;
        toast.success('Quiz added successfully');
      }
      await loadData();
      setIsCreating(false);
      setEditingId(null);
      setQuizForm({ language: 'en', difficulty: 'easy', question: '', options: ['', '', ''], correct: '', hint: '' });
    } catch (error: any) {
      console.error('Failed to save quiz:', error);
      toast.error(error.message || 'Failed to save quiz');
    }
  };

  const handleDelete = async (type: 'ayah' | 'dua' | 'fact' | 'quiz', id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const { error } = await supabase
        .from('daily_content')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadData();
      toast.success('Item deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete item:', error);
      toast.error('Failed to delete item');
    }
  };

  const handleEdit = (type: 'ayah' | 'dua' | 'fact' | 'quiz', item: any) => {
    setEditingId(item.id);
    setIsCreating(true);
    if (type === 'ayah') setAyahForm(item);
    if (type === 'dua') setDuaForm(item);
    if (type === 'fact') setFactForm(item);
    if (type === 'quiz') setQuizForm(item);
  };

  const tabs = [
    { id: 'ayah' as const, label: 'Ayahs', icon: BookOpen },
    { id: 'dua' as const, label: 'Duas', icon: Sparkles },
    { id: 'fact' as const, label: 'Facts', icon: HelpCircle },
    { id: 'quiz' as const, label: 'Quizzes', icon: HelpCircle },
  ];

  return (
    <div className="flex-1">
      <section className="container py-10 md:py-16 space-y-10">
        <header className="flex justify-between items-center">
          <div>
            <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-islamic-dark/60 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-islamic-gold mr-2" />
              Admin
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-islamic-dark">
              Manage <span className="text-gradient">Daily Content</span>
            </h1>
          </div>
          <Button
            onClick={() => {
              setIsCreating(true);
              setEditingId(null);
            }}
            className="btn-islamic"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-islamic-cream/50">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsCreating(false);
                  setEditingId(null);
                }}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-islamic-green-600 text-islamic-green-600 font-semibold'
                    : 'border-transparent text-islamic-dark/60 hover:text-islamic-dark'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form */}
        {isCreating && (
          <Card className="bg-[#efefec]/90 backdrop-blur-sm border border-islamic-gold/30">
            <CardHeader>
              <CardTitle>
                {editingId ? 'Edit' : 'Add New'} {tabs.find(t => t.id === activeTab)?.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeTab === 'ayah' && (
                <form onSubmit={handleAyahSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Reference</label>
                    <Input
                      value={ayahForm.reference}
                      onChange={(e) => setAyahForm({ ...ayahForm, reference: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Arabic Text</label>
                    <Input
                      value={ayahForm.arabic}
                      onChange={(e) => setAyahForm({ ...ayahForm, arabic: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">English Translation</label>
                    <Input
                      value={ayahForm.translation_en}
                      onChange={(e) => setAyahForm({ ...ayahForm, translation_en: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">French Translation</label>
                    <Input
                      value={ayahForm.translation_fr}
                      onChange={(e) => setAyahForm({ ...ayahForm, translation_fr: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Wolof Translation</label>
                    <Input
                      value={ayahForm.translation_wo}
                      onChange={(e) => setAyahForm({ ...ayahForm, translation_wo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="btn-islamic">Save</Button>
                    <Button type="button" variant="outline" onClick={() => {
                      setIsCreating(false);
                      setEditingId(null);
                    }}>Cancel</Button>
                  </div>
                </form>
              )}

              {activeTab === 'dua' && (
                <form onSubmit={handleDuaSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Arabic Text</label>
                    <Input
                      value={duaForm.arabic}
                      onChange={(e) => setDuaForm({ ...duaForm, arabic: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">English Translation</label>
                    <Input
                      value={duaForm.translation_en}
                      onChange={(e) => setDuaForm({ ...duaForm, translation_en: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">French Translation</label>
                    <Input
                      value={duaForm.translation_fr}
                      onChange={(e) => setDuaForm({ ...duaForm, translation_fr: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Wolof Translation</label>
                    <Input
                      value={duaForm.translation_wo}
                      onChange={(e) => setDuaForm({ ...duaForm, translation_wo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="btn-islamic">Save</Button>
                    <Button type="button" variant="outline" onClick={() => {
                      setIsCreating(false);
                      setEditingId(null);
                    }}>Cancel</Button>
                  </div>
                </form>
              )}

              {activeTab === 'fact' && (
                <form onSubmit={handleFactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">English Fact</label>
                    <Input
                      value={factForm.fact_en}
                      onChange={(e) => setFactForm({ ...factForm, fact_en: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">French Fact</label>
                    <Input
                      value={factForm.fact_fr}
                      onChange={(e) => setFactForm({ ...factForm, fact_fr: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Wolof Fact</label>
                    <Input
                      value={factForm.fact_wo}
                      onChange={(e) => setFactForm({ ...factForm, fact_wo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="btn-islamic">Save</Button>
                    <Button type="button" variant="outline" onClick={() => {
                      setIsCreating(false);
                      setEditingId(null);
                    }}>Cancel</Button>
                  </div>
                </form>
              )}

              {activeTab === 'quiz' && (
                <form onSubmit={handleQuizSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Language</label>
                    <select
                      value={quizForm.language}
                      onChange={(e) => setQuizForm({ ...quizForm, language: e.target.value as 'en' | 'fr' | 'wo' })}
                      className="w-full px-3 py-2 border border-islamic-cream rounded-lg"
                    >
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="wo">Wolof</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Difficulty</label>
                    <select
                      value={quizForm.difficulty}
                      onChange={(e) => setQuizForm({ ...quizForm, difficulty: e.target.value as 'easy' | 'medium' | 'advanced' })}
                      className="w-full px-3 py-2 border border-islamic-cream rounded-lg"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Question</label>
                    <Input
                      value={quizForm.question}
                      onChange={(e) => setQuizForm({ ...quizForm, question: e.target.value })}
                      required
                    />
                  </div>
                  {quizForm.options.map((opt, idx) => (
                    <div key={idx}>
                      <label className="block text-sm font-medium mb-2">Option {idx + 1}</label>
                      <Input
                        value={opt}
                        onChange={(e) => {
                          const newOptions = [...quizForm.options];
                          newOptions[idx] = e.target.value;
                          setQuizForm({ ...quizForm, options: newOptions });
                        }}
                        required
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium mb-2">Correct Answer</label>
                    <Input
                      value={quizForm.correct}
                      onChange={(e) => setQuizForm({ ...quizForm, correct: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hint</label>
                    <Input
                      value={quizForm.hint}
                      onChange={(e) => setQuizForm({ ...quizForm, hint: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="btn-islamic">Save</Button>
                    <Button type="button" variant="outline" onClick={() => {
                      setIsCreating(false);
                      setEditingId(null);
                    }}>Cancel</Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        )}

        {/* List */}
        <div className="space-y-4">
          {activeTab === 'ayah' && ayahs.map(ayah => (
            <Card key={ayah.id} className="bg-[#efefec]/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-islamic-dark mb-2">{ayah.reference}</h3>
                    <p className="font-arabic text-xl text-islamic-dark/90 mb-2 text-right">{ayah.arabic}</p>
                    <p className="text-sm text-islamic-dark/70">{ayah[`translation_${language}` as keyof DailyAyah]}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleEdit('ayah', ayah)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete('ayah', ayah.id!)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {activeTab === 'dua' && duas.map(dua => (
            <Card key={dua.id} className="bg-[#efefec]/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-arabic text-xl text-islamic-dark/90 mb-2 text-right">{dua.arabic}</p>
                    <p className="text-sm text-islamic-dark/70">{dua[`translation_${language}` as keyof DailyDua]}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleEdit('dua', dua)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete('dua', dua.id!)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {activeTab === 'fact' && facts.map(fact => (
            <Card key={fact.id} className="bg-[#efefec]/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-islamic-dark/70">{fact[`fact_${language}` as keyof DailyFact]}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleEdit('fact', fact)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete('fact', fact.id!)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {activeTab === 'quiz' && quizzes.map(quiz => (
            <Card key={quiz.id} className="bg-[#efefec]/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-2">
                      <span className="text-xs px-2 py-1 bg-islamic-green/10 text-islamic-green-600 rounded">{quiz.language}</span>
                      <span className="text-xs px-2 py-1 bg-islamic-gold/10 text-islamic-gold rounded">{quiz.difficulty}</span>
                    </div>
                    <h3 className="font-semibold text-islamic-dark mb-2">{quiz.question}</h3>
                    <ul className="text-sm text-islamic-dark/70 space-y-1">
                      {quiz.options.map((opt, idx) => (
                        <li key={idx}>• {opt} {opt === quiz.correct && '(Correct)'}</li>
                      ))}
                    </ul>
                    <p className="text-xs text-islamic-dark/60 mt-2">Hint: {quiz.hint}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleEdit('quiz', quiz)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete('quiz', quiz.id!)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

