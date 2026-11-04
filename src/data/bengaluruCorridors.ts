import { TransitCorridor } from '../types/corridor';

export const BENGALURU_CORRIDORS: TransitCorridor[] = [
  // 1. Indiranagar Corridor
  {
    id: 'indiranagar-defence-colony',
    name: 'Indiranagar Metro to Defence Colony',
    nameKn: 'ಇಂದಿರಾನಗರ ಮೆಟ್ರೋ ಇಂದ ಡಿಫೆನ್ಸ್ ಕಾಲೋನಿ',
    nameHi: 'इंदिरानगर मेट्रो से डिफेंस कॉलोनी',
    nameNe: 'इन्दिरानगर मेट्रोबाट डिफेन्स कलोनी',
    area: 'Central-East Bengaluru (Indiranagar)',
    description: 'Arterial shopping corridor connecting CMH Road metro station with residential avenues via 100ft Road.',
    startNodeId: 'in-node-1',
    endNodeId: 'in-node-8',
    center: { lat: 12.9745, lng: 77.6450 },
    zoom: 15,
    publicTransit: {
      lineName: 'Metro Feeder MF-1',
      vehicleType: 'Metro Feeder',
      boardingStop: 'Indiranagar Metro Gate 1',
      alightingStop: '100ft Rd 12th Main',
      departureFrequencyText: 'Every 8 mins',
      rideDurationMinutes: 4,
      walkToStopMinutes: 1,
      walkFromStopMinutes: 2,
      safetyRating: 'High • Electric feeder bus with CCTV',
    },
    sanctuaries: [
      {
        id: 'sanc-hp-indiranagar',
        name: 'HP Petrol Oasis 100ft Rd',
        nameKn: 'ಎಚ್‌ಪಿ ಪೆಟ್ರೋಲ್ ಬಂಕ್',
        nameHi: 'एचपी पेट्रोल पंप',
        nameNe: 'एचपी पेट्रोल पम्प',
        type: 'petrol_bunk',
        lat: 12.9735,
        lng: 77.6415,
        address: '100 Feet Rd, HAL 2nd Stage',
        isOpen24x7: true,
        isStaffed: true,
        lightingRating: 5,
        contactNumber: '+91 80 2528 3344',
        description: 'Brightly illuminated 24/7 forecourt with uniformed attendants, clean washrooms, and security guards.'
      },
      {
        id: 'sanc-apollo-indiranagar',
        name: 'Apollo Pharmacy 24x7',
        nameKn: 'ಅಪೊಲೊ ಫಾರ್ಮಸಿ',
        nameHi: 'अपोलो फार्मेसी',
        nameNe: 'अपोलो फार्मेसी',
        type: 'pharmacy',
        lat: 12.9726,
        lng: 77.6455,
        address: '12th Main Road, HAL 2nd Stage',
        isOpen24x7: true,
        isStaffed: true,
        lightingRating: 5,
        contactNumber: '+91 80 4110 5000',
        description: '24-hour illuminated storefront with security guard stationed outside.'
      },
      {
        id: 'sanc-bcp-indiranagar',
        name: 'Police Assistance Chowki',
        nameKn: 'ಪೊಲೀಸ್ ಚೌಕಿ',
        nameHi: 'पुलिस सहायता चौकी',
        nameNe: 'प्रहरी चौकी',
        type: 'police_kiosk',
        lat: 12.9772,
        lng: 77.6410,
        address: '100ft Rd / CMH Rd Junction',
        isOpen24x7: true,
        isStaffed: true,
        lightingRating: 5,
        contactNumber: '112',
        description: 'Manned police station with 24/7 law and order patrol vehicle.'
      }
    ],
    nodes: [
      // Safe Route Road Grid (Follows 100ft Rd south, turns east on 12th Main into Defence Colony)
      { id: 'in-node-1', name: 'Indiranagar Metro Gate 1', lat: 12.9784, lng: 77.6408, isLit: true, cctvCovered: true },
      { id: 'in-node-2', name: 'BCP Police Chowki', lat: 12.9772, lng: 77.6410, isLit: true, cctvCovered: true },
      { id: 'in-node-3', name: '100 Feet Rd Commercial High Street', lat: 12.9755, lng: 77.6412, isLit: true, cctvCovered: true },
      { id: 'in-node-4', name: 'HP 24/7 Petrol Oasis', lat: 12.9735, lng: 77.6415, isLit: true, cctvCovered: true },
      { id: 'in-node-5', name: '12th Main Paved Crossing', lat: 12.9732, lng: 77.6432, isLit: true, cctvCovered: true },
      { id: 'in-node-6', name: 'Apollo Pharmacy 24x7 Corner', lat: 12.9726, lng: 77.6455, isLit: true, cctvCovered: true },
      { id: 'in-node-7', name: 'Defence Colony Main Link', lat: 12.9720, lng: 77.6475, isLit: true, cctvCovered: true },
      { id: 'in-node-8', name: 'Defence Colony Park Avenue', lat: 12.9710, lng: 77.6495, isLit: true, cctvCovered: true },

      // Dark Alley Shortcut (Follows real street turns: east along CMH Rd -> south down Sri Krishna Temple lane -> east down 1st Main -> south down 3rd Cross -> east into Park Ave)
      { id: 'in-dark-node-1', name: 'CMH Rd / Temple Corner', lat: 12.9784, lng: 77.6425, isLit: false, cctvCovered: false },
      { id: 'in-dark-node-2', name: 'Sri Krishna Temple Rear Cross Lane', lat: 12.9762, lng: 77.6426, isLit: false, cctvCovered: false },
      { id: 'in-dark-node-3', name: '1st Main Narrow Unlit Cross', lat: 12.9762, lng: 77.6452, isLit: false, cctvCovered: false },
      { id: 'in-dark-node-4', name: '3rd Cross Culvert Lane', lat: 12.9735, lng: 77.6454, isLit: false, cctvCovered: false },
      { id: 'in-dark-node-5', name: 'Unlit Park Rear Boundary Cut', lat: 12.9735, lng: 77.6485, isLit: false, cctvCovered: false }
    ],
    segments: [
      // Safe Route Segments (1.4 km, 17 mins): 140 + 190 + 220 + 190 + 260 + 220 + 210 = 1430m
      { id: 'in-s-1', fromNodeId: 'in-node-1', toNodeId: 'in-node-2', distanceMeters: 140, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: '100 Feet Road' },
      { id: 'in-s-2', fromNodeId: 'in-node-2', toNodeId: 'in-node-3', distanceMeters: 190, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: '100 Feet Road' },
      { id: 'in-s-3', fromNodeId: 'in-node-3', toNodeId: 'in-node-4', distanceMeters: 220, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: '100 Feet Road' },
      { id: 'in-s-4', fromNodeId: 'in-node-4', toNodeId: 'in-node-5', distanceMeters: 190, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: '12th Main Road' },
      { id: 'in-s-5', fromNodeId: 'in-node-5', toNodeId: 'in-node-6', distanceMeters: 260, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: '12th Main Road' },
      { id: 'in-s-6', fromNodeId: 'in-node-6', toNodeId: 'in-node-7', distanceMeters: 220, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: 'Defence Colony Link' },
      { id: 'in-s-7', fromNodeId: 'in-node-7', toNodeId: 'in-node-8', distanceMeters: 210, isLit: true, hasActiveFrontage: true, surfaceType: 'secondary_road', streetName: 'Park Avenue' },

      // Dark Shortcut Segments (720m, 8 mins - saves 9 mins, but unlit dirt alley!): 120 + 130 + 140 + 130 + 110 + 90 = 720m
      { id: 'in-d-1', fromNodeId: 'in-node-1', toNodeId: 'in-dark-node-1', distanceMeters: 120, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'CMH Rd Temple Lane' },
      { id: 'in-d-2', fromNodeId: 'in-dark-node-1', toNodeId: 'in-dark-node-2', distanceMeters: 130, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'Temple Rear Cross' },
      { id: 'in-d-3', fromNodeId: 'in-dark-node-2', toNodeId: 'in-dark-node-3', distanceMeters: 140, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: '1st Main Unlit Lane' },
      { id: 'in-d-4', fromNodeId: 'in-dark-node-3', toNodeId: 'in-dark-node-4', distanceMeters: 130, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: '3rd Cross Culvert Lane' },
      { id: 'in-d-5', fromNodeId: 'in-dark-node-4', toNodeId: 'in-dark-node-5', distanceMeters: 110, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'Park Boundary Cut' },
      { id: 'in-d-6', fromNodeId: 'in-dark-node-5', toNodeId: 'in-node-8', distanceMeters: 90, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'Park Rear Entry' }
    ]
  },

  // 2. Whitefield Corridor
  {
    id: 'whitefield-metro-nallurahalli',
    name: 'Kadugodi Metro to Nallurahalli Gate',
    nameKn: 'ಕಾಡುಗೋಡಿ ಮೆಟ್ರೋ ಇಂದ ನಲ್ಲೂರಹಳ್ಳಿ ಗೇಟ್',
    nameHi: 'काडुगोडी मेट्रो से नल्लूरहल्ली गेट',
    nameNe: 'काडुगोडी मेट्रोबाट नल्लूरहल्ली गेट',
    area: 'East Bengaluru (Whitefield IT Hub)',
    description: 'Arterial commute connecting Kadugodi Whitefield Metro to residential layouts along Borewell Road.',
    startNodeId: 'wf-node-1',
    endNodeId: 'wf-node-8',
    center: { lat: 12.9705, lng: 77.7485 },
    zoom: 15,
    publicTransit: {
      lineName: 'BMTC Bus 335-E',
      vehicleType: 'BMTC Bus',
      boardingStop: 'Kadugodi Metro Bay 2',
      alightingStop: 'Nallurahalli Junction',
      departureFrequencyText: 'Every 7 mins',
      rideDurationMinutes: 6,
      walkToStopMinutes: 1,
      walkFromStopMinutes: 3,
      safetyRating: 'High • CCTV & Conductor on board',
    },
    sanctuaries: [
      {
        id: 'sanc-shell-whitefield',
        name: 'Shell Fuel Station',
        nameKn: 'ಶೆಲ್ ಪೆಟ್ರೋಲ್ ಬಂಕ್',
        nameHi: 'शेल पेट्रोल पंप',
        nameNe: 'शेल पेट्रोल पम्प',
        type: 'petrol_bunk',
        lat: 12.9745,
        lng: 77.7450,
        address: 'Borewell Main Rd, Whitefield',
        isOpen24x7: true,
        isStaffed: true,
        lightingRating: 5,
        contactNumber: '+91 80 2845 2200',
        description: '24/7 brightly illuminated 4-island forecourt with security guards and active staff.'
      },
      {
        id: 'sanc-apollo-whitefield',
        name: 'Apollo Pharmacy 24x7',
        nameKn: 'ಅಪೊಲೊ ಫಾರ್ಮಸಿ',
        nameHi: 'अपोलो फार्मेसी',
        nameNe: 'अपोलो फार्मेसी',
        type: 'pharmacy',
        lat: 12.9695,
        lng: 77.7435,
        address: 'ECC Road Junction, Nallurahalli',
        isOpen24x7: true,
        isStaffed: true,
        lightingRating: 5,
        contactNumber: '+91 80 4110 5000',
        description: '24-hour illuminated storefront with security guard stationed outside.'
      },
      {
        id: 'sanc-bcp-suraksha-wf',
        name: 'Police Suraksha Kiosk',
        nameKn: 'ಪೊಲೀಸ್ ಕಿಯೋಸ್ಕ್',
        nameHi: 'पुलिस सुरक्षा कियोस्क',
        nameNe: 'प्रहरी चौकी',
        type: 'police_kiosk',
        lat: 12.9760,
        lng: 77.7500,
        address: 'Kadugodi Signal, Whitefield',
        isOpen24x7: true,
        isStaffed: true,
        lightingRating: 5,
        contactNumber: '112',
        description: 'Manned Bengaluru City Police post with emergency beacon.'
      }
    ],
    nodes: [
      // Safe Route Grid (Curves West along Whitefield Main Rd, then South along Borewell Rd)
      { id: 'wf-node-1', name: 'Kadugodi Metro Exit B', lat: 12.9754, lng: 77.7550, isLit: true, cctvCovered: true },
      { id: 'wf-node-2', name: 'Whitefield Main Road Signal', lat: 12.9760, lng: 77.7515, isLit: true, cctvCovered: true },
      { id: 'wf-node-3', name: 'Police Suraksha Post', lat: 12.9758, lng: 77.7480, isLit: true, cctvCovered: true },
      { id: 'wf-node-4', name: 'Shell 24/7 Forecourt', lat: 12.9745, lng: 77.7450, isLit: true, cctvCovered: true },
      { id: 'wf-node-5', name: 'Borewell Commercial Avenue', lat: 12.9720, lng: 77.7442, isLit: true, cctvCovered: true },
      { id: 'wf-node-6', name: 'Apollo Pharmacy 24x7 Junction', lat: 12.9695, lng: 77.7435, isLit: true, cctvCovered: true },
      { id: 'wf-node-7', name: 'Borewell Road Lit Sidewalk', lat: 12.9670, lng: 77.7430, isLit: true, cctvCovered: true },
      { id: 'wf-node-8', name: 'Nallurahalli Lake View Gate', lat: 12.9642, lng: 77.7420, isLit: true, cctvCovered: true },

      // Dark Shortcut (Follows street grid: south down Kadugodi back lane -> west along Inner Circle culvert -> south to Lake gate)
      { id: 'wf-dark-node-1', name: 'Kadugodi Substation Back Lane', lat: 12.9725, lng: 77.7550, isLit: false, cctvCovered: false },
      { id: 'wf-dark-node-2', name: 'Inner Circle Unlit Culvert Lane', lat: 12.9725, lng: 77.7495, isLit: false, cctvCovered: false },
      { id: 'wf-dark-node-3', name: 'ECC Rear Vacant Track', lat: 12.9680, lng: 77.7495, isLit: false, cctvCovered: false },
      { id: 'wf-dark-node-4', name: 'Nallurahalli Lake Mud Bund', lat: 12.9680, lng: 77.7440, isLit: false, cctvCovered: false }
    ],
    segments: [
      // Safe Route Segments (1.8 km, 21 mins): 240 + 260 + 280 + 290 + 280 + 240 + 210 = 1800m
      { id: 'wf-s-1', fromNodeId: 'wf-node-1', toNodeId: 'wf-node-2', distanceMeters: 240, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: 'Whitefield Main Road' },
      { id: 'wf-s-2', fromNodeId: 'wf-node-2', toNodeId: 'wf-node-3', distanceMeters: 260, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: 'Whitefield Main Road' },
      { id: 'wf-s-3', fromNodeId: 'wf-node-3', toNodeId: 'wf-node-4', distanceMeters: 280, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: 'Borewell Road Corridor' },
      { id: 'wf-s-4', fromNodeId: 'wf-node-4', toNodeId: 'wf-node-5', distanceMeters: 290, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: 'Borewell Road Corridor' },
      { id: 'wf-s-5', fromNodeId: 'wf-node-5', toNodeId: 'wf-node-6', distanceMeters: 280, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: 'Borewell Road Corridor' },
      { id: 'wf-s-6', fromNodeId: 'wf-node-6', toNodeId: 'wf-node-7', distanceMeters: 240, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: 'Nallurahalli Main Link' },
      { id: 'wf-s-7', fromNodeId: 'wf-node-7', toNodeId: 'wf-node-8', distanceMeters: 210, isLit: true, hasActiveFrontage: true, surfaceType: 'secondary_road', streetName: 'Lake View Road' },

      // Dark Shortcut Segments (710m, 8 mins - saves 13 mins, but pitch dark!): 160 + 170 + 150 + 130 + 100 = 710m
      { id: 'wf-d-1', fromNodeId: 'wf-node-1', toNodeId: 'wf-dark-node-1', distanceMeters: 160, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'Substation Back Lane' },
      { id: 'wf-d-2', fromNodeId: 'wf-dark-node-1', toNodeId: 'wf-dark-node-2', distanceMeters: 170, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'Inner Circle Culvert' },
      { id: 'wf-d-3', fromNodeId: 'wf-dark-node-2', toNodeId: 'wf-dark-node-3', distanceMeters: 150, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'ECC Rear Vacant Track' },
      { id: 'wf-d-4', fromNodeId: 'wf-dark-node-3', toNodeId: 'wf-dark-node-4', distanceMeters: 130, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'Lake Mud Bund' },
      { id: 'wf-d-5', fromNodeId: 'wf-dark-node-4', toNodeId: 'wf-node-8', distanceMeters: 100, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'Backyard Gap' }
    ]
  },

  // 3. Bellandur Outer Ring Road Corridor
  {
    id: 'bellandur-orr-greenglen',
    name: 'Ecospace Skywalk to Green Glen Layout',
    nameKn: 'ಇಕೋಸ್ಪೇಸ್ ಇಂದ ಗ್ರೀನ್ ಗ್ಲೆನ್ ಲೇಔಟ್',
    nameHi: 'इकोस्पेस से ग्रीन ग्लेन लेआउट',
    nameNe: 'इकोस्पेसबाट ग्रीन ग्लेन लेआउट',
    area: 'South-East Bengaluru (Bellandur ORR)',
    description: 'Tech corridor connecting Outer Ring Road skywalk to residential societies via illuminated service roads.',
    startNodeId: 'bel-node-1',
    endNodeId: 'bel-node-7',
    center: { lat: 12.9238, lng: 77.6772 },
    zoom: 15,
    publicTransit: {
      lineName: 'BMTC Bus 500-D',
      vehicleType: 'BMTC Bus',
      boardingStop: 'Ecospace Skywalk Bus Bay',
      alightingStop: 'Green Glen Junction',
      departureFrequencyText: 'Every 5 mins',
      rideDurationMinutes: 5,
      walkToStopMinutes: 1,
      walkFromStopMinutes: 2,
      safetyRating: 'High • 24/7 ORR bus with CCTV',
    },
    sanctuaries: [
      {
        id: 'sanc-bpcl-bellandur',
        name: 'BPCL 24/7 Oasis',
        nameKn: 'ಬಿಪಿಸಿಎಲ್ ಬಂಕ್',
        nameHi: 'बीपीसीएल 24/7 पेट्रोल पंप',
        nameNe: 'बीपीसीएल २४/७ पेट्रोल पम्प',
        type: 'petrol_bunk',
        lat: 12.9248,
        lng: 77.6795,
        address: 'Outer Ring Rd, near EcoSpace, Bellandur',
        isOpen24x7: true,
        isStaffed: true,
        lightingRating: 5,
        contactNumber: '+91 80 2574 1122',
        description: 'Well-lit convenience store forecourt with continuous security guard and night cab passenger pickup area.'
      },
      {
        id: 'sanc-sakra-bellandur',
        name: 'Sakra Hospital Emergency',
        nameKn: 'ಸಾಕ್ರಾ ಆಸ್ಪತ್ರೆ ತುರ್ತು ವಿಭಾಗ',
        nameHi: 'साक्रा हॉस्पिटल इमरजेंसी',
        nameNe: 'सक्रा अस्पताल',
        type: 'hospital',
        lat: 12.9222,
        lng: 77.6740,
        address: 'SY No 52/2, Devarabeesanahalli, Bellandur',
        isOpen24x7: true,
        isStaffed: true,
        lightingRating: 5,
        contactNumber: '080 2520 4000',
        description: '24/7 guarded emergency ward entrance with active triage ambulance bay and security post.'
      }
    ],
    nodes: [
      { id: 'bel-node-1', name: 'Ecospace Skywalk Terminal', lat: 12.9265, lng: 77.6830, isLit: true, cctvCovered: true },
      { id: 'bel-node-2', name: 'ORR Service Road (Bright)', lat: 12.9255, lng: 77.6810, isLit: true, cctvCovered: true },
      { id: 'bel-node-3', name: 'BPCL 24/7 Fuel Oasis', lat: 12.9248, lng: 77.6795, isLit: true, cctvCovered: true },
      { id: 'bel-node-4', name: 'Devarabeesanahalli Link', lat: 12.9238, lng: 77.6775, isLit: true, cctvCovered: true },
      { id: 'bel-node-5', name: 'Sakra Hospital Emergency Gate', lat: 12.9222, lng: 77.6740, isLit: true, cctvCovered: true },
      { id: 'bel-node-6', name: 'Green Glen Main Avenue', lat: 12.9215, lng: 77.6728, isLit: true, cctvCovered: true },
      { id: 'bel-node-7', name: 'Green Glen Layout Gate 1', lat: 12.9212, lng: 77.6715, isLit: true, cctvCovered: true },

      // Dark Shortcut (Street aligned: south through Pillar 44 underpass -> west along canal gully -> south into rear gate)
      { id: 'bel-dark-1', name: 'Flyover Pillar 44 Underpass', lat: 12.9242, lng: 77.6820, isLit: false, cctvCovered: false },
      { id: 'bel-dark-2', name: 'Canal Service Dirt Track', lat: 12.9228, lng: 77.6820, isLit: false, cctvCovered: false },
      { id: 'bel-dark-3', name: 'Unpaved Culvert Gully', lat: 12.9228, lng: 77.6755, isLit: false, cctvCovered: false },
      { id: 'bel-dark-4', name: 'Perimeter Boundary Gap', lat: 12.9215, lng: 77.6755, isLit: false, cctvCovered: false }
    ],
    segments: [
      // Safe Route (1.4 km, 16 mins)
      { id: 'bel-s-1', fromNodeId: 'bel-node-1', toNodeId: 'bel-node-2', distanceMeters: 230, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: 'ORR Service Road' },
      { id: 'bel-s-2', fromNodeId: 'bel-node-2', toNodeId: 'bel-node-3', distanceMeters: 170, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: 'ORR Service Road' },
      { id: 'bel-s-3', fromNodeId: 'bel-node-3', toNodeId: 'bel-node-4', distanceMeters: 260, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: 'ORR Service Road' },
      { id: 'bel-s-4', fromNodeId: 'bel-node-4', toNodeId: 'bel-node-5', distanceMeters: 390, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: 'Green Glen Link Road' },
      { id: 'bel-s-5', fromNodeId: 'bel-node-5', toNodeId: 'bel-node-6', distanceMeters: 160, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: 'Green Glen Avenue' },
      { id: 'bel-s-6', fromNodeId: 'bel-node-6', toNodeId: 'bel-node-7', distanceMeters: 140, isLit: true, hasActiveFrontage: true, surfaceType: 'secondary_road', streetName: 'Green Glen Main' },

      // Dark Shortcut (670m, 8 mins - saves 8 mins, but dark underpass!): 150 + 130 + 160 + 120 + 110 = 670m
      { id: 'bel-d-1', fromNodeId: 'bel-node-1', toNodeId: 'bel-dark-1', distanceMeters: 150, isLit: false, hasActiveFrontage: false, surfaceType: 'isolated_underpass', streetName: 'Pillar 44 Dark Underpass' },
      { id: 'bel-d-2', fromNodeId: 'bel-dark-1', toNodeId: 'bel-dark-2', distanceMeters: 130, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'Canal Service Dirt Track' },
      { id: 'bel-d-3', fromNodeId: 'bel-dark-2', toNodeId: 'bel-dark-3', distanceMeters: 160, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'Unpaved Culvert Gully' },
      { id: 'bel-d-4', fromNodeId: 'bel-dark-3', toNodeId: 'bel-dark-4', distanceMeters: 120, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'Perimeter Boundary Gap' },
      { id: 'bel-d-5', fromNodeId: 'bel-dark-4', toNodeId: 'bel-node-7', distanceMeters: 110, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'Gate Rear Cut' }
    ]
  },

  // 4. Koramangala Corridor
  {
    id: 'koramangala-sonyworld-5thblock',
    name: 'Sony World Junction to 5th Block',
    nameKn: 'ಕೋರಮಂಗಲ ಸೋನಿ ವರ್ಲ್ಡ್ ಇಂದ 5ನೇ ಬ್ಲಾಕ್',
    nameHi: 'कोरमंगला सोनी वर्ल्ड से 5th ब्लॉक',
    nameNe: 'कोरामङ्गला सोनी वल्डबाट ५th ब्लक',
    area: 'South Bengaluru (Koramangala Hub)',
    description: 'High-traffic night shift corridor connecting 80ft Road commercial hub with residential layouts.',
    startNodeId: 'km-node-1',
    endNodeId: 'km-node-7',
    center: { lat: 12.9345, lng: 77.6255 },
    zoom: 15,
    publicTransit: {
      lineName: 'BMTC Bus 340',
      vehicleType: 'BMTC Bus',
      boardingStop: 'Sony World Signal Bus Stop',
      alightingStop: 'Koramangala 5th Block Post',
      departureFrequencyText: 'Every 8 mins',
      rideDurationMinutes: 4,
      walkToStopMinutes: 1,
      walkFromStopMinutes: 2,
      safetyRating: 'High • 24/7 commercial route with streetlights',
    },
    sanctuaries: [
      {
        id: 'sanc-bpcl-koramangala',
        name: 'BPCL Fuel Oasis 80ft Rd',
        nameKn: 'ಬಿಪಿಸಿಎಲ್ ಬಂಕ್',
        nameHi: 'बीपीसीएल पेट्रोल पंप',
        nameNe: 'बीपीसीएल पेट्रोल पम्प',
        type: 'petrol_bunk',
        lat: 12.9360,
        lng: 77.6240,
        address: '80 Feet Rd, 4th Block, Koramangala',
        isOpen24x7: true,
        isStaffed: true,
        lightingRating: 5,
        contactNumber: '+91 80 2553 4411',
        description: '24/7 lit petrol pump forecourt with manned convenience store and armed night guard.'
      },
      {
        id: 'sanc-medplus-koramangala',
        name: 'MedPlus 24x7 Pharmacy',
        nameKn: 'ಮೆಡ್‌ಪ್ಲಸ್ ಫಾರ್ಮಸಿ',
        nameHi: 'मेडप्लस फार्मेसी',
        nameNe: 'मेडप्लस फार्मेसी',
        type: 'pharmacy',
        lat: 12.9330,
        lng: 77.6275,
        address: '5th Block Main Road, Koramangala',
        isOpen24x7: true,
        isStaffed: true,
        lightingRating: 4,
        contactNumber: '+91 80 4099 2200',
        description: '24-hour illuminated pharmacy storefront with CCTV coverage.'
      }
    ],
    nodes: [
      { id: 'km-node-1', name: 'Sony World Junction Crossing', lat: 12.9380, lng: 77.6220, isLit: true, cctvCovered: true },
      { id: 'km-node-2', name: '80ft Road Commercial Corridor', lat: 12.9365, lng: 77.6235, isLit: true, cctvCovered: true },
      { id: 'km-node-3', name: 'BPCL 24/7 Fuel Oasis', lat: 12.9360, lng: 77.6240, isLit: true, cctvCovered: true },
      { id: 'km-node-4', name: '80ft Road / 5th Block Junction', lat: 12.9348, lng: 77.6255, isLit: true, cctvCovered: true },
      { id: 'km-node-5', name: 'MedPlus 24x7 Storefront', lat: 12.9330, lng: 77.6275, isLit: true, cctvCovered: true },
      { id: 'km-node-6', name: '5th Block Main Residential Link', lat: 12.9322, lng: 77.6285, isLit: true, cctvCovered: true },
      { id: 'km-node-7', name: 'Koramangala 5th Block Gate', lat: 12.9315, lng: 77.6295, isLit: true, cctvCovered: true },

      // Dark Shortcut (Street aligned: east on 1st Main -> south on stormwater culvert -> east into 5th Block)
      { id: 'km-dark-1', name: '1st Main Unlit Corner Lane', lat: 12.9380, lng: 77.6265, isLit: false, cctvCovered: false },
      { id: 'km-dark-2', name: 'Storm Drain Boundary Path', lat: 12.9345, lng: 77.6265, isLit: false, cctvCovered: false },
      { id: 'km-dark-3', name: '5th Block Unlit Perimeter Track', lat: 12.9345, lng: 77.6295, isLit: false, cctvCovered: false }
    ],
    segments: [
      // Safe Route (1.3 km, 15 mins)
      { id: 'km-s-1', fromNodeId: 'km-node-1', toNodeId: 'km-node-2', distanceMeters: 230, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: '80 Feet Road' },
      { id: 'km-s-2', fromNodeId: 'km-node-2', toNodeId: 'km-node-3', distanceMeters: 90, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: '80 Feet Road' },
      { id: 'km-s-3', fromNodeId: 'km-node-3', toNodeId: 'km-node-4', distanceMeters: 210, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: '80 Feet Road' },
      { id: 'km-s-4', fromNodeId: 'km-node-4', toNodeId: 'km-node-5', distanceMeters: 290, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: '5th Block Main' },
      { id: 'km-s-5', fromNodeId: 'km-node-5', toNodeId: 'km-node-6', distanceMeters: 140, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: '5th Block Main' },
      { id: 'km-s-6', fromNodeId: 'km-node-6', toNodeId: 'km-node-7', distanceMeters: 130, isLit: true, hasActiveFrontage: true, surfaceType: 'secondary_road', streetName: 'Residential Cross' },

      // Dark Shortcut (610m, 7 mins - saves 8 mins, but canal blind turn!): 160 + 170 + 160 + 120 = 610m
      { id: 'km-d-1', fromNodeId: 'km-node-1', toNodeId: 'km-dark-1', distanceMeters: 160, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: '1st Main Unlit Lane' },
      { id: 'km-d-2', fromNodeId: 'km-dark-1', toNodeId: 'km-dark-2', distanceMeters: 170, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'Storm Drain Path' },
      { id: 'km-d-3', fromNodeId: 'km-dark-2', toNodeId: 'km-dark-3', distanceMeters: 160, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'Perimeter Track' },
      { id: 'km-d-4', fromNodeId: 'km-dark-3', toNodeId: 'km-node-7', distanceMeters: 120, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: '5th Block Fence Cut' }
    ]
  },

  // 5. Electronic City Corridor
  {
    id: 'electronic-city-infosys-neeladri',
    name: 'Infosys Gate 1 to Neeladri Township',
    nameKn: 'ಇನ್ಫೋಸಿಸ್ ಗೇಟ್ 1 ಇಂದ ನೀಲಾದ್ರಿ ರಸ್ತೆ',
    nameHi: 'इन्फोसिस गेट 1 से नीलाद्री रोड',
    nameNe: 'इन्फोसिस गेट १ बाट निलाद्री सडक',
    area: 'South Bengaluru (Electronic City Phase 1)',
    description: 'High-density tech employee corridor connecting Phase 1 corporate gates with residential townships.',
    startNodeId: 'ec-node-1',
    endNodeId: 'ec-node-6',
    center: { lat: 12.8445, lng: 77.6680 },
    zoom: 15,
    publicTransit: {
      lineName: 'BMTC Bus 378',
      vehicleType: 'BMTC Bus',
      boardingStop: 'Infosys Main Gate Stop',
      alightingStop: 'Neeladri Road Cross',
      departureFrequencyText: 'Every 10 mins',
      rideDurationMinutes: 6,
      walkToStopMinutes: 1,
      walkFromStopMinutes: 2,
      safetyRating: 'High • Electronic City industrial security',
    },
    sanctuaries: [
      {
        id: 'sanc-hp-ecity',
        name: 'HP 24/7 Fuel Oasis',
        nameKn: 'ಎಚ್‌ಪಿ ಬಂಕ್',
        nameHi: 'एचपी 24/7 पेट्रोल पंप',
        nameNe: 'एचपी २४/७ पेट्रोल पम्प',
        type: 'petrol_bunk',
        lat: 12.8440,
        lng: 77.6710,
        address: 'Phase 1 Main Rd, Electronic City',
        isOpen24x7: true,
        isStaffed: true,
        lightingRating: 5,
        contactNumber: '+91 80 2852 0100',
        description: '24/7 brightly illuminated forecourt with uniformed attendants and active CCTV.'
      },
      {
        id: 'sanc-ec-police',
        name: 'E-City Police Post',
        nameKn: 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ ಪೊಲೀಸ್ ಚೌಕಿ',
        nameHi: 'इलेक्ट्रॉनिक सिटी पुलिस चौकी',
        nameNe: 'प्रहरी चौकी',
        type: 'police_kiosk',
        lat: 12.8455,
        lng: 77.6680,
        address: 'Wipro Junction, Electronic City Phase 1',
        isOpen24x7: true,
        isStaffed: true,
        lightingRating: 5,
        contactNumber: '112',
        description: 'Permanent Bengaluru Police post with emergency beacon.'
      }
    ],
    nodes: [
      { id: 'ec-node-1', name: 'Infosys Gate 1 Terminal', lat: 12.8485, lng: 77.6620, isLit: true, cctvCovered: true },
      { id: 'ec-node-2', name: 'E-City Tollway Service Road', lat: 12.8470, lng: 77.6650, isLit: true, cctvCovered: true },
      { id: 'ec-node-3', name: 'E-City Police Station Post', lat: 12.8455, lng: 77.6680, isLit: true, cctvCovered: true },
      { id: 'ec-node-4', name: 'HP 24/7 Auto Care Forecourt', lat: 12.8440, lng: 77.6710, isLit: true, cctvCovered: true },
      { id: 'ec-node-5', name: 'Neeladri Road Commercial Link', lat: 12.8425, lng: 77.6730, isLit: true, cctvCovered: true },
      { id: 'ec-node-6', name: 'Neeladri Road Highrise Township', lat: 12.8410, lng: 77.6745, isLit: true, cctvCovered: true },

      // Dark Shortcut (Street aligned: south along Bettadasanapura village lane -> east through mud track -> into Neeladri)
      { id: 'ec-dark-1', name: 'Bettadasanapura Unlit Village Lane', lat: 12.8445, lng: 77.6620, isLit: false, cctvCovered: false },
      { id: 'ec-dark-2', name: 'Vacant Compound Mud Track', lat: 12.8445, lng: 77.6685, isLit: false, cctvCovered: false },
      { id: 'ec-dark-3', name: 'Culvert Boundary Gap', lat: 12.8415, lng: 77.6685, isLit: false, cctvCovered: false }
    ],
    segments: [
      // Safe Route (1.7 km, 20 mins)
      { id: 'ec-s-1', fromNodeId: 'ec-node-1', toNodeId: 'ec-node-2', distanceMeters: 380, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: 'Phase 1 Main Road' },
      { id: 'ec-s-2', fromNodeId: 'ec-node-2', toNodeId: 'ec-node-3', distanceMeters: 360, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: 'Phase 1 Main Road' },
      { id: 'ec-s-3', fromNodeId: 'ec-node-3', toNodeId: 'ec-node-4', distanceMeters: 370, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: 'Phase 1 Main Road' },
      { id: 'ec-s-4', fromNodeId: 'ec-node-4', toNodeId: 'ec-node-5', distanceMeters: 280, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: 'Neeladri Link Road' },
      { id: 'ec-s-5', fromNodeId: 'ec-node-5', toNodeId: 'ec-node-6', distanceMeters: 240, isLit: true, hasActiveFrontage: true, surfaceType: 'secondary_road', streetName: 'Neeladri Avenue' },

      // Dark Shortcut (750m, 9 mins - saves 11 mins, but pitch dark!): 190 + 210 + 200 + 150 = 750m
      { id: 'ec-d-1', fromNodeId: 'ec-node-1', toNodeId: 'ec-dark-1', distanceMeters: 190, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'Bettadasanapura Lane' },
      { id: 'ec-d-2', fromNodeId: 'ec-dark-1', toNodeId: 'ec-dark-2', distanceMeters: 210, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'Vacant Compound Mud Track' },
      { id: 'ec-d-3', fromNodeId: 'ec-dark-2', toNodeId: 'ec-dark-3', distanceMeters: 200, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'Culvert Boundary Gap' },
      { id: 'ec-d-4', fromNodeId: 'ec-dark-3', toNodeId: 'ec-node-6', distanceMeters: 150, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'Township Fence Gap' }
    ]
  },

  // 6. HSR Layout Corridor
  {
    id: 'hsr-bda-sector1',
    name: 'HSR BDA Complex to 27th Main Sector 1',
    nameKn: 'ಎಚ್‌ಎಸ್‌ಆರ್ ಬಿಡಿಎ ಕಾಂಪ್ಲೆಕ್ಸ್ ಇಂದ 27ನೇ ಮುಖ್ಯರಸ್ತೆ',
    nameHi: 'एचएसआर बीडीए कॉम्प्लेक्स से 27वीं मेन सेक्टर 1',
    nameNe: 'एचएसआर बीडीए कम्प्लेक्सबाट २७औं मेन सेक्टर १',
    area: 'South-East Bengaluru (HSR Layout)',
    description: 'High-visibility corridor linking BDA commercial square with residential societies along 27th Main high street.',
    startNodeId: 'hsr-node-1',
    endNodeId: 'hsr-node-6',
    center: { lat: 12.9140, lng: 77.6450 },
    zoom: 15,
    publicTransit: {
      lineName: 'BMTC Bus 500-A',
      vehicleType: 'BMTC Bus',
      boardingStop: 'HSR BDA Complex Bus Bay',
      alightingStop: '27th Main 13th Cross',
      departureFrequencyText: 'Every 6 mins',
      rideDurationMinutes: 5,
      walkToStopMinutes: 1,
      walkFromStopMinutes: 2,
      safetyRating: 'High • 24/7 lit commercial avenue',
    },
    sanctuaries: [
      {
        id: 'sanc-ioc-hsr',
        name: 'Indian Oil 24/7 Oasis',
        nameKn: 'ಇಂಡಿಯನ್ ಆಯಿಲ್ ಬಂಕ್',
        nameHi: 'इंडियन ऑयल पेट्रोल पंप',
        nameNe: 'इन्डियन आयल पेट्रोल पम्प',
        type: 'petrol_bunk',
        lat: 12.9135,
        lng: 77.6430,
        address: '14th Main Rd, Sector 6, HSR Layout',
        isOpen24x7: true,
        isStaffed: true,
        lightingRating: 5,
        contactNumber: '+91 80 2572 8844',
        description: 'Bright 24/7 forecourt with 2 armed guards, convenience store, and continuous vehicular traffic.'
      },
      {
        id: 'sanc-apollo-hsr',
        name: 'Apollo Pharmacy 24x7',
        nameKn: 'ಅಪೊಲೊ ಫಾರ್ಮಸಿ',
        nameHi: 'अपोलो फार्मेसी',
        nameNe: 'अपोलो फार्मेसी',
        type: 'pharmacy',
        lat: 12.9150,
        lng: 77.6475,
        address: '27th Main Road, Sector 1, HSR Layout',
        isOpen24x7: true,
        isStaffed: true,
        lightingRating: 5,
        contactNumber: '+91 80 4110 5000',
        description: '24-hour brightly lit chemist with on-duty security guard and outdoor emergency phone.'
      },
      {
        id: 'sanc-bcp-hsr',
        name: 'BCP Police Suraksha Post',
        nameKn: 'ಪೊಲೀಸ್ ಚೌಕಿ',
        nameHi: 'पुलिस सुरक्षा चौकी',
        nameNe: 'प्रहरी चौकी',
        type: 'police_kiosk',
        lat: 12.9120,
        lng: 77.6400,
        address: '14th Main Junction, HSR Layout',
        isOpen24x7: true,
        isStaffed: true,
        lightingRating: 5,
        contactNumber: '112',
        description: 'Manned police outpost with 24/7 patrol squad.'
      }
    ],
    nodes: [
      { id: 'hsr-node-1', name: 'HSR BDA Complex 14th Main', lat: 12.9115, lng: 77.6385, isLit: true, cctvCovered: true },
      { id: 'hsr-node-2', name: 'BCP Police Suraksha Post', lat: 12.9120, lng: 77.6400, isLit: true, cctvCovered: true },
      { id: 'hsr-node-3', name: 'Indian Oil 24/7 Oasis', lat: 12.9135, lng: 77.6430, isLit: true, cctvCovered: true },
      { id: 'hsr-node-4', name: '27th Main Commercial Avenue', lat: 12.9145, lng: 77.6460, isLit: true, cctvCovered: true },
      { id: 'hsr-node-5', name: 'Apollo Pharmacy 24x7 Corner', lat: 12.9150, lng: 77.6475, isLit: true, cctvCovered: true },
      { id: 'hsr-node-6', name: '27th Main Sector 1 Park', lat: 12.9168, lng: 77.6520, isLit: true, cctvCovered: true },

      // Dark Shortcut (Stormwater canal bund road behind Sector 3)
      { id: 'hsr-dark-1', name: 'Sector 3 Drain Service Road', lat: 12.9150, lng: 77.6385, isLit: false, cctvCovered: false },
      { id: 'hsr-dark-2', name: 'Unlit Canal Bund Pathway', lat: 12.9168, lng: 77.6440, isLit: false, cctvCovered: false },
      { id: 'hsr-dark-3', name: 'Sector 1 Park Rear Boundary', lat: 12.9168, lng: 77.6490, isLit: false, cctvCovered: false }
    ],
    segments: [
      // Safe Route (1.5 km, 18 mins)
      { id: 'hsr-s-1', fromNodeId: 'hsr-node-1', toNodeId: 'hsr-node-2', distanceMeters: 170, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: '14th Main Road' },
      { id: 'hsr-s-2', fromNodeId: 'hsr-node-2', toNodeId: 'hsr-node-3', distanceMeters: 360, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: '14th Main Road' },
      { id: 'hsr-s-3', fromNodeId: 'hsr-node-3', toNodeId: 'hsr-node-4', distanceMeters: 350, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: '27th Main High Street' },
      { id: 'hsr-s-4', fromNodeId: 'hsr-node-4', toNodeId: 'hsr-node-5', distanceMeters: 180, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: '27th Main High Street' },
      { id: 'hsr-s-5', fromNodeId: 'hsr-node-5', toNodeId: 'hsr-node-6', distanceMeters: 480, isLit: true, hasActiveFrontage: true, surfaceType: 'secondary_road', streetName: 'Sector 1 Park Avenue' },

      // Dark Shortcut (710m, 8 mins - saves 10 mins, but unlit canal!)
      { id: 'hsr-d-1', fromNodeId: 'hsr-node-1', toNodeId: 'hsr-dark-1', distanceMeters: 190, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'Drain Service Road' },
      { id: 'hsr-d-2', fromNodeId: 'hsr-dark-1', toNodeId: 'hsr-dark-2', distanceMeters: 220, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'Canal Bund Pathway' },
      { id: 'hsr-d-3', fromNodeId: 'hsr-dark-2', toNodeId: 'hsr-dark-3', distanceMeters: 180, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'Park Rear Boundary' },
      { id: 'hsr-d-4', fromNodeId: 'hsr-dark-3', toNodeId: 'hsr-node-6', distanceMeters: 120, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'Fence Breach Gap' }
    ]
  },

  // 7. MG Road / Church Street Corridor
  {
    id: 'mgroad-churchstreet-residency',
    name: 'MG Road Metro to Residency Road Galleria',
    nameKn: 'ಎಂಜಿ ರಸ್ತೆ ಮೆಟ್ರೋ ಇಂದ ರೆಸಿಡೆನ್ಸಿ ರಸ್ತೆ',
    nameHi: 'एमजी रोड मेट्रो से रेजीडेंसी रोड',
    nameNe: 'एमजी रोड मेट्रोबाट रेसिडेन्सी रोड',
    area: 'Central Bengaluru (MG Road & Brigade Road CBD)',
    description: 'Central pedestrian precinct linking Namma Metro with commercial towers along vibrant illuminated boulevards.',
    startNodeId: 'mg-node-1',
    endNodeId: 'mg-node-6',
    center: { lat: 12.9730, lng: 77.6080 },
    zoom: 16,
    publicTransit: {
      lineName: 'Metro Purple Line / G-2',
      vehicleType: 'Metro Feeder',
      boardingStop: 'MG Road Metro Station Gate 2',
      alightingStop: 'Brigade Road Junction',
      departureFrequencyText: 'Every 4 mins',
      rideDurationMinutes: 3,
      walkToStopMinutes: 1,
      walkFromStopMinutes: 2,
      safetyRating: 'Highest • Continuous CCTV surveillance & foot patrols',
    },
    sanctuaries: [
      {
        id: 'sanc-bcp-brigade',
        name: 'Brigade Road Police Kiosk',
        nameKn: 'ಬ್ರಿಗೇಡ್ ರಸ್ತೆ ಪೊಲೀಸ್ ಚೌಕಿ',
        nameHi: 'ब्रिगेड रोड पुलिस बूथ',
        nameNe: 'प्रहरी चौकी',
        type: 'police_kiosk',
        lat: 12.9735,
        lng: 77.6075,
        address: 'Brigade Rd & Church St Junction',
        isOpen24x7: true,
        isStaffed: true,
        lightingRating: 5,
        contactNumber: '112',
        description: '24/7 active police assistance booth with CCTV display wall and armed marshals.'
      },
      {
        id: 'sanc-shell-residency',
        name: 'Shell Mobility Oasis',
        nameKn: 'ಶೆಲ್ ಪೆಟ್ರೋಲ್ ಬಂಕ್',
        nameHi: 'शेल पेट्रोल पंप',
        nameNe: 'शेल पेट्रोल पम्प',
        type: 'petrol_bunk',
        lat: 12.9715,
        lng: 77.6085,
        address: 'Residency Rd, Ashok Nagar',
        isOpen24x7: true,
        isStaffed: true,
        lightingRating: 5,
        contactNumber: '+91 80 2221 4455',
        description: '24/7 brightly lit fuel forecourt with convenience store, bright LED canopy, and security.'
      }
    ],
    nodes: [
      { id: 'mg-node-1', name: 'MG Road Metro Gate 2', lat: 12.9755, lng: 77.6065, isLit: true, cctvCovered: true },
      { id: 'mg-node-2', name: 'Church Street Pedestrian Promenade', lat: 12.9745, lng: 77.6070, isLit: true, cctvCovered: true },
      { id: 'mg-node-3', name: 'Brigade Road Police Kiosk', lat: 12.9735, lng: 77.6075, isLit: true, cctvCovered: true },
      { id: 'mg-node-4', name: 'Brigade Road Commercial Boulevard', lat: 12.9722, lng: 77.6080, isLit: true, cctvCovered: true },
      { id: 'mg-node-5', name: 'Shell Mobility Oasis Forecourt', lat: 12.9715, lng: 77.6085, isLit: true, cctvCovered: true },
      { id: 'mg-node-6', name: 'Residency Road Galleria', lat: 12.9698, lng: 77.6098, isLit: true, cctvCovered: true },

      // Dark Shortcut (Rest House Crescent unlit service alley)
      { id: 'mg-dark-1', name: 'Rest House Rear Narrow Alley', lat: 12.9740, lng: 77.6055, isLit: false, cctvCovered: false },
      { id: 'mg-dark-2', name: 'Museum Rd Dark Culvert', lat: 12.9715, lng: 77.6060, isLit: false, cctvCovered: false },
      { id: 'mg-dark-3', name: 'Residency Rear Unlit Gate', lat: 12.9700, lng: 77.6075, isLit: false, cctvCovered: false }
    ],
    segments: [
      // Safe Route (1.2 km, 15 mins)
      { id: 'mg-s-1', fromNodeId: 'mg-node-1', toNodeId: 'mg-node-2', distanceMeters: 140, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: 'Church Street' },
      { id: 'mg-s-2', fromNodeId: 'mg-node-2', toNodeId: 'mg-node-3', distanceMeters: 130, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: 'Church Street' },
      { id: 'mg-s-3', fromNodeId: 'mg-node-3', toNodeId: 'mg-node-4', distanceMeters: 260, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: 'Brigade Road' },
      { id: 'mg-s-4', fromNodeId: 'mg-node-4', toNodeId: 'mg-node-5', distanceMeters: 210, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: 'Residency Road Link' },
      { id: 'mg-s-5', fromNodeId: 'mg-node-5', toNodeId: 'mg-node-6', distanceMeters: 380, isLit: true, hasActiveFrontage: true, surfaceType: 'secondary_road', streetName: 'Residency Road' },

      // Dark Shortcut (580m, 7 mins - saves 8 mins, but unlit alley!)
      { id: 'mg-d-1', fromNodeId: 'mg-node-1', toNodeId: 'mg-dark-1', distanceMeters: 160, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'Rest House Alley' },
      { id: 'mg-d-2', fromNodeId: 'mg-dark-1', toNodeId: 'mg-dark-2', distanceMeters: 170, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'Museum Rd Culvert' },
      { id: 'mg-d-3', fromNodeId: 'mg-dark-2', toNodeId: 'mg-dark-3', distanceMeters: 150, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'Residency Rear Gate' },
      { id: 'mg-d-4', fromNodeId: 'mg-dark-3', toNodeId: 'mg-node-6', distanceMeters: 100, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'Backyard Cut' }
    ]
  },

  // 8. Manyata Tech Park / Nagavara Corridor
  {
    id: 'manyata-nagavara-orrg',
    name: 'Manyata Tech Park Gate 1 to Thanisandra Main',
    nameKn: 'ಮಾನ್ಯತಾ ಟೆಕ್ ಪಾರ್ಕ್ ಇಂದ ತಣಿಸಂದ್ರ ಮುಖ್ಯರಸ್ತೆ',
    nameHi: 'मान्यता टेक पार्क से थानिसंद्रा मेन रोड',
    nameNe: 'मान्यता टेक पार्कबाट थानिसन्द्रा मुख्य सडक',
    area: 'North Bengaluru (Hebbal / Nagavara IT Corridor)',
    description: 'Arterial commute connecting North Bengaluru tech campus with outer ring road residential societies.',
    startNodeId: 'man-node-1',
    endNodeId: 'man-node-6',
    center: { lat: 13.0450, lng: 77.6250 },
    zoom: 15,
    publicTransit: {
      lineName: 'BMTC Bus 500-D / KIA-8',
      vehicleType: 'BMTC Bus',
      boardingStop: 'Manyata Tech Park Gate 1 Bay',
      alightingStop: 'Thanisandra Junction',
      departureFrequencyText: 'Every 5 mins',
      rideDurationMinutes: 5,
      walkToStopMinutes: 1,
      walkFromStopMinutes: 2,
      safetyRating: 'High • Frequent airport & tech feeder buses',
    },
    sanctuaries: [
      {
        id: 'sanc-shell-manyata',
        name: 'Shell Nagavara 24/7 Forecourt',
        nameKn: 'ಶೆಲ್ ಪೆಟ್ರೋಲ್ ಬಂಕ್',
        nameHi: 'शेल पेट्रोल पंप',
        nameNe: 'शेल पेट्रोल पम्प',
        type: 'petrol_bunk',
        lat: 13.0465,
        lng: 77.6240,
        address: 'Outer Ring Rd, Nagavara, near Manyata',
        isOpen24x7: true,
        isStaffed: true,
        lightingRating: 5,
        contactNumber: '+91 80 2544 3322',
        description: '24/7 brightly illuminated forecourt with active night staff, deli, and continuous security.'
      },
      {
        id: 'sanc-manyata-security',
        name: 'Manyata Main Security Kiosk',
        nameKn: 'ಮಾನ್ಯತಾ ಭದ್ರತಾ ಕಿಯೋಸ್ಕ್',
        nameHi: 'मान्यता मुख्य सुरक्षा कियोस्क',
        nameNe: 'सुरक्षा चौकी',
        type: 'police_kiosk',
        lat: 13.0480,
        lng: 77.6215,
        address: 'Gate 1, Manyata Embassy Business Park',
        isOpen24x7: true,
        isStaffed: true,
        lightingRating: 5,
        contactNumber: '+91 80 4179 0000',
        description: '24/7 campus security hub with 12 uniformed guards and emergency response van.'
      }
    ],
    nodes: [
      { id: 'man-node-1', name: 'Manyata Tech Park Gate 1', lat: 13.0485, lng: 77.6210, isLit: true, cctvCovered: true },
      { id: 'man-node-2', name: 'Manyata Security Kiosk', lat: 13.0480, lng: 77.6215, isLit: true, cctvCovered: true },
      { id: 'man-node-3', name: 'ORR Service Road (Bright)', lat: 13.0470, lng: 77.6230, isLit: true, cctvCovered: true },
      { id: 'man-node-4', name: 'Shell Nagavara 24/7 Forecourt', lat: 13.0465, lng: 77.6240, isLit: true, cctvCovered: true },
      { id: 'man-node-5', name: 'Nagavara Junction Link', lat: 13.0435, lng: 77.6270, isLit: true, cctvCovered: true },
      { id: 'man-node-6', name: 'Thanisandra Main Road Junction', lat: 13.0410, lng: 77.6295, isLit: true, cctvCovered: true },

      // Dark Shortcut (Nagavara village back-canal bund)
      { id: 'man-dark-1', name: 'Nagavara Rear Compound Wall Lane', lat: 13.0465, lng: 77.6210, isLit: false, cctvCovered: false },
      { id: 'man-dark-2', name: 'Unlit Canal Bund Pathway', lat: 13.0435, lng: 77.6240, isLit: false, cctvCovered: false },
      { id: 'man-dark-3', name: 'Thanisandra Village Dirt Cut', lat: 13.0410, lng: 77.6265, isLit: false, cctvCovered: false }
    ],
    segments: [
      // Safe Route (1.6 km, 19 mins)
      { id: 'man-s-1', fromNodeId: 'man-node-1', toNodeId: 'man-node-2', distanceMeters: 90, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: 'Manyata Gate 1 Way' },
      { id: 'man-s-2', fromNodeId: 'man-node-2', toNodeId: 'man-node-3', distanceMeters: 210, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: 'ORR Service Road' },
      { id: 'man-s-3', fromNodeId: 'man-node-3', toNodeId: 'man-node-4', distanceMeters: 170, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: 'ORR Service Road' },
      { id: 'man-s-4', fromNodeId: 'man-node-4', toNodeId: 'man-node-5', distanceMeters: 560, isLit: true, hasActiveFrontage: true, surfaceType: 'paved_main', streetName: 'ORR Service Road' },
      { id: 'man-s-5', fromNodeId: 'man-node-5', toNodeId: 'man-node-6', distanceMeters: 450, isLit: true, hasActiveFrontage: true, surfaceType: 'secondary_road', streetName: 'Thanisandra Main' },

      // Dark Shortcut (690m, 8 mins - saves 11 mins, but pitch dark!)
      { id: 'man-d-1', fromNodeId: 'man-node-1', toNodeId: 'man-dark-1', distanceMeters: 180, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'Rear Compound Lane' },
      { id: 'man-d-2', fromNodeId: 'man-dark-1', toNodeId: 'man-dark-2', distanceMeters: 220, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'Canal Bund Path' },
      { id: 'man-d-3', fromNodeId: 'man-dark-2', toNodeId: 'man-dark-3', distanceMeters: 190, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'Village Dirt Cut' },
      { id: 'man-d-4', fromNodeId: 'man-dark-3', toNodeId: 'man-node-6', distanceMeters: 100, isLit: false, hasActiveFrontage: false, surfaceType: 'dirt_trail', streetName: 'Boundary Breach' }
    ]
  }
];
