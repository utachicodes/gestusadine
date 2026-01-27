import { motion } from 'framer-motion';
import { Sparkles, Globe, Zap, Shield } from 'lucide-react';
import { Button } from '../ui/button';

interface HeroProps {
    onGetStarted?: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-islamic-cream/30 via-white to-islamic-gold/10 dark:from-gray-900 dark:via-gray-800 dark:to-islamic-gold/5">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
                <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-islamic-gold rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
            </div>

            <div className="container relative z-10 px-4 py-16">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
                    >
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Islamic Knowledge AI Platform</span>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold leading-tight"
                    >
                        <span className="text-gradient">Islamic Knowledge</span>
                        <br />
                        <span className="text-islamic-dark dark:text-white">At Your Fingertips</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl md:text-2xl text-islamic-dark/70 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
                    >
                        AI-powered Islamic guidance with personalized themes, advanced chatbots, and access to authentic Islamic knowledge in French, English, and Wolof.
                    </motion.p>

                    {/* Features Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-12"
                    >
                        <div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-islamic-cream dark:border-gray-700">
                            <Globe className="w-5 h-5 text-primary flex-shrink-0" />
                            <span className="text-sm font-medium">3 Languages</span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-islamic-cream dark:border-gray-700">
                            <Zap className="w-5 h-5 text-primary flex-shrink-0" />
                            <span className="text-sm font-medium">AI-Powered</span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-islamic-cream dark:border-gray-700">
                            <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                            <span className="text-sm font-medium">Authentic Sources</span>
                        </div>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
                    >
                        <Button
                            onClick={onGetStarted}
                            size="lg"
                            className="btn-islamic text-lg px-8 py-6 h-auto"
                        >
                            <Sparkles className="w-5 h-5 mr-2" />
                            Get Started Free
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="text-lg px-8 py-6 h-auto"
                            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            View Pricing
                        </Button>
                    </motion.div>

                    {/* Social Proof */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="mt-12 text-sm text-islamic-dark/60 dark:text-gray-400"
                    >
                        <p>Trusted by students of knowledge worldwide</p>
                    </motion.div>
                </div>
            </div>

            {/* Bottom wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    className="w-full h-16 fill-white dark:fill-gray-900"
                >
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" />
                    <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" />
                    <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" />
                </svg>
            </div>
        </section>
    );
}
