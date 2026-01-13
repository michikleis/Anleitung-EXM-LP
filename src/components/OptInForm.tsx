import React, { useState } from 'react';
import { Button } from './Button';
import { FormErrors, WebhookPayload } from '../types';
import { useWebhook } from '../hooks/useWebhook';

interface OptInFormProps {
  onSuccess: (data: { firstName: string; email: string }) => void;
  variant?: 'hero' | 'default';
}

export const OptInForm: React.FC<OptInFormProps> = ({ onSuccess, variant = 'default' }) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [honeypot, setHoneypot] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // First Name Validation
    // Allowed: Letters, umlauts, hyphens. Min 2, Max 30.
    const nameRegex = /^[a-zA-ZäöüÄÖÜß-]+$/;
    if (!firstName.trim()) {
      newErrors.firstName = 'Bitte gib einen echten Vornamen ein.';
      isValid = false;
    } else if (firstName.length < 2 || firstName.length > 30) {
      newErrors.firstName = 'Der Vorname muss zwischen 2 und 30 Zeichen lang sein.';
      isValid = false;
    } else if (!nameRegex.test(firstName)) {
      newErrors.firstName = 'Bitte gib einen echten Vornamen ein (nur Buchstaben).';
      isValid = false;
    }

    // Email Validation
    // Syntactic correctness
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Basic disposable domain list (mocking a more comprehensive backend check)
    const disposableDomains = ['mailinator.com', 'trashmail.com', 'temp-mail.org', 'guerrillamail.com'];
    const domain = email.split('@')[1];

    if (!email.trim()) {
      newErrors.email = 'Bitte gib eine gültige E-Mail-Adresse ein.';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Bitte gib eine gültige E-Mail-Adresse ein.';
      isValid = false;
    } else if (domain && disposableDomains.includes(domain.toLowerCase())) {
      newErrors.email = 'Bitte gib eine gültige E-Mail-Adresse ein (keine Wegwerf-Adresse).';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const { trigger } = useWebhook('OPT_IN');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Bot check (Honeypot)
    if (honeypot) {
      console.log("Bot detected");
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onSuccess({ firstName, email }); // Fake success for bot
      }, 1000);
      return;
    }

    if (!privacyAccepted) {
      setErrors(prev => ({ ...prev, privacy: 'Bitte bestätige die Datenschutzbestimmungen.' }));
      return;
    }

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const payload: WebhookPayload = {
        firstName,
        email,
        timestamp: new Date().toISOString(),
        source: 'LandingPage_ExperimentalMethod_V1'
      };

      const success = await trigger(payload);

      if (success) {
        onSuccess({ firstName, email });
      } else {
        throw new Error('Webhook failed');
      }
    } catch (error) {
      setErrors({ general: 'Das hat gerade nicht geklappt. Bitte versuche es gleich noch einmal.' });
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-6 py-4 rounded-full border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#824ca7] focus:border-transparent transition-all mb-1 shadow-inner";
  const errorClasses = "text-red-500 text-sm ml-4 mb-3 block text-left";

  return (
    <div className={`w-full max-w-lg mx-auto bg-white rounded-[2rem] p-8 md:p-10 ${variant === 'hero' ? 'shadow-2xl' : 'shadow-xl'}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-center mb-4 text-[#282828]">
          Trage Dich jetzt ein und sichere Dir den Zugang zur Komplettanleitung für 0 €.
        </h3>

        <img
          src="https://kbpiyixmecbmxsagnilx.supabase.co/storage/v1/object/public/Bilder/Produktbild/Produktbild%20Video-Training.webp"
          alt="Video Training Produktbild"
          className="w-full rounded-lg mb-4 shadow-sm"
        />

        <div>
          <input
            type="text"
            placeholder="Dein Vorname"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={`${inputClasses} ${errors.firstName ? 'border-red-500 ring-1 ring-red-500' : ''}`}
            disabled={loading}
          />
          {errors.firstName && <span className={errorClasses}>{errors.firstName}</span>}
        </div>

        <div>
          <input
            type="email"
            placeholder="Deine E-Mail-Adresse"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${inputClasses} ${errors.email ? 'border-red-500 ring-1 ring-red-500' : ''}`}
            disabled={loading}
          />
          {errors.email && <span className={errorClasses}>{errors.email}</span>}
        </div>

        <div className="mt-2 text-sm text-gray-500 flex items-start gap-2">
          <input
            type="checkbox"
            id="privacy"
            checked={privacyAccepted}
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-gray-300 text-[#824ca7] focus:ring-[#824ca7]"
          />
          <label htmlFor="privacy" className="text-left leading-snug">
            Ich habe die <a href="https://www.einfachernaehrung.com/datenschutz" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#824ca7]">Datenschutzbestimmungen</a> gelesen und stimme diesen zu.
          </label>
        </div>
        {errors.privacy && <span className={errorClasses}>{errors.privacy}</span>}

        <div className="mt-4">
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Wird bearbeitet...' : 'Zugang erhalten'}
          </Button>
        </div>

        {errors.general && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mt-4 text-center text-sm border border-red-100">
            {errors.general}
          </div>
        )}

        <div className="mt-5 flex justify-center">
          <div className="flex flex-col gap-2 text-sm text-gray-500">
            <div className="flex items-start gap-3 text-left">
              <span className="text-base shrink-0 w-6 flex justify-center mt-0.5">✅</span>
              <span>Es fallen keine Kosten oder Gebühren an. Du musst nur Deine Mail bestätigen.</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-base shrink-0 w-6 flex justify-center">🔒</span>
              <span>Deine Daten sind sicher.</span>
            </div>
          </div>
          {/* Honeypot Field - Invisible to users, visible to bots */}
          <input
            type="text"
            name="b_12345"
            tabIndex={-1}
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ position: 'absolute', opacity: 0, zIndex: -1, width: 0, height: 0 }}
            autoComplete="off"
          />
        </div>
      </form>
    </div>
  );
};