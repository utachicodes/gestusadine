import React from 'react';
import HeroSection from '@/components/landing/HeroSection';

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F0] text-stone-900">
      <main className="flex-grow">
        <HeroSection />
      </main>
    </div>
  );
};

export default Index;
