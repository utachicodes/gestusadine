export interface Lesson {
    id: string;
    title: string;
    content: string; // HTML/Markdown string
    duration: string;
    quiz?: {
        questions: {
            id: number;
            text: string;
            options: string[];
            correctAnswer: number;
        }[];
    };
}

export interface Module {
    id: string;
    title: string;
    category: 'Fiqh' | 'Hadith' | 'Tawhid' | 'Quran';
    description: string;
    image?: string; // Could be a Lucide icon name or image path
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    lessons: Lesson[];
}

export const MODULES: Module[] = [
    {
        id: 'hadith-bukhari',
        title: 'Sahih Al-Bukhari Essentials',
        category: 'Hadith',
        description: 'A selection of the most authentic hadiths covering the foundations of faith and character.',
        level: 'Intermediate',
        lessons: [
            {
                id: 'bukhari-1',
                title: 'Actions are by Intentions (Niyyah)',
                duration: '15 min',
                content: `
                    <div class="space-y-6">
                        <p class="lead text-lg">The Prophet ﷺ said: "Actions are but by intentions and every man shall have only that which he intended."</p>
                        <h3 class="text-xl font-bold mt-4">Commentary</h3>
                        <p>This is the first hadith in Sahih Al-Bukhari. It establishes that the validity of deeds depends on the intention behind them. If one does a good deed for showing off, it is not accepted.</p>
                        <h3 class="text-xl font-bold mt-4">Key Points</h3>
                        <ul class="list-disc pl-5 space-y-2">
                            <li>Niyyah is the foundation of all worship.</li>
                            <li>The place of intention is the heart, not the tongue.</li>
                            <li>Sincerity (Ikhlas) is required for acceptance.</li>
                        </ul>
                    </div>
                `,
                quiz: {
                    questions: [
                        {
                            id: 1,
                            text: "Where is the place of intention (Niyyah)?",
                            options: ["The Tongue", "The Heart", "The Limbs", "The Brain"],
                            correctAnswer: 1
                        },
                        {
                            id: 2,
                            text: "Who narrated this Hadith?",
                            options: ["Abu Huraira", "Umar ibn Al-Khattab", "Aisha", "Anas ibn Malik"],
                            correctAnswer: 1
                        }
                    ]
                }
            },
            {
                id: 'bukhari-2',
                title: 'The Levels of Religion (Hadith Jibreel)',
                duration: '20 min',
                content: `
                    <div class="space-y-6">
                        <p>This famous hadith distinguishes between Islam, Iman, and Ihsan.</p>
                        <p><strong>Islam:</strong> External actions (5 pillars).</p>
                        <p><strong>Iman:</strong> Internal beliefs (6 articles of faith).</p>
                        <p><strong>Ihsan:</strong> Worshipping Allah as if you see Him.</p>
                    </div>
                `,
                quiz: {
                    questions: [
                        {
                            id: 1,
                            text: "What is the highest level of religion?",
                            options: ["Islam", "Iman", "Ihsan", "Taqwa"],
                            correctAnswer: 2
                        }
                    ]
                }
            }
        ]
    },
    {
        id: 'tawhid-101',
        title: 'Kitab at-Tawhid',
        category: 'Tawhid',
        description: 'Understanding the Oneness of Allah and avoiding Shirk.',
        level: 'Beginner',
        lessons: [
            {
                id: 'tawhid-1',
                title: 'The Meaning of La ilaha illa Allah',
                duration: '10 min',
                content: `
                    <div class="space-y-6">
                        <p>It means "There is no deity worthy of worship in truth except Allah".</p>
                        <p>It consists of a negation (La ilaha) and an affirmation (illa Allah).</p>
                    </div>
                `,
                quiz: {
                    questions: [
                        {
                            id: 1,
                            text: "What does the statement negate?",
                            options: ["The existence of God", "False deities", "Angels", "Prophets"],
                            correctAnswer: 1
                        }
                    ]
                }
            }
        ]
    },
    {
        id: 'fiqh-taharah',
        title: 'Fiqh of Purification',
        category: 'Fiqh',
        description: 'Learn how to purify yourself for prayer according to the Sunnah.',
        level: 'Beginner',
        lessons: [
            {
                id: 'wudu-1',
                title: 'The Obligations (Faraid) of Wudu',
                duration: '12 min',
                content: `<p>There are 6 obligatory acts of Wudu...</p>`,
                quiz: {
                    questions: [
                        {
                            id: 1,
                            text: "How many obligatory acts are there in Wudu?",
                            options: ["4", "5", "6", "7"],
                            correctAnswer: 2
                        }
                    ]
                }
            }
        ]
    }
];
