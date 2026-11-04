import React, { useState, useRef } from 'react';
import { Mic, MicOff, Send, ShieldCheck, Share2, Volume2 } from 'lucide-react';
import { AgentAssessmentResult } from '../types/copilot';
import { LanguageCode, TRANSLATIONS } from '../i18n/translations';

interface VoiceCopilotSheetProps {
  onAssessDistress: (text: string) => Promise<void>;
  isLoading: boolean;
  latestAssessment: AgentAssessmentResult | null;
  onShareDispatch: (brief: string) => void;
  language: LanguageCode;
}

export const VoiceCopilotSheet: React.FC<VoiceCopilotSheetProps> = ({
  onAssessDistress,
  isLoading,
  latestAssessment,
  onShareDispatch,
  language,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<unknown>(null);
  const t = TRANSLATIONS[language];

  // Consumer-friendly situation presets
  const PRESETS: Record<LanguageCode, { label: string; text: string }[]> = {
    en: [
      { label: 'Someone following', text: 'Someone is walking very close behind me, I feel unsafe.' },
      { label: 'Suspicious auto', text: 'A suspicious auto is trailing me with headlights turned off.' },
      { label: 'Street is pitch black', text: 'The streetlights ahead are off and it is completely dark.' },
    ],
    kn: [
      { label: 'ಹಿಂಬಾಲಿಸುತ್ತಿದ್ದಾರೆ', text: 'ಒಬ್ಬ ವ್ಯಕ್ತಿ ನನ್ನ ಹಿಂದೆ ಬರುತ್ತಿದ್ದಾನೆ, ಭಯವಾಗುತ್ತಿದೆ.' },
      { label: 'ಆಟೋ ಅನುಮಾನಾಸ್ಪದ', text: 'ಆಟೋ ಒಂದು ಲೈಟ್ ಆಫ್ ಮಾಡಿ ನಿಧಾನವಾಗಿ ನನ್ನ ಪಕ್ಕದಲ್ಲೇ ಬರುತ್ತಿದೆ.' },
      { label: 'ಕತ್ತಲೆಯ ಹಾದಿ', text: 'ಈ ರಸ್ತೆಯಲ್ಲಿ ಬೀದಿ ದೀಪಗಳಿಲ್ಲ, ಕತ್ತಲೆಯಾಗಿದೆ.' },
    ],
    hi: [
      { label: 'कोई पीछा कर रहा है', text: 'कोई मेरे पीछे आ रहा है, मुझे डर लग रहा है।' },
      { label: 'संदेहास्पद ऑटो', text: 'एक ऑटो बिना लाइट के धीमी गति से मेरे पीछे चल रहा है।' },
      { label: 'रास्ते में अंधेरा', text: 'आगे की स्ट्रीट लाइट बंद है और रास्ता बहुत सुनसान है।' },
    ],
    ne: [
      { label: 'कसैले पछ्याइरहेको', text: 'एउटा मान्छे मेरो पछि आइरहेको छ, मलाई डर लाग्यो।' },
      { label: 'अँध्यारो बाटो', text: 'यो बाटोमा बत्ती छैन र एकदमै अँध्यारो छ।' },
    ],
  };

  const currentPresets = PRESETS[language] || PRESETS.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    await onAssessDistress(inputText);
    setInputText('');
  };

  const handleSpeakAloud = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleSpeechRecognition = () => {
    if (isListening) {
      const rec = recognitionRef.current as { stop?: () => void };
      rec?.stop?.();
      setIsListening(false);
      return;
    }

    const SpeechRecognitionClass =
      (window as unknown as { SpeechRecognition?: new () => unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => unknown }).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setIsListening(true);
      setTimeout(() => {
        const sample = currentPresets[0];
        setInputText(sample.text);
        setIsListening(false);
        onAssessDistress(sample.text);
      }, 1000);
      return;
    }

    try {
      const recognition = new (SpeechRecognitionClass as new () => {
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        onresult: (e: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void;
        onerror: () => void;
        onend: () => void;
        start: () => void;
      })();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'kn' ? 'kn-IN' : language === 'hi' ? 'hi-IN' : language === 'ne' ? 'ne-NP' : 'en-IN';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        onAssessDistress(transcript);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="bg-carbon-layer01 border border-white/[0.08] rounded-2xl p-3.5 space-y-3 shadow-soft-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold text-carbon-textPrimary uppercase tracking-wider">
            {t.copilotTab}
          </h3>
          <p className="text-xs text-carbon-textSecondary mt-0.5">
            Speak or tap anytime you feel uncomfortable
          </p>
        </div>
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-carbon-green/10 text-carbon-green-light border border-carbon-green/20">
          Ready 24/7
        </span>
      </div>

      {/* Quick Situation Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {currentPresets.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onAssessDistress(p.text)}
            className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-carbon-layer02 hover:bg-carbon-layer03 border border-white/[0.06] text-xs text-carbon-textPrimary transition-all active:scale-95 whitespace-nowrap shadow-soft-sm"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Voice & Text Input */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? t.micListening : t.micPrompt}
            className="w-full bg-carbon-layer02 text-carbon-textPrimary text-xs px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-carbon-blue-light transition-colors pr-10"
          />
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
              isListening
                ? 'bg-carbon-red text-white animate-pulse'
                : 'text-carbon-textSecondary hover:text-carbon-textPrimary'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          aria-label="Send message"
          className="h-10 px-3.5 rounded-xl bg-carbon-blue hover:bg-carbon-blue-hover disabled:opacity-40 text-white transition-all active:scale-95 flex items-center justify-center font-medium text-xs shadow-soft-sm"
        >
          {isLoading ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
        </button>
      </form>

      {/* Calm Guidance Advice Card */}
      {latestAssessment && (
        <div className="p-3 bg-carbon-layer02/60 border border-white/[0.08] rounded-xl space-y-2.5 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-carbon-textPrimary flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-carbon-green" />
              {t.threatAssessment}
            </span>

            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={() => handleSpeakAloud(latestAssessment.spokenAdvice)}
                className="p-1.5 bg-carbon-layer01 border border-white/[0.08] rounded-lg text-carbon-textSecondary hover:text-carbon-textPrimary transition-colors"
                title="Speak advice out loud"
                aria-label="Speak advice out loud"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onShareDispatch(latestAssessment.structuredDispatchBrief)}
                className="p-1.5 bg-carbon-layer01 border border-white/[0.08] rounded-lg text-carbon-textSecondary hover:text-carbon-textPrimary transition-colors"
                title="Share location with contact"
                aria-label="Share location with contact"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-xs text-carbon-textPrimary leading-relaxed bg-carbon-layer01 p-2.5 rounded-lg border border-white/[0.06]">
            "{latestAssessment.spokenAdvice}"
          </p>

          <div className="text-xs text-carbon-green bg-carbon-green/10 p-2 rounded-lg border border-carbon-green/20 flex items-start space-x-1.5">
            <span className="font-bold">Next:</span>
            <span>{latestAssessment.tacticalAction}</span>
          </div>
        </div>
      )}
    </div>
  );
};
