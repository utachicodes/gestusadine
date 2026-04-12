import * as React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, Library, Sparkles, MessageSquare } from 'lucide-react';

const AboutSection = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const windowScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const windowRotate = useTransform(scrollYProgress, [0, 0.5], [5, 0]);
  const windowOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative py-32 bg-premium-gray overflow-hidden"
    >
      <div className="container mx-auto px-4 lg:px-8">
        {/* Webflow Style Sticky Layout */}
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          <div className="lg:w-1/3 lg:sticky lg:top-40 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-600 mb-6">the machine</h3>
              <h2 className="text-5xl md:text-6xl font-black text-slate-950 tracking-tighter leading-[0.9] mb-8">
                Synthesized <br />
                <span className="text-slate-300">Wisdom.</span>
              </h2>
              <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10">
                Witness the power of organized knowledge. Every pixel in our ecosystem is designed to minimize friction and maximize clarity.
              </p>

              <div className="flex flex-col gap-5">
                {[
                  { icon: Library, label: "5k+ Scholarly Documents" },
                  { icon: Sparkles, label: "AI RAG-assisted Research" },
                  { icon: MessageSquare, label: "Multi-Agent Scholarly Council" }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    className="flex items-center gap-4 group cursor-default"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-brand-600 group-hover:scale-110 transition-transform shadow-sm">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-900 uppercase tracking-widest">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:w-2/3 w-full">
            <motion.div 
              style={{ scale: windowScale, rotateX: windowRotate, opacity: windowOpacity }}
              className="mac-window w-full perspective-[1000px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)]"
            >
              {/* Window Header */}
              <div className="mac-window-header">
                <div className="mac-dot bg-red-400" />
                <div className="mac-dot bg-amber-400" />
                <div className="mac-dot bg-emerald-400" />
                <div className="ml-6 flex-1 h-7 bg-slate-100 rounded-lg flex items-center px-4 gap-3">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <div className="w-32 h-2 bg-slate-200 rounded-full" />
                </div>
                <div className="flex items-center gap-4 text-slate-300">
                  <div className="w-px h-6 bg-slate-100" />
                  <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-white" />
                </div>
              </div>

              {/* Enhanced Window Content */}
              <div className="flex h-[600px] bg-white">
                <div className="hidden md:flex w-72 border-r border-slate-100 p-8 flex-col gap-10 bg-slate-50/20">
                   <div className="space-y-6">
                     <div className="h-2.5 w-16 bg-brand-600/20 rounded-full" />
                     <div className="space-y-3">
                       {[1,2,3,4,5].map(i => (
                         <div key={i} className={`h-10 w-full rounded-xl flex items-center px-4 gap-3 ${i === 1 ? 'bg-white shadow-sm border border-slate-100 ring-2 ring-brand-600/5' : 'bg-transparent'}`}>
                            <div className={`w-4 h-4 rounded-md ${i === 1 ? 'bg-brand-600' : 'bg-slate-200'}`} />
                            <div className={`h-2.5 w-24 rounded-full ${i === 1 ? 'bg-slate-800' : 'bg-slate-200'}`} />
                         </div>
                       ))}
                     </div>
                   </div>
                </div>

                <div className="flex-1 p-10 overflow-hidden relative">
                   <div className="flex items-center justify-between mb-16">
                     <div className="space-y-3">
                       <div className="h-6 w-64 bg-slate-950 rounded-lg" />
                       <div className="h-2.5 w-40 bg-slate-200 rounded-full" />
                     </div>
                     <div className="flex gap-3">
                       <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                          <Library className="w-6 h-6" />
                       </div>
                       <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-xl shadow-slate-200">
                          <Sparkles className="w-6 h-6" />
                       </div>
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {[1,2,3,4,5,6].map(i => (
                       <motion.div 
                         key={i}
                         initial={{ opacity: 0, y: 20 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.2 * (i % 3) }}
                         className="p-6 rounded-[2rem] border border-slate-100 bg-white hover:border-brand-200 transition-all cursor-pointer shadow-sm group"
                       >
                         <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                           <MessageSquare className="w-6 h-6 text-brand-500" />
                         </div>
                         <div className="h-3 w-3/4 bg-slate-900 rounded-full mb-3" />
                         <div className="h-2 w-full bg-slate-100 rounded-full" />
                         <div className="h-2 w-1/2 bg-slate-100 rounded-full mt-2" />
                       </motion.div>
                     ))}
                   </div>

                   {/* Absolute Shader Accents in Mockup */}
                   <div className="absolute top-1/2 right-1/2 -translate-y-1/2 translate-x-1/2 opacity-[0.03] pointer-events-none scale-[3]">
                      <Sparkles className="w-full h-full text-brand-600 rotate-45" />
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
