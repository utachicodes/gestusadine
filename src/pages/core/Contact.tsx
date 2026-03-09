import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
        setTimeout(() => {
            toast({
                title: 'Message sent',
                description: "We'll get back to you within 24 hours.",
            });
            setFormData({ name: '', email: '', message: '' });
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <div className="flex-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-warm-base -z-10" />

            <div className="container relative z-10 py-20 px-4 max-w-5xl">
                <div className="text-center mb-14">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-deep-green mb-4 tracking-tight">
                        Get in touch
                    </h1>
                    <p className="text-base text-deep-green/55 max-w-lg mx-auto">
                        Have a question, suggestion, or want to report an issue? We'd like to hear from you.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-4">
                        {[
                            { icon: Phone, label: 'Phone', value: '+221 76 577 08 10', href: 'tel:+221765770810' },
                            { icon: Mail, label: 'Email', value: 'contact@gestusadine.com', href: 'mailto:contact@gestusadine.com' },
                            { icon: MapPin, label: 'Location', value: 'Dakar, Senegal', href: undefined },
                        ].map((item) => (
                            <div key={item.label} className="glass-card-warm p-5 rounded-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-warm-sand/50 border border-warm-sand rounded-xl text-warm-gold">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-deep-green/35 mb-0.5">{item.label}</p>
                                        {item.href ? (
                                            <a href={item.href} className="text-base font-semibold text-deep-green hover:text-warm-gold transition-colors">
                                                {item.value}
                                            </a>
                                        ) : (
                                            <p className="text-base font-semibold text-deep-green">{item.value}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact Form */}
                    <div className="glass-card-warm p-7 rounded-2xl">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-deep-green/40 mb-1.5 block">
                                    Name
                                </label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Your name"
                                    className="bg-warm-sand/20 border-warm-sand text-deep-green placeholder:text-deep-green/30 h-11 rounded-xl focus:ring-warm-gold/20 focus:border-warm-gold/50"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-deep-green/40 mb-1.5 block">
                                    Email
                                </label>
                                <Input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="you@example.com"
                                    className="bg-warm-sand/20 border-warm-sand text-deep-green placeholder:text-deep-green/30 h-11 rounded-xl focus:ring-warm-gold/20 focus:border-warm-gold/50"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-deep-green/40 mb-1.5 block">
                                    Message
                                </label>
                                <textarea
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="What's on your mind?"
                                    className="w-full min-h-[120px] p-3.5 rounded-xl border border-warm-sand bg-warm-sand/20 text-deep-green placeholder:text-deep-green/30 resize-none focus:outline-none focus:ring-2 focus:ring-warm-gold/20 focus:border-warm-gold/50 transition-all text-sm"
                                />
                            </div>

                            <button type="submit" disabled={isSubmitting} className="w-full btn-spiritual py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                                {isSubmitting ? 'Sending...' : 'Send message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
