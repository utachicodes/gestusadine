import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "gsd-install-dismissed";

export const InstallPrompt = () => {
  const { language } = useLanguage();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (localStorage.getItem(DISMISS_KEY)) return;

    function onPrompt(e: Event) {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", onPrompt);

    // Soft ask: give the user time to experience the app first.
    const t = setTimeout(() => setVisible(true), 12_000);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    function onInstalled() {
      setVisible(false);
      setDeferred(null);
    }
    window.addEventListener("appinstalled", onInstalled);
    return () => window.removeEventListener("appinstalled", onInstalled);
  }, []);

  if (!visible || !deferred) return null;

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  };

  const install = async () => {
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setVisible(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="rounded-2xl border border-emerald-100 bg-white shadow-lg p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0">
          <Download className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-stone-900">
            {language === "fr" ? "Installer GëstuSaDine" : "Install GëstuSaDine"}
          </p>
          <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
            {language === "fr"
              ? "Ajoute l'app à ton écran d'accueil — plus rapide, et fonctionne hors ligne."
              : "Add it to your home screen — faster, and works offline."}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={install}
              className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-full transition-colors"
            >
              {language === "fr" ? "Installer" : "Install"}
            </button>
            <button
              onClick={dismiss}
              className="text-xs text-stone-400 hover:text-stone-600 px-2 py-1.5"
            >
              {language === "fr" ? "Plus tard" : "Later"}
            </button>
          </div>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="text-stone-300 hover:text-stone-500 -mt-1 -mr-1 p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
