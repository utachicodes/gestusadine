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
