import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, Twitter, Instagram } from "lucide-react";
import IslamicPattern from "@/components/effects/IslamicPattern";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-sacred-dark pt-32 pb-16 overflow-hidden border-t border-white/5">
      <IslamicPattern opacity={0.02} className="scale-125" />
      
      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-10">
            <img src="/logofinal.png" alt="Logo" className="h-6 w-fit brightness-0 invert opacity-40" />
            <p className="font-serif-premium text-xl text-white/50 italic leading-relaxed max-w-xs">
              Knowledge is not merely information, it is a light that illuminates the soul.
            </p>
            <div className="flex gap-6">
               {[Twitter, Instagram, Mail].map((Icon, idx) => (
                  <a key={idx} href="#" className="text-white/20 hover:text-accent transition-colors">
                     <Icon className="w-5 h-5" />
                  </a>
               ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-accent mb-12 italic opacity-40">The Legacy</h4>
            <div className="flex flex-col gap-6">
              {['Home', 'Mission', 'Help Center', 'Contact'].map(item => (
                <Link key={item} to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-sm font-bold text-white/30 hover:text-white transition-colors w-fit tracking-widest uppercase">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-accent mb-12 italic opacity-40">Ecosystem</h4>
            <div className="flex flex-col gap-6">
              {['Library', 'Podcasts', 'Community', 'Council'].map(item => (
                <Link key={item} to={`/${item.toLowerCase()}`} className="text-sm font-bold text-white/30 hover:text-white transition-colors w-fit tracking-widest uppercase">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Journal Signup */}
          <div className="flex flex-col gap-10">
             <div className="p-10 border border-white/5 bg-white/[0.01]">
                <p className="font-serif-premium text-lg text-white mb-6 italic">The Gëstu Journal</p>
                <div className="flex flex-col gap-4">
                   <input 
                    type="email" 
                    placeholder="Sacred Email" 
                    className="bg-transparent border-b border-white/10 py-3 text-xs text-white focus:border-accent outline-none w-full transition-colors"
                   />
                   <button className="flex items-center gap-3 text-accent mt-4 group">
                      <span className="text-[10px] font-black uppercase tracking-widest">Subscribe</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                   </button>
                </div>
             </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] font-medium text-white/10 uppercase tracking-widest-xl">
            &copy; {currentYear} GëstuSaDine Platform. ALL RIGHTS RESERVED.
          </p>
          
          <div className="flex gap-12">
            {['Privacy', 'Terms', 'Security'].map(item => (
              <Link key={item} to={`/${item.toLowerCase()}`} className="text-[9px] font-black uppercase tracking-[0.3em] text-white/10 hover:text-white transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
