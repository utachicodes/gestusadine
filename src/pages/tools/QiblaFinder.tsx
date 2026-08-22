import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Compass, MapPin, RotateCcw, AlertCircle, Loader2 } from "lucide-react";

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;
const DEFAULT_LAT = 14.7167;
const DEFAULT_LNG = -17.4677;

function toRadians(deg: number) {
  return (deg * Math.PI) / 180;
}
function toDegrees(rad: number) {
  return (rad * 180) / Math.PI;
}

function calculateQiblaBearing(lat: number, lng: number): number {
  const dLng = toRadians(KAABA_LNG - lng);
  const lat1 = toRadians(lat);
  const lat2 = toRadians(KAABA_LAT);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return (toDegrees(Math.atan2(y, x)) + 360) % 360;
}

function distanceToKaaba(lat: number, lng: number): number {
  const R = 6371;
  const dLat = toRadians(KAABA_LAT - lat);
  const dLng = toRadians(KAABA_LNG - lng);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat)) * Math.cos(toRadians(KAABA_LAT)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const QiblaFinder: React.FC = () => {
  const { language } = useLanguage();
  const t = (en: string, fr: string) => (language === "fr" ? fr : en);

  const [coords, setCoords] = React.useState<{ lat: number; lng: number } | null>(null);
  const [heading, setHeading] = React.useState<number | null>(null);
  const [compassAvailable, setCompassAvailable] = React.useState<boolean | null>(null);
  const [permissionNeeded, setPermissionNeeded] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  const qiblaBearing = coords ? calculateQiblaBearing(coords.lat, coords.lng) : 0;
  const arrowAngle = heading !== null ? (qiblaBearing - heading + 360) % 360 : qiblaBearing;
  const distance = coords ? distanceToKaaba(coords.lat, coords.lng) : 0;

  // Get geolocation
  React.useEffect(() => {
    if (!navigator.geolocation) {
      setError(t("Geolocation not supported", "Géolocalisation non supportée"));
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      () => {
        setCoords({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
        setError(t("Location access denied. Showing default location (Dakar).", "Accès à la position refusé. Emplacement par défaut (Dakar)."));
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [t]);

  // Device orientation (compass)
  const startCompass = React.useCallback(() => {
    let hasRealCompass = false;

    const handler = (e: DeviceOrientationEvent) => {
      let h: number | null = null;
      if (e.webkitCompassHeading !== undefined) {
        h = e.webkitCompassHeading;
      } else if (e.alpha !== null) {
        h = (360 - e.alpha) % 360;
      }
      if (h !== null) {
        setHeading(h);
        if (!hasRealCompass) {
          hasRealCompass = true;
          setCompassAvailable(true);
        }
      }
    };

    window.addEventListener("deviceorientationabsolute", handler);
    window.addEventListener("deviceorientation", handler);

    // Detect if compass works after 2s
    setTimeout(() => {
      if (!hasRealCompass) {
        setCompassAvailable(false);
      }
    }, 2000);

    return () => {
      window.removeEventListener("deviceorientationabsolute", handler);
      window.removeEventListener("deviceorientation", handler);
    };
  }, []);

  React.useEffect(() => {
    if (typeof DeviceOrientationEvent !== "undefined" &&
        typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      setPermissionNeeded(true);
    } else if (typeof DeviceOrientationEvent !== "undefined") {
      const cleanup = startCompass();
      return cleanup;
    } else {
      setCompassAvailable(false);
    }
  }, [startCompass]);

  const requestPermission = async () => {
    try {
      const perm = await (DeviceOrientationEvent as any).requestPermission();
      if (perm === "granted") {
        setPermissionNeeded(false);
        startCompass();
      }
    } catch {
      setCompassAvailable(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{t("Getting your location...", "Obtention de votre position...")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mx-auto">
          <Compass className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">{t("Qibla Finder", "Trouver la Qibla")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("Face the direction of the Sacred Mosque in Makkah", "Facez la direction de la Mosquée Sacrée à La Mecque")}
        </p>
      </div>

      {/* Compass */}
      <div className="relative mx-auto" style={{ width: 280, height: 280 }}>
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-border bg-card shadow-lg" />

        {/* Direction marks */}
        <div className="absolute inset-0">
          {["N", "E", "S", "W"].map((dir, i) => {
            const angle = i * 90;
            const isN = dir === "N";
            return (
              <span
                key={dir}
                className={`absolute text-xs font-bold ${isN ? "text-primary" : "text-muted-foreground"}`}
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-120px)`,
                  transformOrigin: "0 0",
                }}
              >
                {dir}
              </span>
            );
          })}
        </div>

        {/* Degree ticks */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 280">
          {Array.from({ length: 72 }).map((_, i) => {
            const angle = i * 5;
            const isMajor = angle % 30 === 0;
            const r1 = isMajor ? 120 : 126;
            const r2 = 132;
            const rad = toRadians(angle - 90);
            return (
              <line
                key={i}
                x1={140 + r1 * Math.cos(rad)}
                y1={140 + r1 * Math.sin(rad)}
                x2={140 + r2 * Math.cos(rad)}
                y2={140 + r2 * Math.sin(rad)}
                stroke={isMajor ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground) / 0.3)"}
                strokeWidth={isMajor ? 2 : 1}
              />
            );
          })}
        </svg>

        {/* Qibla arrow */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-200"
          style={{ transform: `rotate(${heading !== null ? -heading : 0}deg)` }}
        >
          <div
            className="absolute transition-transform duration-300 ease-out"
            style={{ transform: `rotate(${qiblaBearing}deg)` }}
          >
            <div className="relative" style={{ marginTop: -130 }}>
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[40px] border-l-transparent border-r-transparent border-b-primary mx-auto" />
              <div className="w-2.5 h-2.5 rounded-full bg-primary mx-auto -mt-1" />
            </div>
          </div>
        </div>

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow-md" />
      </div>

      {/* Compass status */}
      {compassAvailable === false && (
        <div className="text-center">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            {t(
              "Compass not available — showing calculated direction only",
              "Boussole non disponible — direction calculée uniquement"
            )}
          </p>
        </div>
      )}

      {/* iOS permission button */}
      {permissionNeeded && (
        <div className="text-center">
          <button
            onClick={requestPermission}
            className="btn-islamic"
          >
            {t("Enable Compass", "Activer la boussole")}
          </button>
          <p className="text-xs text-muted-foreground mt-2">
            {t("iOS requires permission to access device orientation", "iOS nécessite l'autorisation d'accéder à l'orientation")}
          </p>
        </div>
      )}

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="islamic-card p-4 text-center space-y-1">
          <p className="text-2xl font-bold text-primary">{Math.round(qiblaBearing)}°</p>
          <p className="text-xs text-muted-foreground font-medium">{t("Bearing", "Direction")}</p>
        </div>
        <div className="islamic-card p-4 text-center space-y-1">
          <p className="text-2xl font-bold text-primary">{Math.round(distance).toLocaleString()}</p>
          <p className="text-xs text-muted-foreground font-medium">{t("km to Kaaba", "km vers la Kaaba")}</p>
        </div>
      </div>

      {/* Location info */}
      {coords && (
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5" />
          <span>{coords.lat.toFixed(4)}°, {coords.lng.toFixed(4)}°</span>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center gap-2 text-xs text-amber-600 bg-amber-50 rounded-xl p-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tips */}
      <div className="islamic-card p-4 space-y-2">
        <h3 className="text-sm font-semibold text-foreground">{t("Tips", "Conseils")}</h3>
        <ul className="text-xs text-muted-foreground space-y-1.5">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            {t(
              "Hold your phone flat in your palm for the most accurate reading.",
              "Tenez votre téléphone à plat dans votre paume pour une lecture précise."
            )}
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            {t(
              "Wave your phone in a figure-8 pattern to calibrate the compass.",
              "Agitez votre téléphone en forme de 8 pour calibrer la boussole."
            )}
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            {t(
              "The arrow always points toward the Kaaba in Makkah.",
              "La flèche pointe toujours vers la Kaaba à La Mecque."
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default QiblaFinder;
