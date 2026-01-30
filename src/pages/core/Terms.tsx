import { motion } from 'framer-motion';

export default function Terms() {
    return (
        <div className="flex-1 overflow-y-auto">
            <div className="container py-12 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Terms of Service
                        </h1>
                        <p className="text-muted-foreground">
                            Last updated: January 16, 2026
                        </p>
                    </div>

                    <div className="islamic-card p-8 space-y-6 prose prose-sm max-w-none text-foreground">
                        <section>
                            <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
                            <p className="text-muted-foreground">
                                By accessing and using GëstuSaDine, you accept and agree to be bound by these Terms of Service.
                                If you do not agree to these terms, please do not use our service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">2. Description of Service</h2>
                            <p className="text-muted-foreground">
                                GëstuSaDine provides AI-powered Islamic guidance based on the Quran, authentic Hadith, and recognized Islamic scholarship.
                                Our service is for informational and educational purposes only.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">3. User Responsibilities</h2>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>You must be at least 13 years old to use our service</li>
                                <li>You are responsible for maintaining the confidentiality of your account</li>
                                <li>You agree to use the service in accordance with Islamic principles</li>
                                <li>You will not misuse or attempt to harm the service</li>
                                <li>You will not share false or misleading information</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">4. Subscriptions and Payments</h2>
                            <p className="text-muted-foreground">
                                Subscription fees are billed monthly in advance. You may cancel your subscription at any time,
                                and you will retain access until the end of your billing period. Refunds are provided on a case-by-case basis.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">5. Intellectual Property</h2>
                            <p className="text-muted-foreground">
                                All content provided by GëstuSaDine, including responses, templates, and educational materials,
                                is protected by copyright. You may use this content for personal, non-commercial purposes only.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">6. Disclaimer</h2>
                            <p className="text-muted-foreground">
                                While we strive for accuracy, GëstuSaDine is an AI-powered tool and should not replace consultation
                                with qualified Islamic scholars for important religious matters. Always verify important rulings with
                                knowledgeable scholars.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">7. Limitation of Liability</h2>
                            <p className="text-muted-foreground">
                                GëstuSaDine is provided "as is" without warranties. We are not liable for any decisions made
                                based on information from our service. Use at your own discretion.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">8. Account Termination</h2>
                            <p className="text-muted-foreground">
                                We reserve the right to suspend or terminate accounts that violate these terms or engage in
                                harmful behavior. You may delete your account at any time from your account settings.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">9. Changes to Terms</h2>
                            <p className="text-muted-foreground">
                                We may update these terms from time to time. Continued use of our service after changes
                                constitutes acceptance of the new terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">10. Contact</h2>
                            <p className="text-muted-foreground">
                                For questions about these terms, contact us at:{' '}
                                <a href="tel:+221765770810" className="text-primary hover:underline">
                                    +221 76 577 08 10
                                </a>
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
