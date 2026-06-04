import * as React from "react";
import { useTr, type Loc } from "@/lib/i18n";
import {
  Clock,
  Sunrise,
  Sunset,
  Moon,
  MapPin,
  RefreshCw,
  AlertCircle,
  Loader2,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AladhanTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
}

interface AladhanResponse {
  data: {
    timings: AladhanTimings;
  };
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_LAT = 14.4228;
const DEFAULT_LNG = -16.9646;
const DEFAULT_LOCATION_EN = "Mbour, Senegal";
const DEFAULT_LOCATION_FR = "Mbour, S├⌐n├⌐gal";

const LS_METHOD_KEY = "prayerTimes_method";
const LS_SCHOOL_KEY = "prayerTimes_school";

const CALC_METHODS: { value: number; label: Loc }[] = [
  { value: 3, label: { en: "Muslim World League", fr: "Ligue mondiale islamique" } },
  { value: 2, label: { en: "ISNA (North America)", fr: "ISNA (Am├⌐rique du Nord)" } },
  { value: 5, label: { en: "Egyptian General Authority", fr: "Autorit├⌐ g├⌐n├⌐rale d'├ëgypte" } },
  { value: 1, label: { en: "Karachi (HanafiUO)", fr: "Karachi (HanafiUO)" } },
  { value: 4, label: { en: "Umm al-Qura (Mecca)", fr: "Umm al-Qura (La Mecque)" } },
  { value: 12, label: { en: "UOIF (France)", fr: "UOIF (France)" } },
];

const SCHOOLS: { value: number; label: Loc }[] = [
  { value: 0, label: { en: "Standard (Shafi'i / Maliki / Hanbali)", fr: "Standard (Shafi'i / Maliki / Hanbali)" } },
  { value: 1, label: { en: "Hanafi", fr: "Hanafi" } },
];

// ---------------------------------------------------------------------------
// Time helpers
// ---------------------------------------------------------------------------

/** Strip anything after/including a space in an API time string ("05:19 (GMT)" ΓåÆ "05:19") */
function stripTimeSuffix(raw: string): string {
  return raw.slice(0, 5);
}

/** Parse "HH:MM" into total minutes from midnight */
function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Add `delta` minutes to an "HH:MM" string; wraps at 24h */
function addMinutes(hhmm: string, delta: number): string {
  const total = (toMinutes(hhmm) + delta + 1440) % 1440;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Format "HH:MM" (24h) ΓåÆ "h:mm AM/PM" */
function to12h(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr;
  const suffix = h < 12 ? "AM" : "PM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h}:${m} ${suffix}`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const IconChip: React.FC<{ icon: React.ReactNode }> = ({ icon }) => (
  <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-accent/50 text-primary flex-shrink-0">
    {icon}
  </span>
);

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-2">
    {children}
  </p>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const PrayerTimes: React.FC = () => {
  const tr = useTr();

  // ---- Location state ----
  const [coords, setCoords] = React.useState<{ lat: number; lng: number }>({
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
  });
  const [locationLabel, setLocationLabel] = React.useState<string>("");

  // ---- Controls state (persisted) ----
  const [method, setMethod] = React.useState<number>(() => {
    const saved = localStorage.getItem(LS_METHOD_KEY);
    return saved ? parseInt(saved, 10) : 3;
  });
  const [school, setSchool] = React.useState<number>(() => {
    const saved = localStorage.getItem(LS_SCHOOL_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });

  // ---- Data state ----
  const [timings, setTimings] = React.useState<AladhanTimings | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // ---- Countdown state ----
  const [now, setNow] = React.useState(() => new Date());

  // ---- Ticker ----
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // ---- Persist settings ----
  React.useEffect(() => {
    localStorage.setItem(LS_METHOD_KEY, String(method));
  }, [method]);
  React.useEffect(() => {
    localStorage.setItem(LS_SCHOOL_KEY, String(school));
  }, [school]);

  // ---- Try geolocation on mount ----
  const tryGeolocation = React.useCallback(() => {
    if (!navigator.geolocation) {
      setCoords({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
      setLocationLabel("");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationLabel(
          tr({ en: "Your location", fr: "Votre position" })
        );
      },
      () => {
        setCoords({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
        setLocationLabel("");
      }
    );
  }, [tr]);

  React.useEffect(() => {
    tryGeolocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Fetch prayer times ----
  React.useEffect(() => {
    const fetchTimes = async () => {
      setLoading(true);
      setError(null);
      try {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const yyyy = today.getFullYear();
        const url = `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${coords.lat}&longitude=${coords.lng}&method=${method}&school=${school}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: AladhanResponse = await res.json();
        const raw = json.data.timings;
        // Strip suffixes from every key
        const cleaned: AladhanTimings = {} as AladhanTimings;
        (Object.keys(raw) as (keyof AladhanTimings)[]).forEach((k) => {
          cleaned[k] = stripTimeSuffix(raw[k]);
        });
        setTimings(cleaned);
      } catch (e) {
        console.error("Prayer times fetch failed:", e);
        setError(
          tr({
            en: "Could not load prayer times. Please check your connection and try again.",
            fr: "Impossible de charger les heures de pri├¿re. V├⌐rifiez votre connexion et r├⌐essayez.",
          })
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTimes();
    // `tr` is intentionally excluded: it gets a new identity every render, and the
    // 1s countdown ticker re-renders this component each second ΓÇö including it here
    // would refetch the API every second and flicker the page. Language changes
    // don't need a refetch (only the error string would differ).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords, method, school]);

  // ---------------------------------------------------------------------------
  // Derived: next fard prayer + countdown
  // ---------------------------------------------------------------------------

  const FARD_PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
  type FardPrayer = (typeof FARD_PRAYERS)[number];

  const nextPrayer = React.useMemo<{
    name: FardPrayer;
    hhmm: string;
    secondsLeft: number;
  } | null>(() => {
    if (!timings) return null;
    const nowMins = now.getHours() * 60 + now.getMinutes();
    const nowSecs = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    for (const p of FARD_PRAYERS) {
      const t = toMinutes(timings[p]);
      if (t > nowMins) {
        const targetSecs = t * 60;
        return {
          name: p,
          hhmm: timings[p],
          secondsLeft: targetSecs - nowSecs,
        };
      }
    }
    // All passed ΓåÆ Fajr tomorrow
    const fajrMins = toMinutes(timings.Fajr);
    const minutesUntilMidnight = 1440 - nowMins;
    const secsUntilFajrTomorrow =
      (minutesUntilMidnight + fajrMins) * 60 - now.getSeconds();
    return {
      name: "Fajr",
      hhmm: timings.Fajr,
      secondsLeft: secsUntilFajrTomorrow,
    };
  }, [timings, now]);

  // Format countdown seconds ΓåÆ HH:MM:SS
  const countdownStr = React.useMemo(() => {
    if (!nextPrayer) return "--:--:--";
    const s = Math.max(0, nextPrayer.secondsLeft);
    const hh = Math.floor(s / 3600);
    const mm = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  }, [nextPrayer]);

  // Prayer name translations
  const prayerNameMap: Record<string, Loc> = {
    Fajr: { en: "Fajr", fr: "Fajr" },
    Sunrise: { en: "Sunrise", fr: "Lever du soleil" },
    Dhuhr: { en: "Dhuhr", fr: "Dhuhr" },
    Asr: { en: "Asr", fr: "Asr" },
    Sunset: { en: "Sunset", fr: "Coucher du soleil" },
    Maghrib: { en: "Maghrib", fr: "Maghrib" },
    Isha: { en: "Isha", fr: "Isha" },
  };

  // ---------------------------------------------------------------------------
  // Effective location label
  // ---------------------------------------------------------------------------

  const effectiveLabel =
    locationLabel ||
    tr({ en: DEFAULT_LOCATION_EN, fr: DEFAULT_LOCATION_FR });

  // ---------------------------------------------------------------------------
  // Nafl timings (computed from prayer times)
  // ---------------------------------------------------------------------------

  const naflTimings = React.useMemo(() => {
    if (!timings) return null;
    const ishraq = addMinutes(timings.Sunrise, 18);
    const chasht = addMinutes(timings.Sunrise, 45);
    const zawalStart = addMinutes(timings.Dhuhr, -15);
    return { ishraq, chasht, zawalStart };
  }, [timings]);

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------

  const renderFardList = () => {
    if (!timings) return null;
    const prayers: { key: FardPrayer | "Sunrise"; isFard: boolean }[] = [
      { key: "Fajr", isFard: true },
      { key: "Sunrise", isFard: false },
      { key: "Dhuhr", isFard: true },
      { key: "Asr", isFard: true },
      { key: "Maghrib", isFard: true },
      { key: "Isha", isFard: true },
    ];

    return prayers.map(({ key, isFard }) => {
      const hhmm = timings[key as keyof AladhanTimings];
      const isNext = isFard && nextPrayer?.name === key;
      return (
        <div
          key={key}
          className={`flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors ${
            isNext
              ? "bg-primary/8 border border-primary/20"
              : "hover:bg-secondary/50"
          }`}
        >
          <div className="flex items-center gap-3">
            <IconChip
              icon={
                key === "Fajr" || key === "Sunrise" ? (
                  <Sunrise className="w-4 h-4" />
                ) : key === "Maghrib" || key === "Isha" ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )
              }
            />
            <div>
              <p className={`font-semibold text-sm ${isNext ? "text-primary" : "text-foreground"}`}>
                {tr(prayerNameMap[key])}
              </p>
              {!isFard && (
                <p className="text-xs text-muted-foreground">
                  {tr({ en: "Informational", fr: "Informatif" })}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isNext && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground">
                {tr({ en: "Next", fr: "Suivant" })}
              </span>
            )}
            <span className={`text-base font-bold tabular-nums ${isNext ? "text-primary" : "text-foreground"}`}>
              {to12h(hhmm)}
            </span>
          </div>
        </div>
      );
    });
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div>
      <section className="container py-8 md:py-10 space-y-8">
        {/* Page header */}
        <header>
          <SectionLabel>{tr({ en: "Daily Worship", fr: "Culte quotidien" })}</SectionLabel>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {tr({ en: "Prayer Times", fr: "Horaires de pri├¿re" })}
          </h1>
          <p className="mt-2 text-muted-foreground text-base max-w-xl">
            {tr({
              en: "Accurate daily prayer times for your location, with countdown to the next prayer.",
              fr: "Horaires de pri├¿re quotidiens pr├⌐cis pour votre position, avec compte ├á rebours.",
            })}
          </p>
        </header>

        {/* Controls card */}
        <div className="islamic-card p-5">
          <div className="flex flex-wrap items-start gap-4 sm:gap-6">
            {/* Location */}
            <div className="flex-1 min-w-[180px]">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-1 font-semibold">
                {tr({ en: "Location", fr: "Localisation" })}
              </p>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm font-medium text-foreground truncate max-w-[200px]">
                  {effectiveLabel}
                </span>
                <button
                  type="button"
                  onClick={tryGeolocation}
                  className="btn-islamic-outlined text-xs py-1 px-3 flex items-center gap-1"
                  title={tr({ en: "Use my location", fr: "Utiliser ma position" })}
                >
                  <MapPin className="w-3 h-3" />
                  {tr({ en: "Use my location", fr: "Ma position" })}
                </button>
              </div>
            </div>

            {/* Madhab */}
            <div className="min-w-[200px]">
              <label
                htmlFor="school-select"
                className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-1 font-semibold block"
              >
                {tr({ en: "Madhab / School", fr: "Madhab / ├ëcole" })}
              </label>
              <select
                id="school-select"
                value={school}
                onChange={(e) => setSchool(parseInt(e.target.value, 10))}
                className="w-full text-sm bg-card border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {SCHOOLS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {tr(s.label)}
                  </option>
                ))}
              </select>
            </div>

            {/* Calculation method */}
            <div className="min-w-[220px] flex-1">
              <label
                htmlFor="method-select"
                className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-1 font-semibold block"
              >
                {tr({ en: "Calculation Method", fr: "M├⌐thode de calcul" })}
              </label>
              <select
                id="method-select"
                value={method}
                onChange={(e) => setMethod(parseInt(e.target.value, 10))}
                className="w-full text-sm bg-card border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {CALC_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {tr(m.label)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="islamic-card p-10 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm">
              {tr({ en: "Fetching prayer timesΓÇª", fr: "Chargement des horairesΓÇª" })}
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="islamic-card p-6 flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setError(null);
                // Re-trigger by flipping coords identity via a tiny copy
                setCoords((c) => ({ ...c }));
              }}
              className="btn-islamic gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {tr({ en: "Retry", fr: "R├⌐essayer" })}
            </button>
          </div>
        )}

        {/* Main content ΓÇö only when data is ready */}
        {!loading && !error && timings && (
          <>
            {/* Next Prayer Hero */}
            <div className="islamic-card overflow-hidden">
              <div className="relative bg-gradient-to-br from-primary/10 via-accent/10 to-secondary p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-20 translate-x-20 pointer-events-none" />
                <div className="text-center md:text-left">
                  <SectionLabel>
                    {tr({ en: "Next Prayer", fr: "Prochaine pri├¿re" })}
                  </SectionLabel>
                  <p className="text-4xl md:text-5xl font-bold text-foreground mb-1">
                    {nextPrayer
                      ? tr(prayerNameMap[nextPrayer.name])
                      : "ΓÇö"}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {tr({ en: "at", fr: "├á" })}{" "}
                    <span className="font-semibold text-foreground">
                      {nextPrayer ? to12h(nextPrayer.hhmm) : "ΓÇö"}
                    </span>
                  </p>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px h-20 bg-border" />
                <div className="h-px w-24 md:hidden bg-border" />

                {/* Countdown */}
                <div className="text-center">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1 font-semibold">
                    {tr({ en: "Time remaining", fr: "Temps restant" })}
                  </p>
                  <p className="font-mono text-4xl md:text-5xl font-bold text-primary tabular-nums leading-none tracking-tight">
                    {countdownStr}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {tr({ en: "HH : MM : SS", fr: "HH : MM : SS" })}
                  </p>
                </div>
              </div>
            </div>

            {/* Two-column grid for the two lists */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Fardh Prayers */}
              <div className="islamic-card p-5">
                <div className="flex items-center gap-3 mb-4">
                  <IconChip icon={<Clock className="w-4 h-4" />} />
                  <div>
                    <SectionLabel>
                      {tr({ en: "Obligatory Prayers", fr: "Pri├¿res obligatoires" })}
                    </SectionLabel>
                    <h2 className="text-lg font-bold text-foreground -mt-1">
                      {tr({ en: "Fardh Prayer Times", fr: "Horaires Fardh" })}
                    </h2>
                  </div>
                </div>
                <div className="space-y-1">{renderFardList()}</div>
              </div>

              {/* Suhur, Iftar & Nafl */}
              <div className="islamic-card p-5">
                <div className="flex items-center gap-3 mb-4">
                  <IconChip icon={<Moon className="w-4 h-4" />} />
                  <div>
                    <SectionLabel>
                      {tr({ en: "Fasting & Optional Prayers", fr: "Je├╗ne & pri├¿res sur├⌐rogatoires" })}
                    </SectionLabel>
                    <h2 className="text-lg font-bold text-foreground -mt-1">
                      {tr({ en: "Suhur, Iftar & Nafl", fr: "Suhur, Iftar & Nafl" })}
                    </h2>
                  </div>
                </div>

                <div className="space-y-2">
                  {/* Suhur */}
                  <NaflRow
                    icon={<Moon className="w-4 h-4" />}
                    title={tr({ en: "Suhur", fr: "Suhur" })}
                    subtitle={tr({ en: "End of eating for fasting", fr: "Fin du repas avant le je├╗ne" })}
                    time={tr({
                      en: `Until ${to12h(timings.Fajr)}`,
                      fr: `Jusqu'├á ${to12h(timings.Fajr)}`,
                    })}
                  />

                  {/* Imsak */}
                  <NaflRow
                    icon={<Clock className="w-4 h-4" />}
                    title={tr({ en: "Imsak", fr: "Imsak" })}
                    subtitle={tr({ en: "Precautionary end of suhoor", fr: "Fin pr├⌐ventive du suhoor" })}
                    time={to12h(timings.Imsak)}
                  />

                  {/* Iftar */}
                  <NaflRow
                    icon={<Sunset className="w-4 h-4" />}
                    title={tr({ en: "Iftar", fr: "Iftar" })}
                    subtitle={tr({ en: "Break your fast", fr: "Rompez votre je├╗ne" })}
                    time={to12h(timings.Maghrib)}
                  />

                  {/* Tahajjud */}
                  <NaflRow
                    icon={<Moon className="w-4 h-4" />}
                    title={tr({ en: "Tahajjud", fr: "Tahajjud" })}
                    subtitle={tr({ en: "Last third of night ΓÇö most blessed", fr: "Dernier tiers de la nuit ΓÇö le plus b├⌐ni" })}
                    time={`${to12h(timings.Lastthird)} ΓÇô ${to12h(timings.Fajr)}`}
                  />

                  {/* Ishraq */}
                  {naflTimings && (
                    <NaflRow
                      icon={<Sunrise className="w-4 h-4" />}
                      title={tr({ en: "Ishraq", fr: "Ishraq" })}
                      subtitle={tr({ en: "15ΓÇô20 min after sunrise", fr: "15ΓÇô20 min apr├¿s le lever du soleil" })}
                      time={to12h(naflTimings.ishraq)}
                    />
                  )}

                  {/* Chasht / Duha */}
                  {naflTimings && (
                    <NaflRow
                      icon={<Sunrise className="w-4 h-4" />}
                      title={tr({ en: "Chasht (Duha)", fr: "Chasht (Duha)" })}
                      subtitle={tr({ en: "Mid-morning prayer", fr: "Pri├¿re du milieu de matin├⌐e" })}
                      time={to12h(naflTimings.chasht)}
                    />
                  )}

                  {/* Zawal */}
                  {naflTimings && (
                    <NaflRow
                      icon={<Clock className="w-4 h-4" />}
                      title={tr({ en: "Zawal (Forbidden)", fr: "Zawal (Interdit)" })}
                      subtitle={tr({ en: "Avoid prayer during this time", fr: "├ëvitez de prier pendant cette p├⌐riode" })}
                      time={`${to12h(naflTimings.zawalStart)} ΓÇô ${to12h(timings.Dhuhr)}`}
                      highlight="destructive"
                    />
                  )}

                  {/* Midnight */}
                  <NaflRow
                    icon={<Moon className="w-4 h-4" />}
                    title={tr({ en: "Islamic Midnight", fr: "Minuit islamique" })}
                    subtitle={tr({ en: "Midpoint between Maghrib and Fajr", fr: "Mi-chemin entre Maghrib et Fajr" })}
                    time={to12h(timings.Midnight)}
                  />
                </div>
              </div>
            </div>

            {/* Date row */}
            <p className="text-center text-xs text-muted-foreground">
              {tr({ en: "Times for", fr: "Horaires pour" })}{" "}
              <span className="font-semibold text-foreground">{effectiveLabel}</span>
              {" ┬╖ "}
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </>
        )}
      </section>
    </div>
  );
};

// ---------------------------------------------------------------------------
// NaflRow helper component
// ---------------------------------------------------------------------------

interface NaflRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  time: string;
  highlight?: "destructive";
}

const NaflRow: React.FC<NaflRowProps> = ({ icon, title, subtitle, time, highlight }) => {
  const isDestructive = highlight === "destructive";
  return (
    <div
      className={`flex items-center justify-between py-2 px-3 rounded-xl ${
        isDestructive ? "bg-destructive/5 border border-destructive/20" : "hover:bg-secondary/50"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={`inline-flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 ${
            isDestructive
              ? "bg-destructive/10 text-destructive"
              : "bg-accent/50 text-primary"
          }`}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p
            className={`text-sm font-semibold truncate ${
              isDestructive ? "text-destructive" : "text-foreground"
            }`}
          >
            {title}
          </p>
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        </div>
      </div>
      <span
        className={`text-sm font-bold tabular-nums flex-shrink-0 ml-3 ${
          isDestructive ? "text-destructive" : "text-foreground"
        }`}
      >
        {time}
      </span>
    </div>
  );
};

export default PrayerTimes;

