import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Compass, Home, ArrowLeft } from "lucide-react";

const arabicPhrases = [
  "ضل الطريق",
  "ليس هنا ما تبحث عنه",
  "ربما ضللت الطريق",
  "هذه ليست وجهتك",
];

const NotFound = () => {
  const location = useLocation();
  const { t, language } = useLanguage();
  const [phrase] = useState(() =>
    arabicPhrases[Math.floor(Math.random() * arabicPhrases.length)]
  );

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 bg-[#FAF7F0]">
      {/* Decorative background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-emerald-900/3 blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-amber-900/3 blur-[100px]" />
        <div className="absolute top-1/4 left-1/3 w-4 h-4 rounded-full bg-emerald-800/10" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-amber-700/10" />
        <div className="absolute bottom-1/3 left-1/4 w-5 h-5 rounded-full bg-emerald-800/8" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-lg mx-auto text-center"
      >
        {/* Large 404 */}
        <div className="relative mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="text-[10rem] sm:text-[12rem] font-bold leading-none tracking-tighter"
          >
            <span className="text-emerald-900/10">4</span>
            <span className="text-emerald-800/20">0</span>
            <span className="text-emerald-900/10">4</span>
          </motion.div>
          {/* Compass icon overlaid */}
          <motion.div
            initial={{ rotate: -30, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Compass className="w-16 h-16 text-emerald-800/15" strokeWidth={1} />
          </motion.div>
        </div>

        {/* Arabic phrase */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="font-arabic text-2xl text-emerald-800/40 mb-6"
        >
          {phrase}
        </motion.p>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-10"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-3">
            {language === 'fr' ? 'Page introuvable' : 'Page not found'}
          </h1>
          <p className="text-stone-500 leading-relaxed max-w-sm mx-auto">
            {language === 'fr'
              ? "La page que vous cherchez n'existe pas ou a été déplacée. Vérifiez l'URL ou retournez à l'accueil."
              : "The page you're looking for doesn't exist or has been moved. Check the URL or head back home."}
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-800 hover:shadow-lg hover:shadow-emerald-900/20"
          >
            <Home className="w-4 h-4" />
            {language === 'fr' ? 'Accueil' : 'Home'}
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition-all hover:border-emerald-800 hover:text-emerald-800 hover:shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'fr' ? 'Tableau de bord' : 'Dashboard'}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
