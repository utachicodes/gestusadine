import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            toast({
                title: 'Message Sent!',
                description: 'We\'ll get back to you within 24 hours.',
            });
            setFormData({ name: '', email: '', message: '' });
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="container py-12 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    <div className="text-center mb-12">
                        <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-muted-foreground mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                            GET IN TOUCH
                        </p>
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Contact <span className="text-gradient">Us</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Have questions? We're here to help
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Contact Info */}
                        <div className="space-y-6">

                            <div className="islamic-card p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-accent/10 rounded-lg">
                                        <Phone className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                                        <a href="tel:+221765770810" className="text-muted-foreground hover:text-primary">
                                            +221 76 577 08 10
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="islamic-card p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-secondary/10 rounded-lg">
                                        <MapPin className="w-5 h-5 text-secondary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Location</h3>
                                        <p className="text-muted-foreground">
                                            Dakar, Senegal
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="islamic-card p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">
                                        Name
                                    </label>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Your name"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">
                                        Email
                                    </label>
                                    <Input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">
                                        Message
                                    </label>
                                    <textarea
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="How can we help?"
                                        className="w-full min-h-[120px] p-3 rounded-lg border border-border bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <Button type="submit" disabled={isSubmitting} className="w-full btn-islamic">
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </Button>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
