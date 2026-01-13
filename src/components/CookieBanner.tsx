import React, { useState, useEffect } from 'react';
import { Button } from './Button';

export const CookieBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already dismissed the banner
        const dismissed = localStorage.getItem('cookieBannerDismissed');
        if (!dismissed) {
            setIsVisible(true);
        }
    }, []);

    const handleDismiss = () => {
        localStorage.setItem('cookieBannerDismissed', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 p-6 md:p-8 animate-fade-in-up">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-gray-700 text-sm md:text-base leading-relaxed text-center md:text-left">
                    <span className="mr-2 text-xl">🍪</span>
                    Wir verwenden Cookies, um Website-Funktionen bereitzustellen und Inhalte zu personalisieren. Bitte beachte, dass einige Funktionen auf der Webseite nicht funktionieren, wenn Du auf Ablehnen klickst.
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                    <Button onClick={handleDismiss} className="whitespace-nowrap">
                        Geht klar
                    </Button>
                    <button
                        onClick={handleDismiss}
                        className="px-6 py-3 rounded-full border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-800 transition-colors whitespace-nowrap"
                    >
                        Ablehnen
                    </button>
                </div>
            </div>
        </div>
    );
};
