import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

const DOCUMENTS = [
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
