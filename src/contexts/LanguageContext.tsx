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
    'hero.badge_text': 'GëstuSaDine AI is here to consult with you.',
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

    // Dashboard
    'dashboard.sectionLabel': 'Dashboard',
    'dashboard.titlePrefix': 'Your spiritual',
    'dashboard.titleHighlight': 'companion',
    'dashboard.loading': 'Loading…',
    'dashboard.ayahOfTheDay': 'Ayah of the day',
    'dashboard.ayahLoading': 'Loading the ayah…',
    'dashboard.ayahError': 'Could not load the ayah.',
    'dashboard.todayLabel': 'Today',
    'dashboard.todaySummary': 'Your reminders and daily action, all in one place.',
    'dashboard.openReminder': "Open today's reminder",
    'dashboard.todays_reminder': "Today's reminder",
    'dashboard.todays_prayer_times': "Today's prayer times",
    'dashboard.todays_action': "Today's action",
    'dashboard.action_text': 'Take a moment to remember Allah with sincerity, and share something beneficial with someone today.',
    'dashboard.hadith_of_the_day': 'Hadith of the day',
    'dashboard.hadith_text': 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
    'dashboard.hadith_translation': 'Actions are but by intentions.',
    'dashboard.source_authentic_hadith': 'Sahih al-Bukhari',
    'dashboard.prayer_times': 'Prayer times',
    'dashboard.enable_location': "Enable location to see today's prayer times.",
    'dashboard.prayer.fajr': 'Fajr',
    'dashboard.prayer.dhuhr': 'Dhuhr',
    'dashboard.prayer.asr': 'Asr',
    'dashboard.prayer.maghrib': 'Maghrib',
    'dashboard.prayer.isha': 'Isha',
    'dashboard.dailyDua': 'Dua of the day',
    'dashboard.dailyDuaLoading': 'Loading the dua…',
    'dashboard.dailyDuaError': 'Could not load the dua.',
    'dashboard.smallFact': 'Did you know?',
    'dashboard.factLoading': 'Loading…',
    'dashboard.factError': "Could not load today's fact.",
    'dashboard.weeklyQuiz': 'Weekly quiz',
    'dashboard.weeklyQuizSubtitle': 'Test your knowledge',
    'dashboard.easy': 'Easy',
    'dashboard.medium': 'Medium',
    'dashboard.advanced': 'Advanced',
    'dashboard.checkAnswer': 'Check answer',
    'dashboard.correctFeedback': 'Correct, mashaAllah!',
    'dashboard.wrongFeedbackPrefix': 'Not quite. Hint: ',

    // Quiz content
    'quiz.easy.question': 'How many obligatory daily prayers are there in Islam?',
    'quiz.easy.options.0': 'Five',
    'quiz.easy.options.1': 'Three',
    'quiz.easy.options.2': 'Seven',
    'quiz.easy.correct': 'Five',
    'quiz.easy.hint': 'They are spread from dawn to night.',
    'quiz.medium.question': 'During which month do Muslims fast from dawn to sunset?',
    'quiz.medium.options.0': 'Ramadan',
    'quiz.medium.options.1': 'Shaʿbān',
    'quiz.medium.options.2': 'Muharram',
    'quiz.medium.correct': 'Ramadan',
    'quiz.medium.hint': 'It is the ninth month of the Islamic calendar.',
    'quiz.advanced.question': 'In which year of the Hijra was fasting in Ramadan made obligatory?',
    'quiz.advanced.options.0': '2 AH',
    'quiz.advanced.options.1': '1 AH',
    'quiz.advanced.options.2': '5 AH',
    'quiz.advanced.correct': '2 AH',
    'quiz.advanced.hint': 'It was prescribed shortly after the migration to Madinah.',

    // Library
    'library.sectionLabel': 'Knowledge',
    'library.title': 'Digital Library',
    'library.subtitle': 'Browse and download authentic Islamic books, organized by topic, language, and format.',
    'library.search_placeholder': 'Search by title, author, or keyword…',
    'library.filter_category': 'Category',
    'library.all_categories': 'All categories',
    'library.filter_language': 'Language',
    'library.all_languages': 'All languages',
    'library.all_formats': 'All formats',
    'library.no_results': 'No books match your filters.',
    'library.featured': 'Featured',
    'library.pages': 'pages',
    'library.file_size': 'MB',
    'library.downloads': 'downloads',
    'library.download_button': 'Download',
    'library.categories.quran': 'Qur’an',
    'library.categories.hadith': 'Hadith',
    'library.categories.fiqh': 'Fiqh',
    'library.categories.aqeedah': 'Aqeedah',
    'library.categories.seerah': 'Seerah',
    'library.categories.tafsir': 'Tafsir',
    'library.categories.arabic': 'Arabic',
    'library.categories.dua': 'Dua',
    'library.categories.general': 'General',
    'library.languages.ar': 'Arabic',
    'library.languages.en': 'English',
    'library.languages.fr': 'French',
    'library.formats.pdf': 'PDF',
    'library.formats.epub': 'EPUB',
    'library.formats.mobi': 'MOBI',
    'library.formats.audio': 'Audio',

    // Council
    'council.ask_title': 'Ask the Council',
    'council.ask_placeholder': 'Ask a question about Islam…',
    'council.ask_button': 'Ask the Council',
    'council.deliberating': 'The Council is deliberating…',
    'council.consensus_analysis': 'Consensus analysis',
    'council.consensus_score': 'Consensus score',
    'council.confidence': 'Confidence',
    'council.model': 'Model',
    'council.creativity_level': 'Creativity level',
    'council.processing_time': 'Processing time',
    'council.no_members': 'No council members are configured.',
    'council.upload.title': 'Title',
    'council.upload.title_placeholder': 'Document title',
    'council.upload.content': 'Content',
    'council.upload.content_placeholder': 'Paste the document text…',
    'council.upload.source': 'Source',
    'council.upload.source_placeholder': 'e.g. Sahih al-Bukhari, book and number',
    'council.upload.category': 'Category',
    'council.upload.category.fiqh': 'Fiqh (jurisprudence)',
    'council.upload.category.aqeedah': 'Aqeedah (theology)',
    'council.upload.category.context': 'Contemporary context',
    'council.upload.category.humility': 'Epistemic caution',
    'council.upload.category.general': 'General',
    'council.upload.submit': 'Upload document',
    'council.upload.uploading': 'Uploading…',

    // Errors
    'error.delete_failed': 'Delete failed. Please try again.',
    'error.search_failed': 'Search failed. Please try again.',

    // Not found
    'notfound.message': 'The page you’re looking for doesn’t exist.',
    'notfound.return_home': 'Return home',

    // Common
    'common.success': 'MashaAllah! Success.',
    'common.error': 'Error',
    'common.loading': 'Loading...',
    'common.email_sent': 'Email Sent',
    'common.welcome': 'Welcome!',
    'common.welcome_back': 'Welcome back',
    'index.learn_more': 'Learn More',

    // Cookie consent
    'cookie.message': 'GëstuSaDine doesn\'t use third-party cookies, only a single in-house cookie. No data is sent to a third party.',
    'cookie.accept': 'Got it',
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
    'hero.badge_text': 'GëstuSaDine AI est là pour vous consulter.',
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

    // Dashboard
    'dashboard.sectionLabel': 'Tableau de bord',
    'dashboard.titlePrefix': 'Votre compagnon',
    'dashboard.titleHighlight': 'spirituel',
    'dashboard.loading': 'Chargement…',
    'dashboard.ayahOfTheDay': 'Verset du jour',
    'dashboard.ayahLoading': 'Chargement du verset…',
    'dashboard.ayahError': 'Impossible de charger le verset.',
    'dashboard.todayLabel': "Aujourd'hui",
    'dashboard.todaySummary': 'Vos rappels et votre action du jour, en un seul endroit.',
    'dashboard.openReminder': 'Ouvrir le rappel du jour',
    'dashboard.todays_reminder': 'Rappel du jour',
    'dashboard.todays_prayer_times': 'Horaires de prière du jour',
    'dashboard.todays_action': 'Action du jour',
    'dashboard.action_text': "Prenez un moment pour évoquer Allah avec sincérité, et partagez aujourd'hui quelque chose de bénéfique avec quelqu'un.",
    'dashboard.hadith_of_the_day': 'Hadith du jour',
    'dashboard.hadith_text': 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
    'dashboard.hadith_translation': 'Les actions ne valent que par leurs intentions.',
    'dashboard.source_authentic_hadith': 'Sahih al-Bukhari',
    'dashboard.prayer_times': 'Horaires de prière',
    'dashboard.enable_location': 'Activez la localisation pour voir les horaires de prière.',
    'dashboard.prayer.fajr': 'Fajr',
    'dashboard.prayer.dhuhr': 'Dhuhr',
    'dashboard.prayer.asr': 'Asr',
    'dashboard.prayer.maghrib': 'Maghrib',
    'dashboard.prayer.isha': 'Isha',
    'dashboard.dailyDua': 'Invocation du jour',
    'dashboard.dailyDuaLoading': "Chargement de l'invocation…",
    'dashboard.dailyDuaError': "Impossible de charger l'invocation.",
    'dashboard.smallFact': 'Le saviez-vous ?',
    'dashboard.factLoading': 'Chargement…',
    'dashboard.factError': 'Impossible de charger le fait du jour.',
    'dashboard.weeklyQuiz': 'Quiz hebdomadaire',
    'dashboard.weeklyQuizSubtitle': 'Testez vos connaissances',
    'dashboard.easy': 'Facile',
    'dashboard.medium': 'Moyen',
    'dashboard.advanced': 'Avancé',
    'dashboard.checkAnswer': 'Vérifier',
    'dashboard.correctFeedback': 'Correct, mashaAllah !',
    'dashboard.wrongFeedbackPrefix': 'Pas tout à fait. Indice : ',

    // Quiz content
    'quiz.easy.question': "Combien de prières obligatoires y a-t-il chaque jour en Islam ?",
    'quiz.easy.options.0': 'Cinq',
    'quiz.easy.options.1': 'Trois',
    'quiz.easy.options.2': 'Sept',
    'quiz.easy.correct': 'Cinq',
    'quiz.easy.hint': "Elles s'étendent de l'aube à la nuit.",
    'quiz.medium.question': 'Pendant quel mois les musulmans jeûnent-ils de l\'aube au coucher du soleil ?',
    'quiz.medium.options.0': 'Ramadan',
    'quiz.medium.options.1': 'Chaʿbān',
    'quiz.medium.options.2': 'Mouharram',
    'quiz.medium.correct': 'Ramadan',
    'quiz.medium.hint': "C'est le neuvième mois du calendrier islamique.",
    'quiz.advanced.question': "En quelle année de l'Hégire le jeûne du Ramadan est-il devenu obligatoire ?",
    'quiz.advanced.options.0': 'An 2 H',
    'quiz.advanced.options.1': 'An 1 H',
    'quiz.advanced.options.2': 'An 5 H',
    'quiz.advanced.correct': 'An 2 H',
    'quiz.advanced.hint': "Il fut prescrit peu après l'émigration vers Médine.",

    // Library
    'library.sectionLabel': 'Savoir',
    'library.title': 'Bibliothèque numérique',
    'library.subtitle': 'Parcourez et téléchargez des livres islamiques authentiques, classés par thème, langue et format.',
    'library.search_placeholder': 'Rechercher par titre, auteur ou mot-clé…',
    'library.filter_category': 'Catégorie',
    'library.all_categories': 'Toutes les catégories',
    'library.filter_language': 'Langue',
    'library.all_languages': 'Toutes les langues',
    'library.all_formats': 'Tous les formats',
    'library.no_results': 'Aucun livre ne correspond à vos filtres.',
    'library.featured': 'En vedette',
    'library.pages': 'pages',
    'library.file_size': 'Mo',
    'library.downloads': 'téléchargements',
    'library.download_button': 'Télécharger',
    'library.categories.quran': 'Coran',
    'library.categories.hadith': 'Hadith',
    'library.categories.fiqh': 'Fiqh',
    'library.categories.aqeedah': 'Aqida',
    'library.categories.seerah': 'Sîra',
    'library.categories.tafsir': 'Tafsir',
    'library.categories.arabic': 'Arabe',
    'library.categories.dua': 'Invocations',
    'library.categories.general': 'Général',
    'library.languages.ar': 'Arabe',
    'library.languages.en': 'Anglais',
    'library.languages.fr': 'Français',
    'library.formats.pdf': 'PDF',
    'library.formats.epub': 'EPUB',
    'library.formats.mobi': 'MOBI',
    'library.formats.audio': 'Audio',

    // Council
    'council.ask_title': 'Consulter le Conseil',
    'council.ask_placeholder': 'Posez une question sur l’Islam…',
    'council.ask_button': 'Consulter le Conseil',
    'council.deliberating': 'Le Conseil délibère…',
    'council.consensus_analysis': 'Analyse du consensus',
    'council.consensus_score': 'Score de consensus',
    'council.confidence': 'Confiance',
    'council.model': 'Modèle',
    'council.creativity_level': 'Niveau de créativité',
    'council.processing_time': 'Temps de traitement',
    'council.no_members': 'Aucun membre du conseil n’est configuré.',
    'council.upload.title': 'Titre',
    'council.upload.title_placeholder': 'Titre du document',
    'council.upload.content': 'Contenu',
    'council.upload.content_placeholder': 'Collez le texte du document…',
    'council.upload.source': 'Source',
    'council.upload.source_placeholder': 'ex. Sahih al-Bukhari, livre et numéro',
    'council.upload.category': 'Catégorie',
    'council.upload.category.fiqh': 'Fiqh (jurisprudence)',
    'council.upload.category.aqeedah': 'Aqida (théologie)',
    'council.upload.category.context': 'Contexte contemporain',
    'council.upload.category.humility': 'Prudence épistémique',
    'council.upload.category.general': 'Général',
    'council.upload.submit': 'Téléverser le document',
    'council.upload.uploading': 'Téléversement…',

    // Errors
    'error.delete_failed': 'Échec de la suppression. Veuillez réessayer.',
    'error.search_failed': 'Échec de la recherche. Veuillez réessayer.',

    // Not found
    'notfound.message': 'La page que vous recherchez n’existe pas.',
    'notfound.return_home': 'Retour à l’accueil',

    // Common
    'common.success': 'MashaAllah ! Succès.',
    'common.error': 'Erreur',
    'common.loading': 'Chargement...',
    'common.email_sent': 'E-mail envoyé',
    'common.welcome': 'Bienvenue !',
    'common.welcome_back': 'Bon retour',
    'index.learn_more': 'En savoir plus',

    // Cookie consent
    'cookie.message': 'GëstuSaDine n\'utilise pas de cookies tiers, seulement un seul cookie interne. Aucune donnée n\'est envoyée à un tiers.',
    'cookie.accept': 'Compris',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
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
