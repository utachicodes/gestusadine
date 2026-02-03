import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-deep-slate relative overflow-hidden px-4">
      {/* Background Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,245,255,0.05),transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="glass-card-premium p-16 max-w-lg w-full text-center border border-white/5 relative z-10"
      >
        <div className="text-8xl font-black text-white/5 mb-8 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 tracking-[0.2em]">404</div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            Nexus <span className="text-glow-cyan">Severed</span>
          </h1>
          <p className="text-white/40 text-lg mb-10 font-medium">
            {t('notfound.message') || "The requested coordinates do not exist within our verified knowledge base."}
          </p>
          <a
            href="/"
            className="btn-premium inline-flex items-center justify-center min-w-[200px]"
          >
            {t('notfound.return_home') || "Return to Nexus"}
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
