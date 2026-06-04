import React, { useState } from 'react';
import { Mail, Phone, MapPin, type LucideIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useTr, type Loc } from '@/lib/i18n';

export default function Contact() {
    const tr = useTr();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Interim delivery via the visitor's mail client until the Convex `contact` mutation lands.
        const subject = encodeURIComponent(`Contact from ${formData.name || 'a visitor'}`);
        const body = encodeURIComponent(`${formData.message}\n\nFrom: ${formData.name} <${formData.email}>`);
        window.location.href = `mailto:contact@gestusadine.com?subject=${subject}&body=${body}`;
        toast({
            title: tr({ en: 'Opening your email app', fr: 'Ouverture de votre messagerie' }),
            description: tr({
                en: "We've drafted your message to contact@gestusadine.com.",
                fr: 'Nous avons préparé votre message à contact@gestusadine.com.',
            }),
        });
        setFormData({ name: '', email: '', message: '' });
        setIsSubmitting(false);
    };

    const info: { icon: LucideIcon; label: Loc; value: string; href?: string }[] = [
        { icon: Phone, label: { en: 'Phone', fr: 'Téléphone' }, value: '+221 76 577 08 10', href: 'tel:+221765770810' },
        { icon: Mail, label: { en: 'Email', fr: 'E-mail' }, value: 'contact@gestusadine.com', href: 'mailto:contact@gestusadine.com' },
        { icon: MapPin, label: { en: 'Location', fr: 'Adresse' }, value: tr({ en: 'Dakar, Senegal', fr: 'Dakar, Sénégal' }) },
    ];

    return (
        <div className="flex-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-warm-base -z-10" />

            <div className="container relative z-10 py-20 px-4 max-w-5xl">
                <div className="text-center mb-14">
                    <h1 className="text-4xl md:text-5xl font-bold text-deep-green mb-4 tracking-tight">
                        {tr({ en: 'Get in touch', fr: 'Contactez-nous' })}
                    </h1>
                    <p className="text-base text-deep-green/55 max-w-lg mx-auto">
                        {tr({
                            en: 'Have a question, suggestion, or want to report an issue? We’d like to hear from you.',
                            fr: 'Une question, une suggestion ou un problème à signaler ? Nous serions ravis de vous lire.',
                        })}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-4">
                        {info.map((item) => (
                            <div key={item.label.en} className="glass-card-warm p-5 rounded-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-warm-sand/50 border border-warm-sand rounded-xl text-warm-gold">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-deep-green/35 mb-0.5">{tr(item.label)}</p>
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
                                    {tr({ en: 'Name', fr: 'Nom' })}
                                </label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder={tr({ en: 'Your name', fr: 'Votre nom' })}
                                    className="bg-warm-sand/20 border-warm-sand text-deep-green placeholder:text-deep-green/30 h-11 rounded-xl focus:ring-warm-gold/20 focus:border-warm-gold/50"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-deep-green/40 mb-1.5 block">
                                    {tr({ en: 'Email', fr: 'E-mail' })}
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
                                    {tr({ en: 'Message', fr: 'Message' })}
                                </label>
                                <textarea
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder={tr({ en: "What's on your mind?", fr: 'Qu’avez-vous en tête ?' })}
                                    className="w-full min-h-[120px] p-3.5 rounded-xl border border-warm-sand bg-warm-sand/20 text-deep-green placeholder:text-deep-green/30 resize-none focus:outline-none focus:ring-2 focus:ring-warm-gold/20 focus:border-warm-gold/50 transition-all text-sm"
                                />
                            </div>

                            <button type="submit" disabled={isSubmitting} className="w-full btn-spiritual py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                                {isSubmitting ? tr({ en: 'Sending…', fr: 'Envoi…' }) : tr({ en: 'Send message', fr: 'Envoyer le message' })}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
