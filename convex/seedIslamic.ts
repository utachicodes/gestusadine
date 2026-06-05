import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

const ALL_SURAHS = [
  {num:1,name:"Al-Fatihah",arabic:"الفاتحة",ayahs:7,type:"Makki",theme:"The Opening — prayer for guidance, praise of Allah, the straight path. Essence of the Quran."},
  {num:2,name:"Al-Baqarah",arabic:"البقرة",ayahs:286,type:"Madani",theme:"The Cow — longest surah. Laws, stories of Bani Israel, Ayat-ul-Kursi, last 2 ayahs, fasting, Hajj, marriage, riba."},
  {num:3,name:"Aali Imran",arabic:"آل عمران",ayahs:200,type:"Madani",theme:"Family of Imran — Tawheed, story of Maryam and Isa, Battle of Uhud, patience, reliance on Allah."},
  {num:4,name:"An-Nisa'",arabic:"النساء",ayahs:176,type:"Madani",theme:"The Women — family law, marriage, divorce, inheritance, women's rights, justice, orphans."},
  {num:5,name:"Al-Ma'idah",arabic:"المائدة",ayahs:120,type:"Madani",theme:"The Table Spread — completion of religion, halal food, prohibition of alcohol/gambling, covenants."},
  {num:6,name:"Al-An'am",arabic:"الأنعام",ayahs:165,type:"Makki",theme:"The Cattle — Tawheed, refutation of shirk, stories of prophets, Allah's signs in creation."},
  {num:7,name:"Al-A'raf",arabic:"الأعراف",ayahs:206,type:"Makki",theme:"The Heights — stories of Adam, Nuh, Hud, Salih, Lut, Shu'ayb, Musa; A'raf (the heights between Paradise and Hell)."},
  {num:8,name:"Al-Anfal",arabic:"الأنفال",ayahs:75,type:"Madani",theme:"Spoils of War — Badr battle, rules of war, obedience to Allah and the Messenger."},
  {num:9,name:"At-Tawbah",arabic:"التوبة",ayahs:129,type:"Madani",theme:"The Repentance — only surah without Bismillah. Treaties, Tabuk expedition, hypocrites, zakah."},
  {num:10,name:"Yunus",arabic:"يونس",ayahs:109,type:"Makki",theme:"Jonah — signs of Allah in creation, story of Prophet Yunus, revelation of the Quran."},
  {num:11,name:"Hud",arabic:"هود",ayahs:123,type:"Makki",theme:"Prophet Hud — destruction of 'Ad, stories of Nuh, Salih, Ibrahim, Lut, Shu'ayb; patience of prophets."},
  {num:12,name:"Yusuf",arabic:"يوسف",ayahs:111,type:"Makki",theme:"Joseph — the most beautiful story (ahsan al-qasas). Prophet Yusuf's life, patience, forgiveness, trust in Allah."},
  {num:13,name:"Ar-Ra'd",arabic:"الرعد",ayahs:43,type:"Madani",theme:"The Thunder — Allah's power in nature, truth of revelation, patience of believers, punishment of disbelievers."},
  {num:14,name:"Ibrahim",arabic:"إبراهيم",ayahs:52,type:"Makki",theme:"Abraham — Prophet Ibrahim's du'a for Makkah, gratitude to Allah, the straight path."},
  {num:15,name:"Al-Hijr",arabic:"الحجر",ayahs:99,type:"Makki",theme:"The Rocky Tract — Allah's protection of the Quran, story of Lut, punishment of the people of Al-Hijr."},
  {num:16,name:"An-Nahl",arabic:"النحل",ayahs:128,type:"Makki",theme:"The Bee — Allah's blessings in creation, the bee as a sign, justice, patience, prohibition of shirk."},
  {num:17,name:"Al-Isra'",arabic:"الإسراء",ayahs:111,type:"Makki",theme:"The Night Journey — Isra and Mi'raj, Children of Israel, commandments, the Quran as guidance."},
  {num:18,name:"Al-Kahf",arabic:"الكهف",ayahs:110,type:"Makki",theme:"The Cave — the people of the cave, the man with two gardens, Musa and Khidr, Dhul-Qarnayn. Protection from Dajjal."},
  {num:19,name:"Maryam",arabic:"مريم",ayahs:98,type:"Makki",theme:"Mary — story of Zakariyya, Yahya, Maryam, and the birth of Isa (Jesus). Tawheed, resurrection."},
  {num:20,name:"Ta-Ha",arabic:"طه",ayahs:135,type:"Makki",theme:"Ta-Ha — story of Musa and Harun with Pharaoh, the golden calf, the Quran as a reminder."},
  {num:21,name:"Al-Anbiya'",arabic:"الأنبياء",ayahs:112,type:"Makki",theme:"The Prophets — stories of many prophets, their struggles, Allah's victory for the righteous."},
  {num:22,name:"Al-Hajj",arabic:"الحج",ayahs:78,type:"Madani",theme:"The Pilgrimage — Hajj rites, permission to fight, Allah's power, the day of judgement."},
  {num:23,name:"Al-Mu'minun",arabic:"المؤمنون",ayahs:118,type:"Makki",theme:"The Believers — characteristics of successful believers, creation of man, the Hereafter."},
  {num:24,name:"An-Nur",arabic:"النور",ayahs:64,type:"Madani",theme:"The Light — the light of Allah, modesty (hijab), slander punishment (Ifk incident), privacy rules."},
  {num:25,name:"Al-Furqan",arabic:"الفرقان",ayahs:77,type:"Makki",theme:"The Criterion — the Quran as the criterion between truth and falsehood, qualities of the slaves of Ar-Rahman."},
  {num:26,name:"Ash-Shu'ara'",arabic:"الشعراء",ayahs:227,type:"Makki",theme:"The Poets — stories of Musa, Ibrahim, Nuh, Hud, Salih, Lut, Shu'ayb; warning to the Quraysh."},
  {num:27,name:"An-Naml",arabic:"النمل",ayahs:93,type:"Makki",theme:"The Ant — story of Sulayman (Solomon) with the ant and the hoopoe, Queen of Sheba (Bilqis), Tawheed."},
  {num:28,name:"Al-Qasas",arabic:"القصص",ayahs:88,type:"Makki",theme:"The Stories — full story of Musa from birth to prophethood, Qarun, the Hereafter."},
  {num:29,name:"Al-Ankabut",arabic:"العنكبوت",ayahs:69,type:"Makki",theme:"The Spider — the spider's web as a metaphor for weak protectors, tests of believers, stories of prophets."},
  {num:30,name:"Ar-Rum",arabic:"الروم",ayahs:60,type:"Makki",theme:"The Romans — prophecy of Roman victory, signs of Allah, corruption on land and sea, Tawheed."},
  {num:31,name:"Luqman",arabic:"لقمان",ayahs:34,type:"Makki",theme:"Luqman — wisdom of Luqman to his son, Tawheed, patience, humility, gratitude to Allah."},
  {num:32,name:"As-Sajdah",arabic:"السجدة",ayahs:30,type:"Makki",theme:"The Prostration — creation of man, the Hereafter, prostration, the believers and the disobedient."},
  {num:33,name:"Al-Ahzab",arabic:"الأحزاب",ayahs:73,type:"Madani",theme:"The Confederates — Battle of the Trench, rules for the Prophet's wives, hijab, divorce, trust."},
  {num:34,name:"Saba'",arabic:"سبأ",ayahs:54,type:"Makki",theme:"Sheba — story of the people of Saba' (Sheba), Prophet Dawud and Sulayman, warning of judgement."},
  {num:35,name:"Fatir",arabic:"فاطر",ayahs:45,type:"Makki",theme:"The Originator — creation, the Quran as truth, the Hereafter, believers and disbelievers."},
  {num:36,name:"Ya-Sin",arabic:"يس",ayahs:83,type:"Makki",theme:"Ya-Sin — the heart of the Quran. Three messengers, Allah's power, resurrection, paradise."},
  {num:37,name:"As-Saffat",arabic:"الصافات",ayahs:182,type:"Makki",theme:"Those Ranged in Ranks — angels ranked, stories of prophets (Nuh, Ibrahim, Musa, Harun, Ilyas, Lut, Yunus), Tawheed."},
  {num:38,name:"Sad",arabic:"ص",ayahs:88,type:"Makki",theme:"Saad — story of Dawud, Sulayman, Ayyub, Adam and Iblis, the Quran as a reminder."},
  {num:39,name:"Az-Zumar",arabic:"الزمر",ayahs:75,type:"Makki",theme:"The Groups — Tawheed, sincerity in worship, the Day of Judgement, the groups entering Paradise and Hell."},
  {num:40,name:"Ghafir",arabic:"غافر",ayahs:85,type:"Makki",theme:"The Forgiver — forgiveness of Allah, story of the believing man from Pharaoh's family, the Hereafter."},
  {num:41,name:"Fussilat",arabic:"فصلت",ayahs:54,type:"Makki",theme:"Explained in Detail — the Quran as detailed revelation, Allah's signs in creation, warning."},
  {num:42,name:"Ash-Shura",arabic:"الشورى",ayahs:53,type:"Makki",theme:"Consultation — mutual consultation, revelation to Prophet, Tawheed, reward and punishment."},
  {num:43,name:"Az-Zukhruf",arabic:"الزخرف",ayahs:89,type:"Makki",theme:"Gold Ornaments — worldly decoration vs. the Hereafter, story of Ibrahim, the Message."},
  {num:44,name:"Ad-Dukhan",arabic:"الدخان",ayahs:59,type:"Makki",theme:"The Smoke — the smoke as a sign, night of Qadr, punishment and deliverance, the Hereafter."},
  {num:45,name:"Al-Jathiyah",arabic:"الجاثية",ayahs:37,type:"Makki",theme:"The Kneeling — the kneeling of nations on judgement day, Allah's signs, warning."},
  {num:46,name:"Al-Ahqaf",arabic:"الأحقاف",ayahs:35,type:"Makki",theme:"The Sandhills — story of Prophet Hud and the people of 'Ad, jinn listening to the Quran."},
  {num:47,name:"Muhammad",arabic:"محمد",ayahs:38,type:"Madani",theme:"Prophet Muhammad — fighting in Allah's path, the Prophet's guidance, hypocrisy, Paradise."},
  {num:48,name:"Al-Fath",arabic:"الفتح",ayahs:29,type:"Madani",theme:"The Victory — Treaty of Hudaybiyyah, future victories, the Companions described."},
  {num:49,name:"Al-Hujurat",arabic:"الحجرات",ayahs:18,type:"Madani",theme:"The Dwellings — etiquette with the Prophet, manners between believers, verifying news, brotherhood."},
  {num:50,name:"Qaf",arabic:"ق",ayahs:45,type:"Makki",theme:"Qaf — creation, resurrection, Allah's power, the Hereafter, the Quran as reminder."},
  {num:51,name:"Adh-Dhariyat",arabic:"الذاريات",ayahs:60,type:"Makki",theme:"The Scattering Winds — Allah's power, the Hour is coming, the righteous and their reward."},
  {num:52,name:"At-Tur",arabic:"الطور",ayahs:49,type:"Makki",theme:"The Mount — Mount Tur (Sinai), the Quran's truth, the Hereafter, warning to disbelievers."},
  {num:53,name:"An-Najm",arabic:"النجم",ayahs:62,type:"Makki",theme:"The Star — the Prophet's ascent (Mi'raj), refutation of idol worship, intercession belongs to Allah."},
  {num:54,name:"Al-Qamar",arabic:"القمر",ayahs:55,type:"Makki",theme:"The Moon — the moon split as a sign, stories of the destroyed nations, the Quran is easy to remember."},
  {num:55,name:"Ar-Rahman",arabic:"الرحمن",ayahs:78,type:"Madani",theme:"The Most Merciful — the greatest of Allah's blessings, 'Which of your Lord's favors do you deny?', Paradise described."},
  {num:56,name:"Al-Waqi'ah",arabic:"الواقعة",ayahs:96,type:"Makki",theme:"The Event — the inevitable Day of Judgement, three groups (foremost, people of the right, people of the left)."},
  {num:57,name:"Al-Hadid",arabic:"الحديد",ayahs:29,type:"Madani",theme:"The Iron — Allah's power and knowledge, spending in charity, humility, the Hereafter."},
  {num:58,name:"Al-Mujadilah",arabic:"المجادلة",ayahs:22,type:"Madani",theme:"The Pleading Woman — the woman who complained to the Prophet, zihar, secret counsel, etiquette."},
  {num:59,name:"Al-Hashr",arabic:"الحشر",ayahs:24,type:"Madani",theme:"The Gathering — expulsion of Banu Nadir, division of spoils, the attributes of Allah (last 3 ayahs)."},
  {num:60,name:"Al-Mumtahanah",arabic:"الممتحنة",ayahs:13,type:"Madani",theme:"The Examined Woman — treaties with disbelievers, dealing with non-Muslim relatives, the oath of women."},
  {num:61,name:"As-Saff",arabic:"الصف",ayahs:14,type:"Madani",theme:"The Ranks — fighting in ranks for Allah, saying what you do not do, Musa and Isa's prophecies."},
  {num:62,name:"Al-Jumu'ah",arabic:"الجمعة",ayahs:11,type:"Madani",theme:"The Friday Congregation — Friday prayer obligation, seeking Allah's bounty, preferring trade over prayer."},
  {num:63,name:"Al-Munafiqun",arabic:"المنافقون",ayahs:11,type:"Madani",theme:"The Hypocrites — exposing the hypocrites of Medina, their deception, spending for show."},
  {num:64,name:"At-Taghabun",arabic:"التغابن",ayahs:18,type:"Madani",theme:"The Mutual Disillusion — the Day of Gathering, mutual loss, trust in Allah, the Hereafter."},
  {num:65,name:"At-Talaq",arabic:"الطلاق",ayahs:12,type:"Madani",theme:"The Divorce — detailed rules of divorce, waiting period (iddah), provision, Allah's commands."},
  {num:66,name:"At-Tahrim",arabic:"التحريم",ayahs:12,type:"Madani",theme:"The Prohibition — the Prophet's household incident, repentance, guarding family from Hellfire."},
  {num:67,name:"Al-Mulk",arabic:"الملك",ayahs:30,type:"Makki",theme:"The Sovereignty — Allah's dominion, creation of death and life, protection from punishment of the grave."},
  {num:68,name:"Al-Qalam",arabic:"القلم",ayahs:52,type:"Makki",theme:"The Pen — the Prophet's character, the pen and writing, the test of the garden owners."},
  {num:69,name:"Al-Haqqah",arabic:"الحاقة",ayahs:52,type:"Makki",theme:"The Inevitable — the sure reality of judgement, destruction of past nations, the Quran is Allah's word."},
  {num:70,name:"Al-Ma'arij",arabic:"المعارج",ayahs:44,type:"Makki",theme:"The Ascending Stairways — the Day of Judgement, the impatient nature of man, the prayerful believers."},
  {num:71,name:"Nuh",arabic:"نوح",ayahs:28,type:"Makki",theme:"Noah — Prophet Nuh's long دعوة to his people, the flood, forgiveness of sins."},
  {num:72,name:"Al-Jinn",arabic:"الجن",ayahs:28,type:"Makki",theme:"The Jinn — the jinn listening to the Quran, their belief, types of jinn, Allah's protection."},
  {num:73,name:"Al-Muzzammil",arabic:"المزمل",ayahs:20,type:"Makki",theme:"The Wrapped One — night prayer (tahajjud), patience with the disbelievers, the Quran as a weighty word."},
  {num:74,name:"Al-Muddaththir",arabic:"المدثر",ayahs:56,type:"Makki",theme:"The Cloaked One — the command to arise and warn, the Hereafter, the reckoning."},
  {num:75,name:"Al-Qiyamah",arabic:"القيامة",ayahs:40,type:"Makki",theme:"The Resurrection — the Day of Resurrection, the soul at death, the face of Allah, human denial."},
  {num:76,name:"Al-Insan",arabic:"الإنسان",ayahs:31,type:"Madani",theme:"Man — creation of man from a drop, guidance, the righteous drinking from a pure cup, patience."},
  {num:77,name:"Al-Mursalat",arabic:"المرسلات",ayahs:50,type:"Makki",theme:"Those Sent Forth — the winds sent forth, the Day of Decision, woe to the deniers."},
  {num:78,name:"An-Naba'",arabic:"النبأ",ayahs:40,type:"Makki",theme:"The Great News — the great news of resurrection, the Hereafter, the Day of Decision."},
  {num:79,name:"An-Nazi'at",arabic:"النازعات",ayahs:46,type:"Makki",theme:"Those Who Pull Out — the angels pulling souls, story of Musa and Pharaoh, the final Hour."},
  {num:80,name:"Abasa",arabic:"عبس",ayahs:42,type:"Makki",theme:"He Frowned — the Prophet frowning at the blind man Ibn Umm Maktum, the Quran as a reminder."},
  {num:81,name:"At-Takwir",arabic:"التكوير",ayahs:29,type:"Makki",theme:"The Wrapping — the sun wrapped up, the Hereafter, the revelation of the Quran."},
  {num:82,name:"Al-Infitar",arabic:"الانفطار",ayahs:19,type:"Makki",theme:"The Cleaving — the sky split apart, the record of deeds (Kiraman Katibin), the Day of Judgement."},
  {num:83,name:"Al-Mutaffifin",arabic:"المطففين",ayahs:36,type:"Makki",theme:"The Defrauders — woe to those who cheat in weights and measures, the records (Sijjin and Illiyyun)."},
  {num:84,name:"Al-Inshiqaq",arabic:"الانشقاق",ayahs:25,type:"Makki",theme:"The Splitting — the sky split open, the reckoning, the book given in the right vs. left hand."},
  {num:85,name:"Al-Buruj",arabic:"البروج",ayahs:22,type:"Makki",theme:"The Mansions of the Stars — the story of the People of the Ditch (Ashab al-Ukhdud), the preserved tablet."},
  {num:86,name:"At-Tariq",arabic:"الطارق",ayahs:17,type:"Makki",theme:"The Nightcomer — the piercing star, each soul has a guardian, the Quran is a decisive word."},
  {num:87,name:"Al-A'la",arabic:"الأعلى",ayahs:19,type:"Makki",theme:"The Most High — glorify Allah's name, the Quran is easy to remember, the early scriptures."},
  {num:88,name:"Al-Ghashiyah",arabic:"الغاشية",ayahs:26,type:"Makki",theme:"The Overwhelming — the overwhelming event, faces of Paradise and Hell, the Prophet is a reminder."},
  {num:89,name:"Al-Fajr",arabic:"الفجر",ayahs:30,type:"Makki",theme:"The Dawn — the fate of Thamud, 'Ad, and Pharaoh, the love of wealth, 'O soul at peace, return to your Lord.'"},
  {num:90,name:"Al-Balad",arabic:"البلد",ayahs:20,type:"Makki",theme:"The City — Makkah as the sacred city, man in toil, the two paths (good and evil)."},
  {num:91,name:"Ash-Shams",arabic:"الشمس",ayahs:15,type:"Makki",theme:"The Sun — oath by Allah's creation, purification of the soul, story of Thamud and Salih."},
  {num:92,name:"Al-Layl",arabic:"الليل",ayahs:21,type:"Makki",theme:"The Night — different paths of giving vs. stinginess, the Hereafter, 'and your Lord will give you and you will be satisfied.'"},
  {num:93,name:"Ad-Duha",arabic:"الضحى",ayahs:11,type:"Makki",theme:"The Morning Brightness — comfort for the Prophet, Allah has not forsaken him, the Hereafter is better."},
  {num:94,name:"Ash-Sharh",arabic:"الشرح",ayahs:8,type:"Makki",theme:"The Opening of the Breast — the Prophet's chest expanded, ease after hardship, strive for your Lord."},
  {num:95,name:"At-Tin",arabic:"التين",ayahs:8,type:"Makki",theme:"The Fig — oath by the fig and olive, man created in the best form, the judgement."},
  {num:96,name:"Al-Alaq",arabic:"العلق",ayahs:19,type:"Makki",theme:"The Clot — the first revelation, 'Read in the name of your Lord', man's transgression, the prostration."},
  {num:97,name:"Al-Qadr",arabic:"القدر",ayahs:5,type:"Makki",theme:"The Decree — the Night of Decree (Laylat al-Qadr), the Quran sent down, better than a thousand months."},
  {num:98,name:"Al-Bayyinah",arabic:"البينة",ayahs:8,type:"Madani",theme:"The Clear Evidence — the People of the Book until clear evidence came, the best of creation."},
  {num:99,name:"Az-Zalzalah",arabic:"الزلزلة",ayahs:8,type:"Madani",theme:"The Earthquake — the earth's final quake, the weighing of deeds, an atom's weight of good and evil."},
  {num:100,name:"Al-Adiyat",arabic:"العاديات",ayahs:11,type:"Makki",theme:"The Charging Steeds — the horses charging, man's ingratitude, the resurrection."},
  {num:101,name:"Al-Qari'ah",arabic:"القارعة",ayahs:11,type:"Makki",theme:"The Striking Calamity — the Day of Judgement, scales weighed, the abyss of Hell."},
  {num:102,name:"At-Takathur",arabic:"التكاثر",ayahs:8,type:"Makki",theme:"The Rivalry in Increase — worldly competition distracts from Allah, you will surely see Hellfire."},
  {num:103,name:"Al-Asr",arabic:"العصر",ayahs:3,type:"Makki",theme:"The Time — by time, man is in loss except those who believe, do good, enjoin truth and patience."},
  {num:104,name:"Al-Humazah",arabic:"الهمزة",ayahs:9,type:"Makki",theme:"The Slanderer — woe to every slanderer and backbiter who hoards wealth, the crushing Fire (Hutamah)."},
  {num:105,name:"Al-Fil",arabic:"الفيل",ayahs:5,type:"Makki",theme:"The Elephant — the year of the elephant, Allah's protection of the Ka'bah from Abraha's army."},
  {num:106,name:"Quraysh",arabic:"قريش",ayahs:4,type:"Makki",theme:"Quraysh — the Quraysh's secure caravans, let them worship the Lord of this House."},
  {num:107,name:"Al-Ma'un",arabic:"الماعون",ayahs:7,type:"Makki",theme:"Small Kindness — those who deny the judgement, neglect the orphan, and withhold small kindness."},
  {num:108,name:"Al-Kawthar",arabic:"الكوثر",ayahs:3,type:"Makki",theme:"The Abundance — the river of Paradise given to the Prophet, sacrifice, your enemy is cut off."},
  {num:109,name:"Al-Kafirun",arabic:"الكافرون",ayahs:6,type:"Makki",theme:"The Disbelievers — 'I do not worship what you worship', clear separation of religions, tolerance."},
  {num:110,name:"An-Nasr",arabic:"النصر",ayahs:3,type:"Madani",theme:"The Victory — Allah's help and victory, people entering Islam in crowds, glorify your Lord."},
  {num:111,name:"Al-Masad",arabic:"المسد",ayahs:5,type:"Makki",theme:"The Palm Fiber — Abu Lahab and his wife, their punishment, Allah's protection of the message."},
  {num:112,name:"Al-Ikhlas",arabic:"الإخلاص",ayahs:4,type:"Makki",theme:"The Sincerity — pure Tawheed, Allah is One, Eternal, He begets not nor is born. One-third of the Quran."},
  {num:113,name:"Al-Falaq",arabic:"الفلق",ayahs:5,type:"Makki",theme:"The Daybreak — seeking refuge from all evil (creation, darkness, sorcery, envy)."},
  {num:114,name:"An-Nas",arabic:"الناس",ayahs:6,type:"Makki",theme:"Mankind — seeking refuge in the Lord of mankind from the whispering of shaytan among jinn and mankind."},
];

const SURAH_LIST_TEXT = "COMPLETE LIST OF ALL 114 QURAN SURAHS WITH AYAH COUNTS AND THEMES:\n\n" + ALL_SURAHS.map(s =>
  `Surah ${s.num}: ${s.name} (${s.arabic}) - ${s.type}, ${s.ayahs} ayahs. Theme: ${s.theme}`
).join("\n") + "\n\nUse this to verify surah numbers, ayah counts, and themes. If a user asks about an ayah number that exceeds a surah's ayah count, tell them it doesn't exist in that surah.";

const DOCUMENTS = [
  {
    title: "Complete List of All 114 Surahs with Ayah Counts",
    content: SURAH_LIST_TEXT,
    source: "Quran - Verified",
    category: "quran"
  },
  // ===== QURAN (SALAFI TAFSIR - IBN KATHIR, IBN BAZ, AL-SADI) =====
  {
    title: "Surah Al-Fatihah (The Opening)",
    content: `Surah Al-Fatihah (الفاتحة) - Makki, 7 ayahs. The greatest surah in the Quran. It is a prayer for guidance, lordship, and mercy of Allah. The Prophet (ﷺ) said: "There is no prayer for the one who did not recite Al-Fatihah." (Bukhari #756). It includes: Praise of Allah (ayah 1), His lordship and mercy (ayah 2-3), His sole right to worship (ayah 4), asking for guidance to the straight path (ayah 5-6), and the path of those blessed not those who earned anger or went astray (ayah 7). Tafsir Ibn Kathir: The seven oft-repeated verses.`,
    source: "Quran - Tafsir Ibn Kathir",
    category: "quran"
  },
  {
    title: "Surah Al-Baqarah (The Cow) - Key Ayahs",
    content: `Surah Al-Baqarah (البقرة) - Madani, 286 ayahs. The longest surah in the Quran.

Ayat-ul-Kursi (ayah 255): "Allah! None has the right to be worshipped but He, the Ever Living, the Self-Subsisting. Neither slumber nor sleep overtakes Him. To Him belongs whatever is in the heavens and whatever is on the earth. Who can intercede with Him except by His permission? He knows what is before them and what is behind them. They encompass nothing of His knowledge except what He wills. His Kursi extends over the heavens and the earth, and He is never weary of preserving them. He is the Most High, the Most Great." The Prophet (ﷺ) said: "Whoever recites Ayat-ul-Kursi after every prescribed prayer, nothing prevents him from entering Paradise except death." (Sahih, narrated by al-Nasa'i and others, authenticated by Al-Albani).

Last two ayahs (285-286): "The Messenger believes in what was revealed to him from his Lord, and so do the believers. All believe in Allah, His angels, His books, and His messengers... Allah does not burden a soul more than it can bear..." The Prophet (ﷺ) said: "Whoever recites the last two ayahs of Surah Al-Baqarah at night, they will suffice him." (Bukhari #5009, Muslim #807).

Ayah 256: "There is no compulsion in religion. The right path is clear from the wrong path."

Ayah 177: True piety (birr) is to believe in Allah, the Last Day, the angels, the Books, and the Prophets; and to give wealth despite love of it to relatives, orphans, the needy, the traveler, those who ask, and for freeing slaves; to establish prayer and give zakah; to fulfill covenants when made; to be patient in poverty, distress, and during battle.`,
    source: "Quran - Tafsir Ibn Kathir",
    category: "quran"
  },
  {
    title: "Surah Al-Ikhlas (The Sincerity)",
    content: `Surah Al-Ikhlas (الإخلاص) - Makki, 4 ayahs. "Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born. Nor is there to Him any equivalent." Equivalent to one-third of the Quran (Bukhari #5013, Muslim #812). This surah establishes pure Tawhid (monotheism) and refutes all forms of shirk including the Christian trinity and polytheism.`,
    source: "Quran - Tafsir Ibn Kathir",
    category: "quran"
  },
  {
    title: "Surah Al-Falaq and An-Nas (The Daybreak and Mankind)",
    content: `Surah Al-Falaq (الفلق) - Makki, 5 ayahs. "Say: I seek refuge in the Lord of the daybreak, from the evil of what He created, and from the evil of darkness when it settles, and from the evil of the blowers in knots, and from the evil of an envier when he envies."

Surah An-Nas (الناس) - Makki, 6 ayahs. "Say: I seek refuge in the Lord of mankind, the King of mankind, the God of mankind, from the evil of the whisperer who withdraws, who whispers in the breasts of mankind, from among the jinn and mankind."

These two surahs are called Al-Mu'awwidhatayn. The Prophet (ﷺ) recited them every night before sleeping and when ill (Bukhari #5017, Muslim #2192).`,
    source: "Quran - Tafsir Ibn Kathir",
    category: "quran"
  },
  {
    title: "Surah Al-Ma'idah (The Table Spread)",
    content: `Surah Al-Ma'idah (المائدة) - Madani, 120 ayahs. Revealed after the Treaty of Hudaybiyyah. Key topics: completion of the religion (ayah 3: "This day I have perfected your religion for you"), prohibition of alcohol and gambling (ayah 90-91), permission of good food, rules of marriage with People of the Book, punishment for theft (ayah 38), and the story of the two sons of Adam (Habil and Qabil). Ayah 3: "Today I have perfected your religion for you and completed My favor upon you and have chosen Islam as your religion." This ayah was revealed during the Farewell Pilgrimage.`,
    source: "Quran - Tafsir Ibn Kathir",
    category: "quran"
  },
  {
    title: "Surah An-Nisa' (The Women) - Key Rulings",
    content: `Surah An-Nisa' (النساء) - Madani, 176 ayahs. Key rulings: justice for orphans (ayah 2-6), marriage laws including polygyny with justice (ayah 3: marry two, three, or four if you can be just), women's right to inheritance (ayah 7-12), husband-wife relations (ayah 34-35), family law, and jihād rulings. Ayah 59: "O you who have believed, obey Allah and obey the Messenger and those in authority among you." Ayah 136: "O you who have believed, believe in Allah and His Messenger and the Book that He sent down upon His Messenger and the Book which He sent down before."`,
    source: "Quran - Tafsir Ibn Kathir",
    category: "quran"
  },
  {
    title: "Surah Al-An'am (The Cattle) - Tawhid",
    content: `Surah Al-An'am (الأنعام) - Makki, 165 ayahs. Focus on Tawhid (monotheism) and refutation of shirk. Ayah 162-163: "Say: Indeed, my prayer, my sacrifice, my living and my dying are for Allah, Lord of the worlds. No partner has He. And this I have been commanded, and I am the first of the Muslims." Ayah 59: "And with Him are the keys of the unseen; none knows them except Him." Ayah 101: "Originator of the heavens and the earth. How could He have a son when He has no consort?"`,
    source: "Quran - Tafsir Ibn Kathir",
    category: "quran"
  },

  // ===== AQEEDAH (SALAFI - BASED ON QURAN & SUNNAH) =====
  {
    title: "The Six Pillars of Faith (Iman)",
    content: `The six pillars of faith (arkan al-iman) are based on Quran and authentic hadith. The Prophet (ﷺ) said: "Iman is to believe in Allah, His angels, His books, His messengers, the Last Day, and to believe in the divine decree (qadr), both the good and the evil thereof." (Muslim #8, Bukhari #50). These are:
1. Belief in Allah (Tawhid) - His existence, lordship (rububiyyah), right to worship (uluhiyyah), and names/attributes (asma wa sifat) without tahrif (distortion), ta'til (negation), takyif (asking how), or tamthil (resemblance to creation).
2. Belief in the Angels - including Jibril, Mika'il, Israfil, Malik (guardian of Hell), Ridwan (guardian of Paradise), Munkar and Nakir, and the scribes (Kiraman Katibin).
3. Belief in the Books - the Quran (final and preserved), Torah (Tawrat), Gospel (Injil), Psalms (Zabur), and the Scrolls of Ibrahim and Musa. The Quran is the final revelation, superseding all previous books, and is preserved from alteration.
4. Belief in the Messengers - from Nuh to Muhammad (ﷺ). Muhammad is the final prophet, sent to all of humanity. Belief in him requires obedience and following his Sunnah.
5. Belief in the Last Day - the resurrection, judgement, Paradise (Jannah) and Hellfire (Jahannam), the Bridge (Sirat), the Scale (Mizan), and the intercession (shafa'ah) by the Prophet's permission.
6. Belief in Divine Decree (Al-Qadr) - Allah's knowledge of all things, His writing of them in the Preserved Tablet, His will for them to occur, and His creation of them. This does not negate human responsibility for choices.`,
    source: "Aqeedah - Based on Quran, Sahih Bukhari, Sahih Muslim",
    category: "aqeedah"
  },
  {
    title: "Tawhid (Monotheism) - The Foundation of Islam",
    content: `Tawhid is the core of Islam — the belief in the oneness of Allah. It is divided into three categories:
1. Tawhid al-Rububiyyah (Oneness of Lordship) - Allah alone is the Creator, Sustainer, Controller, and Owner of all that exists. No partner in creation, provision, or management of the universe.
2. Tawhid al-Uluhiyyah (Oneness of Worship) - Allah alone has the right to be worshipped. All acts of worship (prayer, fasting, supplication, sacrifice, trust, fear, hope, love) must be directed solely to Allah. This is the meaning of "La ilaha illa Allah."
3. Tawhid al-Asma wa al-Sifat (Oneness of Names and Attributes) - Allah's names and attributes are affirmed as they come in the Quran and authentic Sunnah, without tahrif (distorting), ta'til (denying), takyif (asking how), or tamthil (likening to creation). As Allah said: "There is nothing like unto Him, and He is the All-Hearing, All-Seeing." (Quran 42:11)

The opposite of Tawhid is Shirk (associating partners with Allah). Shirk is the greatest sin — Allah does not forgive shirk if one dies upon it without repentance (Quran 4:48). Major shirk includes praying to other than Allah, sacrificing to other than Allah, seeking rescue from the dead, and believing that others share in Allah's lordship.`,
    source: "Aqeedah - Based on Quran, Sahih Hadith, Ibn Baz, Ibn Uthaymeen",
    category: "aqeedah"
  },
  {
    title: "The Salafi Manhaj (Methodology)",
    content: `The Salafi manhaj is following the understanding of the Salaf al-Salih (the righteous predecessors) — the Companions (Sahabah), their followers (Tabi'un), and the early scholars of the first three generations, as praised by the Prophet (ﷺ): "The best people are my generation, then those who follow them, then those who follow them." (Bukhari #3650, Muslim #2533).

Key principles:
1. Following the Quran and authentic Sunnah according to the understanding of the Salaf.
2. Avoiding bid'ah (religious innovations) — every innovation in religion is misguidance (Muslim #867).
3. Tawhid is the foundation; shirk is the greatest sin.
4. The Quran is the word of Allah, uncreated, revealed, and preserved.
5. Allah's attributes are affirmed as He described them without ta'wil (figurative interpretation).
6. Iman (faith) includes belief, speech, and action; it increases with obedience and decreases with sin.
7. Allegiance (al-wala) to believers and disassociation (al-bara) from disbelievers.
8. Obeying Muslim rulers in what is good, avoiding rebellion.
9. Jihad in the path of Allah continues until the Day of Judgement.

The Salafi methodology is NOT a madhab but a methodology of understanding Islam. In fiqh, Salafis respect all four madhabs (Hanafi, Maliki, Shafi'i, Hanbali) but take the position with the strongest evidence from Quran and Sunnah.`,
    source: "Aqeedah - Ibn Baz, Ibn Uthaymeen, Al-Albani, Al-Fawzan",
    category: "aqeedah"
  },

  // ===== HADITH (SAHIH BUKHARI AND MUSLIM) =====
  {
    title: "The Intention (Niyyah) - Hadith #1",
    content: `The Prophet (ﷺ) said: "Actions are but by intentions, and every person will have only what they intended. Whoever emigrated for the sake of Allah and His Messenger, his emigration was for Allah and His Messenger. Whoever emigrated for worldly gain or to marry a woman, his emigration was for what he emigrated for." (Sahih Bukhari #1, Sahih Muslim #1907). This hadith is one of the most important in Islam — it is considered one-third of Islamic knowledge by some scholars. It establishes that the validity and reward of actions depend on the intention behind them.`,
    source: "Sahih Bukhari #1, Sahih Muslim #1907",
    category: "hadith"
  },
  {
    title: "The Five Pillars of Islam",
    content: `The Prophet (ﷺ) said: "Islam is built upon five: to testify that there is no god worthy of worship except Allah and that Muhammad is the Messenger of Allah, to establish the prayer, to give zakah, to fast Ramadan, and to perform pilgrimage (Hajj) to the House if you have the means." (Sahih Bukhari #8, Sahih Muslim #16). These five pillars form the foundation of Islamic practice.`,
    source: "Sahih Bukhari #8, Sahih Muslim #16",
    category: "hadith"
  },
  {
    title: "The Definition of Ihsan (Excellence in Worship)",
    content: `The Prophet (ﷺ) said: "Ihsan is to worship Allah as if you see Him, and if you cannot see Him, then He certainly sees you." (Sahih Bukhari #50, Sahih Muslim #8). This is from the famous hadith of Jibril (Gabriel) where he asked the Prophet about Islam, Iman, and Ihsan in the presence of the Companions.`,
    source: "Sahih Bukhari #50, Sahih Muslim #8",
    category: "hadith"
  },
  {
    title: "Whoever Innovates in Religion - Hadith on Bid'ah",
    content: `The Prophet (ﷺ) said: "Whoever introduces into this matter of ours (Islam) something that is not part of it, it will be rejected." (Sahih Bukhari #2697, Sahih Muslim #1718). In another narration: "Whoever does an action that is not in accordance with this matter of ours, it will be rejected." (Sahih Muslim #1718). And: "The best speech is the Book of Allah, and the best guidance is the guidance of Muhammad (ﷺ). The worst of matters are the newly invented ones. Every bid'ah (innovation) is misguidance." (Sahih Muslim #867).`,
    source: "Sahih Bukhari #2697, Sahih Muslim #1718, #867",
    category: "hadith"
  },
  {
    title: "The Prohibition of Anger and Good Character",
    content: `A man asked the Prophet (ﷺ) for advice. The Prophet said: "Do not become angry." The man repeated his request, and the Prophet said: "Do not become angry." (Sahih Bukhari #6116). The Prophet (ﷺ) also said: "The most complete of believers in faith are those with the best character." (Tirmidhi #1162, authenticated by Al-Albani). And: "I have been sent to perfect good character." (Muwatta Malik).`,
    source: "Sahih Bukhari #6116, Jami al-Tirmidhi #1162",
    category: "hadith"
  },
  {
    title: "The Importance of Knowledge",
    content: `The Prophet (ﷺ) said: "Whoever travels a path seeking knowledge, Allah makes easy for them a path to Paradise." (Sahih Muslim #2699). "When a person dies, their deeds come to an end except for three: ongoing charity, beneficial knowledge, or a righteous child who prays for them." (Sahih Muslim #1631). "Seeking knowledge is an obligation upon every Muslim." (Ibn Majah #224, authenticated by Al-Albani).`,
    source: "Sahih Muslim #2699, #1631, Sunan Ibn Majah #224",
    category: "hadith"
  },
  {
    title: "The Rights of Neighbors and Muslims",
    content: `The Prophet (ﷺ) said: "None of you has complete faith until he loves for his brother what he loves for himself." (Sahih Bukhari #13, Sahih Muslim #45). "Whoever believes in Allah and the Last Day, let him speak good or remain silent. Whoever believes in Allah and the Last Day, let him honor his neighbor." (Sahih Bukhari #6018, Sahih Muslim #47). "Do not envy one another, do not outbid one another, do not hate one another, do not turn away from one another, and do not undercut one another in business. Be servants of Allah as brothers." (Sahih Muslim #2564).`,
    source: "Sahih Bukhari #13, #6018, Sahih Muslim #45, #47, #2564",
    category: "hadith"
  },
  {
    title: "The Night of Decree (Laylat al-Qadr)",
    content: `The Prophet (ﷺ) said: "Whoever stands in prayer on Laylat al-Qadr out of faith and seeking reward, his previous sins will be forgiven." (Sahih Bukhari #1901, Sahih Muslim #760). Laylat al-Qadr is in the last ten nights of Ramadan, especially the odd nights (21st, 23rd, 25th, 27th, 29th). The Prophet (ﷺ) said: "Search for Laylat al-Qadr in the odd nights of the last ten nights of Ramadan." (Sahih Bukhari #2017). The preferred supplication on this night is: "Allahumma innaka afuwwun tuhibbul afwa fa'fu anni" (O Allah, You are Forgiving and love forgiveness, so forgive me). (Tirmidhi #3513, authenticated by Al-Albani).`,
    source: "Sahih Bukhari #1901, #2017, Sahih Muslim #760, Tirmidhi #3513",
    category: "hadith"
  },
  {
    title: "The Virtue of Fasting",
    content: `The Prophet (ﷺ) said: "Every deed of the son of Adam is multiplied, a good deed is multiplied ten times up to seven hundred times. Allah said: 'Except fasting, for it is for Me and I will reward for it. He gives up his desire and his food for My sake.'" (Sahih Muslim #1151). "Whoever fasts Ramadan out of faith and seeking reward, his previous sins will be forgiven." (Sahih Bukhari #38, Sahih Muslim #760). "There is a gate in Paradise called Ar-Rayyan. Those who fast will enter through it, and no one else will enter." (Sahih Bukhari #1896, Sahih Muslim #1152).`,
    source: "Sahih Bukhari #38, #1896, Sahih Muslim #760, #1151, #1152",
    category: "hadith"
  },
  {
    title: "The Virtue of Prayer (Salah)",
    content: `The Prophet (ﷺ) said: "The first matter that the servant will be brought to account for on the Day of Resurrection is the prayer. If it is sound, the rest of his deeds will be sound. If it is corrupted, the rest of his deeds will be corrupted." (Tabarani, authenticated by Al-Albani). "The covenant between us and them is the prayer; whoever abandons it has disbelieved." (Tirmidhi #2621, Ibn Majah #1079, authenticated by Al-Albani). "Prayer is the light of the believer." (Sahih Muslim #223). The five daily prayers expiate sins committed between them as long as major sins are avoided (Sahih Muslim #233).`,
    source: "Sahih Muslim #223, #233, Tirmidhi #2621, authenticated by Al-Albani",
    category: "hadith"
  },

  // ===== FIQH (SALAFI POSITIONS - BASED ON QURAN AND SAHIH SUNNAH) =====
  {
    title: "Conditions of the Prayer (Shurut al-Salah)",
    content: `The conditions for the prayer to be valid according to the Quran and authentic Sunnah:
1. Entering the time of prayer — Allah says: "Indeed, prayer has been decreed upon the believers at fixed times." (Quran 4:103). Each of the five prayers has a specific time.
2. Purification (Taharah) — from hadath (impurity). The Prophet (ﷺ) said: "Allah does not accept prayer without purification." (Sahih Muslim #224). This includes wudu for minor impurity and ghusl for major impurity.
3. Covering the awrah — for men, from navel to knee; for women, all of the body except face and hands.
4. Facing the Qiblah (direction of the Ka'bah in Makkah) — "Turn your face toward al-Masjid al-Haram" (Quran 2:144).
5. Intention (niyyah) in the heart.

The pillars of prayer (arkan) include: standing (if able), takbirat al-ihram (saying Allahu Akbar to begin), reciting Al-Fatihah, bowing (ruku'), rising from bowing, prostrating on seven limbs (sajdah), rising from prostration, sitting between prostrations, the final tashahhud, sending salawat on the Prophet, and taslim (saying salam to end).`,
    source: "Fiqh - Based on Quran, Sahih Bukhari, Sahih Muslim, Ibn Baz, Ibn Uthaymeen",
    category: "fiqh"
  },
  {
    title: "Zakah (Obligatory Charity)",
    content: `Zakah is the third pillar of Islam. It is obligatory on every free Muslim who owns the minimum threshold (nisab) for one lunar year. The nisab is the equivalent of 85g of gold or 595g of silver. The rate is 2.5% on savings, gold, silver, and trade goods. Zakah on agricultural produce is 5% if irrigated and 10% if naturally watered. Zakah is given to eight categories mentioned in Quran 9:60: the poor, the needy, those employed to collect it, those whose hearts are to be reconciled, freeing captives, those in debt, in the path of Allah, and the wayfarer. Zakah should be given to local Muslims first. It cannot be given to non-Muslims or to direct ascendants/descendants.`,
    source: "Fiqh - Quran 9:60, Sahih Bukhari, Ibn Baz, Ibn Uthaymeen",
    category: "fiqh"
  },
  {
    title: "Rulings on Hajj (Pilgrimage)",
    content: `Hajj is obligatory once in a lifetime for those who have the physical and financial ability (Quran 3:97). The pillars of Hajj (without which it is invalid): 1) Ihram (intention), 2) Standing at Arafah (the Prophet (ﷺ) said: "Hajj is Arafah" — Bukhari and Muslim), 3) Tawaf al-Ifadah, 4) Sa'i between Safa and Marwah. Obligatory acts (wajibat): 1) Ihram from the miqat, 2) Spending the night at Muzdalifah, 3) Spending the nights of Tashriq at Mina, 4) Stoning the Jamarat, 5) Shaving or trimming hair, 6) Farewell tawaf (for non-residents of Makkah).`,
    source: "Fiqh - Quran 3:97, Sahih Bukhari, Sahih Muslim, Ibn Baz",
    category: "fiqh"
  },
  {
    title: "Rulings on Marriage in Islam",
    content: `Marriage (nikah) is a sacred contract in Islam. The conditions for a valid marriage: 1) Mutual consent of both parties, 2) Presence of a guardian (wali) for the bride — the Prophet (ﷺ) said: "There is no marriage without a guardian." (Abu Dawud #2085, Tirmidhi #1101, authenticated by Al-Albani), 3) Two witnesses of upright character, 4) Mahr (dowry) given to the bride — "Give the women their bridal gift as a free gift" (Quran 4:4). Polygyny is permitted up to four wives if justice can be maintained (Quran 4:3). The husband is responsible for maintenance (nafaqah) of his wife and children. Divorce (talaq) is permissible but disliked by Allah — the Prophet (ﷺ) said: "The most hated permissible thing to Allah is divorce." (Abu Dawud, authenticated by Al-Albani).`,
    source: "Fiqh - Quran 4:3, 4:4, Abu Dawud #2085, Tirmidhi #1101, authenticated by Al-Albani",
    category: "fiqh"
  },
  {
    title: "Rulings on Food and Drink",
    content: `Allah says: "O you who have believed, eat from the good things which We have provided for you" (Quran 2:172). Permissible (halal) foods: all that is good and pure. Prohibited (haram) foods: 1) Dead meat (carrion), 2) Blood, 3) Pork, 4) Meat not slaughtered in Allah's name (Quran 2:173, 5:3, 6:145). Seafood is all permissible — the Prophet (ﷺ) said: "Its water is pure and its dead are permissible." (Abu Dawud #83, Tirmidhi #69). Hunting animals with trained dogs or birds of prey is permitted if Allah's name is mentioned when releasing them (Quran 5:4). All intoxicants (khamr) are haram — "Intoxicants, gambling, al-ansab, and al-azlam are an abomination of Satan's handiwork, so avoid it" (Quran 5:90). The Prophet (ﷺ) said: "Every intoxicant is khamr and every intoxicant is haram." (Sahih Muslim #2003).`,
    source: "Fiqh - Quran 2:172, 2:173, 5:3, 5:90, Sahih Muslim #2003, Ibn Baz",
    category: "fiqh"
  },
  {
    title: "Rulings on Menstruation (Hayd)",
    content: `During menstruation, women are prohibited from: 1) Praying (salah), 2) Fasting (but must make up missed days), 3) Sexual intercourse — "Keep away from women during menstruation" (Quran 2:222), 4) Tawaf (circumambulation of Ka'bah), 5) Entering the mosque if there is fear of staining. The Prophet (ﷺ) said: "Is it not that when a woman menstruates, she does not pray nor fast?" (Bukhari #304). She may recite Quran from memory, make dhikr, supplicate, and listen to Quran. She should not make up missed prayers — Aisha (may Allah be pleased with her) said: "We would menstruate during the time of the Prophet (ﷺ), and we were commanded to make up the fasts but not the prayers." (Bukhari #321, Muslim #335). Ghusl (full bath) is required when bleeding stops.`,
    source: "Fiqh - Quran 2:222, Sahih Bukhari #304, #321, Sahih Muslim #335, Ibn Baz",
    category: "fiqh"
  },
  {
    title: "The Prohibition of Riba (Usury/Interest)",
    content: `Riba (interest/usury) is strictly prohibited in Islam. Allah says: "Allah has permitted trade and forbidden riba" (Quran 2:275). "O you who have believed, fear Allah and give up what remains of riba if you are believers. If you do not, be warned of war from Allah and His Messenger" (Quran 2:278-279). The Prophet (ﷺ) cursed the one who consumes riba, the one who pays it, the one who writes it, and the two witnesses, saying they are all alike (Sahih Muslim #1598). Riba includes any increase on a loan, late payment fees, and credit card interest. Dealing with conventional banks that operate on interest is prohibited. Islamic finance uses profit-sharing (mudarabah), cost-plus (murabahah), and leasing (ijarah) instead.`,
    source: "Fiqh - Quran 2:275, 2:278-279, Sahih Muslim #1598, Ibn Baz, Ibn Uthaymeen",
    category: "fiqh"
  },
  {
    title: "Rulings on Dress and Appearance",
    content: `For men: Must cover from navel to knee. Silk and gold are prohibited for men (Bukhari #5843, Muslim #2067). Men should not imitate women's dress. The Prophet cursed men who imitate women and women who imitate men (Bukhari #5885). For women: Must cover all of the body except face and hands in the presence of non-mahram men. "And tell the believing women to lower their gaze and guard their private parts and not display their adornment except what is apparent" (Quran 24:31). "O Prophet, tell your wives and your daughters and the women of the believers to draw their cloaks (jilbab) over themselves" (Quran 33:59). The jilbab must be loose, opaque, and not resemble the dress of disbelievers. The niqab (face veil) is recommended by many scholars based on the practice of the Mothers of the Believers.`,
    source: "Fiqh - Quran 24:31, 33:59, Sahih Bukhari #5843, #5885, Sahih Muslim #2067, Ibn Baz",
    category: "fiqh"
  },
  {
    title: "Rulings on Jihad",
    content: `Jihad literally means "striving" in the path of Allah. The greater jihad is against one's own soul (nafs) to obey Allah. The lesser jihad is armed struggle. Defensive jihad becomes obligatory (fard 'ayn) when Muslim lands are attacked. Offensive jihad is fard kifayah (communal obligation) under a legitimate ruler. The Prophet (ﷺ) said: "I have been commanded to fight people until they testify that there is no god worthy of worship except Allah and that Muhammad is the Messenger of Allah, establish prayer, and give zakah." (Bukhari #25, Muslim #22). This applies to those who refuse to accept Islam after being called, not to peaceful people. Non-combatants (women, children, elderly, monks) must not be harmed. "Fight in the way of Allah those who fight you but do not transgress. Indeed, Allah does not like transgressors." (Quran 2:190).`,
    source: "Fiqh - Quran 2:190, Bukhari #25, Muslim #22, Ibn Baz, Ibn Uthaymeen",
    category: "fiqh"
  },
  {
    title: "Rulings on Inheritance (Miraath)",
    content: `Inheritance is detailed in Quran 4:7-12, 4:176. Fixed shares are given to: husband (1/4 if no children, 1/2 if children), wife/wives (1/8 if no children, 1/4 if children), daughters, parents, and siblings. A son's share is double a daughter's share — "Allah instructs you concerning your children: for the male is the share of two females" (Quran 4:11). This is because the man bears financial responsibility for the family. The Prophet (ﷺ) said: "Allah has given each rightful person their right, so there is no bequest to an heir." (Tirmidhi #2120, authenticated by Al-Albani) — meaning a will cannot override the fixed shares. Up to 1/3 of the estate can be willed to non-heirs. Inheritance must be distributed before any other claims.`,
    source: "Fiqh - Quran 4:7-12, 4:176, Tirmidhi #2120, Ibn Baz",
    category: "fiqh"
  },
  {
    title: "The Names and Attributes of Allah",
    content: `The Salafi position on Allah's names and attributes follows the method of the Salaf (early Muslims). Allah has the most beautiful names (al-asma al-husna) — "And to Allah belong the best names, so invoke Him by them" (Quran 7:180). His attributes are affirmed as they come in the Quran and authentic Sunnah, without tahrif (distortion), ta'til (denial), takyif (asking how), or tamthil (likening to creation). "There is nothing like unto Him, and He is the All-Hearing, All-Seeing." (Quran 42:11). Examples: Allah rose above His throne (istiwa') in a manner befitting His majesty (Quran 20:5), He has hands (Quran 38:75), He descends to the lowest heaven (Bukhari #1145, Muslim #758), He laughs (Muslim #2828), He has a face (Quran 55:27), and He has eyes (Quran 54:14). These are affirmed as true realities without asking how. This is the position of Imam Ahmad, Ibn Taymiyyah, Ibn al-Qayyim, and the contemporary scholars Ibn Baz, Ibn Uthaymeen, and Al-Albani. It rejects the figurative interpretation (ta'wil) of the Mu'tazilah, Ash'aris, and Jahmiyyah.`,
    source: "Aqeedah - Quran 42:11, 7:180, 20:5, Sahih Bukhari #1145, Sahih Muslim #758, Ibn Baz, Ibn Uthaymeen, Al-Albani",
    category: "aqeedah"
  },
  {
    title: "The Prohibition of Seeking Omens (Tiyarah) and Fortune Telling",
    content: `Tiyarah (superstitious omens) is a form of shirk. The Prophet (ﷺ) said: "Tiyarah is shirk, tiyarah is shirk" (Abu Dawud #3910, Tirmidhi #1614, authenticated by Al-Albani). Seeking omens from birds, black cats, dates, or bad luck charms is prohibited. Fortune telling, astrology, palm reading, and divination are all haram. The Prophet (ﷺ) said: "Whoever goes to a fortune teller and asks him about something, his prayer will not be accepted for forty nights." (Sahih Muslim #2230). Believing in astrological predictions or horoscopes contradicts Tawhid. Trust should be in Allah alone. The Prophet (ﷺ) taught to say: "O Allah, I seek refuge in You from bad omens." (Abu Dawud, authenticated by Al-Albani).`,
    source: "Aqeedah/Fiqh - Abu Dawud #3910, Tirmidhi #1614, Sahih Muslim #2230, Ibn Baz, Al-Albani",
    category: "aqeedah"
  },
  {
    title: "Al-Wala wal-Bara (Loyalty and Disassociation)",
    content: `Al-Wala wal-Bara is an Islamic concept: loving and being loyal to believers (wala) and disassociating from disbelief and disbelievers (bara). Allah says: "You will not find a people who believe in Allah and the Last Day having affection for those who oppose Allah and His Messenger" (Quran 58:22). "O you who have believed, do not take the Jews and the Christians as allies. They are allies of one another. And whoever is an ally to them among you, then indeed he is of them" (Quran 5:51). This does not mean injustice or aggression — Muslims must deal justly with non-Muslims: "Allah does not forbid you from being righteous and just toward those who have not fought you because of religion" (Quran 60:8). Wala includes loving the believers, supporting them, and feeling joy at their success. Bara includes hating shirk and disbelief, and feeling distress at the spread of falsehood.`,
    source: "Aqeedah - Quran 58:22, 5:51, 60:8, Ibn Baz, Ibn Uthaymeen, Al-Fawzan",
    category: "aqeedah"
  },

  // ===== FOUR MADHABS - OVERVIEW =====
  {
    title: "The Four Madhabs - Overview of Sunni Islamic Schools of Law",
    content: `The four established Sunni madhabs (schools of jurisprudence) are Hanafi, Maliki, Shafi'i, and Hanbali. All four follow the same foundational sources (Quran, Sunnah, Ijma, Qiyas) but differ in methodology and emphasis. The Prophet (ﷺ) said: "The best people are my generation, then those who follow them, then those who follow them" (Bukhari #3650). The Salafi methodology follows the strongest evidence from Quran and Sunnah while respecting all four madhabs as valid paths within Ahl al-Sunnah wal-Jama'ah. The differences between madhabs are a mercy (based on the hadith: "The difference of opinion among my ummah is a mercy" - though its chain is weak, the meaning is accepted by scholars).`,
    source: "Comparative Fiqh - Based on Quran, Sunnah, and the Four Schools",
    category: "fiqh"
  },
  {
    title: "Hanafi Madhab - Founded by Imam Abu Hanifah",
    content: `Founded by Imam Abu Hanifah al-Nu'man ibn Thabit (80-150 AH / 699-767 CE). The Hanafi school is the largest in terms of followers, predominant in Turkey, Central Asia, the Indian subcontinent, and the Balkans. Key methodology: extensive use of ra'y (reasoned opinion) and qiyas (analogical deduction), preference for istihsan (juristic preference), and heavy reliance on established custom (urf). The school gives significant weight to the hadith but applies rigorous criteria for acceptance. Key texts: al-Hidayah, Radd al-Muhtar (al-Durr al-Mukhtar), Fatawa Hindiyya. Famous Hanafi scholars: Abu Yusuf, Muhammad al-Shaybani, al-Tahawi, al-Sarakhsi, Ibn Abidin. The school is known for its detailed treatment of transactions (mu'amalat) and flexible approach to changing circumstances.`,
    source: "Comparative Fiqh - Hanafi School (Imam Abu Hanifah)",
    category: "fiqh"
  },
  {
    title: "Maliki Madhab - Founded by Imam Malik ibn Anas",
    content: `Founded by Imam Malik ibn Anas (93-179 AH / 711-795 CE) in Medina. The Maliki school is predominant in North and West Africa (including Senegal, Mali, Mauritania, Morocco, Algeria, Tunisia, Libya, Sudan) and parts of the Gulf. Key methodology: prioritization of amal ahl al-Madinah (the practice of the people of Medina) as a source of law, emphasis on masalih mursalah (public interest), and consideration of sadd al-dhara'i (blocking pretexts). Imam Malik compiled al-Muwatta, one of the earliest hadith collections. Key texts: al-Mudawwanah, al-Mukhtasar (Khalil), al-Risalah (Ibn Abi Zayd al-Qayrawani). Famous Maliki scholars: Ibn al-Qasim, Ashhab, Sahnun, al-Qarafi, al-Shatibi, Ibn Rushd (Averroes). The school is known for its emphasis on the practice of the people of Medina as a living transmission of the Sunnah.`,
    source: "Comparative Fiqh - Maliki School (Imam Malik ibn Anas)",
    category: "fiqh"
  },
  {
    title: "Shafi'i Madhab - Founded by Imam al-Shafi'i",
    content: `Founded by Imam Muhammad ibn Idris al-Shafi'i (150-204 AH / 767-820 CE). The Shafi'i school is predominant in Egypt, Yemen, East Africa (Somalia, Ethiopia), Southeast Asia (Indonesia, Malaysia, Philippines), and parts of the Levant and Hijaz. Key methodology: systematic hierarchy of evidence (Quran → Sunnah → Ijma → Qiyas), rejection of istihsan (juristic preference), emphasis on the literal meaning of texts, and strict requirement for hadith authenticity. Imam al-Shafi'i established usul al-fiqh as a discipline through his work al-Risalah. Key texts: al-Umm, Minhaj al-Talibin (al-Nawawi), al-Majmu', Fath al-Muin. Famous Shafi'i scholars: al-Muzani, al-Nawawi, al-Suyuti, Ibn Hajar al-Asqalani, al-Ghazali. The school is known for its systematic methodology and balanced approach.`,
    source: "Comparative Fiqh - Shafi'i School (Imam al-Shafi'i)",
    category: "fiqh"
  },
  {
    title: "Hanbali Madhab - Founded by Imam Ahmad ibn Hanbal",
    content: `Founded by Imam Ahmad ibn Hanbal (164-241 AH / 780-855 CE). The Hanbali school is predominant in Saudi Arabia, Qatar, and parts of the Levant and Iraq. Key methodology: strict adherence to the literal texts of Quran and hadith, minimal use of qiyas (only when absolutely necessary), rejection of ra'y and istihsan, and reliance on fatwa of the Companions (fatwa al-sahabi). Imam Ahmad compiled al-Musnad, one of the largest hadith collections (over 27,000 hadith). Key texts: al-Mughni (Ibn Qudamah), al-Muharrar, Kashshaf al-Qina', al-Insaf. Famous Hanbali scholars: Ibn Qudamah, Ibn Taymiyyah, Ibn al-Qayyim, al-Buhuti, al-Mardawi. In modern times, the Hanbali school is often associated with the Salafi methodology due to its strict textual approach, though Salafism is not limited to any single madhab.`,
    source: "Comparative Fiqh - Hanbali School (Imam Ahmad ibn Hanbal)",
    category: "fiqh"
  },

  // ===== MADHAB COMPARISONS - PRAYER (SALAH) =====
  {
    title: "Raising Hands in Prayer (Raf al-Yadayn) - Madhab Positions",
    content: `Raising the hands during prayer (raf al-yadayn) at the takbirat al-ihram, before and after ruku, is a well-known point of difference:
- Hanbali and Shafi'i: Raise hands at takbirat al-ihram, before ruku (when going into it), and after rising from ruku. Based on authentic hadith: "I saw the Prophet (ﷺ) raise his hands when he began the prayer, when he bowed, and when he raised his head from bowing" (Bukhari #735, Muslim #390).
- Hanafi: Only raise hands at the opening takbir (takbirat al-ihram). Do not raise at any other point. Based on the practice of Abdullah ibn Mas'ud who reported: "The Prophet (ﷺ) used to raise his hands at the opening takbir, then not thereafter" (Abu Dawud #748, although its authenticity is debated; graded hasan by some, da'if by others).
- Maliki: Raise hands at the opening takbir only. The well-known Maliki position is similar to Hanafi on this point.
The majority of hadith support raising, making it the stronger evidenced position, but all positions are valid within their respective methodological frameworks.`,
    source: "Comparative Fiqh - Sahih Bukhari #735, Sahih Muslim #390, Abu Dawud #748",
    category: "fiqh"
  },
  {
    title: "Saying Ameen in Prayer - Aloud or Silently - Madhab Positions",
    content: `Whether the congregation says Ameen aloud after the imam's Fatiha differs:
- Shafi'i and Hanbali: The congregation says Ameen aloud. Based on the Prophet (ﷺ) saying: "When the imam says Ameen, say Ameen, for whoever's Ameen coincides with the angels' Ameen, their previous sins will be forgiven" (Bukhari #780, Muslim #410). This hadith is interpreted by these schools as commanding audible Ameen.
- Hanafi: The congregation says Ameen silently. Based on Quran 17:110: "And do not recite loudly in your prayer, nor silently, but seek a way in between." Hanafis interpret the raising of voices in prayer as undesirable.
- Maliki: The imam says Ameen silently, and the congregation also says it silently. Based on the practice of the people of Medina transmitted through Imam Malik.
All views are valid and based on evidence. The Shafi'i and Hanbali position is supported by more explicit textual evidence, while Hanafi and Maliki rely on general principles of lowering the voice in prayer.`,
    source: "Comparative Fiqh - Sahih Bukhari #780, Sahih Muslim #410, Quran 17:110",
    category: "fiqh"
  },
  {
    title: "Reciting Al-Fatihah Behind the Imam - Madhab Positions",
    content: `Whether one must recite Al-Fatihah when praying behind an imam:
- Shafi'i: Reciting Al-Fatihah behind the imam is obligatory (fard) in all prayers, whether the imam recites aloud or silently. Based on "There is no prayer for the one who did not recite Al-Fatihah" (Bukhari #756, Muslim #394). This is applied generally to all prayer situations.
- Hanbali: Must recite Al-Fatihah in silent prayers, but should remain silent during aloud prayers and listen. Based on Quran 7:204: "When the Quran is recited, listen to it and be silent." Combines both evidences.
- Hanafi: Do not recite anything behind the imam. The imam's recitation suffices for the follower. Based on: "When he (the imam) recites, then listen attentively" (Muslim #404). And: "Whoever has an imam, the imam's recitation is his recitation" (Ibn Majah, hadith with varying authenticity).
- Maliki: Recite Fatiha behind the imam in silent prayers but not in aloud prayers. Similar to the Hanbali position in effect.
The strongest evidence supports reciting Fatiha (Bukhari #756 is explicit), but listening during aloud recitation also has strong Quranic evidence (7:204).`,
    source: "Comparative Fiqh - Sahih Bukhari #756, Sahih Muslim #394, #404, Quran 7:204",
    category: "fiqh"
  },
  {
    title: "Hand Placement in Prayer (Qabd vs Sadl) - Madhab Positions",
    content: `Where to place the hands during standing (qiyam) in prayer:
- Hanafi: Men place hands below the navel, right hand grasping the left wrist. Women place hands on the chest. Based on the practice of Ali (may Allah be pleased with him): "It is from the Sunnah to place one hand over the other below the navel" (Abu Dawud #756, though its chain is debated).
- Shafi'i: Place hands on the chest, between the navel and the chest, with right hand on the back of the left hand. Based on "We used to be commanded to place the right hand over the left in prayer" (Muslim #401) and the practice of the Prophet as observed by Sahih narrators.
- Hanbali: Place hands on the chest. The preferred Hanbali position is on the upper chest. Evidence: "The Prophet (ﷺ) used to place his right hand over his left and place them on his chest" (Abu Dawud #759, reported by Qays ibn Rami).
- Maliki: Let the hands hang at the sides (sadl) during the standing position. This is the distinctive Maliki position. Based on the practice of the people of Medina transmitted through Imam Malik.
All positions are valid. The hadith evidence is strongest for placing hands on the chest, but the Maliki position preserves a practice some scholars trace to early Islam.`,
    source: "Comparative Fiqh - Abu Dawud #756, #759, Sahih Muslim #401",
    category: "fiqh"
  },
  {
    title: "Qunut in Fajr Prayer - Madhab Positions",
    content: `The qunut (supplication) in the Fajr prayer differs significantly across madhabs:
- Shafi'i: Qunut in Fajr is a confirmed Sunnah (sunnah mu'akkadah), recited after rising from ruku in the second rakah. Based on: "The Prophet (ﷺ) used to recite qunut in Fajr" (Muslim #678). They interpret the Prophet's consistency as establishing it as a regular practice.
- Hanafi: No qunut in Fajr except during calamities (qunut al-nazilah). Based on the hadith that the Prophet (ﷺ) recited qunut for one month then stopped (Bukhari #1003). They view the regular qunut as abrogated.
- Hanbali: Qunut in Fajr is recommended but not emphasized. They consider it optional. Based on the narration that the Prophet (ﷺ) sometimes did it and sometimes did not, making it non-obligatory.
- Maliki: No qunut in Fajr as a regular practice. They confine qunut to times of calamity (qunut al-nazilah), similar to Hanafi but with different evidence weighting.
The Shafi'i and Hanbali positions have stronger specific textual evidence, while the Hanafi and Maliki rely on the principle that the Prophet abandoned a regular qunut.`,
    source: "Comparative Fiqh - Sahih Muslim #678, Sahih Bukhari #1003",
    category: "fiqh"
  },

  // ===== MADHAB COMPARISONS - PURIFICATION (TAHARAH) =====
  {
    title: "Wiping Over Socks (Mash ala al-Khuffayn) - Madhab Conditions",
    content: `Wiping over socks during wudu is permitted by all four madhabs, but with different conditions:
- Hanbali: Permitted on any socks that cover the ankles (including thin cotton socks), as long as they can be walked in. The primary condition is coverage of the foot and ankle. Time limit: 24 hours for resident, 72 hours for traveler.
- Hanafi: Must be thick, durable footwear known as khuff (leather or thick material), not thin cotton socks. Must be able to walk in them without another shoe. Time limit: 24 hours resident, 72 hours traveler.
- Shafi'i: Must be leather or leather-like material that covers the entire foot and ankle, and must be worn in a state of wudu. Thin cotton socks are not sufficient. Time limit: 24 hours resident, 72 hours traveler.
- Maliki: Similar to Hanbali — any covering of the feet suffices, including socks, as long as they are not transparent. Time limit: 24 hours for resident, 72 hours for traveler.
All agree that wiping is on the top of the sock only, not the bottom, based on the Prophet's practice. The Hanbali and Maliki views are more practical for contemporary Muslims. The evidence is the hadith: "The Prophet (ﷺ) wiped over his socks and sandals" (Abu Dawud #159, Tirmidhi #99, authenticated by Al-Albani).`,
    source: "Comparative Fiqh - Abu Dawud #159, Tirmidhi #99, Al-Albani authentication",
    category: "fiqh"
  },
  {
    title: "Touching a Woman Breaks Wudu - Madhab Positions",
    content: `Does touching a woman (non-mahram) invalidate wudu?
- Shafi'i: Yes, any skin-to-skin contact between a man and non-mahram woman breaks wudu. Based on: "Or you have touched women" (Quran 5:6), interpreted literally as physical touch. Also: "The Prophet (ﷺ) kissed one of his wives and prayed without performing wudu" is explained as him having been in a state of wudu already.
- Hanafi: No, touching a woman does not break wudu. Based on the same Quran 5:6, which they interpret as meaning sexual intercourse (metaphorical touch). Supported by the hadith: "The Prophet (ﷺ) kissed one of his wives and prayed without performing wudu" (Abu Dawud #179, Tirmidhi #86).
- Maliki: No, touching does not break wudu unless accompanied by sexual desire (shahwah). If there is desire, wudu is broken. This is a middle position.
- Hanbali: No, touching a woman does not break wudu under any circumstances. Based on the same hadith evidence and the principle that acts remain valid unless clear evidence proves otherwise.
The strongest textual evidence supports the view that touching does not break wudu (the hadith is explicit), which is why the majority (Hanafi, Maliki with condition, Hanbali) take this position.`,
    source: "Comparative Fiqh - Quran 5:6, Abu Dawud #179, Tirmidhi #86",
    category: "fiqh"
  },
  {
    title: "Bleeding Breaks Wudu - Madhab Positions",
    content: `Does bleeding (e.g., from a wound, cupping, nosebleed) break wudu?
- Hanafi: No, bleeding does NOT break wudu unless blood flows beyond the wound area. Even then, it is makruh (disliked) but does not invalidate wudu. Based on the practice of the Companions: "Ibn Umar squeezed a pimple and blood came out, and he prayed without renewing wudu" (Muwatta Malik #62).
- Shafi'i: Yes, bleeding breaks wudu. Based on "If any of you experiences a flow of blood while in prayer, let him leave and make wudu" (Darqutni). They interpret the general command as including all significant bleeding.
- Maliki: Yes, bleeding breaks wudu if the blood flows (moves beyond the wound). Minor spots do not break wudu. The criterion is flow, not mere occurrence.
- Hanbali: No, bleeding does NOT break wudu. The Hanbali position is the same as Hanafi — bleeding does not invalidate wudu. Based on explicit reports from the Companions.
The Hanafi and Hanbali positions have stronger evidence from the practice of the Companions. The hadith about renewing wudu for blood is not considered authentic (da'if) by many muhaddithin.`,
    source: "Comparative Fiqh - Muwatta Malik, Darqutni, Companion practices",
    category: "fiqh"
  },
  {
    title: "Eating Camel Meat Breaks Wudu - Madhab Positions",
    content: `Does eating camel meat invalidate wudu?
- Hanbali: Yes, eating camel meat breaks wudu. The Prophet (ﷺ) said: "Perform wudu from eating camel meat" (Muslim #360, Abu Dawud #184). This is considered an explicit, un-abrogated command by the Hanbali school.
- Hanafi: No, eating camel meat does not break wudu. They interpret the command as relating to hygiene or recommendatory, not obligatory. They also note that the Prophet (ﷺ) ate camel meat and prayed without wudu in some narrations, suggesting the command was specific to certain contexts.
- Shafi'i: No, eating camel meat does not break wudu. They view the hadith as abrogated or as applying only to the specific context of the conquest of Khaybar. The general principle is that eating cooked food does not break wudu.
- Maliki: No, eating camel meat does not break wudu. They consider that only what exits from the private parts (urine, stool, wind) breaks wudu.
The Hanbali position follows the literal wording of an authentic hadith (Muslim #360). The majority position (Hanafi, Maliki, Shafi'i) relies on the general principle that food does not break wudu, treating the camel meat hadith as either context-specific or non-obligatory.`,
    source: "Comparative Fiqh - Sahih Muslim #360, Abu Dawud #184",
    category: "fiqh"
  },

  // ===== MADHAB COMPARISONS - FASTING, ZAKAT, HAJJ =====
  {
    title: "Tarawih Prayer - Number of Rakats - Madhab Positions",
    content: `The number of rakats for Tarawih prayer during Ramadan varies:
- Hanafi: 20 rakats (10 salams of 2 rakats each). Based on the practice of Umar ibn al-Khattab (may Allah be pleased with him) who established 20 rakats during his caliphate (Muwatta Malik, authenticated transmission). The Hanafis also add 3 rakats of Witr.
- Shafi'i: 20 rakats, same as Hanafi. Based on the same practice of Umar and the consensus of the Companions on this number. Also add 3 rakats Witr.
- Hanbali: 20 rakats is the preferred number, based on the established practice of the Companions. Ibn Qudamah in al-Mughni confirmed 20 rakats as the sunnah.
- Maliki: 20 rakats (some older sources mention 36). The well-known Maliki position is 20 rakats plus 3 Witr. Some Maliki sources mention 36 rakats based on the practice of the people of Medina after the Companions.
Evidence both ways: Aisha (may Allah be pleased with her) said the Prophet (ﷺ) never prayed more than 11 rakats (including Witr) in Ramadan (Bukhari #1147, Muslim #738). Some scholars follow this as the sunnah (8 Tarawih + 3 Witr = 11). Others consider the 20-rakat practice established by Umar as a legitimate expansion approved by the Companions. Both positions have strong evidence.`,
    source: "Comparative Fiqh - Bukhari #1147, Muslim #738, Muwatta Malik, al-Mughni",
    category: "fiqh"
  },
  {
    title: "Triple Talaq (Divorce) - Madhab Positions",
    content: `If a husband pronounces three divorces at once (triple talaq), does it count as three or one?
- Hanafi, Maliki, Hanbali: All three count as three, making the divorce irrevocable (talaq ba'in). The wife cannot remarry the husband unless she marries another man and that marriage ends legitimately (halalah). Based on the hadith that the Prophet (ﷺ) approved three divorces as three (Muslim #1472).
- Shafi'i: All three count as three — same position as the majority. This is the established Shafi'i view.
- Contemporary Salafi view (following Ibn Taymiyyah and Ibn al-Qayyim): Triple talaq pronounced at once counts as ONE divorce (talaq raj'i). Based on the hadith: "Three divorces during the time of the Prophet (ﷺ), Abu Bakr, and the first two years of Umar's caliphate were counted as one" (Muslim #1472, in a different narration). Umar later changed this practice for public interest (to prevent men from trifling with divorce).
The majority position (counts as three) follows the later practice endorsed by Umar and the Companions. The minority position (counts as one) follows the earlier practice of the Prophet himself. Both positions have textual evidence.`,
    source: "Comparative Fiqh - Sahih Muslim #1472, Ibn Taymiyyah, Ibn al-Qayyim",
    category: "fiqh"
  },

  // ===== MADHAB COMPARISONS - FOOD, DRINK, DAILY LIFE =====
  {
    title: "Dog Saliva and Impurity - Madhab Positions",
    content: `The ruling on dog saliva and whether dogs are impure (najis):
- Hanafi: Dog saliva and all parts of the dog are impure (najis). Something touched by dog saliva must be washed 3 times (no specific requirement for soil). Based on the general principle of impurity.
- Shafi'i: Dog saliva is severely impure (najis mughallazh). A vessel licked by a dog must be washed 7 times, one of which with soil. Based on: "If a dog drinks from your vessel, wash it seven times, and the eighth with soil" (Muslim #279). The entire dog is considered impure in the Shafi'i school.
- Hanbali: Same as Shafi'i — dog saliva is severely impure, requiring 7 washes including one with soil. Based on the same hadith (Muslim #279). The dog's body is not impure, only its saliva, sweat, and other fluids.
- Maliki: Dogs are not impure (tahir). Based on the principle that the original ruling of things is purity (taharah). No special washing is required — normal washing suffices. Supported by the hadith that dogs were present around the Prophet's mosque in Medina (Bukhari #3329).
The Shafi'i, Hanafi, and Hanbali positions have explicit textual evidence (Muslim #279). The Maliki position relies on general principles and the absence of evidence for impurity beyond the vessel-washing command.`,
    source: "Comparative Fiqh - Sahih Muslim #279, Sahih Bukhari #3329",
    category: "fiqh"
  },
  {
    title: "Ruling on Music and Musical Instruments - Madhab Positions",
    content: `The permissibility of music and musical instruments differs significantly:
- Hanbali: Most musical instruments are haram (unlawful), with the exception of the duff (tambourine) at weddings and Eid. Based on: "There will be people from my ummah who will make lawful fornication, silk, alcohol, and musical instruments" (Bukhari #5590). This hadith lists musical instruments alongside clearly forbidden things.
- Hanafi: Similar to Hanbali — musical instruments other than the duff at weddings are considered haram or severely disliked. The voice and hands of women singing are considered awrah (must be concealed).
- Shafi'i: Some musical instruments are permitted (duff, certain percussion). String and wind instruments are discouraged or prohibited depending on context. The Shafi'i school generally distinguishes between lawful entertainment (at weddings, Eid) and excessive indulgence.
- Maliki: Most musical instruments are prohibited, except the duff at weddings. The Maliki position is one of the strictest regarding music, prohibiting string instruments and wind instruments entirely.
All four madhabs agree that the duff (tambourine) at weddings and Eid is permitted based on authentic sunnah. They differ on other instruments. The majority (Hanbali, Maliki, Hanafi) hold that musical instruments beyond the duff are prohibited based on Bukhari #5590. A minority view permits some instruments based on other evidence.`,
    source: "Comparative Fiqh - Sahih Bukhari #5590, traditions on duff at weddings",
    category: "fiqh"
  },
  {
    title: "Smoking (Tobacco) - Madhab Rulings",
    content: `Smoking tobacco is a modern issue (introduced after the classical madhab period), so rulings are derived by analogy (qiyas):
- Hanafi: Smoking is makruh tahrimi (severely disliked, close to haram) due to evidence that it harms the body and wastes wealth. Based on: "Do not kill yourselves" (Quran 4:29) and "Spend not wastefully" (Quran 17:26-27).
- Maliki: Haram (unlawful) — Malikis generally rule smoking as haram due to the harm it causes, applying the principle of darar (harm), which must be avoided. "There should be neither harming nor reciprocating harm" (hadith, Ibn Majah #2340).
- Shafi'i: Haram — based on the same principles of avoiding self-harm and wasting wealth. The Shafi'i position has strengthened over time as medical evidence of harm has become clear.
- Hanbali: Haram — Ibn Taymiyyah and later Hanbali scholars ruled smoking as haram due to intoxication-like effects and proven health risks. Contemporary Hanbali scholars (Ibn Baz, Ibn Uthaymeen) ruled it haram.
The consensus of contemporary scholars from all four madhabs is that smoking is haram or at least severely prohibited due to proven health risks. The earlier permissive rulings were based on lack of evidence about harm.`,
    source: "Comparative Fiqh - Quran 4:29, 17:26-27, Ibn Majah #2340, Ibn Baz, Ibn Uthaymeen",
    category: "fiqh"
  },
  {
    title: "Beard in Islam - Madhab Positions",
    content: `The ruling on growing the beard and its length:
- Hanbali: Growing the beard is wajib (obligatory). It is haram to shave the beard entirely. Based on the explicit command: "Trim your mustaches and let your beards grow" (Bukhari #5892, Muslim #259). The command is interpreted as obligatory. The beard must be at least a fistful in length.
- Hanafi: Growing the beard is wajib (obligatory). Based on the same hadith. The Hanafi school considers shaving the beard to be major sin (kabirah). Length: at least a fistful; trimming beyond that is permitted.
- Maliki: Growing the beard is recommended (mandub) but not obligatory. Shaving the beard is makruh (disliked) but not haram. Based on a different interpretation of the command — they view it as recommended rather than obligatory.
- Shafi'i: Growing the beard is a confirmed Sunnah (sunnah mu'akkadah) but not obligatory. Shaving the beard is makruh (disliked). Based on interpreting the command as recommendatory rather than obligatory.
All four schools agree that the beard is emphasized in Islam. The difference is whether it is obligatory or recommended. The Hanbali and Hanafi positions of obligation are supported by the imperative verb form in the authentic hadith. The Maliki and Shafi'i positions take into account that some Companions may have trimmed their beards.`,
    source: "Comparative Fiqh - Sahih Bukhari #5892, Sahih Muslim #259",
    category: "fiqh"
  },
  {
    title: "Joining Prayers Without Travel - Madhab Positions",
    content: `Can a person combine (jam') Dhuhr and Asr, or Maghrib and Isha, without being on a journey (e.g., due to illness, rain, work)?
- Hanbali: Permitted to combine prayers due to illness, rain, extreme need, or any valid hardship (mashaqqah). Based on the Prophet (ﷺ) combining prayers in Medina without fear or travel (Muslim #705). The Hanbali interpretation is the broadest.
- Shafi'i: Combining prayers for reasons other than travel or the Hajj at Arafah/Muzdalifah is not permitted. Rain is an exception for Maghrib and Isha at the mosque. Based on the principle that prayer times are fixed (Quran 4:103).
- Maliki: Similar to Shafi'i — combining is generally limited to travel and emergencies. Rain at the mosque is accepted for Maghrib and Isha. The Maliki school is relatively strict on this.
- Hanafi: Combining prayers outside of Arafah and Muzdalifah (during Hajj) is not permitted at all, even for travel. Instead, Hanafis perform qasr (shortening) for travel. They interpret the hadith of combining in Medina as being due to rain or a medical reason, not general permission.
The Hanbali position is the most accommodating, permitting combination for any genuine hardship. The other schools restrict it to specific circumstances.`,
    source: "Comparative Fiqh - Sahih Muslim #705, Quran 4:103",
    category: "fiqh"
  },

  // ===== COMPREHENSIVE FIQH GUIDES =====
  {
    title: "Comprehensive Guide to Salah (Prayer) - Detailed",
    content: `Salah is the second pillar of Islam and the most important physical act of worship. It is obligatory on every sane adult Muslim five times daily.

TIMES OF PRAYER:
Fajr: From true dawn (white light across the horizon) until sunrise. Dhuhr: From when the sun passes its zenith until the shadow of an object equals its length. Asr: From when the shadow equals the object's length until sunset (yellowing of the sun). Maghrib: From sunset until the red twilight disappears. Isha: From the disappearance of the red twilight until midnight (or true dawn according to some scholars).

CONDITIONS OF VALIDITY (Shurut):
1. Entry of the proper time. 2. Purification from minor hadath (wudu) and major hadath (ghusl). 3. Cleanliness of the body, clothing, and place of prayer. 4. Covering the awrah. 5. Facing the Qiblah. 6. Intention (niyyah) in the heart.

PILLARS (Arkan) — prayer is invalid if any is omitted:
1. Standing (if able). 2. Takbirat al-Ihram (saying Allahu Akbar to begin). 3. Reciting Surah Al-Fatihah. 4. Bowing (Ruku) with tranquility. 5. Rising from bowing and standing upright. 6. Prostration (Sujud) on seven limbs (forehead, nose, hands, knees, toes) with tranquility. 7. Rising from prostration and sitting between the two prostrations. 8. The final Tashahhud. 9. Sending salawat upon the Prophet in the final Tashahhud. 10. The final Taslim (saying Assalamu alaykum wa rahmatullah to the right). 11. Maintaining correct order of pillars. 12. Tranquility (tumaninah) in each pillar.

WAJIBAT (Obligatory Acts) — if omitted unintentionally, make up with sujud al-sahw:
1. All takbirs except Takbirat al-Ihram. 2. Saying Subhana Rabbiyal Adheem in ruku. 3. Saying Sami Allahu liman hamidah (for imam and alone). 4. Saying Rabbana lakal hamd after rising. 5. Saying Subhana Rabbiyal A'la in sujud. 6. The first Tashahhud. 7. Sitting for the first Tashahhud.

INVALIDATORS OF PRAYER:
1. Speaking intentionally. 2. Laughing aloud. 3. Eating or drinking. 4. Excessive movement unrelated to prayer. 5. Exposing the awrah. 6. Turning the chest away from the Qiblah without excuse. 7. Breaking wudu. 8. Passing of time (prayer time exiting). 9. Changing the intention.

RECOMMENDED ACTS:
Raising hands at takbirs, placing right hand over left on chest, reciting surah after Fatiha in first two rakats, saying Ameen, saying the opening du'a (thana), seeking refuge in Allah before reciting (ta'awwudh).`,
    source: "Fiqh - Quran, Sahih Bukhari, Sahih Muslim, Ibn Baz, Ibn Uthaymeen",
    category: "fiqh"
  },
  {
    title: "Comprehensive Guide to Sawm (Fasting) - Detailed",
    content: `Fasting Ramadan is the fourth pillar of Islam. It is obligatory on every sane, adult Muslim who is able. "O you who have believed, fasting is prescribed for you as it was prescribed for those before you, that you may attain piety (taqwa)." (Quran 2:183).

PILLARS OF FASTING:
1. Intention (niyyah) — must be made before Fajr each night. The Prophet (ﷺ) said: "Whoever does not intend to fast before Fajr, there is no fast for him." (Abu Dawud #2454, Tirmidhi #730, authenticated by Al-Albani).
2. Abstaining from all nullifiers from true dawn (Fajr) until sunset.

SUNNAH ACTS:
1. Suhur (pre-dawn meal) — the Prophet (ﷺ) said: "Take suhur, for in suhur is blessing." (Bukhari #1923, Muslim #1095). It is delayed until just before Fajr.
2. Iftar (breaking fast) promptly at sunset. The Prophet (ﷺ) used to break with fresh dates, or if not available, dry dates, or water. He said: "Allahumma laka sumtu wa ala rizqika aftartu" (O Allah, for You I fasted and with Your provision I break my fast).
3. Supplication at iftar — "Dhahab al-zama' wa abtalat al-uruq wa thabata al-ajr in sha Allah" (The thirst is gone, the veins are moistened, and the reward is confirmed by Allah's will).
4. Increasing good deeds: charity, Quran recitation, night prayer (Tarawih), and itikaf (seclusion in the mosque) especially in the last ten days.

NULLIFIERS OF FASTING (require qada/makeup):
1. Eating or drinking deliberately. 2. Intentional vomiting. 3. Menstruation or post-childbirth bleeding. 4. Sexual intercourse (requires both qada and kaffarah — expiation of fasting 60 consecutive days or feeding 60 poor people). 5. Injections that provide nourishment. 6. Cupping (hijamah) according to the stronger view. The Prophet (ﷺ) said: "The cupper and the one being cupped have broken their fast." (Abu Dawud #2367, authenticated by Al-Albani).

DOES NOT BREAK THE FAST:
1. Eating or drinking forgetfully (complete the fast, it is Allah's provision). 2. Swallowing saliva or dust unintentionally. 3. Using miswak or toothbrush (without swallowing). 4. Rinsing the mouth or nose with water (without exaggeration). 5. Applying eye drops or kohl (does not reach the stomach). 6. Having a blood test or injection that is not nourishing. 7. Wet dreams. 8. Kissing and embracing one's spouse if one can control oneself (the Prophet (ﷺ) used to kiss his wives while fasting — Bukhari #1927).

VOLUNTARY FASTS:
Recommended: Mondays and Thursdays (the Prophet's deeds were presented on these days), the White Days (13th, 14th, 15th of each lunar month), Day of Arafah (9th Dhul-Hijjah — expiates two years of sins), Day of Ashura (10th Muharram — expiates previous year's sins) along with the 9th or 11th, six days of Shawwal after Ramadan, and the month of Shaban.`,
    source: "Fiqh - Quran 2:183, Sahih Bukhari, Sahih Muslim, Ibn Baz, Ibn Uthaymeen, Al-Albani",
    category: "fiqh"
  },
  {
    title: "Comprehensive Guide to Zakat (Obligatory Charity) - Detailed",
    content: `Zakat is the third pillar of Islam. It is obligatory on every free Muslim who owns the minimum threshold (nisab) for one complete lunar year. The nisab is the equivalent of 85 grams of gold or 595 grams of silver. At current market rates, the silver nisab is often lower, making it easier for more people to be obligated. The purpose of zakat is to purify wealth and help the needy.

CATEGORIES OF WEALTH SUBJECT TO ZAKAT:
1. Gold and silver (including savings, cash, bank accounts, and investments) — 2.5% annually.
2. Trade goods (inventory of a business) — 2.5% of the value annually.
3. Agricultural produce — 10% if naturally watered (rain, rivers), 5% if irrigated with expense.
4. Livestock (camels, cattle, sheep, goats) — specific amounts based on the number of animals. For sheep/goats: 1 for 40-120, 2 for 121-200, 3 for 201-300, etc. For cattle: 1 calf for 30, 2 for 60, etc. For camels: specific graded scale.
5. Rikaz (buried treasure/minerals found) — 20% immediately, no annual wait.
6. Income from rental properties, stocks, and investments — 2.5% of net income annually.

ZAKAT IS PAID TO EIGHT CATEGORIES (Quran 9:60):
1. Al-Fuqara (the poor) — those who have nothing or insufficient means. 2. Al-Masakin (the needy) — those in difficulty though not completely destitute. 3. Those employed to collect and distribute zakat. 4. Those whose hearts are to be reconciled (new Muslims or those inclined to Islam). 5. Freeing captives and slaves. 6. Al-Gharimun (those in debt) — people who have debts they cannot pay. 7. Fi Sabilillah (in the path of Allah) — includes Jihad, building Islamic institutions, and general charitable causes. 8. Ibn al-Sabil (the wayfarer) — travelers stranded without means.

CONDITIONS:
Zakat is not paid to: non-Muslims (except those whose hearts are reconciled), direct ascendants (parents, grandparents) or descendants (children, grandchildren) whom one is obligated to support, or one's spouse.
Zakat should be given in the local area first, but can be transferred to more needy areas.
It is recommended to give zakat during Ramadan for multiplied rewards.
Zakat al-Fitr (Fitrana): 2.5 kg of staple food per person, given before Eid prayer at the end of Ramadan. The Prophet (ﷺ) made it obligatory to purify the fasting person from idle speech and to feed the poor.`,
    source: "Fiqh - Quran 9:60, Sahih Bukhari, Sahih Muslim, Ibn Baz, Ibn Uthaymeen",
    category: "fiqh"
  },
  {
    title: "Comprehensive Guide to Hajj and Umrah - Detailed",
    content: `Hajj is the fifth pillar of Islam. It is obligatory once in a lifetime on every Muslim who has the physical and financial ability to travel and perform it. "And Hajj to the House is a duty that mankind owes to Allah, for those who can afford the journey." (Quran 3:97). Umrah is recommended but not obligatory.

TYPES OF HAJJ:
1. Ifrad: Performing Hajj alone (no Umrah). 2. Qiran: Entering ihram for Umrah and Hajj together (requires a sacrificial animal). 3. Tamattu': Performing Umrah first, then Hajj separately in the same year (most recommended by the Prophet, requires a sacrificial animal).

PILLARS OF HAJJ (arkan — missing any invalidates Hajj):
1. Ihram (intention to begin Hajj). 2. Standing at Arafah (Wuquf) on the 9th of Dhul-Hijjah. The Prophet (ﷺ) said: "Hajj is Arafah" — meaning Arafah is the essential element. 3. Tawaf al-Ifadah (the obligatory circumambulation of the Ka'bah). 4. Sa'i between Safa and Marwah.

WAJIBAT OF HAJJ:
1. Ihram from the designated miqat (station). 2. Spending the night at Muzdalifah after Arafah. 3. Spending the nights of Tashriq (11th, 12th, 13th) at Mina. 4. Stoning the Jamarat. 5. Shaving or trimming the hair. 6. The Farewell Tawaf (for non-Makkah residents).

PROHIBITIONS DURING IHRAM:
1. Wearing stitched clothing (men). 2. Covering the head (men). 3. Using perfume. 4. Cutting nails or hair. 5. Hunting or killing animals. 6. Sexual relations and romantic talk. 7. Getting married or proposing. The Prophet (ﷺ) said: "Whoever performs Hajj and does not commit any obscenity or transgression, they return as pure as the day their mother gave birth to them." (Bukhari #1819).

UMRAH PILLARS:
1. Ihram. 2. Tawaf around the Ka'bah. 3. Sa'i between Safa and Marwah. 4. Shaving or trimming hair.

VIRTUE OF UMRAH IN RAMADAN:
The Prophet (ﷺ) said: "Umrah in Ramadan is equivalent to Hajj." (Bukhari #1782, Muslim #1256).

SUNNAH OF HAJJ:
Reciting talbiyah (Labbayk Allahumma labbayk...), kissing the Black Stone if possible, touching the Yemeni corner, praying behind Maqam Ibrahim, drinking Zamzam water, making abundant du'a at Arafah.`,
    source: "Fiqh - Quran 3:97, Sahih Bukhari, Sahih Muslim, Ibn Baz, Ibn Uthaymeen",
    category: "fiqh"
  },

  // ===== SEERAH (BIOGRAPHY OF THE PROPHET) =====
  {
    title: "Seerah - Makkan Period (610-622 CE)",
    content: `BIRTH AND EARLY LIFE: Prophet Muhammad (ﷺ) was born in Makkah in the Year of the Elephant (approximately 570 CE) to Abdullah ibn Abd al-Muttalib (who died before his birth) and Aminah bint Wahb. His grandfather Abd al-Muttalib named him Muhammad. He was nursed by Halimah al-Sa'diyah in the desert. His mother died when he was 6, his grandfather when he was 8, after which his uncle Abu Talib took care of him. He worked as a shepherd and later in trade. He became known as al-Amin (the Trustworthy) for his honesty. At age 25, he married Khadijah bint Khuwaylid, a wealthy merchant woman 15 years his senior. She bore him six children: Al-Qasim, Zaynab, Ruqayyah, Umm Kulthum, Fatimah, and Abdullah. All sons died in infancy.

THE FIRST REVELATION: At age 40, while meditating in the Cave of Hira on Mount Nur, Angel Jibril appeared and commanded: "Iqra (Read)!" The first revealed verses were Surah Al-Alaq 96:1-5. Khadijah believed him immediately and took him to her cousin Waraqah ibn Nawfal, a Christian scholar who confirmed the prophethood.

THE EARLY CALL (3 years secret, then open): The Prophet called people to Tawheed secretly for three years. The first to believe: Khadijah, Abu Bakr, Ali (age 10), and Zayd ibn Harithah. Then Allah commanded: "And warn your closest relatives" (Quran 26:214). The Prophet climbed Mount Safa and called the Quraysh, announcing his prophethood. Abu Lahab cursed him, but most listened.

PERSECUTION BEGINS: The Quraysh persecuted the weak Muslims severely. Bilal was tortured under hot rocks. Sumayyah and Yasir were tortured and killed — the first martyrs. The Prophet was mocked, called a poet, sorcerer, and madman. Abu Lahab's wife threw thorns at his door. Despite this, the Prophet continued preaching.

FIRST HIJRAH TO ABYSSINIA (615 CE): The Prophet sent 11 men and 4 women to Christian Abyssinia (Ethiopia) under the protection of the Just Negus (Najashi), who refused to extradite them despite Quraysh gifts. He rejected the Quraysh's description of the Muslims as rebels, especially after hearing Surah Maryam.

THE BOYCOTT (616-619 CE): The Quraysh boycotted Banu Hashim and Banu al-Muttalib in Shi'b Abi Talib. No trade or marriage was allowed. The Muslims endured extreme hunger for three years, eating leaves. The boycott ended when Allah sent termites that ate the document except for Allah's name.

THE YEAR OF SORROW (619 CE): Khadijah and Abu Talib died in the same year. The Prophet called it the Year of Sorrow. With Abu Talib's protection gone, Quraysh intensified persecution. The Prophet went to Ta'if seeking support, but the people threw stones at him until his feet bled.

AL-ISRA WAL-MIRAJ (620 CE): The Prophet was taken from the Sacred Mosque in Makkah to al-Aqsa Mosque in Jerusalem, then ascended through the heavens. He met the prophets, was shown Paradise and Hell, and received the obligation of five daily prayers.

THE PLEDGE OF AQABAH: During the pilgrimage season, six men from Yathrib (Medina) accepted Islam. The next year 12 came, then 73 came and pledged to protect the Prophet as they protected their families. This was the Second Pledge of Aqabah — the foundation of the Islamic state of Medina.

THE HIJRAH (622 CE): After the Quraysh plotted to assassinate the Prophet, Allah gave permission to emigrate. Ali slept in the Prophet's bed as a decoy. The Prophet and Abu Bakr hid in the Cave of Thawr for three days. A spider web and dove's nest at the cave entrance convinced the pursuers it was empty. They traveled south to Medina, arriving on Monday, 12 Rabi' al-Awwal (the Islamic calendar begins from this Hijrah).`,
    source: "Seerah - Based on Ibn Hisham, Ibn Ishaq, Sahih Bukhari, Al-Bidayah wan-Nihayah (Ibn Kathir)",
    category: "seerah"
  },
  {
    title: "Seerah - Madani Period (622-632 CE)",
    content: `ESTABLISHMENT OF THE STATE: Upon arriving in Medina (Yathrib), the Prophet built the first mosque (Masjid al-Nabawi) and established brotherhood (mu'akhah) between the Muhajirun (Makkan emigrants) and Ansar (Medinan helpers). He drafted the Constitution of Medina (Mithaq al-Madinah), which established rights and duties for all citizens including Jews, creating the first Islamic multi-religious state.

THE BADRIYYUN (The Battles):
BADR (2 AH/624 CE): 313 Muslims faced 1,000 Quraysh. Allah sent angels. The Muslims won, killing 70 Quraysh leaders (including Abu Jahl) and capturing 70. This was the first major battle of Islam. Quran 3:123-127 discusses it.
UHUD (3 AH/625 CE): Quraysh returned to avenge Badr. The Prophet commanded 50 archers to stay on a hill. When Muslims appeared to be winning, the archers disobeyed to collect spoils. Khalid ibn al-Walid (then a disbeliever) exploited the gap, killing 70 Muslims including Hamza (the Prophet's uncle). The Prophet himself was wounded. Quran 3:140-180 addresses this lesson.
TRENCH (5 AH/627 CE): The Confederates (10,000 men from various tribes) besieged Medina. Salman al-Farsi suggested digging a trench. After a month, Allah sent a wind and the confederates withdrew. Quran 33:9-27.
HUDAYBIYYAH (6 AH/628 CE): The Prophet and 1,400 Muslims set out for Umrah. Quraysh blocked them. The Treaty of Hudaybiyyah was signed: 10-year truce, Muslims could return the following year for 3 days, and anyone could join either side. The Companions were upset at the terms, but Allah called it a "clear victory" (Quran 48:1). Within 2 years, more people accepted Islam than in the previous 20 years.
KHAYBAR (7 AH/629 CE): The Muslim army conquered the Jewish stronghold of Khaybar.
MUTAH (8 AH/629 CE): Muslims fought the Romans in northern Arabia. Khalid ibn al-Walid (now Muslim) took command after three commanders were martyred and withdrew successfully.
CONQUEST OF MAKKAH (8 AH/630 CE): After Quraysh broke the Hudaybiyyah treaty, the Prophet marched with 10,000 men. Makkah was conquered without bloodshed. The Prophet proclaimed: "Whoever enters Abu Sufyan's house is safe, whoever locks their door is safe, whoever enters the Sacred Mosque is safe." He cleansed the Ka'bah of idols and declared: "Truth has come and falsehood has vanished" (Quran 17:81). He forgave the Quraysh entirely — a general amnesty.
HUNAYN and TA'IF (8 AH/630 CE): Hawazin and Thaqif tribes opposed the Muslims but were defeated at Hunayn.

THE FAREWELL PILGRIMAGE (10 AH/632 CE): The Prophet performed Hajj and delivered his famous Farewell Sermon at Arafah and Mina. He said: "O people, your Lord is one, your father is one. No Arab is superior to a non-Arab, no non-Arab is superior to an Arab, no white to a black, no black to a white, except by piety." He established the prohibition of riba and blood feuds from the Jahiliyyah. He instructed: "I leave with you that which if you hold to, you will never go astray: the Book of Allah and my Sunnah."

THE PROPHET'S DEATH: Shortly after returning to Medina, the Prophet fell ill. He died on Monday, 12 Rabi' al-Awwal 11 AH (632 CE) at the age of 63, in the room of Aisha (may Allah be pleased with her). He was buried there, which is now the Green Dome of Masjid al-Nabawi. Abu Bakr announced: "Whoever worshipped Muhammad, Muhammad has died. Whoever worshipped Allah, Allah is alive and never dies."`,
    source: "Seerah - Based on Ibn Hisham, Ibn Ishaq, Sahih Bukhari, Sahih Muslim, Al-Bidayah wan-Nihayah (Ibn Kathir)",
    category: "seerah"
  },
  {
    title: "The Rightly Guided Caliphs (Al-Khulafa' al-Rashidun)",
    content: `The four Rightly Guided Caliphs are Abu Bakr, Umar, Uthman, and Ali (may Allah be pleased with them all). The Prophet (ﷺ) said: "Follow the example of those who come after me: Abu Bakr and Umar." (Tirmidhi #3662, authenticated by Al-Albani). And: "The guided successors after me are Abu Bakr and Umar." (Abu Dawud #4649).

ABU BAKR AL-SIDDIQ (11-13 AH / 632-634 CE): The first adult male to accept Islam. His daughter Aisha married the Prophet. He was the Prophet's closest friend and companion in the Cave of Thawr. After the Prophet's death, some tribes refused zakat. Abu Bakr famously declared: "By Allah, if they withhold a single camel's rope they used to give the Prophet, I will fight them for it." He compiled the Quran into one book after the Battle of Yamamah (many memorizers were killed). He led the wars against the false prophets (Musaylimah, Tulayhah, etc.) and expanded into Syria and Iraq. He ruled for 2 years and died at 63. His last words: "O Allah, let me die as a Muslim and join me with the righteous."

UMAR IBN AL-KHATTAB AL-FARUQ (13-23 AH / 634-644 CE): He initially opposed Islam but embraced after reading Surah Ta-Ha. His conversion strengthened the Muslims. He was known for justice (Adl), fearlessness, and simplicity. During his caliphate, the Islamic empire expanded dramatically: Persia (Sassanid Empire) was conquered, the Levant and Egypt were taken from the Byzantines, and Jerusalem surrendered peacefully. He established the Islamic calendar (Hijri), the treasury (Bayt al-Mal), provinces with governors, and the military register (Diwan). He prayed at Jerusalem's Church of the Holy Sepulchre but refused to pray inside to avoid setting a precedent for converting it to a mosque. He was assassinated by Abu Lu'lu'ah al-Majusi (a Persian slave) while leading Fajr prayer. He ruled for 10 years.

UTHMAN IBN AFFAN DHU AL-NURAYN (23-35 AH / 644-656 CE): Known for modesty and generosity — he equipped the army of Tabuk with 1,000 camels and 10,000 dinars. He married two daughters of the Prophet (Ruqayyah then Umm Kulthum). He standardized the Quranic text (the Uthmanic codex) and ordered the destruction of variant copies to preserve unity. The empire expanded to North Africa, Armenia, and Cyprus. He continued Umar's administrative systems. Rebels from Egypt and other regions besieged his house for 49 days and killed him while he was reciting Quran. He ruled for 12 years.

ALI IBN ABI TALIB (35-40 AH / 656-661 CE): The Prophet's cousin and son-in-law (married to Fatimah, father of Hasan and Husayn). He was the first youth to accept Islam and slept in the Prophet's bed during the Hijrah. His caliphate was marked by internal conflicts: the Battle of the Camel against Aisha's forces (which ended in reconciliation), the Battle of Siffin against Mu'awiyah (which ended in arbitration), and the Khawarij (Kharijites) who rebelled against both Ali and Mu'awiyah. Ali defeated the Khawarij at Nahrawan. He was assassinated by Abd al-Rahman ibn Muljam (a Kharijite) while praying Fajr in the Kufa mosque. He ruled for 5 years. His leadership was marked by deep knowledge, eloquence (Nahj al-Balaghah), and piety.`,
    source: "Seerah/History - Sahih Bukhari, Sahih Muslim, Tarikh al-Tabari, Ibn Kathir",
    category: "seerah"
  },
  {
    title: "The Mothers of the Believers (Wives of the Prophet)",
    content: `The Prophet (ﷺ) had 11 wives, known as Ummahat al-Mu'minin (Mothers of the Believers) — Quran 33:6. All were widows except Aisha:
1. KHADIJAH BINT KHUWAYLID: The Prophet's first wife, a wealthy merchant. She was 40 and he was 25 when they married. She bore all his children except Ibrahim. She was the first to believe in his prophethood and supported him through persecutions. She died in the Year of Sorrow. The Prophet said she was the best woman of her time and that Allah sent her greetings of peace through Jibril (Bukhari #3820).
2. SAWDAH BINT ZAM'AH: A widow who emigrated to Abyssinia. The Prophet married her after Khadijah's death, and she cared for his children.
3. AISHA BINT ABI BAKR: The only virgin the Prophet married. She was a great scholar who narrated 2,210 hadith, the most from any single Companion. She led the Battle of the Camel seeking justice for Uthman's murder. She taught fiqh, tafsir, and hadith for decades after the Prophet's death. The Prophet said: "Take half of your religion from this Humayra (Aisha)." She was falsely accused of adultery (the Ifk incident, Quran 24:11-20) and Allah declared her innocence.
4. HAFSAH BINT UMAR: Daughter of Umar ibn al-Khattab. She was entrusted with the first compiled Quran manuscript (the one collected by Abu Bakr), which became the basis for Uthman's standardized copy.
5. ZAYNAB BINT KHUZAYMAH: Known as Umm al-Masakin (Mother of the Poor) for her charity. She lived only a few months after marriage.
6. UMM SALAMAH (Hind bint Abi Umayyah): A wise and intelligent woman. She advised the Prophet at Hudaybiyyah — when the Companions hesitated to sacrifice, she told the Prophet to do it himself, and they followed.
7. ZAYNAB BINT JAHSH: The Prophet's cousin, married by Allah's command (Quran 33:37). She was noble and righteous, and her marriage established the ruling that adopted sons are not real sons.
8. JUWAYRIYAH BINT AL-HARITH: A captive from Banu Mustaliq. The Prophet married her, and the Companions freed 100 of her people saying "the Prophet's in-laws cannot be captives."
9. UMM HABIBAH (Ramlah bint Abi Sufyan): Daughter of Abu Sufyan. She emigrated to Abyssinia with her first husband, who apostatized and died. The Negus (Najashi) performed her marriage to the Prophet.
10. SAFIYYAH BINT HUYAYY: Daughter of a Jewish chief. The Prophet treated her with dignity and freed her. She was known for piety and generosity.
11. MAYMUNAH BINT AL-HARITH: The last wife the Prophet married. She was a generous woman who freed many slaves.
The Prophet's household was simple — they ate dates and barley, often went a month without cooking a meal, and slept on palm-fiber mats.`,
    source: "Seerah - Sahih Bukhari, Sahih Muslim, Ibn Sa'd's Tabaqat, Ibn Kathir",
    category: "seerah"
  },

  // ===== DAILY ADHKAR (SUPPLICATIONS) =====
  {
    title: "Morning and Evening Adhkar (Supplications)",
    content: `Allah commands: "And remember your Lord frequently and exalt Him evening and morning" (Quran 3:41). The Prophet (ﷺ) recited these daily, especially between Fajr and sunrise, and between Asr and Maghrib.

MORNING ADHKAR (recited between Fajr and sunrise):
1. Ayat-ul-Kursi (Quran 2:255) — whoever recites it in the morning is protected until evening.
2. Surah Al-Ikhlas, Al-Falaq, An-Nas (3 times each) — sufficient for protection from everything.
3. "Amsayna wa ams al-mulku lillah..." (We have reached the evening and the sovereignty belongs to Allah).
4. "Subhan Allah wa bi hamdihi" (100 times in the morning) — the Prophet said: "Whoever says it 100 times in the morning and evening, none will come with better than it on the Day of Resurrection except the one who said the same or more." (Muslim #2692).
5. "La ilaha illa Allah wahdahu la sharika lah, lahul mulku wa lahul hamdu wa huwa 'ala kulli shay'in qadir" (10 times or once) — equivalent to freeing four slaves (Bukhari #3293, Muslim #2693).
6. "Allahumma inni as'aluka al-'afiyah fi al-dunya wa al-akhirah" (O Allah, I ask You for well-being in this world and the Hereafter).
7. "Allahumma bika amsayna wa bika asbahna..." (O Allah, by You we enter the evening and by You we enter the morning...).
8. "Hasbi Allah la ilaha illa huwa, alayhi tawakkaltu wa huwa rabb al-'arsh al-'azim" (7 times) — Allah will suffice the one who says this (related with the story of Ibrahim).
9. "Bismillah alladhi la yadurru ma'a ismihi shay'un fi al-ardi wa la fi al-sama'i wa huwa al-sami' al-'alim" (3 times in morning and evening) — nothing will harm the one who says it (Abu Dawud #5088, Tirmidhi #3388).
10. Recitation of the last three ayahs of Surah Al-Hashr (59:22-24).

EVENING ADHKAR (recited between Asr and Maghrib):
The same as morning, substituting "amsayna" (we have reached the evening) for the morning version. The most important are Ayat-ul-Kursi, the three Quls (Ikhlas, Falaq, Nas), and Subhan Allah wa bi hamdihi 100 times.

BEFORE SLEEP:
1. Combine palms and recite Al-Ikhlas, Al-Falaq, An-Nas, then blow and wipe over the body (3 times) — Bukhari #5017.
2. Ayat-ul-Kursi — a protector from Allah, and no devil approaches until morning (Bukhari #2311).
3. "Bismika Allahumma amutu wa ahya" (In Your name, O Allah, I die and I live).
4. Last two ayahs of Surah Al-Baqarah (285-286) — sufficient protection (Bukhari #5009, Muslim #807).
5. "Subhan Allah" (33 times), "Alhamdulillah" (33 times), "Allahu Akbar" (34 times) before sleeping — better than a servant (Muslim #2727).

UPON WAKING:
"Alhamdulillah alladhi ahyana ba'da ma amatana wa ilayhin nushur" (Praise be to Allah who gave us life after death and to Him is the resurrection).`,
    source: "Adhkar - Based on Sahih Bukhari, Sahih Muslim, Al-Adhkar by Imam al-Nawawi, Hisn al-Muslim",
    category: "ibadah"
  },
  {
    title: "Daily Adhkar for Eating, Entering Home, and Travel",
    content: `BEFORE EATING:
Say "Bismillah" (In the name of Allah). The Prophet (ﷺ) said: "When one of you eats, let him mention Allah's name. If he forgets at the beginning, let him say: 'Bismillah fi awwalihi wa akhirihi' (In the name of Allah, at its beginning and its end)." (Abu Dawud #3767, Tirmidhi #1858, authenticated by Al-Albani).

AFTER EATING:
"Alhamdulillah alladhi at'amana wa saqana wa ja'alana muslimin" (Praise be to Allah who fed us, gave us drink, and made us Muslims). Or: "Alhamdulillah hamdan kathiran tayyiban mubarakan fih" (Praise be to Allah, abundant, good, and blessed praise). The Prophet (ﷺ) said: "Allah is pleased with a servant who eats a meal and praises Him for it, or drinks a drink and praises Him for it." (Muslim #2734).

AFTER DRINKING MILK:
"Allahumma barik lana fihi wa zidna minh" (O Allah, bless it for us and give us more of it).

SUNNAH OF EATING AND DRINKING:
1. Eat with the right hand — "Do not eat with your left, for the shaytan eats with his left." (Muslim #2020).
2. Drink in three sips, not one gulp — "Drink in three breaths, and mention Allah, and thank Him when you finish." (Tirmidhi, authenticated by Al-Albani).
3. Do not blow on hot food or drink.
4. Do not criticize food — "The Prophet never criticized any food. If he liked it, he ate. If not, he left it." (Bukhari #3563, Muslim #2064).
5. Eat from what is in front of you (if eating from a shared dish).
6. Lick the fingers after eating — you do not know which portion contains the barakah (Muslim #2032).

WHEN ENTERING THE HOME:
"Bismillah wa lajna wa bismillah kharajna wa 'ala rabbina tawakkalna" (In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we rely). Then say salam to the household. The Prophet (ﷺ) said: "When a man enters his house and mentions Allah when entering and when eating, the shaytan says: 'You have no place to spend the night and no dinner.'" (Muslim #2018).

WHEN LEAVING THE HOME:
"Bismillah, tawakkaltu 'ala Allah, wa la hawla wa la quwwata illa billah" (In the name of Allah, I rely on Allah, and there is no power or strength except through Allah). It will be said: "You have been guided, sufficed, and protected." (Abu Dawud #5095, Tirmidhi #3426).

TRAVEL DUA:
"Allahu Akbar, Allahu Akbar, Allahu Akbar. Subhan alladhi sakhkhara lana hadha wa ma kunna lahu muqrinin. Wa inna ila rabbina lamunqalibun." (Allah is greatest. Glory to Him who has subjected this to us, and we could never have done it by ourselves. And to our Lord we shall return.) — Quran 43:13-14.
When returning, add: "Ayibun, ta'ibun, 'abidun, li rabbina hamidun" (Returning, repenting, worshipping, praising our Lord). (Bukhari, Muslim).

WHEN SNEEZING:
Say: "Alhamdulillah." Others respond: "Yarhamuk Allah (May Allah have mercy on you)." The sneezer then says: "Yahdina wa yahdikum Allah (May Allah guide us and have mercy on you)." (Bukhari #6224).

DUA FOR ANXIETY OR SADNESS:
"Allahumma inni 'abduka ibn 'abdika ibn amatika, nasiyati bi yadika, maddin fiyya hukmuka, 'adlun fiyya qada'uka, as'aluka bi kulli ismin huwa laka..." (O Allah, I am Your servant, son of your male and female servants; my forelock is in Your hand; Your judgement is upon me; Your decree is just...). The Prophet (ﷺ) said: "No servant says this when afflicted with anxiety or sadness except that Allah removes it and replaces it with joy." (Ahmad, authenticated by Al-Albani).

DUA FOR PROTECTION FROM ANXIETY AND LAZINESS:
"Allahumma inni a'udhu bika minal hammi wal hazan, wa a'udhu bika minal 'ajzi wal kasal, wa a'udhu bika minal jubni wal bukhl, wa a'udhu bika min ghalabatid dayn wa qahrir rijal" (O Allah, I seek refuge in You from anxiety and sorrow, from weakness and laziness, from cowardice and miserliness, from overpowering debt and the oppression of men).`,
    source: "Adhkar - Based on Sahih Bukhari, Sahih Muslim, Al-Adhkar by Imam al-Nawawi, Hisn al-Muslim",
    category: "ibadah"
  },
  {
    title: "Forty Hadith of Imam al-Nawawi - Complete List",
    content: `Imam Yahya ibn Sharaf al-Nawawi (d. 676 AH) compiled 42 hadith that cover the essentials of Islam. Complete list:
1. "Actions are but by intentions." (Bukhari, Muslim). 2. Jibril's hadith on Islam, Iman, Ihsan. (Bukhari, Muslim). 3. "Islam is built on five pillars." (Bukhari, Muslim). 4. "Actions are by what is intended, and every person will get what was intended." (Bukhari, Muslim). 5. "Whoever introduces an innovation in this matter of ours, it is rejected." (Bukhari, Muslim). 6. "Truly, the halal is clear and the haram is clear." (Bukhari, Muslim). 7. "Religion is sincere advice (naseehah)." (Muslim). 8. "I have been commanded to fight people until they testify that there is no god but Allah." (Bukhari, Muslim). 9. "What I have forbidden you, avoid; what I have commanded you, do as much as you can." (Bukhari, Muslim). 10. "Allah is good and accepts only what is good." (Muslim). 11. "Leave what makes you doubt for what does not make you doubt." (Tirmidhi, Nasa'i). 12. "Part of the perfection of one's Islam is leaving what does not concern him." (Tirmidhi). 13. "None of you has complete faith until he loves for his brother what he loves for himself." (Bukhari, Muslim). 14. "The blood of a Muslim is not permissible to shed except for three reasons." (Bukhari, Muslim). 15. "Whoever believes in Allah and the Last Day, let him speak good or remain silent." (Bukhari, Muslim). 16. "Do not become angry." (Bukhari). 17. "Allah has prescribed excellence (ihsan) in everything." (Muslim). 18. "Fear Allah wherever you are, follow up a bad deed with a good deed." (Tirmidhi). 19. "Be mindful of Allah and He will protect you." (Tirmidhi). 20. "If you feel no shame, do as you wish." (Bukhari). 21. "Say, 'I believe in Allah,' then be steadfast." (Muslim). 22. "Shall I inform you of the best of deeds?" (Tirmidhi). 23. "Purification is half of faith." (Muslim). 24. "O My servants, I have forbidden injustice for Myself." (Muslim). 25. "There are those who give charity from pure earnings." (Muslim). 26. "Every joint of the body must give charity every day." (Bukhari, Muslim). 27. "Righteousness is good character." (Muslim). 28. "I have been sent to perfect good character." (Muwatta). 29. "Ask me." (Tirmidhi). 30. "Allah has prescribed the obligations." (Nasa'i, Ibn Majah). 31. "Renounce the world and Allah will love you." (Ibn Majah). 32. "Do not harm yourselves or others." (Ibn Majah). 33. "The proof of the believer is the evidence." (related by al-Bayhaqi). 34. "Whoever sees an evil, let him change it with his hand." (Muslim). 35. "Do not envy one another, do not hate one another." (Bukhari, Muslim). 36. "Whoever fulfills the needs of his brother, Allah fulfills his needs." (Bukhari, Muslim). 37. "Allah wrote down the good deeds and the evil deeds." (Bukhari, Muslim). 38. "Allah says: Whoever is hostile to a friend of Mine, I declare war on them." (Bukhari). 39. "Allah has forgiven my ummah for mistakes, forgetfulness, and what they are forced to do." (Ibn Majah, authenticated by Al-Albani). 40. "Be in this world as if you were a stranger or a wayfarer." (Bukhari). 41. "None of you truly believes until his desires follow what I have brought." (reported by al-Bayhaqi). 42. "O son of Adam, as long as you call upon Me and ask of Me, I will forgive you." (Tirmidhi, Ahmad).`,
    source: "Hadith - Al-Arba'in al-Nawawiyyah by Imam al-Nawawi",
    category: "hadith"
  },
  {
    title: "The Major Hadith Collections - Overview",
    content: `SUNAN: The six canonical hadith collections (Kutub al-Sittah):
1. SAHIH BUKHARI (d. 256 AH/870 CE): The most authentic book after the Quran. Muhammad ibn Isma'il al-Bukhari collected 600,000 hadith and selected 7,275 (about 2,602 without repetition). Conditions: narrator must have met his source (liqa'), be of proven integrity ('adalah), memory (dabt), with continuous chain (ittisal), without hidden defects ('illah) or anomaly (shudhudh). Every hadith that meets Bukhari's conditions is called muttafaq 'alayh if Muslim agrees.
2. SAHIH MUSLIM (d. 261 AH/875 CE): Muslim ibn al-Hajjaj al-Qushayri collected 300,000 hadith and selected 12,000 (about 4,000 without repetition). His conditions are slightly less strict than Bukhari's on liqa' but equally strict on 'adalah and dabt. Together with Bukhari, they are called Al-Sahihan.
3. SUNAN ABI DAWUD (d. 275 AH/889 CE): Abu Dawud al-Sijistani collected 5,274 hadith, including weak (da'if) ones with clarification. He said: "I have mentioned the hadith that are sahih, and those close to sahih, and those close to hasan."
4. JAMI' AL-TIRMIDHI (d. 279 AH/892 CE): Muhammad ibn Isa al-Tirmidhi categorized hadith by authenticity (sahih, hasan, da'if) and included fiqh opinions of scholars. Contains 3,956 hadith.
5. SUNAN AL-NASA'I (d. 303 AH/915 CE): Ahmad ibn Shu'ayb al-Nasa'i compiled Al-Mujtaba (the most authentic of the Sunan after Bukhari and Muslim). Contains 5,761 hadith.
6. SUNAN IBN MAJAH (d. 273 AH/887 CE): Muhammad ibn Yazid ibn Majah al-Qazwini. Contains 4,341 hadith, with more weak hadith than others. Some scholars substitute Muwatta Malik as the sixth.

OTHER MAJOR COLLECTIONS:
MUSNAD AHMAD (d. 241 AH/855 CE): Imam Ahmad ibn Hanbal. The largest Musnad with 27,000+ hadith, organized by Companion.
MUWATTA MALIK (d. 179 AH/795 CE): Imam Malik ibn Anas. The earliest surviving comprehensive hadith collection, combining hadith with the practice of the people of Medina.
SUNAN AL-DARIMI, SAHIH IBN HIBBAN, SAHIH IBN KHUZAYMAH, AL-MUSTADRAK of al-Hakim, and AL-MU'JAM of al-Tabarani.

TERMS:
Sahih: Authentic — meets all conditions of accuracy.
Hasan: Good — slightly weaker than sahih but still usable as evidence.
Da'if: Weak — missing one or more conditions of authenticity.
Muttafaq 'alayh: Agreed upon by both Bukhari and Muslim — the highest level of authenticity.
Hasan Sahih: A hadith graded as hasan by some scholars and sahih by others (common in Tirmidhi).`,
    source: "Hadith Sciences - Based on Ibn al-Salah, al-Nawawi, Ibn Hajar, al-Suyuti",
    category: "hadith"
  },
  {
    title: "Hadith on Mercy, Kindness, and Good Character",
    content: `The Prophet (ﷺ) emphasized excellent character as the essence of faith:
"The most complete of believers in faith are those with the best character." (Tirmidhi #1162, authenticated by Al-Albani). "The best of you are the best to their families, and I am the best to my family." (Tirmidhi #3895, Ibn Majah #1977).
"None of you has complete faith until he loves for his brother what he loves for himself." (Bukhari #13, Muslim #45).
"The believers in their mutual love, mercy, and compassion are like a single body: if one part complains, the rest of the body responds with fever and sleeplessness." (Muslim #2586).
"Whoever does not show mercy will not be shown mercy." (Bukhari #6013, Muslim #2318).
"Allah is not merciful to the one who is not merciful to people." (Bukhari #7376, Muslim #2319).
"Those who are merciful will be shown mercy by the Most Merciful. Be merciful to those on earth, and the One in the heavens will be merciful to you." (Abu Dawud #4941, Tirmidhi #1924, authenticated by Al-Albani).
"A good word is charity." (Bukhari #2989, Muslim #1009).
"Beware of suspicion, for suspicion is the most false of speech. Do not spy on each other, do not backbite, do not envy, do not hate, do not turn away from each other. Be servants of Allah as brothers." (Bukhari #6064, Muslim #2563).
"Avoid the seven destructive sins: shirk, sorcery, killing a soul except by right, consuming riba, consuming the wealth of orphans, fleeing from the battlefield, and slandering chaste believing women." (Bukhari #2766, Muslim #89).
"The strong person is not the one who can wrestle others, but the one who controls himself at times of anger." (Bukhari #6114, Muslim #2609).
"Whoever is kind, Allah is kind to him. Be kind to those on earth and the One in heaven will be kind to you." (Abu Dawud, Tirmidhi, authenticated by Al-Albani).`,
    source: "Sahih Bukhari, Sahih Muslim, Tirmidhi, Abu Dawud - Ibn Baz, Al-Albani authentication",
    category: "hadith"
  },

  // ===== QURANIC SCIENCES (ULUM AL-QURAN) =====
  {
    title: "Quranic Sciences (Ulum al-Quran) - Comprehensive Overview",
    content: `DEFINITION: Ulum al-Quran is the field of study that deals with the Quran's revelation, compilation, preservation, interpretation, and miraculous nature.

REVELATION (WAHY): The Quran was revealed to Prophet Muhammad (ﷺ) over 23 years (610-632 CE) through Angel Jibril. The first revelation: Surah Al-Alaq (96:1-5) in the Cave of Hira. The final revelation: "This day I have perfected your religion for you" (Quran 5:3), revealed at Arafah during the Farewell Pilgrimage. The Quran was revealed in seven ahruf (dialects/modes) for ease of recitation, but was later standardized to the Quraysh dialect by Caliph Uthman.

MAKKI VS MADANI: Makki surahs (86 surahs) were revealed before the Hijrah — focus on Tawheed, the Hereafter, stories of prophets, and moral reform. They are typically shorter with powerful imagery. Madani surahs (28 surahs) were revealed after the Hijrah — focus on legislation, social laws, family law, jihad, and relations with People of the Book. They are typically longer. Distinguishing features: Makki surahs address "Ya ayyuha al-nas" (O mankind); Madani address "Ya ayyuha alladhina amanu" (O you who believe). Makki surahs contain sajdahs (prostrations) and the word "kalla" (never/by no means). Madani surahs contain detailed legal rulings.

ASBAB AL-NUZUL (Reasons for Revelation): Understanding why specific ayahs were revealed is essential for correct interpretation (tafsir). Examples: Surah Al-Ikhlas was revealed when polytheists asked about Allah's nature. Ayat-ul-Kursi (2:255) was revealed to establish Allah's unique attributes. The Ifk incident (24:11-20) was revealed to declare Aisha's innocence after slander. The prohibition of alcohol (5:90-91) came in stages: first acknowledging benefit and sin (2:219), then prohibiting prayer while intoxicated (4:43), and finally complete prohibition (5:90).

PRESERVATION: The Quran is the only revealed scripture preserved in its original language without alteration. Allah says: "Indeed, it is We who sent down the Quran, and indeed, We will be its guardian" (Quran 15:9). Preservation was first through memorization (the Prophet and thousands of Companions memorized it). During Abu Bakr's caliphate, Zayd ibn Thabit compiled it into one book after the Battle of Yamamah (many huffaz died). During Uthman's caliphate, the standard codex was produced and copies were sent to major cities.

I'JAZ (MIRACULOUS NATURE): The Quran's miracles include: linguistic inimitability (no Arabic composition matches its eloquence), scientific accuracy (embryology, ocean barriers, etc.), historical accuracy (Pharaoh was drowned but his body preserved — Quran 10:92, confirmed by modern archaeology), legislation (comprehensive and timeless), and prophecies (Roman victory after defeat — Quran 30:2-5, preservation of the Quran — 15:9).

TAFSIR (EXEGESIS): Major tafsir works: Tafsir al-Tabari (the most authoritative early tafsir), Tafsir Ibn Kathir (the most widely used, based on Quran, Sunnah, and Salaf understanding), Tafsir al-Sa'di (contemporary, easy to understand, aligned with Salafi methodology), Tafsir al-Qurtubi (focused on legal rulings), Tafsir al-Baghawi, and Tafsir al-Shanqiti (contemporary). The correct method: Quran explains Quran, then Sunnah, then the sayings of the Companions, then the Tabi'un, then linguistic analysis, and finally reasoned opinion (ijtihad) within bounds.`,
    source: "Ulum al-Quran - Based on al-Suyuti (al-Itqan), Ibn Hajar, Ibn Kathir, al-Shatibi",
    category: "quran"
  },
  {
    title: "Tafsir of Surah Al-Fatihah - Detailed Explanation",
    content: `Surah Al-Fatihah (The Opening) — 7 ayahs, Makki. It is the most recited surah in Islam, obligatory in every rakah of every prayer. The Prophet (ﷺ) said: "I have divided the prayer between Me and My servant into two halves, and My servant will have what he asks." (Sahih Muslim #395).

AYAH 1: "Bismillah al-Rahman al-Rahim" (In the name of Allah, the Most Gracious, the Most Merciful). The basmalah contains three of Allah's names: Allah (the One worshipped with love and reverence), al-Rahman (the Most Gracious — mercy that encompasses all creation), and al-Rahim (the Most Merciful — mercy that is specifically for the believers). Tafsir Ibn Kathir: Begin every action with Allah's name.

AYAH 2: "Alhamdulillah rabb al-alamin" (All praise is due to Allah, Lord of the worlds). Perfect praise belongs to Allah alone — all thanks, gratitude, and praise are for Him. He is the Lord (Rab) — the Creator, Owner, Sustainer, and Controller of all worlds (alamin = all of existence including humans, jinn, angels, and all creation).

AYAH 3: "Al-Rahman al-Rahim" (The Most Gracious, the Most Merciful). These are emphasized again to encourage hope in Allah's mercy after acknowledging His lordship.

AYAH 4: "Maliki yawm al-din" (Sovereign of the Day of Recompense). He alone owns and rules the Day of Judgement. This instills both fear (accountability) and hope (justice).

AYAH 5: "Iyyaka na'budu wa iyyaka nasta'in" (You alone we worship, and You alone we ask for help). This is the essence of Tawhid — dedicating worship exclusively to Allah and seeking help only from Him. Ibn Taymiyyah said this ayah contains the cure for spiritual ailments.

AYAH 6: "Ihdina al-sirata al-mustaqim" (Guide us to the straight path). The most important du'a — asking for continuous guidance to the straight path of Islam. The path is described as straight (mustaqim) — no deviation, no extremes.

AYAH 7: "Sirata alladhina an'amta alayhim ghayri al-maghdubi alayhim wa la al-dallin" (The path of those You have blessed, not of those who earned Your anger, nor of those who go astray). "Those You have blessed" are the prophets, the truthful, the martyrs, and the righteous (Quran 4:69). "Those who earned anger" are the Jews who knew the truth but rejected it. "Those who go astray" are the Christians who followed ignorance and exaggeration in religion (Ibn Kathir, Tirmidhi #2953).`,
    source: "Tafsir - Tafsir Ibn Kathir, Tafsir al-Sa'di, Tafsir al-Tabari, Sahih Muslim #395, Tirmidhi #2953",
    category: "quran"
  },

  // ===== MAJOR SINS AND REPENTANCE =====
  {
    title: "Major Sins (Al-Kaba'ir) in Islam",
    content: `Major sins (kaba'ir) are those that carry a specific punishment in the Quran or Sunnah, or are explicitly cursed or threatened with Hellfire. The Prophet (ﷺ) said: "Avoid the seven destructive sins: associating partners with Allah (shirk), sorcery, killing a soul whom Allah has forbidden except by right, consuming riba (interest/usury), consuming the wealth of orphans, fleeing from the battlefield, and slandering chaste, believing women." (Bukhari #2766, Muslim #89).

The major sins include but are not limited to:
1. Shirk (associating partners with Allah) — the greatest sin, not forgiven if died upon without repentance (Quran 4:48).
2. Despairing of Allah's mercy and feeling safe from Allah's plan. (Quran 12:87, 7:99).
3. Killing a soul without right — including abortion after ensoulment (after 120 days).
4. Sorcery and magic.
5. Not praying — the Prophet (ﷺ) said the covenant between us and them is the prayer; whoever abandons it has disbelieved (Tirmidhi #2621).
6. Wrongfully consuming orphans' wealth.
7. Consuming riba (interest).
8. Zina (adultery and fornication) — "Do not approach zina, for it is an abomination and an evil way" (Quran 17:32).
9. Homosexual acts (liwat) — "You commit such immorality as no one has preceded you with among the worlds" (Quran 7:80).
10. False accusation of chaste women.
11. Theft and robbery.
12. Drinking alcohol and drugs.
13. Lying about the Prophet (ﷺ) — "Whoever lies about me deliberately, let him take his seat in Hellfire." (Bukhari #110).
14. Fleeing from the battlefield.
15. Disobeying and disrespecting parents (uquq al-walidayn).
16. Cutting ties of kinship.
17. False testimony and bearing false witness.
18. Backbiting (ghibah) — speaking about your brother in a way he dislikes (Muslim #2589).
19. Slander (namimah) — carrying tales to cause discord between people.
20. Taking false oaths.
21. Hoarding wealth and refusing to pay zakat.
22. Suicide — the person will be punished with the same means in Hellfire (Bukhari #5778).
23. Spreading secrets and violating trust.
24. Overcharging travelers and taking advantage of need (najsh).
25. Breaking promises and covenants.

Repentance (tawbah) is accepted for all sins as long as the person repents sincerely before death. The Prophet (ﷺ) said: "Allah accepts the repentance of a servant as long as the death rattle has not reached the throat." (Tirmidhi #3537, authenticated by Al-Albani).`,
    source: "Fiqh/Aqeedah - Quran, Sahih Bukhari, Sahih Muslim, Al-Kaba'ir by Imam al-Dhahabi, Ibn Baz, Ibn Uthaymeen",
    category: "aqeedah"
  },
  {
    title: "Repentance (Tawbah) - Conditions and Acceptance",
    content: `Tawbah (repentance) is an obligation on every Muslim. Allah says: "And turn to Allah in repentance, all of you, O believers, that you might succeed." (Quran 24:31). "Say: O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins. Indeed, it is He who is the Forgiving, the Merciful." (Quran 39:53).

CONDITIONS OF ACCEPTED REPENTANCE:
1. Ceasing the sin immediately.
2. Regretting deeply for having committed the sin.
3. Resolving never to return to the sin.
4. If the sin involves a right of another person, restoring that right (returning stolen property, clearing someone's name from slander, seeking forgiveness from the person wronged).
5. If the sin was committed against Allah alone, it is sufficient to repent sincerely between the servant and Allah.

WHEN REPENTANCE IS NOT ACCEPTED:
1. At the time of death — when the soul reaches the throat. The Prophet (ﷺ) said: "Allah accepts the repentance of a servant as long as the death rattle has not reached the throat." (Tirmidhi #3537, authenticated by Al-Albani). Pharaoh's repentance when he was drowning was not accepted (Quran 10:90-91).
2. When the sun rises from the west (one of the major signs of the Hour). "The day that some of the signs of your Lord come, no soul will benefit from its faith if it did not believe before" (Quran 6:158).

ACTS THAT ERASE SINS:
1. The five daily prayers — expiate sins between them (Muslim #233).
2. Jumu'ah (Friday prayer) to the next Jumu'ah — expiates sins (Muslim #857).
3. Ramadan to Ramadan — expiates sins (Muslim #233).
4. Umrah to Umrah — expiates sins (Bukhari #1773, Muslim #1349).
5. Fasting the Day of Arafah — expiates two years (Muslim #1162).
6. Fasting Ashura — expiates one year (Muslim #1162).
7. Saying "Subhan Allah wa bi hamdihi" 100 times a day — sins are forgiven even if like the foam of the sea (Bukhari #6405, Muslim #2691).
8. Performing wudu properly followed by two rak'ahs — Paradise (Bukhari #193, Muslim #234).
9. Visiting the sick and attending funerals.
10. Making du'a after the adhan.
11. Sending blessings upon the Prophet (ﷺ) ten times in the morning and evening.

ABUSING ALLAH'S MERCY: While Allah's mercy is vast, a person should not take it as a license to continue sinning while paying lip service to repentance. The Prophet (ﷺ) said: "Beware of the excuses of the careless." True repentance requires genuine change and avoidance of sin.`,
    source: "Aqeedah/Tazkiyah - Quran, Sahih Bukhari, Sahih Muslim, Ibn Qayyim al-Jawziyyah (Madarij al-Salikin), Ibn Taymiyyah",
    category: "aqeedah"
  },

  // ===== JANNAH AND JAHANNAM =====
  {
    title: "The Hereafter - Death, Barzakh, Resurrection, Paradise and Hell",
    content: `DEATH: Every soul will taste death (Quran 3:185). When death approaches a believer, angels with white faces descend with silk and perfumed scents and take their soul gently. The soul of a disbeliever is taken harshly by angels with black faces. After burial, the soul experiences the barzakh (intermediate realm) until the Day of Resurrection.

THE GRAVE (BARZAKH): The Prophet (ﷺ) said: "The grave is either a garden from the gardens of Paradise or a pit from the pits of Hellfire." (Tirmidhi #2460, authenticated by Al-Albani). The trial of the grave: two angels (Munkar and Nakir) ask: "Who is your Lord? What is your religion? Who is your Prophet?" The believer answers correctly and sees his place in Paradise. The disbeliever/hypocrite cannot answer and is punished. The Prophet (ﷺ) taught us to say: "Rabbi Allah, wa dini al-Islam, wa nabiyyi Muhammad (ﷺ)" (My Lord is Allah, my religion is Islam, and my prophet is Muhammad).

THE RESURRECTION (YAWM AL-QIYAMAH): After the trumpet is blown by Israfil, all will be resurrected from their graves. The sun will approach within a mile, and people will sweat according to their deeds. The Prophet's intercession (shafa'ah) will begin the judgement. The records of deeds (Books) will be given: believers in their right hand, disbelievers in their left from behind their backs. The Scale (Mizan) will weigh deeds — even a mustard seed of good will be shown (Quran 99:7-8).

THE BRIDGE (SIRAT): A bridge finer than a hair and sharper than a sword stretched over Hellfire. The believers cross it with varying speeds according to their deeds (some like lightning, some like a horse, some crawling). The disbelievers fall into Hell.

PARADISE (JANNAH): A place of eternal bliss prepared for the righteous. Its descriptions in Quran and Sunnah: rivers of water, milk, honey, and wine (Quran 47:15), gardens beneath which rivers flow, lofty palaces, beautiful companions (hur al-'ayn), delicious fruits, no fatigue, no anger, no idle talk, and the greatest reward — seeing Allah's face (Quran 75:22-23). The Prophet (ﷺ) said: "In Paradise are things that no eye has seen, no ear has heard, and no human mind has conceived." (Bukhari #3244, Muslim #2824). Paradise has eight gates and multiple levels, the highest of which is Al-Firdaws.

HELLFIRE (JAHANNAM): A place of eternal punishment for disbelievers and purification for sinful believers. Its descriptions: blazing fire, boiling water (hamim), eating from zaqqum (a bitter thorn tree), chains and shackles, scorching wind and black smoke. It has seven gates. The Prophet (ﷺ) said the fire of this world is 1/70th of Hellfire (Bukhari #3265). The least punished person stands on fire until his brains boil, yet thinks no one is punished more severely than him (Bukhari #6562, Muslim #284).

Major signs of the Hour include: Dajjal (the false Messiah) will appear, Jesus (Isa) ibn Maryam will descend, Ya'juj and Ma'juj (Gog and Magog) will be released, the sun will rise from the west, the Beast will emerge, and a fire will gather people from Yemen to Sham.`,
    source: "Aqeedah - Quran, Sahih Bukhari, Sahih Muslim, Ibn Kathir (al-Nihayah), Ibn al-Qayyim",
    category: "aqeedah"
  },

  // ===== HEART-SOFTENERS (CHARACTER & SPIRITUALITY) =====
  {
    title: "Sabr (Patience) in Islam - Complete Guide",
    content: `Sabr (patience) is one of the most important virtues in Islam. Allah says: "Indeed, Allah is with the patient" (Quran 2:153). "Only those who are patient shall receive their reward in full, without reckoning" (Quran 39:10). The Prophet (ﷺ) said: "How wonderful is the affair of the believer, for all his affairs are good. If something good happens to him, he gives thanks, and that is good for him, and if something bad happens to him, he bears it with patience and that is good for him." (Muslim #2999).

THREE TYPES OF SABR:
1. Patience in obeying Allah (sabr 'ala al-ta'ah) — performing religious duties consistently despite laziness or difficulty.
2. Patience in refraining from sin (sabr 'an al-ma'siyah) — resisting temptations and avoiding what Allah has forbidden.
3. Patience with Allah's decrees (sabr 'ala al-qadr) — enduring hardships, trials, and calamities without despair or complaining.

Allah has promised the patient an immense reward: "And their recompense shall be Paradise, and silken garments, because they were patient" (Quran 76:12). The Prophet (ﷺ) said: "Whoever persists in being patient, Allah will make him patient. No one is given a gift that is better and more comprehensive than patience." (Bukhari #1469, Muslim #1053).

PATIENCE AT TIMES OF FITNAH: The Prophet (ﷺ) said: "After you there will come the days of patience. Patience during those (days) will be like grasping a live coal. During those (days) the reward for the one who adheres to the commands of Allah will be equivalent to the reward of fifty men." (Abu Dawud #4341, Ibn Majah #4014, authenticated by Al-Albani).

When calamity strikes, the believer says: "Inna lillahi wa inna ilayhi raji'un" (Truly, to Allah we belong and truly, to Him we shall return) — Quran 2:156. This statement brings comfort and reminds the believer that everything belongs to Allah and will return to Him.

The position of patience in faith is like that of the head in relation to the body. Without patience, faith cannot stand firm. The Prophet (ﷺ) said: "No one has been given anything better than patience." (Bukhari #1469).`,
    source: "IslamQA - Based on Quran, Sahih Bukhari #1469, Sahih Muslim #2999, #1053, IslamQA #12380, #13403",
    category: "ibadah"
  },
  {
    title: "Tawakkul (Reliance on Allah) - Complete Guide",
    content: `Tawakkul is the Islamic concept of complete reliance and trust in Allah while taking the necessary means. Allah says: "And whoever relies upon Allah, then He is sufficient for him. Indeed, Allah will accomplish His purpose. Allah has set a measure for all things" (Quran 65:3). "So rely upon Allah; indeed you are upon the clear truth" (Quran 27:79).

THE CORRECT UNDERSTANDING OF TAWAKKUL:
Tawakkul does NOT mean fatalism or passivity. The Prophet (ﷺ) was asked: "Should I tie my camel and rely on Allah, or leave it untied and rely on Allah?" He replied: "Tie it and then rely on Allah." (Tirmidhi #2517, authenticated by Al-Albani). This hadith perfectly illustrates the balance — take all necessary precautions, then place your trust in Allah for the outcome.

TAWAKKUL AND PROVISION: "And whoever fears Allah, He will make a way out for him, and will provide for him from where he does not expect" (Quran 65:2-3). The Prophet (ﷺ) said: "If you were to rely upon Allah with the reliance He deserves, He would provide for you as He provides for the birds: they go out hungry in the morning and return full in the evening." (Tirmidhi #2344, Ibn Majah #4164, authenticated by Al-Albani).

BENEFITS OF TAWAKKUL:
1. Peace of mind — knowing the outcome is in Allah's hands removes anxiety.
2. Strength in adversity — the believer is not shaken by setbacks.
3. True independence — reliance on Allah frees from reliance on people.
4. Increased blessing — Allah suffices the one who relies on Him.
5. Protection from shirk — reliance on other than Allah is a form of minor shirk.

LEVELS OF TAWAKKUL:
1. Tawakkul of the common believer: relying on Allah in matters they cannot control.
2. Tawakkul of the righteous: relying on Allah in all matters, while taking means.
3. Tawakkul of the elite: complete trust that Allah's choice is always best, even when it contradicts personal desire.

The Salaf exemplified tawakkul. When the people told the Companions: "Indeed, the people have gathered against you, so fear them," it only increased them in faith, and they said: "Sufficient for us is Allah, and He is the best Disposer of affairs" (Quran 3:173).`,
    source: "IslamQA - Based on Quran 65:3, 65:2-3, 27:79, 3:173, Tirmidhi #2517, #2344, authenticated by Al-Albani",
    category: "ibadah"
  },
  {
    title: "Riya' (Showing Off) and Sincerity (Ikhlas)",
    content: `Riya' (showing off) is to perform acts of worship or good deeds to be seen and praised by people, rather than for the sake of Allah alone. It is a form of minor shirk and one of the most dangerous spiritual diseases. Allah says: "So whoever expects to meet his Lord, let him do righteous work and not associate anyone in the worship of his Lord" (Quran 18:110).

The Prophet (ﷺ) said: "What I fear most for you is minor shirk." They asked: "O Messenger of Allah, what is minor shirk?" He said: "Riya' (showing off)." (Ahmad, authenticated by Al-Albani). He also said: "Shall I not tell you what I fear for you more than the Dajjal? It is hidden shirk: a man stands to pray and beautifies his prayer because he sees people looking at him." (Ibn Majah #4204).

THE THREE TYPES OF RIYA':
1. Riya' in belief — pretending to have faith to gain worldly benefit (pure hypocrisy).
2. Riya' in actions — such as lengthening prayer or giving charity to be praised.
3. Riya' in speech — speaking words of wisdom or reminding others to appear pious.

SIGNS OF RIYA':
- Increasing acts of worship when around people, decreasing when alone.
- Working harder when praised, slacking when criticized.
- Liking people to know about one's good deeds and charity.
- Being concerned about what others think of one's religious commitment.

CURE FOR RIYA':
1. Strengthening tawheed and ikhlas (sincerity) — remembering that only Allah can reward.
2. Keeping good deeds hidden — "Charity given secretly extinguishes the wrath of the Lord" (Tabarani, authenticated by Al-Albani). The Prophet (ﷺ) said that among those whom Allah will shade on the Day of Resurrection is "a man who gives charity so secretly that his left hand does not know what his right hand gives" (Bukhari #1421, Muslim #1031).
3. Seeking refuge from riya' — the Prophet (ﷺ) taught: "Allahumma inni a'udhu bika an ushrika bika wa ana a'lam, wa astaghfiruka lima la a'lam" (O Allah, I seek refuge in You from knowingly associating partners with You, and I seek Your forgiveness for what I do unknowingly).
4. Reflecting on the Hereafter — remembering that people's opinions have no weight on the Day of Judgement.
5. Accompanying the righteous and avoiding those who flatter.

IKHLAS (SINCERITY): Ikhlas means purifying one's intention for Allah alone. Allah says: "And they were not commanded except to worship Allah, being sincere to Him in religion" (Quran 98:5). The Prophet (ﷺ) said: "Allah does not accept any deed unless it is done sincerely for His sake and seeking His pleasure." (Nasa'i, authenticated by Al-Albani). A small deed done with sincerity is better than a great deed done with riya'.`,
    source: "IslamQA - Based on Quran, Sahih Bukhari, Sahih Muslim, Ibn Baz, Ibn Uthaymeen, IslamQA #129678",
    category: "ibadah"
  },
  {
    title: "Khushu' (Humility and Focus in Prayer)",
    content: `Khushu' is the state of humility, focus, and presence of heart in prayer. Allah says: "Successful indeed are the believers, those who are humble in their prayers" (Quran 23:1-2). The absence of khushu' is a sign of neglect: "So woe to those who pray, who are heedless of their prayer" (Quran 107:4-5).

ATTAINING KHUSHU':
1. Preparing for prayer — performing wudu properly, using the miswak, dressing cleanly, and going to the mosque early.
2. Remembering the greatness of Allah before starting — reciting the opening du'a with meaning.
3. Pausing at each verse of Al-Fatihah — as the Prophet (ﷺ) used to pause after each ayah.
4. Reflecting on the meaning of what is recited — the Prophet (ﷺ) said: "The prayer is not complete unless one recites Al-Fatihah with reflection."
5. Looking at the place of prostration — the Prophet (ﷺ) used to look at the ground during prayer (his gaze was fixed on the place of sujud).
6. Remembering death during prayer — the Prophet (ﷺ) said: "When you stand to pray, pray as if it is your last prayer." (Ibn Majah #4171, authenticated by Al-Albani).
7. Avoiding distractions — removing anything that distracts the mind, not praying when food is served or when needing to relieve oneself.
8. Not looking around — the Prophet (ﷺ) said: "When a person prays, he should not look around, for Allah turns His face to the face of His slave as long as he does not look around." (Tirmidhi, authenticated by Al-Albani).
9. Praying with tranquility (tumaninah) — not rushing through the movements. The Prophet (ﷺ) saw a man praying hurriedly and said: "Go back and pray, for you have not prayed." (Bukhari #793, Muslim #397).
10. Making du'a during sujud — the closest a slave is to his Lord is when prostrating (Muslim #482), so increase supplication at this time.

The Salaf were very particular about khushu'. When Ibn al-Zubayr prayed, he was like a tree trunk planted in the ground — no movement, no distraction. Some of the Salaf would not even know who was sitting beside them in the mosque because of their concentration. The stronger one's iman, the deeper the khushu'. Conversely, sin weakens khushu' — the Prophet (ﷺ) said: "When a man commits a sin, a black spot appears on his heart. If he repents, it is erased. If he persists, it spreads until it overtakes his heart." (Tirmidhi #3334, authenticated by Al-Albani). This hardens the heart and destroys khushu'.`,
    source: "IslamQA - Based on Quran 23:1-2, Sahih Bukhari #793, Sahih Muslim #397, #482, Ibn Majah #4171, Ibn Baz, Ibn Uthaymeen",
    category: "ibadah"
  },
  {
    title: "Purification of the Soul (Tazkiyah al-Nafs)",
    content: `Tazkiyah means purification of the soul from spiritual diseases and its development toward Allah. Allah says: "He has succeeded who purifies it (the soul), and he has failed who corrupts it" (Quran 91:9-10). "Indeed, Allah loves those who repent and loves those who purify themselves" (Quran 2:222).

SPIRITUAL DISEASES TO PURIFY:
1. Kibr (arrogance) — the Prophet (ﷺ) said: "No one who has an atom's weight of arrogance in his heart will enter Paradise." (Muslim #91).
2. Hasad (envy) — "And from the evil of an envier when he envies" (Quran 113:5). Hasad is resenting Allah's blessing on others and wishing it removed.
3. Ghibah (backbiting) — "Would one of you like to eat the flesh of his dead brother?" (Quran 49:12). The Prophet (ﷺ) said: "Backbiting is mentioning your brother in a way he dislikes." (Muslim #2589).
4. Ghadab (anger) — the Prophet (ﷺ) said: "The strong man is not the one who can wrestle, but the one who controls himself at times of anger." (Bukhari #6114, Muslim #2609).
5. Hubb al-dunya (love of this world) — the root of all sin. The Prophet (ﷺ) said: "The love of this world and the dislike of death are the essence of every sin." (Kanz al-Ummal).
6. Su' al-zann (bad suspicion) — "Avoid much suspicion, for some suspicion is sin" (Quran 49:12).
7. Ghaflah (heedlessness) — forgetting Allah and the Hereafter due to worldly absorption.

MEANS OF PURIFICATION:
1. Taqwa (fear of Allah) — the foundation of all purification. "Whoever fears Allah, He will make a way out for him" (Quran 65:2).
2. Regular dhikr (remembrance) — "Verily, in the remembrance of Allah do hearts find rest" (Quran 13:28).
3. Muhasabah (self-accountability) — taking oneself to account before being taken to account. Umar (may Allah be pleased with him) said: "Take account of yourselves before you are brought to account."
4. Tawbah (repentance) — constant return to Allah.
5. Accompaniment of the righteous — "A man follows the religion of his close friend" (Abu Dawud #4833, Tirmidhi #2378).
6. Reducing worldly attachments — zuhd is not forbidding what is halal but preferring the Hereafter over this world.
7. Fasting and night prayer — the Prophet (ﷺ) said: "The month of patience (Ramadan) and three days of each month remove the whispers of the heart." (Ahmad).

THE HEART IS THE KING: All good deeds depend on the state of the heart. The Prophet (ﷺ) said: "There is a piece of flesh in the body; if it is sound, the whole body is sound; if it is corrupt, the whole body is corrupt. It is the heart." (Bukhari #52, Muslim #1599).`,
    source: "IslamQA - Based on Quran, Sahih Bukhari, Sahih Muslim, Ibn al-Qayyim (Madarij al-Salikin), Ibn Taymiyyah, al-Ghazali",
    category: "ibadah"
  },

  // ===== KNOWLEDGE & DAWAH =====
  {
    title: "Seeking Islamic Knowledge (Talab al-Ilm)",
    content: `Seeking Islamic knowledge is an obligation upon every Muslim. The Prophet (ﷺ) said: "Seeking knowledge is an obligation upon every Muslim." (Ibn Majah #224, authenticated by Al-Albani). "Whoever travels a path seeking knowledge, Allah makes easy for them a path to Paradise." (Muslim #2699). "The virtue of the scholar over the worshipper is like the virtue of the moon over all other heavenly bodies." (Abu Dawud #3641, Tirmidhi #2685).

PRIORITIES IN SEEKING KNOWLEDGE:
1. Knowledge of Tawhid (Aqeedah) — knowing Allah, His names and attributes, and the foundations of faith. This is the most important knowledge.
2. Knowledge of Fiqh (rulings) — knowing what is obligatory (fard 'ayn) in worship and daily life: how to pray, fast, give zakah, etc.
3. Knowledge of the Quran and Hadith — the primary sources of Islam.
4. Knowledge of Arabic — to understand the Quran and Sunnah directly.
5. Knowledge of Seerah (biography of the Prophet) — to love and follow him.

The Salaf understood that knowledge precedes speech and action. Imam al-Bukhari titled a chapter: "Knowledge precedes speech and action." The proof is Allah's command: "Know that there is no god worthy of worship except Allah, and ask forgiveness for your sin" (Quran 47:19) — knowledge comes first, then action.

ETIQUETTE OF SEEKING KNOWLEDGE:
1. Sincere intention (ikhlas) — seeking knowledge for Allah's sake, not for status or argument.
2. Acting upon knowledge — the Prophet (ﷺ) said: "A person will be brought on the Day of Resurrection and thrown into Hell, and his intestines will spill out. He will be asked: 'Did you not enjoin good and forbid evil?' He will say: 'I used to enjoin good but not do it, and forbid evil but do it.'" (Bukhari #3267, Muslim #2989).
3. Humility — knowledge increases humility, not arrogance. The more one learns, the more they realize how little they know.
4. Patience and perseverance — knowledge is not acquired overnight.
5. Respecting teachers — standing up for them, not interrupting, and being grateful.
6. Teaching others — "The best of you are those who learn the Quran and teach it." (Bukhari #5027).

WHEN SEEKING KNOWLEDGE BECOMES OBLIGATORY: Fard 'ayn (personal obligation): knowing the basics of tawheed, how to pray correctly, how to fast, the rules of halal and haram in daily life, and how to deal with one's spouse and children. Fard kifayah (communal obligation): having enough scholars in the community to answer questions and guide the people.

The Prophet (ﷺ) also said: "When a person dies, their deeds come to an end except for three: ongoing charity, beneficial knowledge (that they taught or left behind), or a righteous child who prays for them." (Muslim #1631).`,
    source: "IslamQA - Based on Quran, Sahih Muslim #2699, #1631, Ibn Majah #224, Tirmidhi #2685, Bukhari #5027, IslamQA #349464, #315635",
    category: "knowledge"
  },
  {
    title: "Da'wah (Calling to Islam) - Principles and Etiquette",
    content: `Da'wah means inviting people to the path of Allah with wisdom and good advice. Allah says: "Invite to the way of your Lord with wisdom and good instruction, and argue with them in a way that is best" (Quran 16:125). "Who is better in speech than one who calls to Allah, does righteousness, and says: 'Indeed, I am of the Muslims'?" (Quran 41:33).

OBLIGATION OF DA'WAH: Every Muslim is a caller to Islam by their words and actions. The Prophet (ﷺ) said: "Convey from me, even if it is one ayah" (Bukhari #3461). Da'wah is fard kifayah (communal obligation) — if enough people do it, the rest are absolved, but if nobody does it, the entire community bears sin.

METHODOLOGY OF DA'WAH (based on Quran 16:125):
1. Al-Hikmah (Wisdom) — speaking appropriately to the audience, choosing the right time and place, addressing people according to their understanding. This includes starting with the most important matters (Tawheed before fiqh details), and using gentle persuasion.
2. Al-Maw'izah al-Hasanah (Good Instruction) — kind advice, reminders of Allah and the Hereafter, using stories and examples from the Quran and Sunnah.
3. Al-Mujadalah bi al-lati hiya ahsan (Argument in the Best Way) — debating politely, without insults or anger, presenting evidence clearly, and stopping when the other party becomes hostile.

QUALITIES OF A DA'I (CALLER):
1. Knowledge — one should not speak about Islam without knowledge. "Say: This is my way; I invite to Allah with insight" (Quran 12:108).
2. Sincerity — calling for Allah's sake, not for fame or followers.
3. Good character — the Prophet (ﷺ) had the best character and attracted people through his kindness. "And indeed, you are of a great moral character" (Quran 68:4).
4. Patience — da'wah often involves rejection, mockery, and hardship. The Prophets were the most patient in calling to Allah.
5. Gentleness — the Prophet (ﷺ) said: "Gentleness does not enter anything except that it beautifies it, and it is not removed from anything except that it damages it." (Muslim #2594).
6. Mercy and compassion — desiring good for others, not being harsh or judgmental.
7. Good example — actions speak louder than words. A caller should practice what they preach.

COMMON MISTAKES IN DA'WAH:
1. Starting with secondary issues (e.g., beard length, hand placement in prayer) before establishing Tawheed and the basics.
2. Being harsh or argumentative — which drives people away.
3. Neglecting personal character — the da'i's behavior is often the first "book" people read about Islam.
4. Impatience — expecting immediate results. Guidance is from Allah alone.
5. Not addressing people according to their level of understanding.
6. Focusing on non-Muslims while neglecting Muslims who need strengthening.

The Prophet (ﷺ) sent Mu'adh to Yemen and instructed him: "You are going to a People of the Book. Let the first thing you call them to be the testification that there is no god worthy of worship except Allah and that I am the Messenger of Allah. If they accept that, then inform them that Allah has obligated five prayers upon them each day and night..." (Bukhari #1496, Muslim #19). This hadith teaches the principle of priorities in da'wah.`,
    source: "IslamQA - Based on Quran 16:125, Sahih Bukhari #1496, #3461, Sahih Muslim #19, #2594, Ibn Baz, Ibn Uthaymeen, IslamQA #508244, #199021",
    category: "knowledge"
  },

  // ===== PSYCHOLOGICAL & SOCIAL ISSUES =====
  {
    title: "Waswasah (Whispers from Shaytan) - Islamic Perspective and Treatment",
    content: `Waswasah are the whispers and obsessive thoughts that Shaytan (Satan) casts into the heart of the believer to cause doubt, anxiety, and distress. Allah says: "Say: I seek refuge in the Lord of mankind... from the evil of the whisperer who withdraws, who whispers in the breasts of mankind, from among the jinn and mankind" (Quran 114:1-6).

TYPES OF WASWAS:
1. Waswas in Aqeedah — whispers about Allah, His existence, His attributes, or the fundamentals of faith. The Companions suffered from this and came to the Prophet (ﷺ) saying: "O Messenger of Allah, some of us experience thoughts that are too terrible to speak of." He replied: "That is clear faith." (Muslim #132). Having such thoughts does not affect one's faith; what matters is resisting and ignoring them.
2. Waswas in Worship — obsessive doubts about wudu, purity, prayer (e.g., "Did I say the takbir? Did water reach my elbow? Did I pray three or four rak'at?"). The Prophet (ﷺ) said: "If the Shaytan comes to one of you during his prayer and says: 'You have invalidated your wudu,' let him not leave until he hears a sound or detects an odor." (Bukhari #2056, Muslim #361).
3. Waswas in Daily Life — obsessive thoughts about cleanliness, intentions, food, etc.

THE PRINCIPLE: "DO NOT PAY ATTENTION TO IT":
The general principle for dealing with waswas is to ignore it completely and not act upon it. The more attention one gives to waswas, the stronger it becomes. Ibn Taymiyyah said: "Waswas arises from a lack of knowledge and faith, or from weakness of will. If the person is strong in faith and will, he would not be affected by it."

TREATMENT OF WASWAS:
1. Seeking refuge in Allah (ta'awwudh) — reciting "A'udhu billahi min al-shaytan al-rajim" and the Mu'awwidhatayn (Surah Al-Falaq and An-Nas).
2. Ignoring the whisper — not responding, not repeating, not checking. The Prophet (ﷺ) said: "The Shaytan comes to one of you and says: 'Who created this? Who created that?' until he says: 'Who created your Lord?' When anyone experiences that, let him seek refuge in Allah and stop such thoughts." (Bukhari #3276, Muslim #134).
3. Increase in dhikr and seeking forgiveness.
4. Distracting oneself with beneficial activities.
5. Not giving in to compulsive behavior — e.g., if waswas makes you doubt wudu, do not repeat it. If it makes you doubt the number of rak'at, choose the lesser number and make sujud al-sahw.

SCHOLARS' ADVICE ON WASWAS: Ibn al-Qayyim said: "The Shaytan may cast waswas into the hearts of the believers regarding the fundamentals of faith, but when they seek refuge in Allah, ignore it, and busy themselves with obedience, it vanishes." The cure for waswas is to treat the whispers as if they do not exist. The more you engage with them, the more they persist. When you ignore them, they disappear.

SPECIFIC RULINGS:
- A person who suffers from waswas in wudu should not repeat it more than three times for any body part.
- A person who suffers from waswas in prayer should not repeat the prayer more than once.
- A person who suffers from waswas about najasah (impurity) should follow the original ruling (purity) unless they are certain of impurity.
- Doubts about the number of children, whether zakah was paid, etc. — the basis is that they did not occur, and the doubt is ignored.`,
    source: "IslamQA - Based on Quran, Sahih Bukhari #2056, #3276, Sahih Muslim #132, #134, #361, Ibn Taymiyyah, Ibn al-Qayyim, Ibn Uthaymeen, IslamQA #258",
    category: "ibadah"
  },
  {
    title: "Anxiety, Depression, and Stress - Islamic Perspective and Remedies",
    content: `Islam provides a comprehensive approach to dealing with anxiety, depression, and psychological distress. Allah addresses the human condition with mercy and offers practical and spiritual remedies.

CAUSES OF ANXIETY IN ISLAMIC PERSPECTIVE:
1. Weakness of iman (faith) — when a person forgets Allah, reliance on self replaces reliance on Allah, leading to anxiety.
2. Attachment to this world (hubb al-dunya) — fear of losing wealth, status, or loved ones.
3. Sin — sins darken the heart and cause distress. The Prophet (ﷺ) said: "When a person commits a sin, a black spot appears on his heart." (Tirmidhi #3334, authenticated by Al-Albani).
4. Negative thoughts about Allah — thinking that Allah will not forgive or that His decree is unfair.
5. Not accepting qadr (divine decree) — struggling against what Allah has written.

QURANIC REMEDIES FOR ANXIETY:
1. Dhikr (remembrance of Allah): "Verily, in the remembrance of Allah do hearts find rest" (Quran 13:28).
2. Tawakkul: "And whoever relies upon Allah, then He is sufficient for him" (Quran 65:3).
3. Sabr and prayer: "Seek help through patience and prayer; indeed, it is difficult except for the humble" (Quran 2:45).
4. Trusting that trials bring reward: "And certainly, We shall test you with something of fear, hunger, loss of wealth, lives and fruits, but give glad tidings to the patient" (Quran 2:155).
5. Hope in Allah's mercy: "Do not despair of the mercy of Allah. Indeed, Allah forgives all sins" (Quran 39:53).
6. Contentment with qadr: "No calamity befalls except by the leave of Allah. And whoever believes in Allah, He guides his heart" (Quran 64:11).

PROPHETIC REMEDIES:
1. The du'a for anxiety: "Allahumma inni a'udhu bika minal hammi wal hazan, wa a'udhu bika minal 'ajzi wal kasal..." (O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness...).
2. The du'a of Yunus (AS) when he was in the whale's belly: "La ilaha illa anta, subhanaka, inni kuntu min al-zalimin" (There is no god but You, glory to You, indeed I have been among the wrongdoers). The Prophet (ﷺ) said: "No Muslim prays to Allah with this du'a concerning any matter except that Allah will answer him." (Tirmidhi #3505, authenticated by Al-Albani).
3. "Hasbi Allah la ilaha illa huwa, alayhi tawakkaltu wa huwa rabb al-'arsh al-'azim" (Allah is sufficient for me, there is no god but Him. In Him I put my trust, and He is the Lord of the Mighty Throne) — seven times in the morning and evening.
4. Looking at those who have less: The Prophet (ﷺ) said: "Look at those who are below you in worldly terms, not at those above you, so that you will not underestimate the blessings of Allah upon you." (Bukhari #6490, Muslim #2963).

PRACTICAL STEPS:
1. Maintain the five daily prayers — the connection with Allah provides strength.
2. Night prayer (tahajjud) — the Prophet (ﷺ) would stand in prayer during times of distress.
3. Reciting and reflecting on the Quran — especially Surah Al-Duha, Al-Sharh, and Al-Fatihah.
4. Giving charity — "Charity extinguishes sin as water extinguishes fire" (Tirmidhi #2616, authenticated by Al-Albani).
5. Talking to a trusted person — sharing concerns with a wise friend, scholar, or therapist is encouraged in Islam.
6. Seeking medical help when needed — using permissible (halal) medication and therapy is not contrary to tawakkul.
7. Exercise and healthy lifestyle — the body has rights over the person.

The Prophet (ﷺ) experienced sadness (at the death of his son Ibrahim and wife Khadijah) but never depression or despair. He taught us: "How wonderful is the affair of the believer, for all his affairs are good. If something good happens, he gives thanks and that is good for him. If something bad happens, he bears it with patience and that is good for him." (Muslim #2999).`,
    source: "IslamQA - Based on Quran, Sahih Bukhari #6490, Sahih Muslim #2999, #2963, Tirmidhi #3505, Ibn al-Qayyim (al-Fawa'id, Zad al-Ma'ad)",
    category: "ibadah"
  },
  {
    title: "Social Relationships and Brotherhood in Islam",
    content: `Islam places great emphasis on strong social bonds and brotherhood among believers. Allah says: "The believers are but brothers, so make peace between your brothers" (Quran 49:10). The Prophet (ﷺ) said: "The believers in their mutual love, mercy, and compassion are like a single body: if one part complains, the rest of the body responds with fever and sleeplessness." (Muslim #2586).

RIGHTS OF ONE MUSLIM OVER ANOTHER:
The Prophet (ﷺ) said: "The rights of one Muslim over another are six: When you meet him, greet him with salam; when he invites you, accept; when he seeks advice, advise him; when he sneezes and praises Allah, say yarhamuk Allah; when he falls sick, visit him; and when he dies, follow his funeral." (Muslim #2162). In another narration: "Do not envy one another, do not outbid one another, do not hate one another, do not turn away from one another, and do not undercut one another in business. Be servants of Allah as brothers." (Muslim #2564).

GOOD CHARACTER WITH PEOPLE:
1. Truthfulness — being honest in speech and dealings.
2. Trustworthiness — fulfilling promises and returning what is entrusted.
3. Gentleness — the Prophet (ﷺ) said: "Gentleness does not enter anything except that it beautifies it." (Muslim #2594).
4. Forbearance — not reacting to provocation with anger.
5. Generosity — the Prophet (ﷺ) was the most generous of people.
6. Visiting the sick and attending funerals.
7. Making peace between people — "Shall I not tell you of a deed that is better than prayer, fasting, and charity? Making peace between people." (Abu Dawud #4919, Tirmidhi #2509, authenticated by Al-Albani).
8. Smiling — "Your smile in the face of your brother is charity." (Tirmidhi #1956, authenticated by Al-Albani).

FORBIDDEN IN SOCIAL RELATIONSHIPS:
1. Backbiting (ghibah) — mentioning your brother in a way he dislikes (Muslim #2589).
2. Slander (namimah) — carrying tales between people to create discord.
3. Suspicion — "Avoid much suspicion, for some suspicion is sin" (Quran 49:12).
4. Spying — "Do not spy on one another" (Quran 49:12).
5. Mocking and ridiculing — "Do not ridicule one another; it may be that those who are ridiculed are better than those who ridicule" (Quran 49:11).
6. Cutting ties of kinship — the Prophet (ﷺ) said: "The one who cuts ties of kinship will not enter Paradise." (Bukhari #5984, Muslim #2556).
7. Abandoning a Muslim for more than three days — "It is not permissible for a Muslim to forsake his brother for more than three nights." (Bukhari #6065, Muslim #2560).

The best of people are those who are most beneficial to others. The Prophet (ﷺ) said: "The best of people are those who are most beneficial to people." (Ibn Majah, authenticated by Al-Albani).`,
    source: "IslamQA - Based on Quran 49:10-12, Sahih Muslim #2162, #2564, #2586, #2589, Sahih Bukhari #5984, #6065, IslamQA #34621",
    category: "ibadah"
  },

  // ===== FAMILY FIQH =====
  {
    title: "Talaq (Divorce) in Islam - Complete Guide",
    content: `Divorce (talaq) is permitted in Islam but is the most disliked permissible act. The Prophet (ﷺ) said: "The most hated of permissible things to Allah is divorce." (Abu Dawud #2178, Ibn Majah #2018, authenticated by Al-Albani). Divorce should only be resorted to when all attempts at reconciliation have failed.

TYPES OF TALAQ:
1. Talaq al-Sunnah (according to the Prophet's way) — the recommended divorce:
   - One pronouncement of divorce during the wife's tuhr (period of purity between menstruations) during which no intercourse occurred.
   - After this pronouncement, the 'iddah (waiting period) begins. The husband may revoke the divorce at any time during the 'iddah.
   - If the 'iddah ends without revocation, the divorce becomes final (ba'in).
2. Talaq al-Bid'ah (innovated divorce) — a sinful but still effective divorce:
   - Three divorces pronounced at once (triple talaq).
   - Divorce pronounced during menstruation.
   - The majority of scholars count it as valid but sinful. Ibn Taymiyyah held that triple talaq counts as one.

TALAQ RAJ'I (REVOCABLE DIVORCE): After the first or second talaq, the husband has the right to take his wife back during the 'iddah period without a new marriage contract. Allah says: "Divorce is twice. Then either keep her in kindness or release her in kindness" (Quran 2:229). The husband may revoke by saying "I take you back" or by having intercourse with the intention of taking her back.

TALAQ BA'IN (IRREVOCABLE DIVORCE):
- Talaq Ba'in Baynunah Sughra (minor irrevocability): After the first or second talaq if the 'iddah expires without revocation. The couple can remarry with a new contract and mahr.
- Talaq Ba'in Baynunah Kubra (major irrevocability): After the third talaq. The woman becomes haram for the husband until she marries another man and that marriage ends naturally (not through a fraudulent arrangement called tahlil). Allah says: "And if he divorces her (the third time), she is not lawful to him afterward until she marries another husband" (Quran 2:230).

CONDITIONS FOR VALID TALAQ:
1. The husband must be sane and adult.
2. The husband must divorce of his own free will (not coerced).
3. The wife must be in a state of purity (tuhr) during which no intercourse occurred (for sunni talaq).
4. Clear words expressing divorce — either explicit (saarih) like "I divorce you" or implicit (kinaayah) depending on intent.

CONSEQUENCES OF TALAQ:
1. The wife must observe 'iddah (waiting period).
2. The husband must provide maintenance (nafaqah) during the 'iddah.
3. Mahr is divided: if consummated, full mahr is owed; if before consummation, half mahr.
4. If revocable, the wife stays in the marital home.
5. Children's custody is determined (see custody document).

RECONCILIATION: Before final divorce, Islam encourages reconciliation. Allah says: "If you fear a breach between them, appoint an arbitrator from his family and an arbitrator from her family. If they both desire reconciliation, Allah will bring about agreement between them" (Quran 4:35).`,
    source: "IslamQA - Based on Quran 2:229-230, 4:35, Abu Dawud #2178, Ibn Majah #2018, Ibn Baz, Ibn Uthaymeen, IslamQA #48",
    category: "fiqh"
  },
  {
    title: "Khula' (Divorce Initiated by the Wife) - Complete Guide",
    content: `Khula' is a divorce initiated by the wife in exchange for compensation (usually returning the mahr or paying an amount agreed upon). Allah says: "And it is not lawful for you to take anything of what you have given them unless both fear that they cannot maintain the limits of Allah. If you fear that they cannot maintain the limits of Allah, then there is no blame on either of them for what she gives to get herself free" (Quran 2:229).

PROPHETIC EXAMPLE: The wife of Thabit ibn Qays came to the Prophet (ﷺ) and said: "O Messenger of Allah, I do not find any fault with Thabit's character or religion, but I cannot bear to live with him." The Prophet (ﷺ) asked: "Will you give back his garden?" She agreed. The Prophet (ﷺ) told Thabit: "Accept the garden and divorce her." (Bukhari #5273, Muslim #2895).

DIFFERENCES BETWEEN KHULA' AND TALAQ:
1. Initiation: Talaq is initiated by the husband; khula' is initiated by the wife.
2. Compensation: In talaq, the husband gives the mahr; in khula', the wife gives compensation.
3. Revocability: Talaq raj'i is revocable; khula' is irrevocable (ba'in) — the husband cannot take her back during the 'iddah without a new marriage contract.
4. Iddah: In khula', the 'iddah is usually one menstrual cycle (some scholars say three, as in regular talaq).

GROUNDS FOR KHULA':
- The wife dislikes her husband's character or treatment.
- She fears she cannot fulfill her marital obligations.
- She cannot continue the marriage due to incompatibility.
- She dislikes the husband's appearance, smell, or other personal matters.
- The husband is not fulfilling her rights.
- She simply cannot bear to live with him.

CONSEQUENCES:
1. The wife gives up part or all of her mahr to the husband.
2. The divorce becomes irrevocable (ba'in).
3. The wife observes 'iddah.
4. The husband is not obligated to provide maintenance during 'iddah (according to the majority).
5. Remarriage is possible with a new contract and mahr.

RULING ON KHULA': Khula' is permissible when the wife has a valid reason. Without a valid reason, it is discouraged. The Prophet (ﷺ) said: "If a woman seeks khula' without a valid reason, she will not smell the fragrance of Paradise." (Abu Dawud #2226, Tirmidhi #1187, Ibn Majah #2055, authenticated by Al-Albani).`,
    source: "IslamQA - Based on Quran 2:229, Sahih Bukhari #5273, Sahih Muslim #2895, Abu Dawud #2226, Ibn Baz, Ibn Uthaymeen, IslamQA #35",
    category: "fiqh"
  },
  {
    title: "Child Custody (Hadhanah) in Islam",
    content: `Child custody (hadhanah) in Islam is primarily about the best interests and welfare of the child. The basic principle is that the child should be with the mother during early childhood, as she is more nurturing and compassionate.

RIGHT OF THE MOTHER TO CUSTODY:
The Prophet (ﷺ) said to a woman who came asking about custody: "You have more right to him as long as you do not remarry." (Abu Dawud #2276, authenticated by Al-Albani). This establishes the mother's primary right to custody. Another woman came to the Prophet (ﷺ) and said: "This son of mine, my womb was a vessel for him, my breast was a source of drink for him, my lap was a refuge for him, and his father has divorced me and wants to take him away." The Prophet (ﷺ) said: "You have more right to him as long as you do not remarry." (Ahmad, authenticated by Al-Albani).

QUALIFICATIONS FOR THE CUSTODIAN:
1. Sane and adult.
2. Muslim — a non-Muslim cannot have custody of a Muslim child.
3. Trustworthy (not a sinner openly) — the child's religious and moral upbringing must be ensured.
4. Capable of raising the child — physically and mentally able.
5. Residing in a safe environment.
6. For the mother: not remarried to a non-mahram man (her right to custody transfers if she remarries).

ORDER OF CUSTODY RIGHTS:
1. The mother, then the maternal grandmother, then the mother's mother upwards.
2. The father, then the paternal grandmother, etc. (some differences among madhabs).
3. If no one qualifies, custody goes to the nearest female relatives on the mother's side.
4. If no female qualifies, custody goes to the father or nearest male mahram.

AGE OF CUSTODY (AGE OF DISCRETION):
- Hanafi: Mother has custody until the son is 7 (can choose thereafter) and daughter until puberty.
- Maliki: Daughter until marriage; son until puberty.
- Shafi'i: Son until 7-9 years (can choose), daughter until marriage.
- Hanbali: Son until 7 (can choose), daughter until 7 or 9 (can choose), after which father takes over.
The child may be given the choice between parents at the age of discretion if both are equally qualified. The Prophet (ﷺ) gave a child the choice between his father and mother (Abu Dawud #2277, Tirmidhi #1357, authenticated by Al-Albani).

THE FATHER'S ROLE: The father is responsible for:
1. Financial support (nafaqah) of the children regardless of who has custody.
2. Education and religious upbringing.
3. Supervision of major decisions (marriage, education, travel).
4. The child's housing if he is the custodian.

CUSTODY AFTER DIVORCE: The custodial parent (usually the mother) has the right to:
1. Live in a suitable home (the father must provide housing if he can afford it).
2. Travel with the child locally; for long-distance travel, permission of the other parent is needed.
3. Make day-to-day decisions about the child's welfare.
Major decisions (schooling, medical procedures, marriage) require mutual consultation.

ABANDONMENT OF CUSTODY: Custody cannot be abandoned without valid reason. Whoever abandons custody responsibilities without excuse is sinful. If both parents abandon custody, the judge appoints a suitable guardian.

Child custody in Islam is always determined by what is best for the child. The ultimate goal is the child's physical, emotional, and spiritual well-being.`,
    source: "IslamQA - Based on Abu Dawud #2276, #2277, Tirmidhi #1357, Ahmad, Ibn Qudamah (al-Mughni), Ibn Baz, IslamQA #51",
    category: "fiqh"
  },
  {
    title: "'Iddah (Waiting Period) After Divorce or Death",
    content: `'Iddah is the waiting period a woman must observe after divorce or the death of her husband before she can remarry. Allah says: "Divorced women shall wait for three periods (quru')" (Quran 2:228). "And those who are taken in death among you and leave wives behind — they shall wait for four months and ten days" (Quran 2:234).

PURPOSES OF 'IDDAH:
1. To ascertain whether the woman is pregnant (to avoid mixing lineages).
2. To allow time for reconciliation between the spouses (in case of revocable divorce).
3. To allow the woman to grieve for her husband (in case of death).
4. To give the woman time to adjust to her new situation.

TYPES OF 'IDDAH:
1. 'Iddah of Divorce (Talaq):
   - If the wife is menstruating: three complete menstrual cycles (quru').
   - If the wife is young/old and does not menstruate: three months.
   - If the wife is pregnant: until she gives birth — regardless of how soon or late that is.
2. 'Iddah of Death (Widow):
   - If not pregnant: four months and ten days.
   - If pregnant: until she gives birth (the longer of the two periods).
3. 'Iddah of Khula':
   - One menstrual cycle (according to some scholars) or three (according to others).
4. 'Iddah of an Annulled Marriage:
   - Varies based on whether the marriage was consummated.

RULINGS DURING 'IDDAH:
During revocable divorce 'iddah (talaq raj'i):
- The wife stays in the marital home — "Do not turn them out of their homes, nor shall they leave" (Quran 65:1).
- The husband may take her back by words or actions.
- The husband is obligated to provide maintenance, food, clothing, and housing.
- The wife may beautify herself (if hoping for reconciliation).
- She may not leave the house except for necessity.

During irrevocable divorce 'iddah (talaq ba'in):
- Same as above regarding staying in the home.
- Maintenance is due (according to the majority).
- The husband cannot take her back without a new marriage.

During widow's 'iddah:
- She may stay in the marital home or any appropriate place.
- She may not leave the house unnecessarily for 4 months and 10 days.
- She should avoid perfumes, jewelry, and beautification.
- Maintenance from the husband's estate is due for the duration.

It is haram for a woman to conceal her pregnancy or lie about her 'iddah. Proposing marriage during 'iddah is prohibited: "There is no blame on you for what you hint of a proposal to women or conceal it in your hearts" (Quran 2:235) — direct proposals are not allowed, but hints are permitted.`,
    source: "IslamQA - Based on Quran 2:228, 2:234, 2:235, 65:1, Ibn Baz, Ibn Uthaymeen, IslamQA #53",
    category: "fiqh"
  },
  {
    title: "Kind Treatment of Spouses and Marital Harmony",
    content: `Islam places great emphasis on kind treatment between spouses. Allah says: "And live with them in kindness. If you dislike them, it may be that you dislike something in which Allah has placed much good" (Quran 4:19). "And of His signs is that He created for you from yourselves mates that you may find tranquility in them, and He placed between you love and mercy" (Quran 30:21).

THE PROPHET'S EXAMPLE: The Prophet (ﷺ) said: "The best of you are the best to their families, and I am the best to my family." (Tirmidhi #3895, Ibn Majah #1977). He used to help with household chores, mend his own clothes, and treat his wives with gentleness and humor. He said: "A believer should not hate a believing woman; if he dislikes one characteristic in her, he will be pleased with another." (Muslim #1469).

RIGHTS OF THE WIFE:
1. Mahr (dowry) — "Give the women their bridal gift as a free gift" (Quran 4:4).
2. Maintenance (nafaqah) — the husband must provide food, clothing, housing, and medical care according to his means. "Let the wealthy man spend according to his wealth" (Quran 65:7).
3. Kind treatment — the husband should not harm her physically, verbally, or emotionally. "And do not treat them with harshness that you may take away what you have given them" (Quran 4:19).
4. Fair division of time (in polygynous marriages) — "And you will never be able to be perfectly just between wives, so do not incline completely toward one" (Quran 4:129).
5. Sexual fulfillment — the husband should not neglect his wife's physical needs.
6. Protection and security — the husband is the protector (qawwam) of the family.
7. Right to education and religious practice.
8. Right to visit her family and receive visitors.

RIGHTS OF THE HUSBAND:
1. Obedience (ta'ah) in what is good and permissible — "Therefore righteous women are obedient and guard in the husband's absence what Allah would have them guard" (Quran 4:34).
2. Respect and honor as the head of the household.
3. The wife should not admit anyone into the home whom the husband dislikes.
4. The wife should guard his wealth and honor.
5. Physical intimacy — the wife should not refuse without a valid excuse. The Prophet (ﷺ) said: "If a husband calls his wife to bed and she refuses and he spends the night angry, the angels curse her until morning." (Bukhari #3237, Muslim #1436).

MUTUAL RESPONSIBILITIES:
1. Living together with love, mercy, and companionship.
2. Consulting each other in family matters.
3. Keeping each other's secrets.
4. Helping one another in righteousness and piety.
5. Being patient with each other's shortcomings.
6. Raising children together with Islamic values.
7. Expressing love and appreciation.

RESOLVING CONFLICTS (Quran 4:34-35):
1. First: Advise and remind the spouse of Allah.
2. Second: Separate beds (as a temporary measure).
3. Third: Lightly admonish (without causing injury).
4. If still unresolved: Appoint arbitrators from both families.
The Prophet (ﷺ) never hit any of his wives or servants. His advice was always kindness and patience.

A GOOD WIFE: The Prophet (ﷺ) said: "This world is temporary enjoyment, and the best enjoyment in it is a righteous wife." (Muslim #1467). "Marry a woman who is loving and fertile, for I will boast of your numbers before the other nations." (Abu Dawud #2050, authenticated by Al-Albani).

A GOOD HUSBAND: The Prophet (ﷺ) said: "The most complete of believers in faith are those with the best character, and the best of you are those who are best to their wives." (Tirmidhi #1162, authenticated by Al-Albani).`,
    source: "IslamQA - Based on Quran 4:19, 4:34, 30:21, Sahih Bukhari #3237, Sahih Muslim #1436, #1467, #1469, Tirmidhi #3895, Ibn Baz, IslamQA #45, #47",
    category: "fiqh"
  },
  {
    title: "Zuhd (Asceticism) and Contentment in Islam",
    content: `Zuhd is not about abandoning the world completely or forbidding what is halal. It is about having the Hereafter in one's heart while living in this world. The Prophet (ﷺ) said: "Be in this world as if you are a stranger or a wayfarer." (Bukhari #6416). Ibn Umar (may Allah be pleased with him) used to say: "When you reach the evening, do not wait for the morning. When you reach the morning, do not wait for the evening. Take from your health for your sickness and from your life for your death."

THE MEANING OF ZUHD:
Imam Ahmad said: "Zuhd is of three types: (1) Abstaining from the unlawful — this is the zuhd of the common people. (2) Abstaining from excess of the lawful — this is the zuhd of the elite. (3) Abstaining from everything that distracts from Allah — this is the zuhd of the scholars."

Ibn al-Qayyim said: "Zuhd is not about having little wealth; zuhd is about having no attachment to wealth. Some people have much wealth but are ascetics. Some have little but are attached to it."

CONTENTMENT (QANAAH): Qana'ah is being satisfied with what Allah has provided. The Prophet (ﷺ) said: "Richness is not about having many possessions, but richness is contentment of the soul." (Bukhari #6446, Muslim #1051). "Whoever among you wakes up secure in his dwelling, healthy in his body, and having his food for the day, it is as if the entire world has been gathered for him." (Tirmidhi #2346, authenticated by Al-Albani).

HOW TO DEVELOP ZUHD AND QANAAH:
1. Contemplating the temporary nature of this world and the permanence of the Hereafter.
2. Remembering death frequently — the Prophet (ﷺ) said: "Remember often the destroyer of pleasures (death)." (Tirmidhi #2307, Nasa'i #1824, authenticated by Al-Albani).
3. Looking at those who have less in worldly terms (Bukhari #6490, Muslim #2963).
4. Reducing hopes and expectations — living each day as if it were the last.
5. Fulfilling obligations without excess in luxuries.
6. Giving charity regularly.
7. Reflecting on the lives of the Prophets and the Salaf — how they lived simply.

THE BALANCE: Islam does not require poverty. The Prophet (ﷺ) himself made du'a: "O Allah, I ask You for guidance, piety, chastity, and self-sufficiency." (Muslim #2721). Wealth can be a great blessing if used correctly. The righteous Salaf included both wealthy (Uthman, Abd al-Rahman ibn Awf) and poor (Abu Dharr, Ahl al-Suffah). What matters is the attachment of the heart, not the amount of wealth.

The Prophet (ﷺ) said: "If the son of Adam had a valley full of gold, he would wish for a second valley. Nothing fills his mouth except the dirt of the grave. But Allah accepts the repentance of those who repent." (Bukhari #6438, Muslim #1048).`,
    source: "IslamQA - Based on Sahih Bukhari #6416, #6438, #6446, #6490, Sahih Muslim #1048, #1051, #2721, #2963, Tirmidhi #2307, Ibn al-Qayyim (Madarij al-Salikin), Ibn Rajab",
    category: "ibadah"
  },
];

export const seed = action({
  handler: async (ctx) => {
    let inserted = 0;
    let errors = 0;

    for (const doc of DOCUMENTS) {
      try {
        await ctx.runAction(internal.seedIslamic.upsertDoc, {
          title: doc.title,
          content: doc.content,
          source: doc.source,
          category: doc.category,
        });
        inserted++;
      } catch (e) {
        errors++;
      }
    }

    return { inserted, errors, total: DOCUMENTS.length };
  },
});

export const upsertDoc = action({
  args: {
    title: v.string(),
    content: v.string(),
    source: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args: any) => {
    const docId = await ctx.runMutation(internal.ragInternal.insertDocument, {
      title: args.title,
      content: args.content,
      source: args.source,
      category: args.category,
      uploadedAt: Date.now(),
    });

    const chunkSize = 500;
    const chunks = [];
    for (let i = 0; i < args.content.length; i += chunkSize) {
      chunks.push({
        content: args.content.substring(i, i + chunkSize),
        category: args.category,
      });
    }

    if (chunks.length > 0) {
      await ctx.runMutation(internal.ragInternal.insertChunkBatch, {
        chunks,
        documentId: docId,
      });
    }
  },
});
