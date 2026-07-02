import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isSameDay, isToday } from 'date-fns';
import { startOfDayUTC } from '@/lib/utils';
import type { MoodDef } from './journalConstants';

interface JournalCalendarProps {
  calendarMonth: Date;
  setCalendarMonth: (v: Date) => void;
  calYear: number;
  calMon: number;
  firstDay: number;
  daysInMonth: number;
  entryDateMap: Map<number, string | undefined>;
  selectedDate: Date;
  setSelectedDate: (v: Date) => void;
  selectedDateEntry: any;
  tr: (obj: { en: string; fr: string }) => string;
  getMoodDef: (key?: string | null) => MoodDef | undefined;
  setTab: (v: any) => void;
}

export function JournalCalendar({
  calendarMonth,
  setCalendarMonth,
  calYear,
  calMon,
  firstDay,
  daysInMonth,
  entryDateMap,
  selectedDate,
  setSelectedDate,
  selectedDateEntry,
  tr,
  getMoodDef,
  setTab,
}: JournalCalendarProps) {
  return (
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
                {hasEntry && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-0.5" />
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
            {selectedDateEntry.mood && (() => {
              const moodDef = getMoodDef(selectedDateEntry.mood);
              if (!moodDef) return null;
              const Icon = moodDef.icon;
              return (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{tr({ en: moodDef.en, fr: moodDef.fr })}</span>
                </div>
              );
            })()}
            <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-8">{selectedDateEntry.content}</p>
            {(selectedDateEntry.tags ?? []).length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {(selectedDateEntry.tags ?? []).map((tag: string) => (
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
  );
}
