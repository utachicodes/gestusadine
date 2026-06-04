import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const VerificationSuccess = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-100 mx-auto mb-6 flex items-center justify-center">
          <svg className="w-8 h-8 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-stone-900 mb-3">
          {language === 'fr' ? 'Email vérifié !' : 'Email verified!'}
        </h1>
        <p className="text-sm text-stone-500 mb-8 leading-relaxed">
          {language === 'fr'
            ? 'Votre adresse email a été vérifiée avec succès. Vous pouvez maintenant vous connecter.'
            : 'Your email has been successfully verified. You can now sign in.'}
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-900 px-6 py-3 text-sm font-semibold text-[#FAF7F0] hover:bg-emerald-800 transition-colors"
        >
          {language === 'fr' ? 'Se connecter' : 'Sign in'}
        </Link>
      </div>
    </div>
  );
};

export default VerificationSuccess;
