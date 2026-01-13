import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { useWebhook } from '../hooks/useWebhook';

interface SurveyStep {
  id: number;
  question: string;
  subtext?: string;
  type: 'single-choice' | 'multiple-choice' | 'text' | 'scale' | 'email' | 'phone' | 'contact-verification';
  options?: string[];
  minLabel?: string;
  maxLabel?: string;
  hasOtherOption?: boolean; // Trigger for "Sonstige" input
}

const DEMO_STEPS: SurveyStep[] = [
  {
    id: 1,
    question: "Was ist aktuell Deine größte Herausforderung?",
    subtext: "Du kannst mehrere Punkte auswählen.",
    type: "multiple-choice",
    options: [
      "Ich möchte Gewicht verlieren und definierter aussehen",
      "Ich möchte meine Kalorien erhöhen, bin jedoch unsicher",
      "Ich möchte wieder ein entspanntes Essverhalten",
      "Ich möchte weg vom Kalorienzählen",
      "Nichts davon"
    ]
  },
  {
    id: 2,
    question: "Welche Ziele möchtest Du erreichen?",
    subtext: "Du kannst mehrere auswählen.",
    type: "multiple-choice",
    options: [
      "Ich möchte Gewicht verlieren (über 10 Kilogramm)",
      "Ich möchte Gewicht verlieren (unter 10 Kilogramm)",
      "Ich möchte definierter aussehen",
      "Ich möchte meine Periode wieder haben",
      "Ich möchte essen, ohne schlechtes Gewissen",
      "Ich möchte gesund zunehmen, Normalgewicht erreichen und Muskeln aufbauen",
      "Ich möchte meine Kalorien erhöhen, ohne zuzunehmen",
      "Nichts davon"
    ]
  },
  {
    id: 3,
    question: "Wie sehr stört Dich Deine Situation aktuell?",
    subtext: "1 = Gar nicht, 10 = Es muss sich etwas ändern",
    type: "scale",
    options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
  },
  {
    id: 4,
    question: "Besteht aktuell oder hattest Du in der Vergangenheit eine diagnostizierte Essstörung?",
    type: "single-choice",
    options: ["Ja", "Nein"]
  },
  {
    id: 5,
    question: "Bist Du von einer oder mehreren dieser Stoffwechselkrankheiten betroffen?",
    subtext: "Du kannst mehrere auswählen.",
    type: "multiple-choice",
    hasOtherOption: true,
    options: [
      "PCOS",
      "Hashimoto",
      "Lipödem",
      "Diabetes Typ 2",
      "Sonstige",
      "Nichts davon"
    ]
  },
  {
    id: 6,
    question: "Angenommen, wir erreichen sicher Dein Ziel: Wie viel wärst Du bereit, monatlich in eine Lösung zu investieren?",
    type: "single-choice",
    options: [
      "0 € ❌",
      "Bis zu 80 € ✌️",
      "Bis zu 150 € ✅",
      "Zwischen 150 und 250 € ☑️",
      "Bis zu 400 €, wenn ich mein Ziel dadurch schneller erreiche 🦄"
    ]
  },
  {
    id: 7,
    question: "Sind Dein Vorname und die E-Mail korrekt?",
    subtext: "Wenn ja, drücke auf Weiter.",
    type: "contact-verification"
  },
  {
    id: 8,
    question: "Wie lautet Deine Telefonnummer?",
    subtext: "Damit wir Dich erreichen können.",
    type: "phone"
  },
  {
    id: 9,
    question: "Wann bist Du am besten erreichbar?",
    subtext: "Beispiel: Montags und Mittwochs, ab 17 Uhr.",
    type: "text"
  }
];

const COUNTRY_CODES = [
  { code: '+49', label: '🇩🇪 +49' },
  { code: '+43', label: '🇦🇹 +43' },
  { code: '+41', label: '🇨🇭 +41' },
];

interface SurveyWizardProps {
  initialUserData?: {
    firstName: string;
    email: string;
  }
}

export const SurveyWizard: React.FC<SurveyWizardProps> = ({ initialUserData }) => {
  const { trigger } = useWebhook('SURVEY_SUBMIT');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Ref for scrolling to top
  const wizardRef = useRef<HTMLDivElement>(null);

  // Local state for inputs to allow typing before submitting
  const [textInput, setTextInput] = useState("");
  const [otherInput, setOtherInput] = useState(""); // For "Sonstige"
  const [phoneCode, setPhoneCode] = useState(COUNTRY_CODES[0].code);
  const [phoneNumber, setPhoneNumber] = useState("");

  // New state for Contact Verification Step
  const [contactName, setContactName] = useState(initialUserData?.firstName || "");
  const [contactEmail, setContactEmail] = useState(initialUserData?.email || "");

  // New state for manual country code entry
  const [isManualPhone, setIsManualPhone] = useState(false);
  const [whatsAppConsent, setWhatsAppConsent] = useState(false);

  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const isIframe = window.location.pathname.includes('iframe');

  // Helper to get current answer safely
  const getCurrentAnswer = () => answers[DEMO_STEPS[currentStep].id];

  // Dynamic Step Logic (Override text for iFrame)
  let step = DEMO_STEPS[currentStep];
  if (isIframe && step.id === 7) {
    step = {
      ...step,
      question: "Verrätst Du uns Deinen Namen & Deine E-Mail?",
      subtext: "Trage hier bitte Deinen Vornamen und Deine E-Mail ein. (Pflichtfelder)"
    };
  }

  // Update contact info if initialUserData changes later (e.g. slight delay in prop propagation)
  useEffect(() => {
    if (initialUserData) {
      setContactName(prev => prev || initialUserData.firstName);
      setContactEmail(prev => prev || initialUserData.email);
    }
  }, [initialUserData]);

  // Reset local states when changing steps
  useEffect(() => {
    setTextInput("");
    setOtherInput("");
    setValidationError(null);
    // We don't reset phoneCode/isManualPhone to keep user selection if they go back/forth
  }, [currentStep]);

  // Scroll to top of wizard on step change
  useEffect(() => {
    if (currentStep > 0 && wizardRef.current) {
      wizardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentStep]);

  const handleSingleSelect = (option: string) => {
    setAnswers(prev => ({ ...prev, [step.id]: option }));
    handleNext();
  };

  const handleMultiSelect = (option: string) => {
    // Clear validation error when user selects something
    setValidationError(null);

    const stepId = step.id;
    const current = (answers[stepId] as string[]) || [];

    let updated: string[];
    if (current.includes(option)) {
      updated = current.filter(item => item !== option);
    } else {
      updated = [...current, option];
    }
    setAnswers(prev => ({ ...prev, [stepId]: updated }));
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      setAnswers(prev => ({ ...prev, [step.id]: textInput }));
      handleNext();
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(textInput)) {
      setAnswers(prev => ({ ...prev, [step.id]: textInput }));
      handleNext();
    }
  };

  const handleContactVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (contactName.trim() && emailRegex.test(contactEmail)) {
      setAnswers(prev => ({
        ...prev,
        [step.id]: { firstName: contactName, email: contactEmail }
      }));
      handleNext();
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // WhatsApp Check
    if (whatsAppConsent && phoneNumber.trim().length === 0) {
      setValidationError("Bitte trage Deine Telefonnummer ein, damit wir Dich per WhatsApp kontaktieren können.");
      return;
    }

    // Allow empty (optional) OR valid length if typed
    if (phoneNumber.trim().length === 0) {
      setAnswers(prev => ({ ...prev, [step.id]: "Nicht angegeben" }));
      handleNext();
    } else if (phoneNumber.length > 5) {
      setAnswers(prev => ({ ...prev, [step.id]: `${phoneCode} ${phoneNumber}` }));
      handleNext();
    }
  };

  const handleMultiChoiceNext = () => {
    const currentAnswers = (answers[step.id] as string[]) || [];
    if (currentAnswers.length === 0) {
      setValidationError("Bitte wähle eine Option aus, um fortfahren zu können");
      return;
    }
    handleNext();
  };

  const handleNext = () => {
    // If we are on a multi-choice step with "Sonstige" selected, save the text input
    if (step.type === 'multiple-choice' && step.hasOtherOption) {
      const currentAnswers = (answers[step.id] as string[]) || [];
      if (currentAnswers.includes("Sonstige") && otherInput.trim()) {
        setAnswers(prev => ({ ...prev, [`${step.id}_other`]: otherInput }));
      }
    }

    if (currentStep < DEMO_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Survey Finished Logic

      // Build Payload
      const payload = {
        timestamp: new Date().toISOString(),
        source: isIframe ? 'Survey_Frame' : 'Survey_ThankYouPage',
        challenge: answers[1] || [],
        goals: answers[2] || [],
        situation_rating: answers[3] || "0",
        eating_disorder: answers[4] || "Nicht angegeben",
        metabolic_diseases: answers[5] || [],
        budget: answers[6] || "0 €",
        contact: answers[7] || { firstName: "Unknown", email: "unknown@example.com" },
        phone: answers[8] || "Nicht angegeben",
        availability: answers[9] || "Nicht angegeben",
        whatsapp_consent: whatsAppConsent,
        raw_answers: answers
      };

      // Check Budget Answer for Disqualification
      const budgetAnswer = answers[6];
      const lowBudgetOptions = ["0 € ❌", "Bis zu 80 € ✌️"];
      const isDisqualified = typeof budgetAnswer === 'string' && lowBudgetOptions.includes(budgetAnswer);

      // ALWAYS send webhook first
      trigger(payload).then(success => {
        if (success) console.log("Final Answers sent:", payload);
        else console.error("Failed to send survey webhook");

        // Handling Logic AFTER webhook attempt (ALWAYS redirect now)
        if (isDisqualified) {
          window.location.href = "https://start.einfachernaehrung.com/kontakterfolgreich";
        } else {
          // Qualified -> Booking page
          window.location.href = "https://start.einfachernaehrung.com/buchung";
        }
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (isCompleted) {
    return (
      <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-xl p-8 md:p-12 text-center animate-fade-in">
        <div className="w-16 h-16 bg-purple-100 text-[#824ca7] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-[#282828] mb-4">Vielen Dank!</h3>
        <p className="text-gray-600">Wir haben Deine Antworten erhalten und werden sie berücksichtigen.</p>
      </div>
    );
  }

  const currentAnswer = getCurrentAnswer();
  const isLastStep = currentStep === DEMO_STEPS.length - 1;

  return (
    <div ref={wizardRef} className="w-full max-w-2xl bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 flex flex-col min-h-[450px] scroll-mt-8">

      {/* Header / Progress - ONLY ON LAST STEP */}
      {isLastStep && (
        <div className="bg-gray-50 px-6 py-5 md:px-8 md:py-6 border-b border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-[#824ca7] tracking-wider uppercase">Fast geschafft</span>
            <span className="text-xs text-gray-400">97%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
            <div
              className="bg-[#824ca7] h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `97%` }}
            ></div>
          </div>
          <p className="text-xs text-green-600 font-medium text-center animate-pulse">
            Nur noch ein Klick
          </p>
        </div>
      )}

      {/* Content */}
      <div className="p-6 md:p-10 flex-grow flex flex-col animate-fade-in" key={step.id}>
        <div className="mb-8 text-center">
          <h3 className="text-xl md:text-2xl font-bold text-[#282828] leading-snug mb-2">
            {step.question}
          </h3>
          {step.subtext && (
            <p className="text-gray-500 text-sm md:text-base">
              {step.subtext}
            </p>
          )}
        </div>

        {/* Single Choice Options */}
        {step.type === 'single-choice' && step.options && (
          <div className="grid gap-3">
            {step.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSingleSelect(option)}
                className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-200 font-medium flex items-center justify-between group
                  ${currentAnswer === option
                    ? 'border-green-500 bg-green-50 text-green-900'
                    : 'border-gray-200 hover:border-[#824ca7] hover:bg-purple-50 text-gray-700 hover:text-[#824ca7]'
                  }`}
              >
                <span>{option}</span>
                <span className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors
                     ${currentAnswer === option ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300 group-hover:border-[#824ca7]'}`}>
                  {currentAnswer === option && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Scale (1-10) Options */}
        {step.type === 'scale' && step.options && (
          <div className="flex flex-col items-center h-full justify-center">
            <div className="flex flex-wrap justify-center gap-3 mb-6 max-w-lg">
              {step.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSingleSelect(option)}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-2 font-bold text-lg transition-all duration-200 flex items-center justify-center shadow-sm
                      ${currentAnswer === option
                      ? 'border-[#824ca7] bg-[#824ca7] text-white scale-110 shadow-lg'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-[#824ca7] hover:text-[#824ca7] hover:scale-105'
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {(step.minLabel || step.maxLabel) && (
              <div className="w-full flex justify-between text-xs md:text-sm text-gray-400 font-medium px-2 max-w-lg">
                <span>{step.minLabel}</span>
                <span>{step.maxLabel}</span>
              </div>
            )}
          </div>
        )}

        {/* Multiple Choice Options */}
        {step.type === 'multiple-choice' && step.options && (
          <div className="flex flex-col h-full">
            <div className="grid gap-3 mb-8">
              {step.options.map((option, idx) => {
                const isSelected = (currentAnswer as string[])?.includes(option);
                const isOther = option === "Sonstige";

                return (
                  <div key={idx}>
                    <button
                      onClick={() => handleMultiSelect(option)}
                      className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-200 font-medium flex items-center justify-between group
                            ${isSelected
                          ? 'border-green-500 bg-green-50 text-green-900'
                          : 'border-gray-200 hover:border-[#824ca7] hover:bg-purple-50 text-gray-700 hover:text-[#824ca7]'
                        }`}
                    >
                      <span>{option}</span>
                      <span className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors
                                ${isSelected ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300 group-hover:border-[#824ca7]'}`}>
                        {isSelected && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                    </button>

                    {/* Conditional Text Input for "Sonstige" */}
                    {isOther && isSelected && step.hasOtherOption && (
                      <div className="mt-2 ml-4 animate-fade-in">
                        <input
                          type="text"
                          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#824ca7] focus:border-transparent outline-none bg-gray-50"
                          placeholder="Bitte spezifizieren..."
                          value={otherInput}
                          onChange={(e) => setOtherInput(e.target.value)}
                          autoFocus
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-auto flex flex-col items-end">
              {validationError && (
                <div className="text-red-500 text-sm mb-2 font-medium bg-red-50 px-3 py-1 rounded-lg border border-red-100">
                  {validationError}
                </div>
              )}
              <Button onClick={handleMultiChoiceNext}>
                Weiter
              </Button>
            </div>
          </div>
        )}

        {/* Text Input */}
        {step.type === 'text' && (
          <form onSubmit={handleTextSubmit} className="flex flex-col gap-4 h-full">
            <textarea
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#824ca7] focus:border-transparent outline-none min-h-[120px] resize-none"
              placeholder="Deine Antwort hier..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              autoFocus
            />
            {step.id === 9 && (
              <div className="mt-4 text-sm text-gray-500 flex items-start gap-2 text-left bg-gray-50 p-3 rounded-lg border border-gray-100">
                <input
                  type="checkbox"
                  id="privacy-survey"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-[#824ca7] focus:ring-[#824ca7] shrink-0"
                />
                <label htmlFor="privacy-survey" className="leading-snug">
                  Ich habe die <a href="/datenschutz" target="_blank" className="underline hover:text-[#824ca7]">Datenschutzbestimmungen</a> gelesen und stimme diesen zu.
                </label>
              </div>
            )}
            <div className="mt-auto flex justify-end">
              <Button type="submit" disabled={!textInput.trim() || (step.id === 9 && !privacyAccepted)}>
                {step.id === 9 ? 'Absenden' : 'Weiter'}
              </Button>
            </div>
          </form>
        )}

        {/* Email Input (Standalone) */}
        {step.type === 'email' && (
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4 h-full justify-center">
            <input
              type="email"
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#824ca7] focus:border-transparent outline-none text-lg"
              placeholder="name@beispiel.de"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              autoFocus
            />
            <div className="mt-8 flex justify-end">
              <Button type="submit" disabled={!textInput.includes('@') || !textInput.includes('.')}>
                Weiter
              </Button>
            </div>
          </form>
        )}

        {/* Contact Verification Input (Name + Email) */}
        {step.type === 'contact-verification' && (
          <form onSubmit={handleContactVerificationSubmit} className="flex flex-col gap-5 h-full justify-center">

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1 ml-4 text-left">Vorname</label>
              <input
                type="text"
                className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#824ca7] focus:border-transparent outline-none text-lg"
                placeholder="Dein Vorname"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1 ml-4 text-left">E-Mail-Adresse</label>
              <input
                type="email"
                className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#824ca7] focus:border-transparent outline-none text-lg"
                placeholder="name@beispiel.de"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>

            <div className="mt-8 flex justify-end">
              <Button type="submit" disabled={!contactName.trim() || !contactEmail.includes('@') || !contactEmail.includes('.')}>
                Weiter
              </Button>
            </div>
          </form>
        )}

        {/* Phone Input */}
        {step.type === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-4 h-full justify-center">
            <div className="flex gap-3 items-start">
              {/* Country Code Toggle */}
              {isManualPhone ? (
                <input
                  type="text"
                  placeholder="+49"
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value)}
                  className="w-24 p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#824ca7] focus:border-transparent outline-none text-lg text-center"
                  autoFocus
                />
              ) : (
                <div className="relative">
                  <select
                    value={phoneCode}
                    onChange={(e) => setPhoneCode(e.target.value)}
                    className="appearance-none w-32 p-4 pr-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#824ca7] outline-none bg-white text-lg cursor-pointer"
                  >
                    {COUNTRY_CODES.map(c => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
              )}

              <input
                type="tel"
                className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#824ca7] focus:border-transparent outline-none text-lg flex-grow"
                placeholder="151 12345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9\s-]/g, ''))}
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setIsManualPhone(!isManualPhone);
                if (!isManualPhone) setPhoneCode(""); // Clear code when switching to manual for fresh input
                else setPhoneCode(COUNTRY_CODES[0].code); // Reset to default when switching back
              }}
              className="text-sm text-gray-500 hover:text-[#824ca7] underline text-left self-start ml-1"
            >
              {isManualPhone ? "Zurück zur Standard-Auswahl" : "Ich habe eine andere Vorwahl"}
            </button>

            <div className="mt-4 flex items-start gap-4 p-4 border border-green-500 bg-white rounded-xl text-left">
              {/* WhatsApp Icon */}
              <img
                src="https://kbpiyixmecbmxsagnilx.supabase.co/storage/v1/object/public/Bilder/Logos/WhatsApp%20Logo.png"
                alt="WhatsApp"
                className="w-6 h-6 shrink-0 mt-0.5"
              />

              {/* Checkbox */}
              <input
                type="checkbox"
                id="whatsapp-consent"
                checked={whatsAppConsent}
                onChange={(e) => setWhatsAppConsent(e.target.checked)}
                className="w-5 h-5 mt-1 rounded border-gray-300 text-[#25D366] focus:ring-[#25D366] shrink-0"
              />

              {/* Text */}
              <label htmlFor="whatsapp-consent" className="text-sm text-gray-600 leading-snug cursor-pointer">
                Statt telefonisch möchte ich lieber per WhatsApp von Einfach Ernährung kontaktiert werden, um Rückfragen zu meinem Anliegen zu klären oder weitere Informationen zu erhalten.
              </label>
            </div>

            {validationError && (
              <div className="mt-4 text-red-500 text-sm font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-100 text-center">
                {validationError}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              {/* Button disabled only if user STARTED typing but has < 6 chars. */}
              <Button type="submit" disabled={phoneNumber.length > 0 && phoneNumber.length < 6}>
                Weiter
              </Button>
            </div>
          </form>
        )}

      </div>

      {/* Footer / Navigation for Back Button */}
      {currentStep > 0 && (
        <div className="px-6 py-4 bg-white border-t border-gray-100 flex justify-start">
          <button
            onClick={handleBack}
            className="text-gray-400 hover:text-[#824ca7] font-medium text-sm flex items-center gap-1 transition-colors px-2 py-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Zurück
          </button>
        </div>
      )}

      {/* Footer message only on first step */}
      {currentStep === 0 && (
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center flex justify-center gap-2 items-center">
          <span className="text-lg">🔒</span>
          <p className="text-xs text-gray-600 font-medium">Deine Daten werden sicher verschlüsselt.</p>
        </div>
      )}
    </div>
  );
};