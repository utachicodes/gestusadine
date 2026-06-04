import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-warm-base -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-warm-gold/6 rounded-full blur-[120px] -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="glass-card-warm p-14 max-w-md w-full text-center rounded-3xl shadow-xl relative z-10"
      >
        <div className="text-8xl font-bold text-warm-sand/80 mb-2 select-none leading-none">
          404
        </div>

        <p className="font-arabic text-3xl text-warm-gold/60 mb-6">ضل الطريق</p>

        <h1 className="text-3xl font-bold text-deep-green mb-4">
          Page Not Found
        </h1>
        <p className="text-deep-green/50 mb-8 leading-relaxed">
          {t('notfound.message') || "The page you are looking for does not exist or has been moved."}
        </p>

        <Link
          to="/"
          className="btn-spiritual inline-flex items-center justify-center gap-2 text-sm group"
        >
          {t('notfound.return_home') || "Return Home"}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
