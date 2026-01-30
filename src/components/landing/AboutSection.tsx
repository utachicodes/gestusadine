
import React from 'react';
import { Book, GraduationCap, Heart, Map } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block relative">
            About <span className="text-gradient">Dr. Ahmed Lo</span>
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-islamic-gold rounded-full"></span>
          </h2>
          <p className="text-lg text-islamic-dark/70 max-w-2xl mx-auto">
            A journey of knowledge, dedication, and service to the Islamic community
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-islamic-pattern opacity-10 rounded-full"></div>
            <div className="islamic-border rounded-xl overflow-hidden h-full">
              <div className="bg-white p-8 h-full">
                <div className="flex items-center mb-6">
                  <GraduationCap className="w-8 h-8 text-islamic-green mr-4" />
                  <h3 className="text-xl font-bold">Early Life and Education</h3>
                </div>
                <p className="mb-4">
                  Dr. Ahmed Lo was born in 1955 in Tawfekh near Touba. He memorized the Quran in Ndame, in the Louga region of Senegal. He learned basic Islamic knowledge first in Touba and then in Saint-Louis.
                </p>
                <p>
                  During this time, he developed an excellent level in Arabic, allowing him to write beautiful poems. However, he felt the need to learn more about his religion despite financial constraints.
                </p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-islamic-pattern opacity-10 rounded-full"></div>
            <div className="islamic-border rounded-xl overflow-hidden h-full">
              <div className="bg-white p-8 h-full">
                <div className="flex items-center mb-6">
                  <Map className="w-8 h-8 text-islamic-green mr-4" />
                  <h3 className="text-xl font-bold">Journey for Knowledge</h3>
                </div>
                <p className="mb-4">
                  An adventurer in search of knowledge, he traveled with friends through Mali, Côte d'Ivoire, Benin, Nigeria, and Egypt, where he worked briefly to fund his pilgrimage to Umrah in Saudi Arabia in 1980.
                </p>
                <p>
                  Unable to enroll in university, he decided to write a poem about his goal of studying Islam, which he presented to the rector of the University of Medina, Dr. Abdullah Zaïd, after a prayer.
                </p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-islamic-pattern opacity-10 rounded-full"></div>
            <div className="islamic-border rounded-xl overflow-hidden h-full">
              <div className="bg-white p-8 h-full">
                <div className="flex items-center mb-6">
                  <Book className="w-8 h-8 text-islamic-green mr-4" />
                  <h3 className="text-xl font-bold">Academic Achievements</h3>
                </div>
                <p className="mb-4">
                  Dr. Lo began his studies in 1980-81 at the age of 25, passing the entrance exam to secondary school in three months, and obtaining his baccalaureate three years later.
                </p>
                <p>
                  He was selected for his oral examination by a university jury to pursue his doctorate, focusing on the sensitive topic of "The Sanctification of Saints in Light of Sufi Doctrine."
                </p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-islamic-pattern opacity-10 rounded-full"></div>
            <div className="islamic-border rounded-xl overflow-hidden h-full">
              <div className="bg-white p-8 h-full">
                <div className="flex items-center mb-6">
                  <Heart className="w-8 h-8 text-islamic-green mr-4" />
                  <h3 className="text-xl font-bold">Community Involvement</h3>
                </div>
                <p className="mb-4">
                  Dr. Lo has been involved in various community outreach programs, helping to educate individuals about Islamic teachings and practices.
                </p>
                <p>
                  He has also successfully resolved sensitive diplomatic issues through personal initiatives, without expecting any compensation from the Senegalese state.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
