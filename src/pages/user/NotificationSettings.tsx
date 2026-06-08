import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/auth/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import {
  Bell,
  BellOff,
  MapPin,
  BookOpen,
  Sun,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Loader2,
  Navigation,
} from "lucide-react";

// ─── types ────────────────────────────────────────────────────────────────────

type PermissionState = "granted" | "denied" | "default";

interface PrayerToggles {
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

interface NotificationSettingsState {
  prayers: PrayerToggles;
  prayerLocation: {
    lat: string;
    lng: string;
    timezone: string;
  };
  quranReminderEnabled: boolean;
  quranReminderTime: string;
  dailyContentEnabled: boolean;
  dailyContentTime: string;
}

// ─── constants ────────────────────────────────────────────────────────────────

const PRAYERS: { key: keyof PrayerToggles; en: string; fr: string; ar: string }[] = [
  { key: "fajr",    en: "Fajr",    fr: "Fajr",    ar: "الفجر" },
  { key: "dhuhr",   en: "Dhuhr",   fr: "Dhouhr",  ar: "الظهر" },
  { key: "asr",     en: "Asr",     fr: "Asr",     ar: "العصر" },
  { key: "maghrib", en: "Maghrib", fr: "Maghrib", ar: "المغرب" },
  { key: "isha",    en: "Isha",    fr: "Isha",    ar: "العشاء" },
];

const TIMEZONES = [
  { value: "Africa/Dakar",      label: "Africa/Dakar" },
  { value: "Africa/Abidjan",    label: "Africa/Abidjan" },
  { value: "Africa/Accra",      label: "Africa/Accra" },
  { value: "Africa/Lagos",      label: "Africa/Lagos" },
  { value: "Africa/Cairo",      label: "Africa/Cairo" },
  { value: "Africa/Nairobi",    label: "Africa/Nairobi" },
  { value: "Europe/London",     label: "Europe/London" },
  { value: "Europe/Paris",      label: "Europe/Paris" },
  { value: "Asia/Riyadh",       label: "Asia/Riyadh" },
  { value: "Asia/Dubai",        label: "Asia/Dubai" },
  { value: "Asia/Karachi",      label: "Asia/Karachi" },
  { value: "Asia/Jakarta",      label: "Asia/Jakarta" },
  { value: "America/New_York",  label: "America/New_York" },
];

const DEFAULT_SETTINGS: NotificationSettingsState = {
  prayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
  prayerLocation: { lat: "", lng: "", timezone: "Africa/Dakar" },
  quranReminderEnabled: false,
  quranReminderTime: "06:00",
  dailyContentEnabled: false,
  dailyContentTime: "08:00",
};

// ─── helpers ──────────────────────────────────────────────────────────────────

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

// ─── component ────────────────────────────────────────────────────────────────

const NotificationSettings: React.FC = () => {
  const { language } = useLanguage();
  const { profile } = useAuth();

  // Convex hooks — the modules are not yet in generated types, so we cast.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getVapidPublicKey = useAction((api as any).webPush.getVapidPublicKey);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const savedSettings = useQuery((api as any).notifications.getMySettings);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const saveSubscription = useMutation((api as any).notifications.saveSubscription);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const saveSettings = useMutation((api as any).notifications.saveSettings);

  // Permission state
  const [permission, setPermission] = useState<PermissionState>("default");

  // Local form state
  const [settings, setSettings] = useState<NotificationSettingsState>(DEFAULT_SETTINGS);

  // Loading flags
  const [subscribing, setSubscribing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);

  // ── on mount: read current permission + prefill from saved settings ──

  useEffect(() => {
    if (typeof Notification !== "undefined") {
      setPermission(Notification.permission as PermissionState);
    }
  }, []);

  useEffect(() => {
    if (!savedSettings) return;
    // Merge saved settings over defaults so missing keys are safe.
    setSettings((prev) => ({
      prayers: { ...prev.prayers, ...(savedSettings.prayers ?? {}) },
      prayerLocation: { ...prev.prayerLocation, ...(savedSettings.prayerLocation ?? {}) },
      quranReminderEnabled: savedSettings.quranReminderEnabled ?? false,
      quranReminderTime: savedSettings.quranReminderTime ?? "06:00",
      dailyContentEnabled: savedSettings.dailyContentEnabled ?? false,
      dailyContentTime: savedSettings.dailyContentTime ?? "08:00",
    }));
  }, [savedSettings]);

  // ── push subscription ──

  async function handleEnablePush() {
    if (typeof Notification === "undefined") {
      toast.error(tr("notifications.unsupported"));
      return;
    }
    setSubscribing(true);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm as PermissionState);
      if (perm !== "granted") {
        toast.error(tr("notifications.permDenied"));
        return;
      }

      const vapidKey: string | null = await getVapidPublicKey({});
      if (!vapidKey) {
        toast.error(tr("notifications.vapidError"));
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      const json = sub.toJSON();
      await saveSubscription({
        endpoint: json.endpoint!,
        p256dh: (json.keys as Record<string, string>).p256dh,
        auth: (json.keys as Record<string, string>).auth,
      });

      toast.success(tr("notifications.subscribed"));
    } catch (err) {
      console.error(err);
      toast.error(tr("notifications.subscribeError"));
    } finally {
      setSubscribing(false);
    }
  }

  // ── geolocation ──

  function handleUseLocation() {
    if (!navigator.geolocation) {
      toast.error(tr("notifications.geoUnsupported"));
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setSettings((prev) => ({
          ...prev,
          prayerLocation: {
            ...prev.prayerLocation,
            lat: pos.coords.latitude.toFixed(6),
            lng: pos.coords.longitude.toFixed(6),
          },
        }));
        setLocating(false);
        toast.success(tr("notifications.locationDetected"));
      },
      () => {
        setLocating(false);
        toast.error(tr("notifications.locationError"));
      }
    );
  }

  // ── save ──

  async function handleSave() {
    setSaving(true);
    try {
      await saveSettings(settings);
      toast.success(tr("notifications.saved"));
    } catch (err) {
      console.error(err);
      toast.error(tr("notifications.saveError"));
    } finally {
      setSaving(false);
    }
  }

  // ── i18n helper ──

  const strings: Record<string, { en: string; fr: string }> = {
    "page.title":              { en: "Notification Settings",       fr: "Paramètres de notifications" },
    "page.subtitle":           { en: "Manage how and when the app reminds you.", fr: "Gérez comment et quand l'application vous rappelle." },
    "push.title":              { en: "Browser Push Notifications",  fr: "Notifications push navigateur" },
    "push.desc":               { en: "Receive reminders even when the app is closed.", fr: "Recevez des rappels même lorsque l'application est fermée." },
    "push.enable":             { en: "Enable Push Notifications",   fr: "Activer les notifications push" },
    "push.enabled":            { en: "Push notifications are active.", fr: "Les notifications push sont actives." },
    "push.denied":             { en: "Permission denied. Open your browser settings to allow notifications for this site.", fr: "Permission refusée. Ouvrez les paramètres de votre navigateur pour autoriser les notifications pour ce site." },
    "perm.granted":            { en: "Granted",       fr: "Autorisé" },
    "perm.denied":             { en: "Denied",        fr: "Refusé" },
    "perm.default":            { en: "Not asked",     fr: "Non demandé" },
    "prayer.title":            { en: "Prayer Time Notifications",   fr: "Notifications pour les prières" },
    "prayer.desc":             { en: "Get notified at the start of each prayer time.", fr: "Soyez notifié au début de chaque heure de prière." },
    "location.title":          { en: "Your Location",               fr: "Votre localisation" },
    "location.desc":           { en: "Used to calculate accurate prayer times.", fr: "Utilisée pour calculer les horaires de prière précis." },
    "location.useBtn":         { en: "Use my location",             fr: "Utiliser ma position" },
    "location.lat":            { en: "Latitude",      fr: "Latitude" },
    "location.lng":            { en: "Longitude",     fr: "Longitude" },
    "location.timezone":       { en: "Timezone",      fr: "Fuseau horaire" },
    "quran.title":             { en: "Quran Reading Reminder",      fr: "Rappel de lecture du Coran" },
    "quran.desc":              { en: "A daily reminder to read the Quran.", fr: "Un rappel quotidien pour lire le Coran." },
    "quran.enable":            { en: "Enable Quran reminder",       fr: "Activer le rappel Coran" },
    "quran.time":              { en: "Reminder time",               fr: "Heure du rappel" },
    "daily.title":             { en: "Daily Content Reminder",      fr: "Rappel de contenu quotidien" },
    "daily.desc":              { en: "Daily ayah, hadith, or dua notification.", fr: "Notification quotidienne : verset, hadith ou dua." },
    "daily.enable":            { en: "Enable daily reminder",       fr: "Activer le rappel quotidien" },
    "daily.time":              { en: "Reminder time",               fr: "Heure du rappel" },
    "save":                    { en: "Save Settings",               fr: "Enregistrer" },
    "notifications.unsupported":   { en: "Push notifications not supported in this browser.", fr: "Notifications push non prises en charge dans ce navigateur." },
    "notifications.permDenied":    { en: "Permission denied.",       fr: "Permission refusée." },
    "notifications.vapidError":    { en: "Could not fetch server key.", fr: "Impossible de récupérer la clé serveur." },
    "notifications.subscribed":    { en: "Push notifications enabled!", fr: "Notifications push activées !" },
    "notifications.subscribeError":{ en: "Failed to enable notifications.", fr: "Impossible d'activer les notifications." },
    "notifications.geoUnsupported":{ en: "Geolocation not supported.", fr: "Géolocalisation non prise en charge." },
    "notifications.locationDetected": { en: "Location detected.", fr: "Localisation détectée." },
    "notifications.locationError":    { en: "Could not detect location.", fr: "Impossible de détecter la localisation." },
    "notifications.saved":     { en: "Settings saved.", fr: "Paramètres enregistrés." },
    "notifications.saveError": { en: "Failed to save settings.", fr: "Erreur lors de l'enregistrement." },
  };

  function tr(key: string): string {
    const entry = strings[key];
    if (!entry) return key;
    return language === "fr" ? entry.fr : entry.en;
  }

  // ── permission badge ──

  function PermissionBadge() {
    if (permission === "granted") {
      return (
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          {tr("perm.granted")}
        </Badge>
      );
    }
    if (permission === "denied") {
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200 flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          {tr("perm.denied")}
        </Badge>
      );
    }
    return (
      <Badge className="bg-stone-100 text-stone-600 border-stone-200 flex items-center gap-1">
        <HelpCircle className="w-3 h-3" />
        {tr("perm.default")}
      </Badge>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* ── Push permission card ── */}
      <Card className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Bell className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{tr("push.title")}</h2>
              <p className="text-sm text-muted-foreground">{tr("push.desc")}</p>
            </div>
          </div>
          <PermissionBadge />
        </div>

        {permission === "denied" && (
          <div className="flex items-start gap-3 rounded-lg bg-amber-50 border border-amber-200 p-4">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-800">{tr("push.denied")}</p>
          </div>
        )}

        {permission === "granted" ? (
          <div className="flex items-center gap-2 text-sm text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
            {tr("push.enabled")}
          </div>
        ) : permission !== "denied" ? (
          <Button
            onClick={handleEnablePush}
            disabled={subscribing}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {subscribing ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Bell className="w-4 h-4 mr-2" />
            )}
            {tr("push.enable")}
          </Button>
        ) : null}
      </Card>

      {/* ── Prayer time notifications ── */}
      <Card className="p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
            <Sun className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{tr("prayer.title")}</h2>
            <p className="text-sm text-muted-foreground">{tr("prayer.desc")}</p>
          </div>
        </div>

        {/* Individual prayer toggles */}
        <div className="space-y-3">
          {PRAYERS.map(({ key, en, fr, ar }) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-base font-medium text-foreground">
                  {language === "fr" ? fr : en}
                </span>
                <span className="text-sm text-stone-400 font-arabic" dir="rtl">
                  {ar}
                </span>
              </div>
              <Switch
                checked={settings.prayers[key]}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    prayers: { ...prev.prayers, [key]: checked },
                  }))
                }
              />
            </div>
          ))}
        </div>

        {/* Location section */}
        <div className="pt-2 space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <h3 className="font-medium text-foreground">{tr("location.title")}</h3>
          </div>
          <p className="text-sm text-muted-foreground -mt-2">{tr("location.desc")}</p>

          <Button
            variant="outline"
            size="sm"
            onClick={handleUseLocation}
            disabled={locating}
            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          >
            {locating ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Navigation className="w-4 h-4 mr-2" />
            )}
            {tr("location.useBtn")}
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="lat" className="text-sm font-medium">
                {tr("location.lat")}
              </Label>
              <input
                id="lat"
                type="number"
                step="any"
                placeholder="14.692778"
                value={settings.prayerLocation.lat}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    prayerLocation: { ...prev.prayerLocation, lat: e.target.value },
                  }))
                }
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lng" className="text-sm font-medium">
                {tr("location.lng")}
              </Label>
              <input
                id="lng"
                type="number"
                step="any"
                placeholder="-17.446667"
                value={settings.prayerLocation.lng}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    prayerLocation: { ...prev.prayerLocation, lng: e.target.value },
                  }))
                }
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="timezone" className="text-sm font-medium">
              {tr("location.timezone")}
            </Label>
            <select
              id="timezone"
              value={settings.prayerLocation.timezone}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  prayerLocation: { ...prev.prayerLocation, timezone: e.target.value },
                }))
              }
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* ── Quran reading reminder ── */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold text-foreground">{tr("quran.title")}</h2>
                <p className="text-sm text-muted-foreground">{tr("quran.desc")}</p>
              </div>
              <Switch
                checked={settings.quranReminderEnabled}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, quranReminderEnabled: checked }))
                }
              />
            </div>
          </div>
        </div>

        {settings.quranReminderEnabled && (
          <div className="space-y-1.5 pt-1">
            <Label htmlFor="quran-time" className="text-sm font-medium">
              {tr("quran.time")}
            </Label>
            <input
              id="quran-time"
              type="time"
              value={settings.quranReminderTime}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, quranReminderTime: e.target.value }))
              }
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500"
            />
          </div>
        )}
      </Card>

      {/* ── Daily content reminder ── */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
            <BellOff className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold text-foreground">{tr("daily.title")}</h2>
                <p className="text-sm text-muted-foreground">{tr("daily.desc")}</p>
              </div>
              <Switch
                checked={settings.dailyContentEnabled}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, dailyContentEnabled: checked }))
                }
              />
            </div>
          </div>
        </div>

        {settings.dailyContentEnabled && (
          <div className="space-y-1.5 pt-1">
            <Label htmlFor="daily-time" className="text-sm font-medium">
              {tr("daily.time")}
            </Label>
            <input
              id="daily-time"
              type="time"
              value={settings.dailyContentTime}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, dailyContentTime: e.target.value }))
              }
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500"
            />
          </div>
        )}
      </Card>

      {/* ── Save button ── */}
      <div className="pb-2">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
          size="lg"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <CheckCircle2 className="w-4 h-4 mr-2" />
          )}
          {tr("save")}
        </Button>
      </div>
    </div>
  );
};

export default NotificationSettings;
