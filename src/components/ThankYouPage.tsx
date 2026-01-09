import React from 'react';
import { SurveyWizard } from './SurveyWizard';

interface ThankYouPageProps {
    userData?: {
        firstName: string;
        email: string;
    }
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({ userData }) => {
  return (
    <div className="min-h-screen bg-[#f9f9f9] flex flex-col">
      
      {/* Content Wrapper */}
      <div className="flex-grow flex flex-col items-center pt-4 pb-12 px-4 w-full">
        {/* Header Content */}
        <div className="max-w-2xl w-full flex flex-col items-center text-center mb-8">
            {/* Logo */}
            <img 
            src="https://kjudshqjrtaqwqaxuldr.supabase.co/storage/v1/object/public/Team%20und%20Buero%20Bilder/Logo%20EE%20GmbH.svg" 
            alt="EE GmbH Logo" 
            className="h-8 md:h-10 mb-2"
            />

            {/* Small Green Check */}
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3 shadow-sm border border-green-50">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            </div>

            {/* Headline */}
            <h1 className="text-xl md:text-2xl font-bold text-[#824ca7] mb-2 leading-tight">
            Super, das hat funktioniert 🥳
            </h1>
            
            {/* Subtext - using text-wrap:balance for better flow */}
            <p className="text-base md:text-lg text-gray-600 mb-6 max-w-lg [text-wrap:balance] leading-relaxed">
            Bestätige jetzt nur schnell Deine E-Mail-Adresse und wir senden Dir alle Inhalte&nbsp;zu.
            </p>

            {/* Blue Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 items-start text-left max-w-xl w-full shadow-sm">
                <div className="shrink-0 text-blue-800 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                    </svg>
                </div>
                <p className="text-sm text-blue-900 leading-relaxed [text-wrap:pretty]">
                    Solltest Du in 20 Minuten keine E-Mail bekommen, melde Dich gerne bei uns unter <strong>support(at)einfachernaehrung.com</strong>. Schaue auch bei Spam oder Werbung&nbsp;nach.
                </p>
            </div>
        </div>

        {/* Survey Section */}
        <div className="w-full flex flex-col items-center animate-fade-in-up delay-200">
            <h2 className="text-lg md:text-xl font-bold text-[#282828] mb-6">
                Wenn Du schon hier bist …
            </h2>

            {/* Wizard Component */}
            <SurveyWizard initialUserData={userData} />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#824ca7] text-white py-16 px-4 mt-auto">
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

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fade-in-up {
            animation: fadeIn 0.7s ease-out forwards;
        }
        .delay-200 {
            animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
};