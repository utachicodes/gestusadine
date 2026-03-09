export default function Privacy() {
    return (
        <div className="flex-1 relative overflow-hidden min-h-screen">
            <div className="absolute inset-0 bg-warm-base -z-10" />

            <div className="container relative z-10 py-20 px-4 max-w-3xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-deep-green mb-4 tracking-tight">
                        Privacy Policy
                    </h1>
                    <p className="text-deep-green/45 text-sm">
                        Last updated: January 16, 2026
                    </p>
                </div>

                <div className="glass-card-warm p-8 md:p-10 rounded-2xl space-y-8 text-sm text-deep-green/60 leading-relaxed">
                    <section>
                        <h2 className="text-base font-bold text-deep-green mb-3">1. What we collect</h2>
                        <p>
                            When you create an account, we collect your name, email address, and optional profile info. We also store your chat messages and basic usage data (pages visited, features used) to improve the platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-deep-green mb-3">2. How we use it</h2>
                        <ul className="space-y-2 list-disc list-inside">
                            <li>Generating AI responses to your Islamic questions</li>
                            <li>Showing you relevant daily content and recommendations</li>
                            <li>Processing subscriptions and payments</li>
                            <li>Sending platform updates (you can opt out)</li>
                            <li>Fixing bugs and improving the service</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-deep-green mb-3">3. Security</h2>
                        <p>
                            Your data is encrypted in transit and at rest. We use Firebase Authentication for identity and Firestore security rules to ensure users can only access their own data. We don't sell your data to third parties.
                        </p>
                    </section>

                    <section className="pt-6 border-t border-warm-sand/60">
                        <p>
                            Questions about your data? Email us at{' '}
                            <a href="mailto:privacy@gestusadine.com" className="text-warm-gold hover:underline">
                                privacy@gestusadine.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
