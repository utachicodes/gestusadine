import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/auth/AuthContext';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const translations = {
  en: {
    // Brand
    'brand.name': 'GëstuSaDine',
    'brand.mission': 'Making Islam accessible, engaging, and beautiful.',
    'brand.tagline': 'GëstuSaDine: The Vision: A Complete Islamic Lifestyle Ecosystem',

    // Chat / AI Companion
    'chat.placeholder': 'Ask GëstuSaDine AI anything about Islam...',
    'chat.welcome': 'Asalamu alaikum, I am your GëstuSaDine Companion',
    'chat.welcome_logo_alt': 'GëstuSaDine AI',
    'chat.welcome.subtitle': 'Islam become truly accessible when it is spoken in the language of the heart.',
    'chat.thinking': 'Consulting the Council...',
    
    // Media / Education
    'media.title': 'Media Studio',
    'media.subtitle': 'Educational Content Studio',
    'media.intro': 'We create animated videos that teach Islamic values through colorful, engaging storytelling for every generation.',
    
    // Community
    'events.title': 'Events',
    'events.subtitle': 'Community & Real-World Connection',
    'events.intro': 'Organizing lectures, women\'s circles, and youth programs across Senegal.',
    
    // Auth / Login (PERMANENT FIX)
    'login.processing': 'Processing...',
    'login.error_invalid_email': 'Invalid email address.',
    'login.error_user_not_found': 'No user found with this email.',
    'login.error_wrong_password': 'Incorrect password.',
    'login.error_email_in_use': 'Email is already in use.',
    'login.error_weak_password': 'Password should be at least 6 characters.',
    'login.error_generic': 'An error occurred. Please try again.',
    'login.reset_email_sent': 'Check your inbox for password reset instructions.',
    'login.full_name_required': 'Full name is required',
    'login.success_signed_up': 'Account created successfully.',
    'login.success_signed_in': 'Signed in successfully.',
    'login.full_name': 'Full Name',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.forgot_password': 'Forgot password?',
    'login.sign_in': 'Sign In',
    'login.sign_up': 'Sign Up',
    'login.send_reset_link': 'Send Reset Link',
    'login.no_account': "Don't have an account?",
    'login.already_account': 'Already have an account?',
    'login.back_to_login': 'Back to login',

    // Navigation
    'nav.home': 'Home',
    'nav.ai_companion': 'AI Companion',
    'nav.media': 'Studio',
    'nav.events': 'Events',
    'nav.podcasts': 'Podcasts',
    'nav.community': 'Community',
    'nav.shop': 'Streetwear',
    'nav.dashboard': 'Dashboard',
    'nav.signout': 'Sign Out',
    'nav.signin': 'Sign In',
    'nav.learn_more': 'Learn More',

    // Hero
    'hero.badge_text': 'GëstuSaDine AI is here to consult with you —',
    'hero.badge_link': 'Start consultation →',
    'hero.title_part1': 'A knowledge system',
    'hero.title_part2': 'that works like a',
    'hero.title_highlight': 'Council',
    'hero.description': 'A platform that makes Islam accessible, engaging, and beautiful for every generation - from children to adults.',
    'hero.cta_primary': 'Start Consultation',
    'hero.cta_secondary': 'Listen to Library',

    // Pillars / Feature Grid
    'pillar.education.title': 'Educational Content Studio',
    'pillar.education.desc': 'Animated videos for kids, teens, and adults teaching Islamic values through storytelling.',
    'pillar.ai.title': 'Interactive Learning',
    'pillar.ai.desc': 'A personal Islamic companion that answers questions and guides your learning journey.',
    'pillar.community.title': 'Community Connection',
    'pillar.community.desc': 'Women\'s circles, youth programs, and family events building strong community bonds.',
    'pillar.fashion.title': 'Islamic Streetwear',
    'pillar.fashion.desc': 'Wear your faith with pride. Modern designs funded by the educational mission.',
    'pillar.podcasts.title': 'Podcast Network',
    'pillar.podcasts.desc': 'Relatable conversations about living faith in the modern world.',

    // Common
    'common.success': 'MashaAllah! Success.',
    'common.error': 'Error',
    'common.loading': 'Loading...',
    'common.email_sent': 'Email Sent',
    'common.welcome': 'Welcome!',
    'common.welcome_back': 'Welcome back',
    'index.learn_more': 'Learn More',
  },
  fr: {
    // Brand
    'brand.name': 'GëstuSaDine',
    'brand.mission': 'Rendre l\'Islam accessible, engageant et beau.',
    'brand.tagline': 'GëstuSaDine : La Vision : Un écosystème de vie islamique complet',

    // Chat / AI Companion
    'chat.placeholder': 'Posez n\'importe quelle question sur l\'Islam à GëstuSaDine AI...',
    'chat.welcome': 'Asalamu alaikum, je suis votre compagnon GëstuSaDine',
    'chat.welcome_logo_alt': 'GëstuSaDine AI',
    'chat.welcome.subtitle': 'L\'Islam devient vraiment accessible lorsqu\'il est parlé dans la langue du cœur.',
    'chat.thinking': 'Consultation du Conseil...',
    
    // Media / Education
    'media.title': 'Studio Média',
    'media.subtitle': 'Studio de contenu éducatif',
    'media.intro': 'Nous créons des vidéos animées qui enseignent les valeurs islamiques grâce à des récits colorés et engageants.',
    
    // Community
    'events.title': 'Événements',
    'events.subtitle': 'Connexion communautaire et réelle',
    'events.intro': 'Organisation de conférences, de cercles de femmes et de programmes pour les jeunes à travers le Sénégal.',

    // Auth / Login (PERMANENT FIX)
    'login.processing': 'Traitement...',
    'login.error_invalid_email': 'Adresse e-mail invalide.',
    'login.error_user_not_found': 'Aucun utilisateur trouvé avec cet e-mail.',
    'login.error_wrong_password': 'Mot de passe incorrect.',
    'login.error_email_in_use': 'Cet e-mail est déjà utilisé.',
    'login.error_weak_password': 'Le mot de passe doit comporter au moins 6 caractères.',
    'login.error_generic': 'Une erreur est survenue. Veuillez réessayer.',
    'login.reset_email_sent': 'Vérifiez votre boîte de réception pour les instructions de réinitialisation.',
    'login.full_name_required': 'Le nom complet est requis',
    'login.success_signed_up': 'Compte créé avec succès.',
    'login.success_signed_in': 'Connecté avec succès.',
    'login.full_name': 'Nom Complet',
    'login.email': 'E-mail',
    'login.password': 'Mot de passe',
    'login.forgot_password': 'Mot de passe oublié ?',
    'login.sign_in': 'Se Connecter',
    'login.sign_up': "S'inscrire",
    'login.send_reset_link': 'Envoyer le lien de réinitialisation',
    'login.no_account': "Vous n'avez pas de compte ?",
    'login.already_account': 'Vous avez déjà un compte ?',
    'login.back_to_login': 'Retour à la connexion',
    
    // Navigation
    'nav.home': 'Accueil',
    'nav.ai_companion': 'Compagnon IA',
    'nav.media': 'Studio',
    'nav.events': 'Événements',
    'nav.podcasts': 'Podcasts',
    'nav.community': 'Communauté',
    'nav.shop': 'Streetwear',
    'nav.dashboard': 'Tableau de bord',
    'nav.signout': 'Déconnexion',
    'nav.signin': 'Connexion',
    'nav.learn_more': 'En savoir plus',

    // Hero
    'hero.badge_text': 'GëstuSaDine AI est là pour vous consulter —',
    'hero.badge_link': 'Commencer la consultation →',
    'hero.title_part1': 'Un système de connaissances',
    'hero.title_part2': 'qui fonctionne comme un',
    'hero.title_highlight': 'Conseil',
    'hero.description': 'Une plateforme qui rend l\'Islam accessible, engageant et beau pour chaque génération - des enfants aux adultes.',
    'hero.cta_primary': 'Commencer la consultation',
    'hero.cta_secondary': 'Écouter la bibliothèque',

    // Pillars / Feature Grid
    'pillar.education.title': 'Studio de contenu éducatif',
    'pillar.education.desc': 'vidéos animées pour enfants, adolescents et adultes enseignant les valeurs islamiques.',
    'pillar.ai.title': 'Apprentissage interactif',
    'pillar.ai.desc': 'Un compagnon islamique personnel qui répond aux questions et guide votre apprentissage.',
    'pillar.community.title': 'Connexion communautaire',
    'pillar.community.desc': 'Cercles de femmes, programmes pour les jeunes et événements familiaux.',
    'pillar.fashion.title': 'Streetwear Islamique',
    'pillar.fashion.desc': 'Portez votre foi avec fierté. Des designs modernes finançant la mission éducative.',
    'pillar.podcasts.title': 'Réseau de podcasts',
    'pillar.podcasts.desc': 'Des conversations sur la vie de foi dans le monde moderne.',

    // Common
    'common.success': 'MashaAllah ! Succès.',
    'common.error': 'Erreur',
    'common.loading': 'Chargement...',
    'common.email_sent': 'E-mail envoyé',
    'common.welcome': 'Bienvenue !',
    'common.welcome_back': 'Bon retour',
    'index.learn_more': 'En savoir plus',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const readStored = (): Language => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('GëstuSaDine-language') as Language;
      if (saved && ['en', 'fr'].includes(saved)) return saved;
    }
    return 'en';
  };

  const [language, setLanguageState] = useState<Language>(readStored);

  useEffect(() => {
    document.documentElement.lang = language;
    if (typeof window !== 'undefined') {
      localStorage.setItem('GëstuSaDine-language', language);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const current = (translations as Record<string, Record<string, string>>)[language];
    const translate = (dict?: Record<string, string>) => {
      const value = dict?.[key];
      if (!value) return undefined;
      if (!params) return value;
      return Object.keys(params).reduce((acc, paramKey) => {
        const token = `{${paramKey}}`;
        return acc.replace(token, String(params[paramKey]));
      }, value);
    };

    const currentValue = translate(current);
    if (currentValue) return currentValue;

    const fallback = (translations as Record<string, Record<string, string>>).en;
    const fallbackValue = translate(fallback);
    if (fallbackValue) return fallbackValue;
    
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
