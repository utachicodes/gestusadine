import { format, isToday } from 'date-fns';
import { startOfDayUTC } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PeriodCalendarProps {
  tr: (obj: { en: string; fr: string }) => string;
  calendarMonth: Date;
  setCalendarMonth: (d: Date) => void;
  calYear: number;
  calMon: number;
  firstDay: number;
  daysInMonth: number;
  logMap: Map<number, any>;
}

export function PeriodCalendar({ tr, calendarMonth, setCalendarMonth, calYear, calMon, firstDay, daysInMonth, logMap }: PeriodCalendarProps) {
  return (
    <div className="islamic-card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCalendarMonth(new Date(calYear, calMon - 1, 1))}
          className="p-2 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h2 className="text-sm font-semibold text-foreground">{format(calendarMonth, 'MMMM yyyy')}</h2>
        <button
          onClick={() => setCalendarMonth(new Date(calYear, calMon + 1, 1))}
          className="p-2 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} className="text-center text-[10px] font-semibold text-muted-foreground py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`b${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayDate = new Date(calYear, calMon, i + 1);
          const dayTs = startOfDayUTC(dayDate);
          const log = logMap.get(dayTs);
          const flow = log?.flow;
          const isT = isToday(dayDate);

          const cellColor = flow === 'heavy' || flow === 'medium'
            ? 'bg-red-100 text-red-800'
            : flow === 'light' || flow === 'spotting'
            ? 'bg-rose-50 text-rose-700'
            : (log?.symptoms?.length ?? 0) > 0
            ? 'bg-purple-50 text-purple-700'
            : isT
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-muted/40';

          return (
            <div
              key={i}
              className={`flex flex-col items-center justify-center rounded-xl min-h-[40px] sm:aspect-square text-xs font-medium ${cellColor} ${isT ? 'ring-2 ring-primary/30' : ''}`}
            >
              <span>{i + 1}</span>
              {flow && flow !== 'none' && <span className="text-[8px]">🩸</span>}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
        {[
          { color: 'bg-red-100', label: tr({ en: 'Heavy / Medium', fr: 'Abondant / Moyen' }) },
          { color: 'bg-rose-50',   label: tr({ en: 'Light / Spotting', fr: 'Léger / Spotting' }) },
          { color: 'bg-purple-50', label: tr({ en: 'Symptoms logged', fr: 'Symptômes notés' }) },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={`w-3 h-3 rounded-sm ${color}`} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
