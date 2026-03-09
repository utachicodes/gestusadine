import * as React from 'react';
import AboutSection from '@/components/landing/AboutSection';

export default function About() {
    return (
        <div className="flex-1">
            {/* Hero */}
            <section className="relative pt-20 pb-12 overflow-hidden">
                <div className="absolute inset-0 bg-warm-base -z-10" />

                <div className="container relative z-10 px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-deep-green mb-5 tracking-tight">
                            Why GëstuSaDine exists
                        </h1>
                        <p className="text-lg text-deep-green/55 leading-relaxed">
                            Muslims in West Africa deserve better than random internet fatwas. We built a platform that checks every answer against multiple scholarly perspectives before showing it to you.
                        </p>
                    </div>
                </div>
            </section>

            <AboutSection />

            {/* How the AI Council Works */}
            <section className="py-20 relative overflow-hidden bg-warm-sand/20 border-t border-warm-sand/60">
                <div className="container px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="glass-card-warm p-7 rounded-2xl">
                                <h2 className="text-xl font-serif font-bold text-deep-green mb-4">The problem</h2>
                                <p className="text-deep-green/55 leading-relaxed text-sm">
                                    Most Islamic Q&A apps give you one answer from one source. You don't know if it's Hanafi or Maliki, you don't see the evidence, and you can't tell if the AI just made it up.
                                </p>
                            </div>
                            <div className="glass-card-warm p-7 rounded-2xl">
                                <h2 className="text-xl font-serif font-bold text-deep-green mb-4">Our approach</h2>
                                <p className="text-deep-green/55 leading-relaxed text-sm">
                                    We run every question through four specialized AI agents — each with a different focus — then a synthesis engine combines their answers into a clear, referenced response. If the AI isn't sure, it says so.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
