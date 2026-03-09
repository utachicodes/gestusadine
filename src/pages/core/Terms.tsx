export default function Terms() {
    return (
        <div className="flex-1 relative overflow-hidden min-h-screen">
            <div className="absolute inset-0 bg-warm-base -z-10" />

            <div className="container relative z-10 py-20 px-4 max-w-3xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-deep-green mb-4 tracking-tight">
                        Terms of Service
                    </h1>
                    <p className="text-deep-green/45 text-sm">
                        Last updated: January 16, 2026
                    </p>
                </div>

                <div className="glass-card-warm p-8 md:p-10 rounded-2xl space-y-8 text-sm text-deep-green/60 leading-relaxed">
                    <section>
                        <h2 className="text-base font-bold text-deep-green mb-3">1. Agreement</h2>
                        <p>
                            By using GëstuSaDine, you agree to these terms. The platform provides AI-generated Islamic guidance and educational content. Use it respectfully and in good faith.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-deep-green mb-3">2. Intellectual property</h2>
                        <p>
                            The platform's code, design, and AI-generated content are owned by GëstuSaDine. You may not copy, redistribute, or scrape the platform's content without permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-deep-green mb-3">3. Important disclaimer</h2>
                        <p className="italic">
                            GëstuSaDine is an educational tool, not a replacement for a qualified scholar. For major life decisions (marriage, divorce, inheritance, etc.), please consult a local scholar directly. The AI can make mistakes.
                        </p>
                    </section>

                    <section className="pt-6 border-t border-warm-sand/60">
                        <p>
                            Legal questions? Contact{' '}
                            <a href="mailto:legal@gestusadine.com" className="text-warm-gold hover:underline">
                                legal@gestusadine.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
