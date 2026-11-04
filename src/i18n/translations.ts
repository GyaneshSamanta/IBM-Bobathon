export type LanguageCode = 'kn' | 'en' | 'hi' | 'ne';

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  tagline: string;
  onlineMode: string;
  offlineMode: string;
  safeCorridor: string;
  darkShortcut: string;
  litRating: string;
  safetyScore: string;
  startTransit: string;
  endTransit: string;
  transitActive: string;
  sanctuaryNear: string;
  open24x7: string;
  staffed: string;
  callSanctuary: string;
  covertMode: string;
  covertPrompt: string;
  sirenTrigger: string;
  sirenStop: string;
  sosAlert: string;
  stagnationWarning: string;
  stagnationDesc: string;
  cancelAlert: string;
  micPrompt: string;
  micListening: string;
  threatAssessment: string;
  tacticalAction: string;
  shareAlert: string;
  recenterMap: string;
  distance: string;
  duration: string;
  selectCorridor: string;
  routeTab: string;
  sanctuaryTab: string;
  copilotTab: string;
  guidedStory: string;
  allGood: string;
  safeHavenDirections: string;
  alertSent: string;
}

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  kn: {
    appTitle: 'ಕಾವಲು',
    appSubtitle: 'ರಾತ್ರಿ ಸುರಕ್ಷಿತ ಸಂಚಾರ ಸಂಗಾತಿ',
    tagline: 'ಬೆಂಗಳೂರು ನಿದ್ರಿಸುವಾಗ, ಕಾವಲು ಕಾಯುತ್ತದೆ',
    onlineMode: 'ಲೈವ್ ರಕ್ಷಣೆ • ಸಂಪರ್ಕದಲ್ಲಿದೆ',
    offlineMode: 'ಆಫ್‌ಲೈನ್ ಕಾವಲು • ನೆಟ್‌ವರ್ಕ್ ಇಲ್ಲದೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ',
    safeCorridor: 'ಸುರಕ್ಷಿತ ಬೆಳಕಿನ ರಸ್ತೆ',
    darkShortcut: 'ಕತ್ತಲೆಯ ಹಾದಿ (ಬೇಡ)',
    litRating: 'ಬೆಳಕಿನ ವ್ಯವಸ್ಥೆ',
    safetyScore: 'ಸುರಕ್ಷತೆ',
    startTransit: 'ಸುರಕ್ಷಿತ ನಡಿಗೆ ಪ್ರಾರಂಭಿಸಿ',
    endTransit: 'ನಡಿಗೆ ಮುಕ್ತಾಯ • ನಾನು ಸುರಕ್ಷಿತ',
    transitActive: 'ಕಾವಲು ನಿಮ್ಮೊಂದಿಗೆ ರಕ್ಷಣೆಯಲ್ಲಿದೆ',
    sanctuaryNear: 'ಹತ್ತಿರದ ಸುರಕ್ಷಿತ ತಾಣಗಳು',
    open24x7: '24/7 ತೆರೆದಿದೆ',
    staffed: 'ಸಿಬ್ಬಂದಿ ಇದ್ದಾರೆ',
    callSanctuary: 'ಕರೆ ಮಾಡಿ',
    covertMode: 'ರಹಸ್ಯ ಮೋಡ್ (ಡಿಸ್ಪ್ಲೇ ಮರೆಮಾಡಿ)',
    covertPrompt: 'ಪರದೆ ಆಫ್ ಆದಂತೆ ಕಾಣುತ್ತದೆ, ಆದರೆ ಕಾವಲು ಹಿನ್ನೆಲೆಯಲ್ಲಿ ನಿಮ್ಮನ್ನು ಕಾಯುತ್ತಿರುತ್ತದೆ',
    sirenTrigger: 'ತುರ್ತು ಸೈರನ್ ಶಬ್ದ',
    sirenStop: 'ಸೈರನ್ ನಿಲ್ಲಿಸಿ',
    sosAlert: 'ತುರ್ತು ಸಹಾಯ (112 SMS)',
    stagnationWarning: 'ನೀವು ನಿಂತಿರುವುದು ಪತ್ತೆಯಾಗಿದೆ',
    stagnationDesc: 'ನೀವು ಕೆಲವು ನಿಮಿಷಗಳಿಂದ ಕತ್ತಲೆಯ ಪ್ರದೇಶದಲ್ಲಿ ನಿಂತಿದ್ದೀರಿ. ಎಲ್ಲವೂ ಸರಿಯಾಗಿದೆಯೇ?',
    cancelAlert: 'ನಾನು ಸುರಕ್ಷಿತವಾಗಿದ್ದೇನೆ',
    micPrompt: 'ಏನಾದರೂ ಆತಂಕವಿದೆಯೇ? ಮಾತನಾಡಿ...',
    micListening: 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇವೆ...',
    threatAssessment: 'ಸುರಕ್ಷತಾ ಮಾರ್ಗದರ್ಶನ',
    tacticalAction: 'ಮಾಡಬೇಕಾದ ಕ್ರಮ',
    shareAlert: 'ಸ್ಥಳ ಹಂಚಿಕೊಳ್ಳಿ',
    recenterMap: 'ನನ್ನ ಸ್ಥಳಕ್ಕೆ ಮರಳಿ',
    distance: 'ದೂರ',
    duration: 'ಸಮಯ',
    selectCorridor: 'ನಿಮ್ಮ ಗಮ್ಯಸ್ಥಾನ ಆಯ್ಕೆಮಾಡಿ',
    routeTab: 'ಮಾರ್ಗ',
    sanctuaryTab: 'ಸುರಕ್ಷಿತ ತಾಣಗಳು',
    copilotTab: 'ಸುರಕ್ಷತಾ ಸಹಾಯಕ',
    guidedStory: 'ಡೆಮೊ ಅನುಭವ',
    allGood: 'ನೀವು ಸುರಕ್ಷಿತ ಮಾರ್ಗದಲ್ಲಿದ್ದೀರಿ',
    safeHavenDirections: 'ತಕ್ಷಣದ ಆಶ್ರಯಕ್ಕೆ ದಾರಿ',
    alertSent: 'ತುರ್ತು ಸಂದೇಶ ಕಳುಹಿಸಲಾಗಿದೆ',
  },
  en: {
    appTitle: 'KAAVALU',
    appSubtitle: 'Night Transit Guardian',
    tagline: 'While Bengaluru sleeps, Kaavalu stands watch',
    onlineMode: 'Live Guardian • Connected',
    offlineMode: 'Offline Guardian • Zero Data Needed',
    safeCorridor: 'Safe Illuminated Route',
    darkShortcut: 'Dark Alley Shortcut (Avoid)',
    litRating: 'Street Lighting',
    safetyScore: 'Safety',
    startTransit: 'Start Safe Walk',
    endTransit: 'End Walk • I Have Arrived Safely',
    transitActive: 'Kaavalu is actively watching over you',
    sanctuaryNear: 'Safe Havens Nearby',
    open24x7: 'Open 24/7',
    staffed: 'Staff on duty',
    callSanctuary: 'Call Haven',
    covertMode: 'Covert Black Screen',
    covertPrompt: 'Screen appears off to others while Kaavalu guards you in background',
    sirenTrigger: 'Emergency Siren Alarm',
    sirenStop: 'Silence Siren',
    sosAlert: 'Emergency SOS (112)',
    stagnationWarning: 'Are You Safe?',
    stagnationDesc: 'You have stopped moving in a dim section. Tap to confirm you are okay.',
    cancelAlert: "I'm Safe • Cancel Alert",
    micPrompt: 'Feel uncomfortable? Speak or type...',
    micListening: 'Listening to you...',
    threatAssessment: 'Safety Guidance',
    tacticalAction: 'Recommended Action',
    shareAlert: 'Share Live Location',
    recenterMap: 'Recenter on me',
    distance: 'Distance',
    duration: 'Est. Time',
    selectCorridor: 'Where are you heading?',
    routeTab: 'Route',
    sanctuaryTab: 'Safe Havens',
    copilotTab: 'Assistant',
    guidedStory: 'Story Demo',
    allGood: "You're on a well-lit, verified road",
    safeHavenDirections: 'Directions to nearest shelter',
    alertSent: 'Emergency alert dispatched',
  },
  hi: {
    appTitle: 'कावलु',
    appSubtitle: 'सुरक्षित रात्रि साथी',
    tagline: 'जब बेंगलुरु सोता है, कावलु पहरा देता है',
    onlineMode: 'लाइव सुरक्षा • कनेक्टेड',
    offlineMode: 'ऑफलाइन सुरक्षा • बिना इंटरनेट के सक्रिय',
    safeCorridor: 'सुरक्षित रोशनी वाला रास्ता',
    darkShortcut: 'अंधेरी गली का रास्ता (बचें)',
    litRating: 'स्ट्रीट लाइट',
    safetyScore: 'सुरक्षा स्तर',
    startTransit: 'सुरक्षित वॉक शुरू करें',
    endTransit: 'यात्रा समाप्त • मैं सुरक्षित हूँ',
    transitActive: 'कावलु आपकी सुरक्षा में सक्रिय है',
    sanctuaryNear: 'नजदीकी सुरक्षित ठिकाने',
    open24x7: '24/7 खुला',
    staffed: 'स्टाफ मौजूद',
    callSanctuary: 'कॉल करें',
    covertMode: 'सीक्रेट ब्लैक स्क्रीन',
    covertPrompt: 'स्क्रीन बंद दिखेगी, लेकिन कावलु बैकग्राउंड में आपकी रक्षा करेगा',
    sirenTrigger: 'इमरजेंसी सायरन',
    sirenStop: 'सायरन बंद करें',
    sosAlert: 'इमरजेंसी SOS (112)',
    stagnationWarning: 'क्या आप सुरक्षित हैं?',
    stagnationDesc: 'आप कुछ मिनटों से एक अंधेरी जगह पर रुके हुए हैं। क्या सब ठीक है?',
    cancelAlert: 'मैं सुरक्षित हूँ (अलर्ट रद्द करें)',
    micPrompt: 'कोई परेशानी है? बोलें या लिखें...',
    micListening: 'सुन रहे हैं...',
    threatAssessment: 'सुरक्षा सलाह',
    tacticalAction: 'तुरंत करने योग्य कदम',
    shareAlert: 'लोकेशन शेयर करें',
    recenterMap: 'मेरी लोकेशन पर जाएँ',
    distance: 'दूरी',
    duration: 'समय',
    selectCorridor: 'आप कहाँ जा रहे हैं?',
    routeTab: 'रास्ता',
    sanctuaryTab: 'सुरक्षित ठिकाने',
    copilotTab: 'सुरक्षा सहायक',
    guidedStory: 'डेमो देखें',
    allGood: 'आप रोशनी वाली सुरक्षित सड़क पर हैं',
    safeHavenDirections: 'नजदीकी सुरक्षित जगह का रास्ता',
    alertSent: 'इमरजेंसी संदेश भेज दिया गया',
  },
  ne: {
    appTitle: 'कावलु',
    appSubtitle: 'सुरक्षित रात्रिकालीन यात्रा साथी',
    tagline: 'बेंगलुरु सुत्दा, कावलु जाग्राम बस्छ',
    onlineMode: 'लाइभ सुरक्षा • जोडिएको छ',
    offlineMode: 'अफलाइन सुरक्षा • इन्टरनेट बिना काम गर्छ',
    safeCorridor: 'उज्यालो र सुरक्षित बाटो',
    darkShortcut: 'अँध्यारो गल्ली (नजानुहोस्)',
    litRating: 'सडक बत्ती',
    safetyScore: 'सुरक्षा',
    startTransit: 'सुरक्षित यात्रा सुरु गर्नुहोस्',
    endTransit: 'यात्रा समाप्त • म सुरक्षित पुगेँ',
    transitActive: 'कावलु तपाईंको सुरक्षामा सक्रिय छ',
    sanctuaryNear: 'नजिकका सुरक्षित ठाउँहरू',
    open24x7: '२४/७ खुला',
    staffed: 'कर्मचारी उपस्थित',
    callSanctuary: 'कल गर्नुहोस्',
    covertMode: 'गोप्य कालो स्क्रिन',
    covertPrompt: 'स्क्रिन बन्द देखिन्छ, तर कावलुले पृष्ठभूमिमा सुरक्षा दिन्छ',
    sirenTrigger: 'आपतकालीन साइरन',
    sirenStop: 'साइरन बन्द गर्नुहोस्',
    sosAlert: 'आपतकालीन SOS (११२)',
    stagnationWarning: 'तपाईं सुरक्षित हुनुहुन्छ?',
    stagnationDesc: 'तपाईं केही समयदेखि अँध्यारो ठाउँमा रोकिनुभएको छ। सब ठीक छ?',
    cancelAlert: 'म सुरक्षित छु (अलर्ट रद्द)',
    micPrompt: 'केही समस्या छ? बोल्नुहोस्...',
    micListening: 'सुन्दैछौं...',
    threatAssessment: 'सुरक्षा सुझाव',
    tacticalAction: 'तत्काल गर्नुपर्ने काम',
    shareAlert: 'लोकेसन पठाउनुहोस्',
    recenterMap: 'मेरो स्थानमा जानुहोस्',
    distance: 'दुरी',
    duration: 'समय',
    selectCorridor: 'तपाईं कता जाँदै हुनुहुन्छ?',
    routeTab: 'बाटो',
    sanctuaryTab: 'सुरक्षित ठाउँहरू',
    copilotTab: 'सुरक्षा सहायक',
    guidedStory: 'डेमो हेर्नुहोस्',
    allGood: 'तपाईं उज्यालो र सुरक्षित बाटोमा हुनुहुन्छ',
    safeHavenDirections: 'नजिकको आश्रय स्थलको बाटो',
    alertSent: 'आपतकालीन सन्देश पठाइयो',
  },
};
