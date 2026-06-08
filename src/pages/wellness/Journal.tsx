import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { format, isToday, isSameDay } from 'date-fns';
import { BookOpen, Flame, BarChart2, Calendar, ChevronLeft, ChevronRight, Trash2, Edit3, X, Search, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/PageHeader';
import { useTr } from '@/lib/i18n';
import type { Id } from '../../../convex/_generated/dataModel';

// ── Mood config ───────────────────────────────────────────────────────────────

const MOODS = [
  { key: 'grateful', emoji: '🤲', en: 'Grateful', fr: 'Reconnaissant' },
  { key: 'happy',    emoji: '😊', en: 'Happy',    fr: 'Heureux' },
  { key: 'calm',     emoji: '🧘', en: 'Calm',     fr: 'Calme' },
  { key: 'hopeful',  emoji: '✨', en: 'Hopeful',  fr: "Plein d'espoir" },
  { key: 'tired',    emoji: '😴', en: 'Tired',    fr: 'Fatigué' },
  { key: 'anxious',  emoji: '😟', en: 'Anxious',  fr: 'Anxieux' },
  { key: 'sad',      emoji: '😔', en: 'Sad',      fr: 'Triste' },
  { key: 'angry',    emoji: '😤', en: 'Frustrated', fr: 'Frustré' },
] as const;

type MoodKey = (typeof MOODS)[number]['key'];

const TEMPLATES = [
  { key: 'free',       en: 'Free write',      fr: 'Écriture libre',  icon: '✏️', prompt: '' },
  { key: 'gratitude',  en: 'Gratitude',       fr: 'Gratitude',       icon: '🤲', prompt: "Today I am grateful for:\n1. \n2. \n3. \n\nA blessing I noticed:\n\nA dua I want to make:\n" },
  { key: 'reflection', en: 'Reflection',      fr: 'Réflexion',       icon: '🌙', prompt: "What I did today:\n\nWhat went well:\n\nWhat I want to improve:\n\nLesson I learned:\n" },
  { key: 'daily',      en: 'Daily check-in',  fr: 'Bilan quotidien', icon: '☀️', prompt: "Mood today: \n\nMy intention for the day:\n\nWhat I want to accomplish:\n\nOne thing I look forward to:\n" },
] as const;

function startOfDayUTC(date: Date): number {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d.getTime();
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

type Tab = 'today' | 'entries' | 'calendar' | 'stats';

const TABS: { id: Tab; en: string; fr: string; icon: React.ReactNode }[] = [
  { id: 'today',    en: 'Today',    fr: "Aujourd'hui", icon: <Edit3 className="w-3.5 h-3.5" /> },
  { id: 'entries',  en: 'Entries',  fr: 'Entrées',     icon: <BookOpen className="w-3.5 h-3.5" /> },
  { id: 'calendar', en: 'Calendar', fr: 'Calendar',    icon: <Calendar className="w-3.5 h-3.5" /> },
  { id: 'stats',    en: 'Stats',    fr: 'Stats',       icon: <BarChart2 className="w-3.5 h-3.5" /> },
];

// ── Main component ────────────────────────────────────────────────────────────

export default function Journal() {
  const tr = useTr();
  const [tab, setTab] = useState<Tab>('today');
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');

  // Editor state
  const [editorTitle, setEditorTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [editorMood, setEditorMood] = useState<string | undefined>();
  const [editorTags, setEditorTags] = useState<string[]>([]);
  const [editorTemplate, setEditorTemplate] = useState('free');
  const [tagInput, setTagInput] = useState('');
  const [editingId, setEditingId] = useState<Id<'journalEntries'> | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Queries
  const todayEntry = useQuery(api.journal.getTodayEntry);
  const allEntries = useQuery(api.journal.getEntries, { limit: 100 });
  const stats = useQuery(api.journal.getStats);
  const entryDates = useQuery(api.journal.getEntryDates, {
    fromDate: startOfDayUTC(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1)),
    toDate: startOfDayUTC(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0)),
  });
  const selectedDateEntry = useQuery(api.journal.getEntryByDate, { date: startOfDayUTC(selectedDate) });

  const createEntry = useMutation(api.journal.createEntry);
  const updateEntry = useMutation(api.journal.updateEntry);
  const deleteEntry = useMutation(api.journal.deleteEntry);

  // Sync editor from today's entry on mount
  useEffect(() => {
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

  const handleSave = async () => {
    if (!editorContent.trim()) { toast.error(tr({ en: 'Write something first.', fr: 'Écrivez quelque chose d\'abord.' })); return; }
    try {
      if (editingId) {
        await updateEntry({ id: editingId, title: editorTitle || undefined, content: editorContent, mood: editorMood, tags: editorTags });
      } else {
        await createEntry({ title: editorTitle || undefined, content: editorContent, mood: editorMood, tags: editorTags, template: editorTemplate });
      }
      toast.success(tr({ en: 'Entry saved.', fr: 'Entrée enregistrée.' }));
      setIsDirty(false);
    } catch {
      toast.error(tr({ en: 'Could not save.', fr: 'Impossible d\'enregistrer.' }));
    }
  };

  const handleDelete = async (id: Id<'journalEntries'>) => {
    try {
      await deleteEntry({ id });
      toast.success(tr({ en: 'Entry deleted.', fr: 'Entrée supprimée.' }));
      if (editingId === id) { setEditorTitle(''); setEditorContent(''); setEditorMood(undefined); setEditorTags([]); setEditingId(null); setIsDirty(false); }
    } catch {
      toast.error(tr({ en: 'Could not delete.', fr: 'Impossible de supprimer.' }));
    }
  };

  const applyTemplate = (key: string) => {
    const t = TEMPLATES.find((t) => t.key === key);
    if (!t) return;
    setEditorTemplate(key);
    if (!isDirty && t.prompt) { setEditorContent(t.prompt); }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !editorTags.includes(tag) && editorTags.length < 20) {
      setEditorTags([...editorTags, tag]);
      setTagInput('');
      setIsDirty(true);
    }
  };

  const filteredEntries = (allEntries ?? []).filter((e) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (e.title ?? '').toLowerCase().includes(q) || e.content.toLowerCase().includes(q);
  });

  const getMoodEntry = (key?: string | null) => MOODS.find((m) => m.key === key);

  // Calendar grid
  const calYear = calendarMonth.getFullYear();
  const calMon = calendarMonth.getMonth();
  const firstDay = new Date(calYear, calMon, 1).getDay();
  const daysInMonth = new Date(calYear, calMon + 1, 0).getDate();
  const entryDateMap = new Map((entryDates ?? []).map((e) => [e.date, e.mood]));

  return (
    <div className="flex-1">
    <section className="container py-8 md:py-10 space-y-6">
      <PageHeader
        eyebrow={tr({ en: 'Wellness', fr: 'Bien-être' })}
        title={tr({ en: 'Journal', fr: 'Journal' })}
        subtitle={tr({
          en: 'Reflect, record, and track your inner journey every day.',
          fr: 'Réfléchissez, notez et suivez votre cheminement intérieur chaque jour.',
        })}
      />

      {/* Tab bar — scrollable so labels stay visible on any screen width */}
      <div className="flex gap-1 border-b border-border overflow-x-auto scrollbar-none">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap flex-shrink-0 ${
              tab === t.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.icon}
            <span>{tr({ en: t.en, fr: t.fr })}</span>
          </button>
        ))}
      </div>

      {/* ── TODAY ───────────────────────────────────────────────────────── */}
      {tab === 'today' && (
        <div className="space-y-4">
          {/* Template picker */}
          <div className="islamic-card p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-3">
              {tr({ en: 'Template', fr: 'Modèle' })}
            </p>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => applyTemplate(t.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-medium transition-all ${
                    editorTemplate === t.key
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  }`}
                >
                  <span>{t.icon}</span>
                  {tr({ en: t.en, fr: t.fr })}
                </button>
              ))}
            </div>
          </div>

          {/* Editor */}
          <div className="islamic-card p-4 sm:p-6 space-y-4">
            <input
              type="text"
              value={editorTitle}
              onChange={(e) => { setEditorTitle(e.target.value); setIsDirty(true); }}
              placeholder={tr({ en: 'Title (optional)', fr: 'Titre (facultatif)' })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground/50"
            />
            <textarea
              value={editorContent}
              onChange={(e) => { setEditorContent(e.target.value); setIsDirty(true); }}
              placeholder={tr({ en: 'Write your thoughts…', fr: 'Écrivez vos pensées…' })}
              rows={10}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none placeholder:text-muted-foreground/50"
            />

            {/* Mood */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2">
                {tr({ en: 'Mood', fr: 'Humeur' })}
              </p>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => { setEditorMood(editorMood === m.key ? undefined : m.key); setIsDirty(true); }}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                      editorMood === m.key
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    <span>{m.emoji}</span>
                    <span className="hidden sm:inline">{tr({ en: m.en, fr: m.fr })}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2">
                {tr({ en: 'Tags', fr: 'Étiquettes' })}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {editorTags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/50 text-primary text-xs font-medium">
                    #{tag}
                    <button onClick={() => { setEditorTags(editorTags.filter((t) => t !== tag)); setIsDirty(true); }}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder={tr({ en: 'Add tag…', fr: 'Ajouter une étiquette…' })}
                  className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                />
                <button onClick={addTag} className="px-3 py-2 rounded-xl bg-muted/40 border border-border text-muted-foreground hover:text-foreground transition-colors">
                  <Tag className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button onClick={handleSave} className="btn-islamic w-full sm:w-auto">
              {editingId
                ? tr({ en: 'Update entry', fr: "Mettre à jour l'entrée" })
                : tr({ en: 'Save entry', fr: "Enregistrer l'entrée" })}
            </button>
          </div>
        </div>
      )}

      {/* ── ENTRIES ─────────────────────────────────────────────────────── */}
      {tab === 'entries' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tr({ en: 'Search entries…', fr: 'Rechercher des entrées…' })}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground/50"
            />
          </div>

          {filteredEntries.length === 0 ? (
            <div className="islamic-card p-8 text-center">
              <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? tr({ en: 'No entries match your search.', fr: 'Aucune entrée ne correspond.' })
                  : tr({ en: 'No entries yet. Start writing today!', fr: "Pas encore d'entrées. Commencez aujourd'hui !" })}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEntries.map((entry) => {
                const mood = getMoodEntry(entry.mood);
                return (
                  <div key={entry._id} className="islamic-card p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(entry.entryDate), 'dd MMM yyyy')}
                          </p>
                          {mood && <span className="text-sm">{mood.emoji}</span>}
                          {isToday(new Date(entry.entryDate)) && (
                            <span className="text-xs font-medium text-primary px-2 py-0.5 rounded-full bg-primary/10">
                              {tr({ en: 'Today', fr: "Aujourd'hui" })}
                            </span>
                          )}
                        </div>
                        {entry.title && (
                          <p className="text-sm font-semibold text-foreground mb-1">{entry.title}</p>
                        )}
                        <p className="text-sm text-muted-foreground line-clamp-2">{entry.content}</p>
                        {(entry.tags ?? []).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {(entry.tags ?? []).map((tag) => (
                              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-accent/50 text-primary">#{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => {
                            setEditorTitle(entry.title ?? '');
                            setEditorContent(entry.content);
                            setEditorMood(entry.mood);
                            setEditorTags(entry.tags ?? []);
                            setEditorTemplate(entry.template ?? 'free');
                            setEditingId(entry._id);
                            setIsDirty(false);
                            setTab('today');
                          }}
                          className="p-2 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(entry._id)}
                          className="p-2 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── CALENDAR ────────────────────────────────────────────────────── */}
      {tab === 'calendar' && (
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 islamic-card p-4 sm:p-5">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCalendarMonth(new Date(calYear, calMon - 1, 1))}
                className="p-2 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h2 className="text-sm font-semibold text-foreground">
                {format(calendarMonth, 'MMMM yyyy')}
              </h2>
              <button
                onClick={() => setCalendarMonth(new Date(calYear, calMon + 1, 1))}
                className="p-2 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['S','M','T','W','T','F','S'].map((d, i) => (
                <div key={i} className="text-center text-[10px] font-semibold text-muted-foreground py-1">{d}</div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`blank-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayDate = new Date(calYear, calMon, i + 1);
                const dayTs = startOfDayUTC(dayDate);
                const mood = entryDateMap.get(dayTs);
                const hasEntry = mood !== undefined;
                const isSelected = isSameDay(dayDate, selectedDate);
                const isT = isToday(dayDate);
                const moodMeta = getMoodEntry(mood);
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(dayDate)}
                    className={`relative flex flex-col items-center justify-center rounded-xl min-h-[40px] sm:aspect-square text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : isT
                        ? 'bg-primary/10 text-primary'
                        : hasEntry
                        ? 'bg-accent/40 text-foreground hover:bg-accent/60'
                        : 'text-muted-foreground hover:bg-muted/40'
                    }`}
                  >
                    <span>{i + 1}</span>
                    {hasEntry && !isSelected && moodMeta && (
                      <span className="text-[10px] leading-none">{moodMeta.emoji}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected day entry preview */}
          <div className="islamic-card p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-3">
              {format(selectedDate, 'dd MMM yyyy')}
            </p>
            {selectedDateEntry === undefined ? (
              <p className="text-sm text-muted-foreground">{tr({ en: 'Loading…', fr: 'Chargement…' })}</p>
            ) : selectedDateEntry ? (
              <div className="space-y-2">
                {selectedDateEntry.title && (
                  <p className="text-sm font-semibold text-foreground">{selectedDateEntry.title}</p>
                )}
                {selectedDateEntry.mood && (
                  <p className="text-lg">{getMoodEntry(selectedDateEntry.mood)?.emoji}</p>
                )}
                <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-8">{selectedDateEntry.content}</p>
                {(selectedDateEntry.tags ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(selectedDateEntry.tags ?? []).map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-accent/50 text-primary">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-3">
                  {tr({ en: 'No entry for this day.', fr: 'Pas d\'entrée pour ce jour.' })}
                </p>
                {isToday(selectedDate) && (
                  <button onClick={() => setTab('today')} className="btn-islamic text-sm">
                    {tr({ en: 'Write today\'s entry', fr: "Écrire l'entrée d'aujourd'hui" })}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      {tab === 'stats' && (
        <div className="space-y-4">
          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />, label: tr({ en: 'Total entries', fr: 'Total entrées' }), value: stats?.total ?? 0, sub: tr({ en: 'journal entries', fr: 'entrées de journal' }) },
              { icon: <Flame className="w-4 h-4 sm:w-5 sm:h-5" />,   label: tr({ en: 'Streak', fr: 'Série' }),         value: stats?.streak ?? 0, sub: tr({ en: 'consecutive days', fr: 'jours consécutifs' }) },
              { icon: <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5" />,label: tr({ en: 'Moods', fr: 'Humeurs' }),       value: Object.keys(stats?.moodCounts ?? {}).length, sub: tr({ en: 'types recorded', fr: 'types enregistrés' }) },
              { icon: <Tag className="w-4 h-4 sm:w-5 sm:h-5" />,     label: tr({ en: 'Tags', fr: 'Étiquettes' }),      value: Object.keys(stats?.tagCounts ?? {}).length, sub: tr({ en: 'unique tags', fr: 'étiquettes uniques' }) },
            ].map(({ icon, label, value, sub }) => (
              <div key={label} className="islamic-card p-3 sm:p-4 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-1 truncate">{label}</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground leading-none">{value}</p>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{sub}</p>
                </div>
                <div className="flex-shrink-0 p-2 sm:p-2.5 rounded-xl bg-accent/50 text-primary">{icon}</div>
              </div>
            ))}
          </div>

          {/* Mood distribution */}
          {Object.keys(stats?.moodCounts ?? {}).length > 0 && (
            <div className="islamic-card p-4 sm:p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">
                {tr({ en: 'Mood distribution', fr: 'Répartition des humeurs' })}
              </h2>
              <div className="space-y-2.5">
                {MOODS.filter((m) => (stats?.moodCounts ?? {})[m.key]).map((m) => {
                  const count = (stats?.moodCounts ?? {})[m.key] ?? 0;
                  const total = stats?.total ?? 1;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={m.key} className="flex items-center gap-3">
                      <span className="text-base w-6 text-center">{m.emoji}</span>
                      <div className="flex-1 h-2.5 rounded-full bg-muted/40 overflow-hidden">
                        <div className="h-full rounded-full bg-primary/70 transition-all duration-300" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Top tags */}
          {Object.keys(stats?.tagCounts ?? {}).length > 0 && (
            <div className="islamic-card p-4 sm:p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">
                {tr({ en: 'Top tags', fr: 'Étiquettes populaires' })}
              </h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats?.tagCounts ?? {})
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 20)
                  .map(([tag, count]) => (
                    <span key={tag} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent/50 text-primary text-sm font-medium">
                      #{tag}
                      <span className="text-xs text-primary/70 ml-1">{count}</span>
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
    </div>
  );
}
