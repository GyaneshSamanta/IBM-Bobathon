import { AgentAssessmentResult, ThreatSeverity, TelemetryContext } from '../types/copilot';

export function evaluateOfflineCopilot(
  input: string,
  context: TelemetryContext
): AgentAssessmentResult {
  const text = (input || '').toLowerCase();
  const lang = context.preferredLanguage || 'en';
  const nearest = context.nearestSanctuaries[0];
  const sancName = nearest ? nearest.name : 'the nearest 24/7 lit petrol station';
  const sancNameKn = nearest ? nearest.nameKn : 'ಹತ್ತಿರದ ಶೆಲ್ ಪೆಟ್ರೋಲ್ ಬಂಕ್';

  let severity: ThreatSeverity = 'MEDIUM';
  let category: AgentAssessmentResult['threatCategory'] = 'general_fear';
  let spokenAdvice = '';
  let tacticalAction = '';
  let recommendedAction: AgentAssessmentResult['recommendedAction'] = 'divert_to_sanctuary';

  // Detection logic across 4 languages
  const isVehicle = /ಆಟೋ|ಕಾರು|गाडी|ऑटो|कार|auto|cab|vehicle|trailing|tailing/.test(text);
  const isDark = /ಕತ್ತಲೆ|ಬೆಳಕಿಲ್ಲ|अँध्यारो|अंधेरा|dark|unlit|lights off|pitch/.test(text);
  const isPursuit = /ಹಿಂಬಾಲಿಸು|पछ्याइ|पीछे|following|chasing|stalking|behind me/.test(text);
  const isCrowd = /ಹುಡುಗರು|ಗುಂಪು|केटाहरू|लड़के|भीड़|men|group|loitering/.test(text);

  if (isPursuit || (isVehicle && isDark)) {
    severity = 'HIGH';
    category = 'suspicious_vehicle';
    recommendedAction = 'divert_to_sanctuary';

    if (lang === 'kn') {
      spokenAdvice = 'ಗಾಬರಿಯಾಗಬೇಡಿ. ಎದುರುಗಡೆ 60 ಮೀಟರ್ ದೂರದಲ್ಲಿ ಬೆಳಕಿರುವ ಶೆಲ್ ಬಂಕ್ ಇದೆ, ಕೂಡಲೇ ಒಳಗೆ ಹೋಗಿ.';
      tacticalAction = `ಕೂಡಲೇ ಬಲಕ್ಕೆ ತಿರುಗಿ ${sancNameKn} ಒಳಗೆ ಹೋಗಿ. ಸಿಬ್ಬಂದಿ ಕೌಂಟರ್ ಬಳಿ ನಿಲ್ಲಿ.`;
    } else if (lang === 'ne') {
      spokenAdvice = 'आत्तिनु पर्दैन। अगाडि ६० मिटरमा उज्यालो पेट्रोल पम्प छ, तुरुन्तै भित्र जानुहोस्।';
      tacticalAction = `तुरुन्तै दायाँ मोडेर ${sancName} भित्र जानुहोस् र काउन्टरमा बस्नुहोस्।`;
    } else if (lang === 'hi') {
      spokenAdvice = 'घबराइए मत। आगे 60 मीटर पर रोशन पेट्रोल पंप है, तुरंत वहां जाएं।';
      tacticalAction = `तुरंत दाईं ओर मुड़कर ${sancName} के अंदर जाएं। काउंटर के पास रहें।`;
    } else {
      spokenAdvice = 'Stay calm. There is a brightly lit fuel station 60 meters ahead. Move there immediately.';
      tacticalAction = `Turn right immediately into ${sancName}. Forecourt is staffed and covered by CCTV.`;
    }
  } else if (isDark) {
    severity = 'MEDIUM';
    category = 'unlit_road';
    recommendedAction = 'continue_on_corridor';

    if (lang === 'kn') {
      spokenAdvice = 'ಮುಂದಿನ 150 ಮೀಟರ್ ಕತ್ತಲೆಯಾಗಿದೆ. ಕಾವುಲು ಸೂಚಿಸಿದ ಮುಖ್ಯ ರಸ್ತೆಯಲ್ಲಿ ಮುಂದುವರಿಯಿರಿ.';
      tacticalAction = 'ಹಿಂಬದಿಯ ಗಲ್ಲಿ ಬೇಡ. ಕಾವಲು ಹಸಿರು ಬೆಳಕಿನ ಮುಖ್ಯ ರಸ್ತೆಯಲ್ಲೇ ವೇಗವಾಗಿ ನಡೆಯಿರಿ.';
    } else if (lang === 'ne') {
      spokenAdvice = 'अगाडिको बाटो अँध्यारो छ। कावलुको हरियो सुरक्षित बाटोमै हिँड्नुहोस्।';
      tacticalAction = 'भित्री गल्लीमा नजानुहोस्। मुख्य उज्यालो सडकमै रहनुहोस्।';
    } else if (lang === 'hi') {
      spokenAdvice = 'आगे की गली में अंधेरा है। कावलु के हरे सुरक्षित मुख्य रास्ते पर चलें।';
      tacticalAction = 'शॉर्टकट से बचें। मुख्य रोशन सड़क पर ही तेज़ी से आगे बढ़ें।';
    } else {
      spokenAdvice = 'The shortcut ahead is unlit. Stay on the illuminated green corridor.';
      tacticalAction = 'Do not take the dirt alley. Maintain a brisk pace along the illuminated arterial road.';
    }
  } else if (isCrowd) {
    severity = 'HIGH';
    category = 'physical_pursuit';
    recommendedAction = 'divert_to_sanctuary';

    if (lang === 'kn') {
      spokenAdvice = 'ಗುಂಪು ಇರುವ ಕಡೆ ಹೋಗಬೇಡಿ. ಎಡಕ್ಕೆ ಅಪೊಲೊ ಫಾರ್ಮಸಿ ಇದೆ, ಅಲ್ಲಿ ನಿಲ್ಲಿ.';
      tacticalAction = 'ರಸ್ತೆ ದಾಟಿ 24 ಗಂಟೆ ತೆರೆದಿರುವ ಫಾರ್ಮಸಿ ಅಥವಾ ಪೊಲೀಸ್ ಕಿಯೋಸ್ಕ್ ಹತ್ತಿರ ಸಾಗಿ.';
    } else if (lang === 'ne') {
      spokenAdvice = 'त्यो समूह भएको बाटो नजानुहोस्। नजिकैको २४ घण्टा खुल्ला फार्मेसीमा जानुहोस्।';
      tacticalAction = 'सडक पार गरेर उज्यालो फार्मेसी वा पुलिस सहायता कक्ष नजिक पुग्नुहोस्।';
    } else if (lang === 'hi') {
      spokenAdvice = 'उस समूह की तरफ न जाएं। बाईं तरफ 24 घंटे खुली फार्मेसी है, वहां रुकें।';
      tacticalAction = 'सड़क पार करें और रोशन 24/7 फार्मेसी के अंदर जाएं।';
    } else {
      spokenAdvice = 'Avoid the group ahead. Cross to the lit side of the street toward the 24/7 pharmacy.';
      tacticalAction = 'Cross over and proceed into the nearest open commercial sanctuary.';
    }
  } else {
    severity = 'LOW';
    category = 'general_fear';
    recommendedAction = 'continue_on_corridor';

    if (lang === 'kn') {
      spokenAdvice = 'ಕಾವಲು ನಿಮ್ಮ ಸಂಚಾರವನ್ನು ಗಮನಿಸುತ್ತಿದೆ. ಸುರಕ್ಷಿತ ರಸ್ತೆಯಲ್ಲಿ ಮುಂದುವರಿಯಿರಿ.';
      tacticalAction = 'ಮುಖ್ಯ ರಸ್ತೆಯಲ್ಲಿ ಮುಂದುವರಿಯಿರಿ. ನೀವು ನಿಂತರೆ ಕಾವಲು ತಕ್ಷಣ ರಕ್ಷಣೆ ನೀಡುತ್ತದೆ.';
    } else if (lang === 'ne') {
      spokenAdvice = 'कावलु तपाईंको साथमा छ। सुरक्षित हरियो बाटोमै अगाडि बढ्नुहोस्।';
      tacticalAction = 'मुख्य बाटोमै हिँड्नुहोस्। कुनै समस्या भए तुरुन्तै अलर्ट दिइनेछ।';
    } else if (lang === 'hi') {
      spokenAdvice = 'कावलु आपकी यात्रा पर नज़र रख रहा है। सुरक्षित रास्ते पर आगे बढ़ते रहें।';
      tacticalAction = 'चिंता न करें, सुरक्षित मार्ग पर ही चलते रहें।';
    } else {
      spokenAdvice = 'Kaavalu is actively monitoring your transit. You are on the safe illuminated corridor.';
      tacticalAction = 'Continue walking along the green line. Sanctuaries are within 100 meters.';
    }
  }

  const dispatchBrief = `🚨 KAAVALU INCIDENT SUMMARY\n` +
    `• Severity: ${severity} (${category})\n` +
    `• User Reported: "${input}"\n` +
    `• Tactical Guidance: ${tacticalAction}\n` +
    `• Recommended Sanctuary: ${sancName}\n` +
    `• Coordinates: ${context.currentPosition.lat.toFixed(4)}, ${context.currentPosition.lng.toFixed(4)}\n` +
    `• Active Battery: ${context.batteryLevel}%`;

  return {
    threatLevel: severity,
    threatCategory: category,
    spokenAdvice,
    tacticalAction,
    targetSanctuaryId: nearest ? nearest.id : null,
    targetSanctuaryName: sancName,
    recommendedAction,
    structuredDispatchBrief: dispatchBrief,
    confidenceScore: 0.94,
    timestamp: new Date().toISOString(),
  };
}
