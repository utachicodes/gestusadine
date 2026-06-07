import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { format, isToday, isSameDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Plus, Search, Calendar, BarChart2,
  Flame, ChevronLeft, ChevronRight, Trash2, Edit3, X, Check,
  Sun,
} from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/PageHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Id } from '../../../convex/_generated/dataModel';

// ── Mood config ───────────────────────────────────────────────────────────────

const MOODS = [
  { key: 'grateful', emoji: '🤲', label: 'Grateful', labelFr: 'Reconnaissant', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { key: 'happy', emoji: '😊', label: 'Happy', labelFr: 'Heureux', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { key: 'calm', emoji: '🧘', label: 'Calm', labelFr: 'Calme', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { key: 'hopeful', emoji: '✨', label: 'Hopeful', labelFr: 'Plein d\'espoir', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { key: 'tired', emoji: '😴', label: 'Tired', labelFr: 'Fatigué', color: 'bg-stone-100 text-stone-600 border-stone-200' },
  { key: 'anxious', emoji: '😟', label: 'Anxious', labelFr: 'Anxieux', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { key: 'sad', emoji: '😔', label: 'Sad', labelFr: 'Triste', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  { key: 'angry', emoji: '😤', label: 'Frustrated', labelFr: 'Frustré', color: 'bg-red-100 text-red-800 border-red-200' },
] as const;

type MoodKey = (typeof MOODS)[number]['key'];

const TEMPLATES = [
  {
    key: 'free',
    label: 'Free write',
    labelFr: 'Écriture libre',
    icon: '✏️',
    prompt: '',
  },
  {
    key: 'gratitude',
    label: 'Gratitude',
    labelFr: 'Gratitude',
    icon: '🤲',
    prompt: `Today I am grateful for:\n1. \n2. \n3. \n\nA blessing I noticed today:\n\nA dua I want to make:\n`,
  },
  {
    key: 'reflection',
    label: 'Reflection',
    labelFr: 'Réflexion',
    icon: '🌙',
    prompt: `What I did today:\n\nWhat went well:\n\nWhat I want to improve:\n\nLesson I learned:\n`,
  },
  {
    key: 'daily',
    label: 'Daily check-in',
    labelFr: 'Bilan quotidien',
    icon: '☀️',
    prompt: `Mood today: \n\nMy intention for the day:\n\nWhat I want to accomplish:\n\nOne thing I am looking forward to:\n`,
  },
] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

function getMood(key: string | undefined) {
  return MOODS.find((m) => m.key === key);
}

function startOfDayUTC(date: Date): number {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d.getTime();
}

// ── Sub-components ────────────────────────────────────────────────────────────

const MoodPicker = ({ value, onChange, language }: {
  value: string | undefined;
  onChange: (mood: string | undefined) => void;
  language: string;
}) => (
  <div className="flex flex-wrap gap-2">
    {MOODS.map((m) => (
      <button
        key={m.key}
        type="button"
        onClick={() => onChange(value === m.key ? undefined : m.key)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
          value === m.key
            ? m.color + ' border-current shadow-sm scale-105'
            : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'
        }`}
        title={language === 'fr' ? m.labelFr : m.label}
      >
        <span className="text-sm">{m.emoji}</span>
        <span className="hidden sm:inline">{language === 'fr' ? m.labelFr : m.label}</span>
      </button>
    ))}
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────

type Tab = 'today' | 'entries' | 'calendar' | 'stats';

export default function Journal() {
  const { language } = useLanguage();
  const [tab, setTab] = useState<Tab>('today');
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Editor state
  const [editorTitle, setEditorTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [editorMood, setEditorMood] = useState<string | undefined>(undefined);
  const [editorTags, setEditorTags] = useState<string[]>([]);
  const [editorTemplate, setEditorTemplate] = useState('free');
  const [tagInput, setTagInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<Id<'journalEntries'> | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Convex
  const todayEntry = useQuery(api.journal.getTodayEntry);
  const allEntries = useQuery(api.journal.getEntries, { limit: 100 });
  const stats = useQuery(api.journal.getStats);
  const entryDates = useQuery(api.journal.getEntryDates, {
    fromDate: startOfDayUTC(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1)),
    toDate: startOfDayUTC(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0)),
  });
  const selectedDateEntry = useQuery(api.journal.getEntryByDate, {
    date: startOfDayUTC(selectedDate),
  });

  const createEntry = useMutation(api.journal.createEntry);
  const updateEntry = useMutation(api.journal.updateEntry);
  const deleteEntry = useMutation(api.journal.deleteEntry);

  // Initialize editor with today's entry if it exists
  React.useEffect(() => {
    if (tab === 'today' && todayEntry !== undefined && !isDirty) {
      if (todayEntry) {
        setEditorTitle(todayEntry.title ?? '');
        setEditorContent(todayEntry.content);
        setEditorMood(todayEntry.mood);
        setEditorTags(todayEntry.tags ?? []);
        setEditorTemplate(todayEntry.template ?? 'free');
        setEditingId(todayEntry._id);
      } else {
        setEditorTitle('');
        setEditorContent('');
        setEditorMood(undefined);
        setEditorTags([]);
        setEditorTemplate('free');
        setEditingId(null);
      }
    }
  }, [todayEntry, tab, isDirty]);

  const handleTemplateChange = (templateKey: string) => {
    const tpl = TEMPLATES.find((t) => t.key === templateKey);
    if (!tpl) return;
    setEditorTemplate(templateKey);
    if (!editorContent.trim() || editorContent === TEMPLATES.find(t => t.key === editorTemplate)?.prompt) {
      setEditorContent(tpl.prompt);
    }
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!editorContent.trim()) {
      toast.error(language === 'fr' ? 'Contenu vide.' : 'Entry cannot be empty.');
      return;
    }
    try {
      await createEntry({
        title: editorTitle.trim() || undefined,
        content: editorContent,
        mood: editorMood,
        tags: editorTags,
        template: editorTemplate,
      });
      setIsDirty(false);
      toast.success(language === 'fr' ? 'Entrée sauvegardée.' : 'Entry saved.');
    } catch {
      toast.error(language === 'fr' ? 'Erreur lors de la sauvegarde.' : 'Failed to save entry.');
    }
  };

  const handleDelete = async (id: Id<'journalEntries'>) => {
    try {
      await deleteEntry({ id });
      toast.success(language === 'fr' ? 'Entrée supprimée.' : 'Entry deleted.');
      if (editingId === id) {
        setIsEditing(false);
        setEditorContent('');
        setEditorTitle('');
        setEditorMood(undefined);
        setEditorTags([]);
        setEditingId(null);
        setIsDirty(false);
      }
    } catch {
      toast.error(language === 'fr' ? 'Erreur lors de la suppression.' : 'Failed to delete entry.');
    }
  };

  const openEntryEditor = (entry: NonNullable<typeof allEntries>[number]) => {
    setEditorTitle(entry.title ?? '');
    setEditorContent(entry.content);
    setEditorMood(entry.mood);
    setEditorTags(entry.tags ?? []);
    setEditorTemplate(entry.template ?? 'free');
    setEditingId(entry._id);
    setIsEditing(true);
    setIsDirty(false);
  };

  const closeEditor = () => {
    setIsEditing(false);
    setEditingId(null);
    setIsDirty(false);
  };

  const handleUpdateEntry = async () => {
    if (!editingId || !editorContent.trim()) return;
    try {
      await updateEntry({
        id: editingId,
        title: editorTitle.trim() || undefined,
        content: editorContent,
        mood: editorMood,
        tags: editorTags,
      });
      setIsDirty(false);
      toast.success(language === 'fr' ? 'Mis à jour.' : 'Updated.');
      closeEditor();
    } catch {
      toast.error(language === 'fr' ? 'Erreur.' : 'Failed to update.');
    }
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (t && !editorTags.includes(t) && editorTags.length < 8) {
      setEditorTags([...editorTags, t]);
      setIsDirty(true);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setEditorTags(editorTags.filter((t) => t !== tag));
    setIsDirty(true);
  };

  const filteredEntries = useMemo(() => {
    if (!allEntries) return [];
    const q = searchQuery.toLowerCase();
    if (!q) return allEntries;
    return allEntries.filter(
      (e) =>
        e.content.toLowerCase().includes(q) ||
        (e.title ?? '').toLowerCase().includes(q) ||
        (e.tags ?? []).some((t) => t.includes(q))
    );
  }, [allEntries, searchQuery]);

  // Calendar helpers
  const calendarDayHasEntry = (date: Date) => {
    const ts = startOfDayUTC(date);
    return entryDates?.some((ed) => ed.date === ts) ?? false;
  };

  const calendarDayMood = (date: Date) => {
    const ts = startOfDayUTC(date);
    return entryDates?.find((ed) => ed.date === ts)?.mood;
  };

  const buildCalendarWeeks = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDow = firstDay.getDay();
    const weeks: (Date | null)[][] = [];
    let week: (Date | null)[] = Array(startDow).fill(null);

    for (let d = 1; d <= lastDay.getDate(); d++) {
      week.push(new Date(year, month, d));
      if (week.length === 7) { weeks.push(week); week = []; }
    }
    if (week.length) {
      while (week.length < 7) week.push(null);
      weeks.push(week);
    }
    return weeks;
  };

  const tabs: { key: Tab; label: string; labelFr: string; icon: React.ReactNode }[] = [
    { key: 'today', label: 'Today', labelFr: "Aujourd'hui", icon: <Sun className="w-4 h-4" /> },
    { key: 'entries', label: 'Entries', labelFr: 'Entrées', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'calendar', label: 'Calendar', labelFr: 'Calendrier', icon: <Calendar className="w-4 h-4" /> },
    { key: 'stats', label: 'Stats', labelFr: 'Statistiques', icon: <BarChart2 className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6" data-tour="journal">
      <PageHeader
        title={language === 'fr' ? 'Journal' : 'Journal'}
        subtitle={language === 'fr' ? 'Réflexion quotidienne & bien-être' : 'Daily reflection & wellbeing'}
      />

      {/* Streak banner */}
      {stats && stats.streak > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <Flame className="w-5 h-5 text-amber-500" />
          <p className="text-sm font-medium text-amber-800">
            {stats.streak}{' '}
            {language === 'fr'
              ? `jour${stats.streak > 1 ? 's' : ''} de suite — continuez !`
              : `day${stats.streak > 1 ? 's' : ''} streak — keep it up!`}
          </p>
        </div>
      )}

      {/* Tab bar */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => { setTab(t.key); setIsEditing(false); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              tab === t.key
                ? 'bg-white shadow-sm text-stone-900'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {t.icon}
            <span className="hidden sm:inline">{language === 'fr' ? t.labelFr : t.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── TODAY ── */}
        {tab === 'today' && !isEditing && (
          <motion.div
            key="today"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-stone-500 text-sm">{format(new Date(), 'EEEE, MMMM d')}</p>
              {todayEntry && (
                <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
                  {language === 'fr' ? 'Sauvegardé' : 'Saved'}
                </span>
              )}
            </div>

            {/* Template picker */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-2">
                {language === 'fr' ? 'Modèle' : 'Template'}
              </p>
              <div className="flex gap-2 flex-wrap">
                {TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.key}
                    type="button"
                    onClick={() => handleTemplateChange(tpl.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      editorTemplate === tpl.key
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <span>{tpl.icon}</span>
                    {language === 'fr' ? tpl.labelFr : tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <input
              type="text"
              placeholder={language === 'fr' ? 'Titre (optionnel)' : 'Title (optional)'}
              value={editorTitle}
              onChange={(e) => { setEditorTitle(e.target.value); setIsDirty(true); }}
              className="w-full text-xl font-semibold bg-transparent border-0 outline-none text-stone-900 placeholder-stone-300"
            />

            {/* Content */}
            <textarea
              placeholder={language === 'fr' ? 'Commencez à écrire...' : 'Start writing...'}
              value={editorContent}
              onChange={(e) => { setEditorContent(e.target.value); setIsDirty(true); }}
              rows={12}
              className="w-full resize-none bg-white/60 border border-stone-200 rounded-xl p-4 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/10 focus:border-emerald-700 transition leading-relaxed"
            />

            {/* Mood */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-2">
                {language === 'fr' ? 'Humeur' : 'Mood'}
              </p>
              <MoodPicker value={editorMood} onChange={(m) => { setEditorMood(m); setIsDirty(true); }} language={language} />
            </div>

            {/* Tags */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-2">
                {language === 'fr' ? 'Étiquettes' : 'Tags'}
              </p>
              <div className="flex flex-wrap gap-2 mb-2">
                {editorTags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 bg-stone-100 text-stone-600 text-xs px-2 py-1 rounded-full border border-stone-200">
                    #{tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={language === 'fr' ? 'Ajouter une étiquette...' : 'Add a tag...'}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                  className="flex-1 text-sm rounded-lg border border-stone-200 bg-white/70 px-3 py-1.5 focus:outline-none focus:border-emerald-600 transition"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 text-stone-600 text-sm hover:bg-stone-200 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="w-full py-3 rounded-xl bg-emerald-900 text-[#FAF7F0] text-sm font-semibold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              {todayEntry
                ? (language === 'fr' ? 'Mettre à jour' : 'Update entry')
                : (language === 'fr' ? 'Sauvegarder' : 'Save entry')}
            </button>
          </motion.div>
        )}

        {/* ── ENTRIES ── */}
        {tab === 'entries' && !isEditing && (
          <motion.div
            key="entries"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder={language === 'fr' ? 'Rechercher dans mes entrées...' : 'Search entries...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white/70 text-sm focus:outline-none focus:border-emerald-600 transition"
              />
            </div>

            {filteredEntries.length === 0 ? (
              <div className="text-center py-16 text-stone-400">
                <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">{language === 'fr' ? 'Aucune entrée pour l\'instant.' : 'No entries yet.'}</p>
                <p className="text-sm mt-1">
                  {language === 'fr' ? 'Commencez à écrire dans l\'onglet Aujourd\'hui.' : 'Start writing in the Today tab.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredEntries.map((entry) => {
                  const mood = getMood(entry.mood);
                  return (
                    <div
                      key={entry._id}
                      className="bg-white/80 border border-stone-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          {entry.title && (
                            <p className="font-semibold text-stone-900 text-sm truncate">{entry.title}</p>
                          )}
                          <p className="text-xs text-stone-400 mt-0.5">
                            {format(new Date(entry.entryDate), 'EEEE, MMMM d, yyyy')}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {mood && <span className="text-lg" title={mood.label}>{mood.emoji}</span>}
                          <button
                            type="button"
                            onClick={() => openEntryEditor(entry)}
                            className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(entry._id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-stone-600 line-clamp-2 leading-relaxed">
                        {entry.content}
                      </p>
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {entry.tags.map((tag) => (
                            <span key={tag} className="text-[11px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ── Editing overlay ── */}
        {isEditing && (
          <motion.div
            key="editing"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <button type="button" onClick={closeEditor} className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors">
                <ChevronLeft className="w-4 h-4" /> {language === 'fr' ? 'Retour' : 'Back'}
              </button>
              {editingId && (
                <button type="button" onClick={() => handleDelete(editingId)} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> {language === 'fr' ? 'Supprimer' : 'Delete'}
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder={language === 'fr' ? 'Titre (optionnel)' : 'Title (optional)'}
              value={editorTitle}
              onChange={(e) => { setEditorTitle(e.target.value); setIsDirty(true); }}
              className="w-full text-xl font-semibold bg-transparent border-0 outline-none text-stone-900 placeholder-stone-300"
            />
            <textarea
              value={editorContent}
              onChange={(e) => { setEditorContent(e.target.value); setIsDirty(true); }}
              rows={12}
              className="w-full resize-none bg-white/60 border border-stone-200 rounded-xl p-4 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/10 focus:border-emerald-700 transition leading-relaxed"
            />
            <MoodPicker value={editorMood} onChange={(m) => { setEditorMood(m); setIsDirty(true); }} language={language} />
            <button
              type="button"
              onClick={handleUpdateEntry}
              className="w-full py-3 rounded-xl bg-emerald-900 text-[#FAF7F0] text-sm font-semibold hover:bg-emerald-800 transition-colors"
            >
              {language === 'fr' ? 'Sauvegarder les modifications' : 'Save changes'}
            </button>
          </motion.div>
        )}

        {/* ── CALENDAR ── */}
        {tab === 'calendar' && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Month navigation */}
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))} className="p-2 rounded-lg hover:bg-stone-100 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <p className="font-semibold text-stone-800">{format(calendarMonth, 'MMMM yyyy')}</p>
              <button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))} className="p-2 rounded-lg hover:bg-stone-100 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i} className="text-[11px] font-semibold text-stone-400 uppercase py-1">{d}</div>
              ))}
              {buildCalendarWeeks().flatMap((week, wi) =>
                week.map((date, di) => {
                  if (!date) return <div key={`${wi}-${di}`} />;
                  const hasEntry = calendarDayHasEntry(date);
                  const mood = calendarDayMood(date);
                  const moodConfig = getMood(mood);
                  const today = isToday(date);
                  const isSelected = isSameDay(date, selectedDate);
                  return (
                    <button
                      key={`${wi}-${di}`}
                      type="button"
                      onClick={() => { setSelectedDate(date); }}
                      className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all ${
                        isSelected ? 'bg-emerald-900 text-white shadow-sm' :
                        today ? 'bg-emerald-50 text-emerald-900 font-bold' :
                        'hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      <span className="text-xs leading-none">{date.getDate()}</span>
                      {hasEntry && (
                        <span className={`mt-0.5 text-[10px] leading-none ${isSelected ? 'opacity-80' : ''}`}>
                          {moodConfig?.emoji ?? '•'}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Selected day entry preview */}
            {selectedDateEntry !== undefined && (
              <div className="mt-2 bg-white/80 border border-stone-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-stone-400 uppercase mb-2">
                  {format(selectedDate, 'MMMM d, yyyy')}
                </p>
                {selectedDateEntry ? (
                  <>
                    {selectedDateEntry.title && (
                      <p className="font-semibold text-stone-900 mb-1">{selectedDateEntry.title}</p>
                    )}
                    <p className="text-sm text-stone-600 line-clamp-4 leading-relaxed">
                      {selectedDateEntry.content}
                    </p>
                    <button
                      type="button"
                      onClick={() => openEntryEditor(selectedDateEntry)}
                      className="mt-3 text-xs text-emerald-700 font-medium hover:underline"
                    >
                      {language === 'fr' ? 'Modifier l\'entrée' : 'Edit entry'} →
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-stone-400 italic">
                    {language === 'fr' ? 'Aucune entrée ce jour-là.' : 'No entry for this day.'}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* ── STATS ── */}
        {tab === 'stats' && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/80 border border-stone-200 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-emerald-800">{stats?.total ?? 0}</p>
                <p className="text-xs text-stone-500 mt-0.5">{language === 'fr' ? 'Entrées' : 'Entries'}</p>
              </div>
              <div className="bg-white/80 border border-stone-200 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-amber-600">{stats?.streak ?? 0}</p>
                <p className="text-xs text-stone-500 mt-0.5">{language === 'fr' ? 'Jours de suite' : 'Day streak'}</p>
              </div>
              <div className="bg-white/80 border border-stone-200 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-purple-700">
                  {stats ? Object.keys(stats.tagCounts).length : 0}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">{language === 'fr' ? 'Étiquettes' : 'Tags used'}</p>
              </div>
            </div>

            {/* Mood distribution */}
            {stats && Object.keys(stats.moodCounts).length > 0 && (
              <div className="bg-white/80 border border-stone-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-stone-700 mb-3">
                  {language === 'fr' ? 'Distribution des humeurs' : 'Mood distribution'}
                </p>
                <div className="space-y-2">
                  {MOODS.filter((m) => stats.moodCounts[m.key]).map((m) => {
                    const count = stats.moodCounts[m.key] ?? 0;
                    const maxCount = Math.max(...Object.values(stats.moodCounts));
                    const pct = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0;
                    return (
                      <div key={m.key} className="flex items-center gap-2">
                        <span className="text-sm w-6">{m.emoji}</span>
                        <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-stone-500 w-6 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Top tags */}
            {stats && Object.keys(stats.tagCounts).length > 0 && (
              <div className="bg-white/80 border border-stone-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-stone-700 mb-3">
                  {language === 'fr' ? 'Étiquettes populaires' : 'Popular tags'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(stats.tagCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 12)
                    .map(([tag, count]) => (
                      <span key={tag} className="flex items-center gap-1 bg-stone-100 border border-stone-200 text-stone-600 text-xs px-2.5 py-1 rounded-full">
                        #{tag}
                        <span className="text-stone-400 ml-1">{count}</span>
                      </span>
                    ))}
                </div>
              </div>
            )}

            {stats?.total === 0 && (
              <div className="text-center py-12 text-stone-400">
                <BarChart2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">{language === 'fr' ? 'Pas encore de données.' : 'No data yet.'}</p>
                <p className="text-sm mt-1">{language === 'fr' ? 'Écrivez quelques entrées pour voir vos statistiques.' : 'Write a few entries to see your stats.'}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
