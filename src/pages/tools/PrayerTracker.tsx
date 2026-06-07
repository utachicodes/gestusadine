import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { toast } from 'sonner';
import { api } from '../../../convex/_generated/api';
import { PageHeader } from '@/components/layout/PageHeader';
import { useTr } from '@/lib/i18n';
import { getErrorMessage } from '@/types/errors';
import { Sunrise, Sun, CloudSun, Sunset, Moon, Flame, CheckCircle2, CalendarCheck, ListChecks, type LucideIcon } from 'lucide-react';

type PrayerKey = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

const PRAYERS: { key: PrayerKey; en: string; fr: string; ar: string; icon: LucideIcon }[] = [
  { key: 'fajr', en: 'Fajr', fr: 'Fajr', ar: 'الفجر', icon: Sunrise },
  { key: 'dhuhr', en: 'Dhuhr', fr: 'Dhuhr', ar: 'الظهر', icon: Sun },
  { key: 'asr', en: 'Asr', fr: 'Asr', ar: 'العصر', icon: CloudSun },
  { key: 'maghrib', en: 'Maghrib', fr: 'Maghrib', ar: 'المغرب', icon: Sunset },
  { key: 'isha', en: 'Isha', fr: 'Isha', ar: 'العشاء', icon: Moon },
];

const WEEKDAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

const PrayerTracker: React.FC<{ embedded?: boolean }> = ({ embedded = false }) => {
  const tr = useTr();
  const today = useQuery(api.prayers.getToday);
  const stats = useQuery(api.prayers.getStats);
  const toggle = useMutation(api.prayers.togglePrayer);

  const handleToggle = (prayer: PrayerKey) => {
    toggle({ prayer }).catch((e) =>
      toast.error(getErrorMessage(e, tr({
        en: 'Could not update your prayer log. Please try again.',
        fr: "Impossible de mettre à jour votre suivi. Veuillez réessayer.",
      }))),
    );
  };

  const logged = new Set(today?.logged ?? []);
  const todayCount = stats?.todayCount ?? logged.size;

  const statCards = [
    { icon: ListChecks, label: tr({ en: 'Today', fr: "Aujourd'hui" }), value: `${todayCount}/5`, sub: tr({ en: 'prayers', fr: 'prières' }) },
    { icon: Flame, label: tr({ en: 'Streak', fr: 'Série' }), value: stats?.streak ?? 0, sub: tr({ en: 'perfect days', fr: 'jours parfaits' }) },
    { icon: CheckCircle2, label: tr({ en: 'Perfect days', fr: 'Jours parfaits' }), value: stats?.perfectDays ?? 0, sub: tr({ en: 'last 90 days', fr: '90 derniers jours' }) },
    { icon: CalendarCheck, label: tr({ en: 'Total', fr: 'Total' }), value: stats?.totalLogged ?? 0, sub: tr({ en: 'logged', fr: 'enregistrées' }) },
  ];

  const weekdays = (d: number) => {
    const dow = new Date(d).getDay();
    return tr({ en: WEEKDAYS_EN[dow], fr: WEEKDAYS_FR[dow] });
  };

  return (
    <div className={embedded ? 'space-y-6' : 'max-w-4xl mx-auto w-full px-4 py-6 space-y-6'}>
      {embedded ? (
        <h2 className="text-xl font-bold text-foreground">
          {tr({ en: "Track today's prayers", fr: 'Suivez vos prières du jour' })}
        </h2>
      ) : (
        <PageHeader
          eyebrow={tr({ en: 'Worship', fr: 'Adoration' })}
          title={tr({ en: 'Prayer Tracker', fr: 'Suivi des prières' })}
          subtitle={tr({
            en: 'Mark each of the five daily prayers and build a consistent streak.',
            fr: 'Marquez chacune des cinq prières quotidiennes et construisez une série régulière.',
          })}
        />
      )}

      {/* Today's prayers — first, so the actionable toggles are above the fold */}
      <div className="islamic-card p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">
          {tr({ en: "Today's prayers", fr: "Prières d'aujourd'hui" })}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {PRAYERS.map((p) => {
            const done = logged.has(p.key);
            const Icon = p.icon;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => handleToggle(p.key)}
                aria-pressed={done}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-4 transition-all duration-200 ${
                  done
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm font-semibold">{tr({ en: p.en, fr: p.fr })}</span>
                <span className="font-arabic text-xs opacity-70">{p.ar}</span>
                {done && <CheckCircle2 className="w-4 h-4 mt-0.5" />}
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-muted-foreground mt-3">
          {tr({
            en: 'Tap a prayer to mark it complete. Tap again to undo.',
            fr: 'Touchez une prière pour la valider. Touchez à nouveau pour annuler.',
          })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map(({ icon: Icon, label, value, sub }) => (
          <div key={label} className="islamic-card p-3 sm:p-4 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-1 truncate">{label}</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground leading-none">{value}</p>
              <p className="text-xs text-muted-foreground mt-1 truncate">{sub}</p>
            </div>
            <div className="flex-shrink-0 p-2 sm:p-2.5 rounded-xl bg-accent/50 text-primary">
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* 7-day history */}
      <div className="islamic-card p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">
          {tr({ en: 'Last 7 days', fr: '7 derniers jours' })}
        </h2>
        <div className="flex items-end justify-between gap-2">
          {(stats?.history ?? []).map((day) => {
            const pct = Math.round((day.count / 5) * 100);
            const perfect = day.count >= 5;
            return (
              <div key={day.date} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full h-24 rounded-lg bg-muted/40 flex items-end overflow-hidden">
                  <div
                    className={`w-full rounded-lg transition-all duration-300 ${perfect ? 'bg-primary' : 'bg-primary/50'}`}
                    style={{ height: `${Math.max(pct, day.count > 0 ? 8 : 0)}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">{weekdays(day.date)}</span>
                <span className="text-[10px] font-semibold text-foreground">{day.count}/5</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PrayerTracker;
