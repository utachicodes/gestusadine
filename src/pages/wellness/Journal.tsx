import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/PageHeader';
import { useTr } from '@/lib/i18n';
import type { Id } from '../../../convex/_generated/dataModel';
import { startOfDayUTC } from "@/lib/utils";
import { TABS, MOODS } from './journal/journalConstants';
import type { Tab } from './journal/journalConstants';
import { JournalEditor } from './journal/JournalEditor';
import { JournalList } from './journal/JournalList';
import { JournalCalendar } from './journal/JournalCalendar';
import { JournalStats } from './journal/JournalStats';

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
  const todayEntries = useQuery(api.journal.getTodayEntries);
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

  // Sync editor from today's latest entry on mount
  useEffect(() => {
    if (tab === 'today' && todayEntries !== undefined && !isDirty) {
      const latest = todayEntries?.[0] ?? null;
      if (latest) {
        setEditorTitle(latest.title ?? '');
        setEditorContent(latest.content);
        setEditorMood(latest.mood);
        setEditorTags(latest.tags ?? []);
        setEditorTemplate(latest.template ?? 'free');
        setEditingId(latest._id);
      } else {
        setEditorTitle('');
        setEditorContent('');
        setEditorMood(undefined);
        setEditorTags([]);
        setEditorTemplate('free');
        setEditingId(null);
      }
    }
  }, [todayEntries, tab, isDirty]);

  const handleSave = async () => {
    if (!editorContent.trim()) { toast.error(tr({ en: 'Write something first.', fr: 'Écrivez quelque chose d\'abord.' })); return; }
    try {
      if (editingId) {
        await updateEntry({ id: editingId, title: editorTitle || undefined, content: editorContent, mood: editorMood, tags: editorTags });
      } else {
        await createEntry({ title: editorTitle || undefined, content: editorContent, mood: editorMood, tags: editorTags, template: editorTemplate === 'free' ? undefined : editorTemplate });
      }
      toast.success(tr({ en: 'Entry saved.', fr: 'Entrée enregistrée.' }));
      // Reset editor for a new entry
      setEditorTitle('');
      setEditorContent('');
      setEditorMood(undefined);
      setEditorTags([]);
      setEditorTemplate('free');
      setEditingId(null);
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

  const filteredEntries = (allEntries ?? []).filter((e) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (e.title ?? '').toLowerCase().includes(q) || e.content.toLowerCase().includes(q);
  });

  const getMoodDef = (key?: string | null) => MOODS.find((m) => m.key === key);

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
            <t.icon className="w-3.5 h-3.5" />
            <span>{tr({ en: t.en, fr: t.fr })}</span>
          </button>
        ))}
      </div>

      {/* ── TODAY ───────────────────────────────────────────────────────── */}
      {tab === 'today' && (
        <JournalEditor
          editorTitle={editorTitle}
          setEditorTitle={setEditorTitle}
          editorContent={editorContent}
          setEditorContent={setEditorContent}
          editorMood={editorMood}
          setEditorMood={setEditorMood}
          editorTags={editorTags}
          setEditorTags={setEditorTags}
          editorTemplate={editorTemplate}
          setEditorTemplate={setEditorTemplate}
          tagInput={tagInput}
          setTagInput={setTagInput}
          editingId={editingId}
          setEditingId={setEditingId}
          isDirty={isDirty}
          setIsDirty={setIsDirty}
          todayEntries={todayEntries}
          handleSave={handleSave}
          tr={tr}
          getMoodDef={getMoodDef}
        />
      )}

      {/* ── ENTRIES ─────────────────────────────────────────────────────── */}
      {tab === 'entries' && (
        <JournalList
          filteredEntries={filteredEntries}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          tr={tr}
          getMoodDef={getMoodDef}
          handleDelete={handleDelete}
          setEditorTitle={setEditorTitle}
          setEditorContent={setEditorContent}
          setEditorMood={setEditorMood}
          setEditorTags={setEditorTags}
          setEditorTemplate={setEditorTemplate}
          setEditingId={setEditingId}
          setIsDirty={setIsDirty}
          setTab={setTab}
        />
      )}

      {/* ── CALENDAR ────────────────────────────────────────────────────── */}
      {tab === 'calendar' && (
        <JournalCalendar
          calendarMonth={calendarMonth}
          setCalendarMonth={setCalendarMonth}
          calYear={calYear}
          calMon={calMon}
          firstDay={firstDay}
          daysInMonth={daysInMonth}
          entryDateMap={entryDateMap}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedDateEntry={selectedDateEntry}
          tr={tr}
          getMoodDef={getMoodDef}
          setTab={setTab}
        />
      )}

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      {tab === 'stats' && (
        <JournalStats stats={stats} tr={tr} />
      )}
    </section>
    </div>
  );
}
