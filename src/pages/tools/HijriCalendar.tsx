import { useMemo, useState } from 'react';
import { CalendarDays, Moon, Star, ChevronLeft, ChevronRight, Locate } from 'lucide-react';
import { useTr } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  toHijri,
  hijriMonthName,
  hijriMonthNameAr,
  isWhiteDay,
  eventOn,
  eventsInHijriMonth,
  computeUpcomingEvents,
} from '@/lib/hijri';

/** Local-midnight Date for the given y/m/d (m is 0-based, JS convention). */
function makeDate(year: number, month: number, day: number): Date {
  return new Date(year, month, day);
}

/** Whether two Dates fall on the same calendar day (local). */
function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function HijriCalendar() {
  const tr = useTr();
  const { language } = useLanguage();
  const locale = language === 'fr' ? 'fr-FR' : 'en-US';

  const today = useMemo(() => {
    const now = new Date();
    return makeDate(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  // The Gregorian month currently displayed in the grid (anchored to its 1st).
  const [viewDate, setViewDate] = useState<Date>(() =>
    makeDate(today.getFullYear(), today.getMonth(), 1),
  );

  const todayHijri = useMemo(() => toHijri(today), [today]);

  // --- Today header labels -------------------------------------------------
  const todayHijriLabel = `${todayHijri.day} ${hijriMonthName(
    todayHijri.month,
    language,
  )} ${todayHijri.year} ${tr({ en: 'AH', fr: 'AH' })}`;
  const todayGregorianLabel = `${today.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })} ${tr({ en: 'CE', fr: 'EC' })}`;

  // --- Calendar grid -------------------------------------------------------
  const grid = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstOfMonth = makeDate(year, month, 1);
    const leadingBlanks = firstOfMonth.getDay(); // 0 = Sunday
    const daysInMonth = makeDate(year, month + 1, 0).getDate();

    const cells: Array<{ date: Date } | null> = [];
    for (let i = 0; i < leadingBlanks; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push({ date: makeDate(year, month, d) });
    // Pad to a whole number of weeks for a clean grid.
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [viewDate]);

  // Dominant Hijri month/year for the displayed Gregorian month (use the 15th).
  const dominantHijri = useMemo(() => {
    const mid = makeDate(viewDate.getFullYear(), viewDate.getMonth(), 15);
    return toHijri(mid);
  }, [viewDate]);

  // Localized weekday short names, Sunday-first.
  const weekdayNames = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    // 2024-01-07 is a Sunday — anchor for stable Sun→Sat ordering.
    return Array.from({ length: 7 }, (_, i) =>
      fmt.format(new Date(2024, 0, 7 + i)),
    );
  }, [locale]);

  const gregMonthLabel = viewDate.toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
  });

  // --- Upcoming events -----------------------------------------------------
  const upcoming = useMemo(() => computeUpcomingEvents(today), [today]);

  // --- Events in the currently displayed Hijri month -----------------------
  const monthEvents = useMemo(
    () => eventsInHijriMonth(dominantHijri.month),
    [dominantHijri.month],
  );

  const goPrevMonth = () =>
    setViewDate((d) => makeDate(d.getFullYear(), d.getMonth() - 1, 1));
  const goNextMonth = () =>
    setViewDate((d) => makeDate(d.getFullYear(), d.getMonth() + 1, 1));
  const goToday = () =>
    setViewDate(makeDate(today.getFullYear(), today.getMonth(), 1));

  const chip = 'inline-flex items-center justify-center rounded-lg bg-accent/50 text-primary';

  return (
    <div>
      <section className="container py-8 md:py-10 space-y-6">
        {/* Header */}
        <header>
          <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-muted-foreground mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
            {tr({ en: 'Tools', fr: 'Outils' })}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {tr({ en: 'Hijri Calendar', fr: 'Calendrier Hégirien' })}
          </h1>
          <p className="mt-2 text-muted-foreground max-w-xl">
            {tr({
              en: 'Follow the Islamic lunar months, recommended fasting days, and the year’s sacred observances.',
              fr: 'Suivez les mois lunaires islamiques, les jours de jeûne recommandés et les célébrations sacrées de l’année.',
            })}
          </p>
        </header>

        {/* Calendar (main) + info rail, side by side to minimize scrolling */}
        <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
          {/* ---- Calendar grid ---- */}
          <div className="lg:col-span-2 islamic-card p-5 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <span className={`${chip} w-10 h-10 shrink-0`}>
                  <CalendarDays className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-xl font-semibold text-foreground leading-tight">
                    {hijriMonthName(dominantHijri.month, language)} {dominantHijri.year}
                  </h2>
                  <p className="text-sm text-muted-foreground capitalize">{gregMonthLabel}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goPrevMonth}
                  aria-label={tr({ en: 'Previous month', fr: 'Mois précédent' })}
                  className="btn-islamic-outlined h-9 w-9 inline-flex items-center justify-center p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={goToday}
                  className="btn-islamic h-9 inline-flex items-center gap-1.5 px-3 text-sm"
                >
                  <Locate className="w-4 h-4" />
                  {tr({ en: 'Today', fr: 'Aujourd’hui' })}
                </button>
                <button
                  type="button"
                  onClick={goNextMonth}
                  aria-label={tr({ en: 'Next month', fr: 'Mois suivant' })}
                  className="btn-islamic-outlined h-9 w-9 inline-flex items-center justify-center p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekday header */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {weekdayNames.map((name, i) => (
                <div
                  key={i}
                  className="text-center text-xs font-medium uppercase tracking-wide text-muted-foreground py-1"
                >
                  {name}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-1">
              {grid.map((cell, i) => {
                if (!cell) {
                  return <div key={i} className="aspect-square rounded-lg" aria-hidden="true" />;
                }
                const h = toHijri(cell.date);
                const today_ = isSameDay(cell.date, today);
                const white = isWhiteDay(h.day);
                const event = eventOn(h.month, h.day);

                const base =
                  'relative aspect-square rounded-lg border flex flex-col items-center justify-center transition-colors';
                const tone = today_
                  ? 'border-primary bg-primary/10 ring-1 ring-primary'
                  : white
                    ? 'border-accent bg-accent/50'
                    : 'border-border bg-card hover:bg-accent/30';

                return (
                  <div key={i} className={`${base} ${tone}`}>
                    {event && (
                      <span
                        className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary"
                        title={tr(event.name)}
                      />
                    )}
                    <span
                      className={`text-sm md:text-base font-semibold leading-none ${
                        today_ ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {cell.date.getDate()}
                    </span>
                    <span className="mt-0.5 text-[10px] md:text-xs text-muted-foreground leading-none">
                      {h.day}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 pt-4 border-t border-border text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-primary/10 ring-1 ring-primary" />
                {tr({ en: 'Today', fr: 'Aujourd’hui' })}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {tr({ en: 'Event', fr: 'Événement' })}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-accent/50 border border-accent" />
                {tr({ en: 'White Days', fr: 'Jours blancs' })}
              </span>
            </div>
          </div>

          {/* ---- Info rail ---- */}
          <div className="space-y-6">
            {/* Today (compact) */}
            <div className="islamic-card p-5">
              <div className="flex items-start gap-3">
                <span className={`${chip} w-10 h-10 shrink-0`}>
                  <Moon className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-0.5">
                    {tr({ en: 'Today', fr: 'Aujourd’hui' })}
                  </p>
                  <p className="text-lg font-bold text-foreground leading-snug">{todayHijriLabel}</p>
                  <p className="text-sm text-muted-foreground">{todayGregorianLabel}</p>
                  <p className="mt-1 font-arabic text-base text-primary" dir="rtl">
                    {todayHijri.day} {hijriMonthNameAr(todayHijri.month)} {todayHijri.year}
                  </p>
                </div>
              </div>
            </div>

            {/* Upcoming events */}
            <div className="islamic-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className={`${chip} w-9 h-9 shrink-0`}>
                  <Star className="w-4 h-4" />
                </span>
                <h2 className="text-base font-semibold text-foreground">
                  {tr({ en: 'Upcoming Events', fr: 'Événements à venir' })}
                </h2>
              </div>
              <ul className="space-y-2.5">
                {upcoming.slice(0, 4).map((e) => (
                  <li
                    key={e.id}
                    className="rounded-lg border border-border bg-card p-3 hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-foreground">{tr(e.name)}</p>
                      <span className="shrink-0 text-xs font-medium text-primary whitespace-nowrap">
                        {e.gregorian.toLocaleDateString(locale, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {e.hijri.day} {hijriMonthName(e.hijri.month, language)} {e.hijri.year}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* White Days explainer */}
            <div className="islamic-card p-5">
              <div className="flex items-center gap-3 mb-2.5">
                <span className={`${chip} w-9 h-9 shrink-0`}>
                  <Moon className="w-4 h-4" />
                </span>
                <h2 className="text-base font-semibold text-foreground">
                  {tr({ en: 'White Days', fr: 'Les Jours blancs' })}
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {tr({
                  en: 'The 13th, 14th, and 15th of each Hijri month are recommended fasting days, named for the full moon that illuminates the night.',
                  fr: 'Les 13e, 14e et 15e jours de chaque mois hégirien sont des jours de jeûne recommandés, nommés d’après la pleine lune qui illumine la nuit.',
                })}
              </p>
            </div>

            {/* Events in the currently displayed Hijri month */}
            <div className="islamic-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className={`${chip} w-9 h-9 shrink-0`}>
                  <CalendarDays className="w-4 h-4" />
                </span>
                <h2 className="text-base font-semibold text-foreground">
                  {tr({ en: 'Events in', fr: 'Événements en' })}{' '}
                  {hijriMonthName(dominantHijri.month, language)}
                </h2>
              </div>
              {monthEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {tr({
                    en: 'No notable observances this month — a calm month for steady worship.',
                    fr: 'Aucune célébration notable ce mois-ci — un mois paisible pour une adoration constante.',
                  })}
                </p>
              ) : (
                <ul className="space-y-3">
                  {monthEvents.map((e) => (
                    <li key={e.id} className="flex items-start gap-3">
                      <span className="mt-0.5 shrink-0 inline-flex items-center justify-center min-w-7 h-7 px-1.5 rounded-md bg-secondary text-xs font-bold text-accent-foreground">
                        {e.day}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{tr(e.name)}</p>
                        <p className="text-sm text-muted-foreground">{tr(e.description)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
