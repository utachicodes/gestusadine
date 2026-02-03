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
        <div className="flex-1 bg-deep-slate relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full bg-mesh-cyan opacity-5 pointer-events-none" />
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-cyan-glow/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="container relative z-10 py-24 px-4 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Header */}
                    <div className="text-center mb-20">
                        <p className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.4em] text-cyan-glow mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow mr-3 animate-pulse" />
                            Direct Channel
                        </p>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
                            Connect with <span className="text-glow-cyan">Us</span>
                        </h1>
                        <p className="text-xl text-white/40 max-w-2xl mx-auto font-medium">
                            Our team of scholars and technologists is ready to assist you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div className="glass-card-premium p-8 group border border-white/5 transition-all hover:border-cyan-glow/20">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-cyan-glow group-hover:bg-cyan-glow/5 transition-all">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Support Line</p>
                                        <a href="tel:+221765770810" className="text-lg font-black text-white hover:text-cyan-glow transition-colors">
                                            +221 76 577 08 10
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card-premium p-8 group border border-white/5 transition-all hover:border-cyan-glow/20">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-cyan-glow group-hover:bg-cyan-glow/5 transition-all">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Inquiries</p>
                                        <a href="mailto:contact@gestusadine.com" className="text-lg font-black text-white hover:text-cyan-glow transition-colors">
                                            contact@gestusadine.com
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card-premium p-8 group border border-white/5 transition-all hover:border-cyan-glow/20">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-cyan-glow group-hover:bg-cyan-glow/5 transition-all">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Location</p>
                                        <p className="text-lg font-black text-white">Dakar, Senegal</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="glass-card-premium p-10 border border-white/5">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 block">
                                        Full Name
                                    </label>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="John Doe"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-14 rounded-xl focus:ring-cyan-glow/20 focus:border-cyan-glow/50"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 block">
                                        Email Address
                                    </label>
                                    <Input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="john@example.com"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-14 rounded-xl focus:ring-cyan-glow/20 focus:border-cyan-glow/50"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 block">
                                        Your Message
                                    </label>
                                    <textarea
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="How can we assist you in your spiritual journey?"
                                        className="w-full min-h-[160px] p-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/20 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-glow/20 focus:border-cyan-glow/50 transition-all font-medium"
                                    />
                                </div>

                                <button type="submit" disabled={isSubmitting} className="w-full btn-premium py-5 text-sm">
                                    {isSubmitting ? 'Transmitting...' : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
