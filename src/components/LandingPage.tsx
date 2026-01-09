import React from 'react';
import { OptInForm } from './OptInForm';
import { Button } from './Button';

interface LandingPageProps {
  onOptInSuccess: (data: { firstName: string; email: string }) => void;
}

const ImageSlider: React.FC = () => {
  const images = [
    "https://kjudshqjrtaqwqaxuldr.supabase.co/storage/v1/object/public/Team%20und%20Buero%20Bilder/Team%20Bild.webp",
    "https://kjudshqjrtaqwqaxuldr.supabase.co/storage/v1/object/public/Team%20und%20Buero%20Bilder/Buero.webp"
  ];
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full max-w-sm mx-auto md:max-w-md">
      {/* Background Accent - Purple Card behind */}
      <div className="absolute top-4 -right-4 w-full h-full bg-[#e6d0f3] rounded-[2.5rem] -z-10"></div>
      
      {/* Image Frame */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] shadow-lg bg-gray-200">
        {images.map((src, index) => (
          <img 
            key={src}
            src={src}
            alt={index === 0 ? "Team Einfach Ernährung" : "Unser Büro in Heppenheim"} 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-8 bg-[#824ca7]' : 'w-3 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Bild ${index + 1} anzeigen`}
          />
        ))}
      </div>
    </div>
  );
};

const TestimonialCard: React.FC<{
  headline: string;
  quote: string;
  name: string;
  imageSrc?: string;
  before: string;
  after: string;
  result: string;
}> = ({ headline, quote, name, imageSrc, before, after, result }) => (
  <div className="flex flex-col items-center bg-white rounded-[2rem] p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
    {/* Stars with Gradient */}
    <div className="flex gap-1 mb-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className="w-5 h-5" viewBox="0 0 24 24" fill="url(#starGradient)">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>

    {/* Headline */}
    <h4 className="text-lg font-bold text-[#282828] mb-4 text-center">{headline}</h4>

    {/* Quote */}
    <p className="text-gray-600 text-center italic mb-6 leading-relaxed flex-grow">
      "{quote}"
    </p>

    {/* Profile */}
    <div className="flex flex-col items-center mb-6">
      <div className="w-16 h-16 bg-gray-200 rounded-full mb-3 overflow-hidden border-2 border-white shadow-sm">
        <img 
            src={imageSrc || `https://api.dicebear.com/9.x/avataaars/svg?seed=${name}&backgroundColor=e6d0f3`} 
            alt={name} 
            className="w-full h-full object-cover" 
        />
      </div>
      <span className="font-semibold text-[#824ca7]">{name}</span>
    </div>

    {/* Stats Box */}
    <div className="w-full bg-white rounded-2xl p-5 shadow-[0_0_15px_rgba(0,0,0,0.05)] border border-gray-100">
      {/* Row 1: Vorher (Red) */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
          <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">VORHER</span>
        </div>
        <span className="font-bold text-gray-800 tabular-nums">{before}</span>
      </div>

      {/* Row 2: Nachher (Green) */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
          <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">NACHHER</span>
        </div>
        <span className="font-bold text-gray-800 tabular-nums">{after}</span>
      </div>

      <div className="h-px bg-gray-100 my-3"></div>

      {/* Row 3: Ergebnis (Yellow/Gold) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
          <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">ERGEBNIS</span>
        </div>
        <span className="font-extrabold text-[#824ca7] text-sm md:text-base leading-snug pl-1">{result}</span>
      </div>
    </div>
  </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onOptInSuccess }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-4 md:pt-12 pb-12 md:pb-20 px-4 md:px-8 lg:pt-20 lg:pb-32 overflow-hidden bg-[#f9f9f9]">
        {/* Animation Styles */}
        <style>{`
          @keyframes float-1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          @keyframes float-2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-30px, 40px) scale(1.05); }
          }
          @keyframes fly-across {
            0% { transform: translate(-10vw, 10vh) rotate(0deg); }
            100% { transform: translate(100vw, -20vh) rotate(180deg); }
          }
          @keyframes fly-across-reverse {
            0% { transform: translate(100vw, 40vh) rotate(0deg); }
            100% { transform: translate(-10vw, -10vh) rotate(-180deg); }
          }
        `}</style>

        {/* Background Animated Balls */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large Floating Blobs (Background base - various colors) */}
          <div className="absolute top-[5%] left-[10%] w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-[float-1_20s_ease-in-out_infinite]"></div>
          <div className="absolute top-[15%] right-[15%] w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-[float-2_25s_ease-in-out_infinite_2s]"></div>
          <div className="absolute -bottom-10 left-[20%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-[float-1_22s_ease-in-out_infinite_5s]"></div>
          <div className="absolute bottom-[20%] right-[5%] w-64 h-64 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-[float-2_18s_ease-in-out_infinite_1s]"></div>

          {/* Smaller Defined Bubbles (Foreground accents - colorful & transparent) */}
          
          {/* Teal - Floating */}
          <div className="absolute top-[30%] left-[15%] w-12 h-12 bg-teal-400 rounded-full opacity-10 animate-[float-2_12s_ease-in-out_infinite]"></div>
          
          {/* Orange - Flying */}
          <div className="absolute top-[60%] left-[-10%] w-20 h-20 bg-orange-400 rounded-full opacity-5 animate-[fly-across_30s_linear_infinite]"></div>
          
          {/* Indigo - Flying Reverse */}
          <div className="absolute top-[20%] right-[-10%] w-16 h-16 bg-indigo-400 rounded-full opacity-5 animate-[fly-across-reverse_35s_linear_infinite_2s]"></div>
          
          {/* Green - Floating */}
          <div className="absolute bottom-[30%] left-[40%] w-14 h-14 bg-green-400 rounded-full opacity-10 animate-[float-1_15s_ease-in-out_infinite_1s]"></div>
          
          {/* Pink - Flying */}
          <div className="absolute top-[80%] left-[-5%] w-24 h-24 bg-pink-400 rounded-full opacity-5 animate-[fly-across_40s_linear_infinite_8s]"></div>
          
          {/* Cyan - Floating */}
          <div className="absolute top-[10%] right-[30%] w-10 h-10 bg-cyan-400 rounded-full opacity-10 animate-[float-2_14s_ease-in-out_infinite_4s]"></div>
          
          {/* Red - Flying Reverse */}
          <div className="absolute bottom-[10%] right-[-10%] w-18 h-18 bg-red-300 rounded-full opacity-5 animate-[fly-across-reverse_45s_linear_infinite_5s]"></div>
          
          {/* Lime - Floating */}
          <div className="absolute top-[45%] right-[20%] w-8 h-8 bg-lime-400 rounded-full opacity-10 animate-[float-1_10s_ease-in-out_infinite_2s]"></div>
          
          {/* Fuchsia - Flying */}
          <div className="absolute top-[25%] left-[-5%] w-12 h-12 bg-fuchsia-400 rounded-full opacity-5 animate-[fly-across_38s_linear_infinite_12s]"></div>
          
          {/* Amber - Floating */}
          <div className="absolute bottom-[40%] right-[40%] w-16 h-16 bg-amber-300 rounded-full opacity-10 animate-[float-2_16s_ease-in-out_infinite_3s]"></div>
        </div>

        {/* Existing Subtle Background Accent */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-purple-50 to-transparent -z-10 opacity-60 rounded-bl-[10rem]"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
            {/* Logo */}
            <img 
              src="https://kjudshqjrtaqwqaxuldr.supabase.co/storage/v1/object/public/Team%20und%20Buero%20Bilder/Logo%20EE%20GmbH.svg" 
              alt="EE GmbH Logo" 
              className="h-10 md:h-12 mb-2 md:mb-4"
            />

            {/* Primary Headline */}
            <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold leading-tight mb-3 tracking-tight [text-wrap:balance] bg-clip-text text-transparent bg-gradient-to-br from-[#4a1a6b] via-[#824ca7] to-[#b984d6]">
              Wie kann es sein, dass Frauen mit der experimentellen Methode täglich 400, 700 oder sogar über 1000 Kalorien mehr&nbsp;essen&nbsp;…
            </h1>
            
            {/* Subheadline */}
            <h2 className="text-xl md:text-2xl lg:text-2xl font-medium text-[#282828] mb-2 lg:mb-8 leading-snug [text-wrap:balance]">
               und trotzdem kein Körperfett zunehmen oder sogar Gewicht&nbsp;verlieren?
            </h2>

            <div className="hidden lg:block h-1 w-24 bg-[#824ca7] rounded-full mt-2 mb-8"></div>

            {/* Social Proof Section */}
            <div className="w-full max-w-lg lg:w-auto flex flex-row flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-2 mt-1 lg:mt-0 mb-4 lg:mb-0 bg-white/50 px-4 py-2.5 rounded-2xl border border-white/60 shadow-sm backdrop-blur-sm lg:bg-transparent lg:p-0 lg:border-0 lg:shadow-none">
               <div className="flex -space-x-3 shrink-0">
                  <img src="https://kjudshqjrtaqwqaxuldr.supabase.co/storage/v1/object/public/Testimonials%20und%20Kundenbilder/Profilbilder%20EXM%20LP/Profilbild%20Christine.webp" alt="Christine" className="w-9 h-9 rounded-full border-2 border-white object-cover" />
                  <img src="https://kjudshqjrtaqwqaxuldr.supabase.co/storage/v1/object/public/Testimonials%20und%20Kundenbilder/Profilbilder%20EXM%20LP/Profilbild%20VIVI.webp" alt="Vivi" className="w-9 h-9 rounded-full border-2 border-white object-cover" />
                  <img src="https://kjudshqjrtaqwqaxuldr.supabase.co/storage/v1/object/public/Testimonials%20und%20Kundenbilder/Profilbilder%20EXM%20LP/Profilbild%20Jessi.webp" alt="Jessi" className="w-9 h-9 rounded-full border-2 border-white object-cover" />
               </div>
               <div className="px-2.5 py-1 bg-[#d4f968] rounded-lg border border-[#c0e650] shadow-sm flex items-center shrink-0">
                  <span className="text-xs font-bold text-black leading-none whitespace-nowrap">+ 4.000</span>
               </div>
               <span className="text-sm font-medium text-gray-700 leading-snug">
                  Frauen haben ihre Kalorien schon erhöht 🔥
               </span>
            </div>
          </div>
          
          {/* ANCHOR ID HERE - added scroll-mt-24 for spacing */}
          <div id="opt-in" className="w-full flex justify-center lg:justify-end scroll-mt-24">
            <OptInForm onSuccess={onOptInSuccess} variant="hero" />
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 md:py-24 bg-white rounded-t-[3rem] md:rounded-t-[5rem] shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)] z-10">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          
          <h2 className="text-2xl md:text-3xl font-bold text-[#282828] mb-8">
            Was Dich erwartet:
          </h2>

          <div className="relative group">
            <div className="relative aspect-video w-[105%] -ml-[2.5%] md:w-[105%] md:-ml-[2.5%] bg-gray-100 rounded-3xl shadow-2xl overflow-hidden mb-12">
              <iframe 
                  src="https://player.vimeo.com/video/1152570593?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" 
                  frameBorder="0" 
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  title="LP EM Videotraining"
                  className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          </div>

          <div className="inline-block w-full md:w-auto">
            <Button href="#opt-in">
              Zugang sichern
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 md:px-8 bg-[#f9f9f9]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-16 text-[#282828]">
            Warum Du Dir den Zugang jetzt sichern solltest
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 - Purple */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center h-full border-2 border-[#824ca7]">
              <div className="w-16 h-16 bg-[#f3e8f9] rounded-full flex items-center justify-center mb-6 text-[#824ca7] text-3xl font-bold shadow-sm border border-[#e6d0f3]">
                1
              </div>
              <p className="text-gray-700 font-medium leading-relaxed">
                Du erfährst, ob eine <span className="font-bold text-[#824ca7]">Kalorienerhöhung</span> jetzt der richtige Schritt für Dich&nbsp;ist.
              </p>
            </div>

            {/* Card 2 - Blue */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center h-full border-2 border-blue-400 relative overflow-hidden">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-500 text-3xl font-bold shadow-sm border border-blue-100">
                2
              </div>
              <p className="text-gray-700 font-medium leading-relaxed">
                Du lernst den <span className="font-bold text-blue-500">Lagerfeuer-Effekt</span> kennen und verstehst, warum die meisten Frauen rund <span className="font-bold text-blue-500">800 Kalorien täglich mehr</span> essen können, ohne&nbsp;zuzunehmen.
              </p>
            </div>

            {/* Card 3 - Green */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center h-full border-2 border-emerald-400">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-emerald-500 text-3xl font-bold shadow-sm border border-emerald-100">
                3
              </div>
              <p className="text-gray-700 font-medium leading-relaxed">
                Du bekommst <span className="font-bold text-emerald-500">drei einfache Strategien</span>, die wir täglich im Coaching nutzen, mit denen Du Deine <span className="font-bold text-emerald-500">Kalorien noch heute erhöhen</span>&nbsp;kannst.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4 md:px-8 bg-white relative">
        {/* SVG Definition for Star Gradient */}
        <svg width="0" height="0" className="absolute pointer-events-none opacity-0">
          <defs>
            <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#824ca7" />
              <stop offset="100%" stopColor="#C0C0C0" />
            </linearGradient>
          </defs>
        </svg>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Testimonial 1 - Jessi */}
            <TestimonialCard 
              headline="Keine Light Produkte mehr"
              quote="Früher musste ich ständig irgendwelche Light-Produkte bestellen, damit ich für 1500 Kalorien irgendwie ‚viel‘ essen kann."
              name="Jessi"
              imageSrc="https://kjudshqjrtaqwqaxuldr.supabase.co/storage/v1/object/public/Testimonials%20und%20Kundenbilder/Profilbilder%20EXM%20LP/Profilbild%20Jessi.webp"
              before="1600 kcal"
              after="3100 kcal"
              result="Danach 5,5 kg verloren mit einem Defizit von 2000 kcal"
            />

            {/* Testimonial 2 - Christine */}
            <TestimonialCard 
              headline="Das ist nicht viel. Das ist normal"
              quote="Ich war der typische Skinny-Fat-Typ. Immer in irgendeiner Dauerdiät. Immer mit dem Gefühl, dass mein Körper halt einfach nicht mehr verträgt als 1600 Kalorien."
              name="Christine"
              imageSrc="https://kjudshqjrtaqwqaxuldr.supabase.co/storage/v1/object/public/Testimonials%20und%20Kundenbilder/Profilbilder%20EXM%20LP/Profilbild%20Christine.webp"
              before="1600 Kalorien"
              after="2400 Kalorien"
              result="Gleiches Gewicht, entspanntes Essverhalten und kein Tracking mehr"
            />

            {/* Testimonial 3 - Vivi */}
            <div className="md:col-span-2 lg:col-span-1">
                <TestimonialCard 
                headline="Ich dachte jahrelang, ich weiß alles"
                quote="Ich geb meinem Körper zum ersten Mal das, was er wirklich braucht und genau deswegen funktioniert es."
                name="Vivi"
                imageSrc="https://kjudshqjrtaqwqaxuldr.supabase.co/storage/v1/object/public/Testimonials%20und%20Kundenbilder/Profilbilder%20EXM%20LP/Profilbild%20VIVI.webp"
                before="1800"
                after="2600"
                result="3,5 kg in 6 Wochen verloren mit 800 Kalorien mehr"
                />
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Button href="#opt-in">
              Zugang erhalten
            </Button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 px-4 md:px-8 bg-[#f9f9f9]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          
          {/* Text Side - Mobile: Order 2 (Below), Desktop: Order 1 (Left) */}
          <div className="order-2 md:order-1 text-center md:text-left mt-6 md:mt-0">
            {/* Desktop Headline - Hidden on mobile */}
            <h3 className="hidden md:block text-3xl font-bold mb-6 text-[#282828]">Über uns</h3>
            
            <div className="text-gray-600 leading-relaxed text-lg flex flex-col gap-4">
                <p>
                    Wir sind die Einfach Ernährung GmbH und begleiten Menschen mit einem kritischen Essverhalten 🦄
                </p>
                <p>
                    Dazu gehören Essanfälle, ständiger Food Fokus und auch Phasen, in denen über längere Zeit zu wenig gegessen&nbsp;wird.
                </p>
                <p>
                    Unser Standort ist das Therapie- und Fortbildungszentrum in Heppenheim an der Bergstraße in Deutschland. Wir arbeiten mit Menschen aus fast ganz Europa zusammen 🇪🇺 🇩🇪 🇦🇹 🇨🇭, unter anderem aus Deutschland, Spanien, Frankreich, Italien, der Schweiz, Österreich und&nbsp;Dänemark.
                </p>
                <p>
                    Einfach Ernährung ist eine der wenigen Ernährungsberatungen im deutschsprachigen Raum, die sich vollständig auf kritisches Essverhalten spezialisiert&nbsp;hat.
                </p>
                <p className="font-medium text-[#824ca7]">
                    Lern uns doch einfach selbst kennen 💜
                </p>
            </div>
          </div>
          
          {/* Slider Side - Mobile: Order 1 (Top), Desktop: Order 2 (Right) */}
          <div className="order-1 md:order-2 flex flex-col items-center">
              {/* Mobile Headline - Hidden on desktop */}
              <h3 className="md:hidden text-2xl font-bold mb-8 text-[#282828]">Über uns</h3>
              <ImageSlider />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#824ca7] text-white py-16 px-4">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          {/* Logo */}
          <img 
            src="https://kjudshqjrtaqwqaxuldr.supabase.co/storage/v1/object/public/Team%20und%20Buero%20Bilder/EE%20Logo%20Weiss.svg" 
            alt="Einfach Ernährung Logo" 
            className="h-20 md:h-24 mb-8"
          />

          {/* Links */}
          <div className="flex gap-8 mb-8 text-base font-medium">
            <a href="https://www.einfachernaehrung.com/impressum" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">Impressum</a>
            <a href="https://www.einfachernaehrung.com/datenschutz" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">Datenschutz</a>
          </div>

          {/* Copyright */}
          <div className="text-sm opacity-60 font-light">
            &copy; Einfach Ernährung GmbH 2026
          </div>
        </div>
      </footer>
    </div>
  );
};