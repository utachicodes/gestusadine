import { motion } from 'framer-motion';

export default function Privacy() {
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
                            Privacy Policy
                        </h1>
                        <p className="text-muted-foreground">
                            Last updated: January 16, 2026
                        </p>
                    </div>

                    <div className="islamic-card p-8 space-y-6 prose prose-sm max-w-none text-foreground">
                        <section>
                            <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
                            <p className="text-muted-foreground">
                                We collect information you provide when creating an account: name, email address, and optional profile information.
                                We also collect your chat messages and usage data to improve our service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>To provide and improve our AI-powered Islamic guidance service</li>
                                <li>To personalize your experience</li>
                                <li>To process subscription payments</li>
                                <li>To send important updates and notifications</li>
                                <li>To ensure the security and integrity of our platform</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">3. Data Security</h2>
                            <p className="text-muted-foreground">
                                We use industry-standard encryption and security measures to protect your data.
                                All sensitive information is encrypted both in transit and at rest.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">4. Third-Party Services</h2>
                            <p className="text-muted-foreground">
                                We use trusted third-party services including Firebase for authentication and database,
                                and payment processors for handling subscriptions. These services have their own privacy policies.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">5. Your Rights</h2>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>Access your personal data</li>
                                <li>Request correction of inaccurate data</li>
                                <li>Request deletion of your account and data</li>
                                <li>Export your data</li>
                                <li>Opt-out of marketing communications</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">6. Data Retention</h2>
                            <p className="text-muted-foreground">
                                We retain your data for as long as your account is active. Upon account deletion,
                                we will remove your personal data within 30 days, except where required by law.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">7. Children's Privacy</h2>
                            <p className="text-muted-foreground">
                                Our service is not directed to children under 13. We do not knowingly collect
                                personal information from children under 13.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">8. Changes to This Policy</h2>
                            <p className="text-muted-foreground">
                                We may update this privacy policy from time to time. We will notify you of
                                significant changes via email or through our platform.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-3">9.Contact Us</h2>
                            <p className="text-muted-foreground">
                                If you have questions about this privacy policy, please contact us at:{' '}
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
