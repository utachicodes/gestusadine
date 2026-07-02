import React from 'react';
import { BookOpen, Edit3, Trash2, Search } from 'lucide-react';
import { format, isToday } from 'date-fns';
import type { MoodDef } from './journalConstants';
import type { Id } from '../../../../convex/_generated/dataModel';

interface JournalListProps {
  filteredEntries: any[];
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  tr: (obj: { en: string; fr: string }) => string;
  getMoodDef: (key?: string | null) => MoodDef | undefined;
  handleDelete: (id: Id<'journalEntries'>) => Promise<void>;
  setEditorTitle: (v: string) => void;
  setEditorContent: (v: string) => void;
  setEditorMood: (v: string | undefined) => void;
  setEditorTags: (v: string[]) => void;
  setEditorTemplate: (v: string) => void;
  setEditingId: (v: Id<'journalEntries'> | null) => void;
  setIsDirty: (v: boolean) => void;
  setTab: (v: any) => void;
}

export function JournalList({
  filteredEntries,
  searchQuery,
  setSearchQuery,
  tr,
  getMoodDef,
  handleDelete,
  setEditorTitle,
  setEditorContent,
  setEditorMood,
  setEditorTags,
  setEditorTemplate,
  setEditingId,
  setIsDirty,
  setTab,
}: JournalListProps) {
  return (
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
            const moodDef = getMoodDef(entry.mood);
            const MoodIcon = moodDef?.icon;
            return (
              <div key={entry._id} className="islamic-card p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(entry.entryDate), 'dd MMM yyyy')}
                      </p>
                      {MoodIcon && <MoodIcon className="w-3.5 h-3.5 text-muted-foreground" />}
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
                        {(entry.tags ?? []).map((tag: string) => (
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
  );
}
