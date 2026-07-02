import React from 'react';
import { X, Tag } from 'lucide-react';
import { MOODS, TEMPLATES } from './journalConstants';
import type { MoodDef } from './journalConstants';
import { toast } from 'sonner';
import type { Id } from '../../../../convex/_generated/dataModel';

interface JournalEditorProps {
  editorTitle: string;
  setEditorTitle: (v: string) => void;
  editorContent: string;
  setEditorContent: (v: string) => void;
  editorMood: string | undefined;
  setEditorMood: (v: string | undefined) => void;
  editorTags: string[];
  setEditorTags: (v: string[]) => void;
  editorTemplate: string;
  setEditorTemplate: (v: string) => void;
  tagInput: string;
  setTagInput: (v: string) => void;
  editingId: Id<'journalEntries'> | null;
  setEditingId: (v: Id<'journalEntries'> | null) => void;
  isDirty: boolean;
  setIsDirty: (v: boolean) => void;
  todayEntries: any;
  handleSave: () => Promise<void>;
  tr: (obj: { en: string; fr: string }) => string;
  getMoodDef: (key?: string | null) => MoodDef | undefined;
}

export function JournalEditor({
  editorTitle, setEditorTitle,
  editorContent, setEditorContent,
  editorMood, setEditorMood,
  editorTags, setEditorTags,
  editorTemplate, setEditorTemplate,
  tagInput, setTagInput,
  editingId, setEditingId,
  isDirty, setIsDirty,
  todayEntries,
  handleSave,
  tr,
  getMoodDef,
}: JournalEditorProps) {
  const applyTemplate = (key: string) => {
    const t = TEMPLATES.find((t) => t.key === key);
    if (!t) return;
    if (key === 'free') {
      setEditorTemplate('free');
    } else {
      setEditorTemplate(key);
      if (!isDirty && t.prompt) { setEditorContent(t.prompt); }
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !editorTags.includes(tag) && editorTags.length < 20) {
      setEditorTags([...editorTags, tag]);
      setTagInput('');
      setIsDirty(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Today's entries list (if any) */}
      {todayEntries && todayEntries.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {tr({ en: 'Today\'s entries', fr: "Entrées d'aujourd'hui" })} ({todayEntries.length})
            </p>
            <button
              onClick={() => {
                setEditorTitle('');
                setEditorContent('');
                setEditorMood(undefined);
                setEditorTags([]);
                setEditorTemplate('free');
                setEditingId(null);
                setIsDirty(false);
              }}
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              + {tr({ en: 'New entry', fr: 'Nouvelle entrée' })}
            </button>
          </div>
          {todayEntries.map((entry: any) => (
            <div
              key={entry._id}
              onClick={() => {
                setEditorTitle(entry.title ?? '');
                setEditorContent(entry.content);
                setEditorMood(entry.mood);
                setEditorTags(entry.tags ?? []);
                setEditorTemplate(entry.template ?? 'free');
                setEditingId(entry._id);
                setIsDirty(false);
              }}
              className={`islamic-card p-3 cursor-pointer transition-all ${
                editingId === entry._id
                  ? 'border-primary/40 bg-primary/5'
                  : 'hover:border-border/60'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {entry.mood && (() => {
                  const moodDef = getMoodDef(entry.mood);
                  if (!moodDef) return null;
                  const Icon = moodDef.icon;
                  return <Icon className="w-3.5 h-3.5 text-muted-foreground" />;
                })()}
                {entry.title && (
                  <p className="text-sm font-semibold text-foreground truncate">{entry.title}</p>
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">{entry.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Template picker */}
      <div className="islamic-card p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-3">
          {tr({ en: 'Template', fr: 'Modèle' })}
        </p>
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => applyTemplate(t.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-medium transition-all ${
                  editorTemplate === t.key
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                }`}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                {tr({ en: t.en, fr: t.fr })}
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor */}
      <div className="islamic-card p-4 sm:p-6 space-y-4">
        <input
          type="text"
          value={editorTitle}
          onChange={(e) => { setEditorTitle(e.target.value); setIsDirty(true); }}
          placeholder={tr({ en: 'Title (optional)', fr: 'Titre (facultatif)' })}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground/50"
        />
        <textarea
          value={editorContent}
          onChange={(e) => { setEditorContent(e.target.value); setIsDirty(true); }}
          placeholder={tr({ en: 'Write your thoughts…', fr: 'Écrivez vos pensées…' })}
          rows={10}
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none placeholder:text-muted-foreground/50"
        />

        {/* Mood */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2">
            {tr({ en: 'Mood', fr: 'Humeur' })}
          </p>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.key}
                  onClick={() => { setEditorMood(editorMood === m.key ? undefined : m.key); setIsDirty(true); }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                    editorMood === m.key
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{tr({ en: m.en, fr: m.fr })}</span>
                </button>
              );
            })}
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
              className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground/50"
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
  );
}
