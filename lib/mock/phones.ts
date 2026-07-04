import type { Phone, PhoneSpecSection } from '@/lib/mock/types';
import { PHONE_IMAGES } from '@/lib/mock/phone-images';

const connectivity = (
  rows: { labelEn: string; labelFr: string; valueEn: string; valueFr?: string }[],
): PhoneSpecSection => ({
  id: 'connectivity',
  titleEn: 'Connectivity',
  titleFr: 'Connectivité',
  rows: rows.map((r) => ({
    labelEn: r.labelEn,
    labelFr: r.labelFr,
    valueEn: r.valueEn,
    valueFr: r.valueFr ?? r.valueEn,
  })),
});

const memory = (
  storage: string,
  expandable: string,
  ram: string,
): PhoneSpecSection => ({
  id: 'memory',
  titleEn: 'Memory',
  titleFr: 'Mémoire',
  rows: [
    { labelEn: 'Internal Storage', labelFr: 'Stockage interne', valueEn: storage, valueFr: storage },
    { labelEn: 'Expandable', labelFr: 'Extensible', valueEn: expandable, valueFr: expandable },
    { labelEn: 'RAM', labelFr: 'RAM', valueEn: ram, valueFr: ram },
  ],
});

const dimensions = (volume: string, weight: string, form: string): PhoneSpecSection => ({
  id: 'dimensions',
  titleEn: 'Dimensions',
  titleFr: 'Dimensions',
  rows: [
    { labelEn: 'Volume', labelFr: 'Volume', valueEn: volume, valueFr: volume },
    { labelEn: 'Weight', labelFr: 'Poids', valueEn: weight, valueFr: weight },
    { labelEn: 'Form Factor', labelFr: 'Facteur de forme', valueEn: form, valueFr: form },
  ],
});

export const PHONES: Phone[] = [
  {
    id: 'tcl-k12',
    image: PHONE_IMAGES['tcl-k12'],
    nameEn: 'TCL K12',
    nameFr: 'TCL K12',
    price: 145.6,
    descriptionEn:
      'The K12 has brilliant visuals on a 6.56" HD+ display. The 90Hz refresh rate will make viewing your favorite sports, shows, and apps smoother and immersive. The 8MP AI-powered rear camera system and 2MP front camera allows to capture everyday moments.',
    descriptionFr:
      'Le K12 offre des visuels éclatants sur un écran HD+ de 6,56 po. La fréquence de rafraîchissement de 90 Hz rend le visionnement de vos sports, émissions et applications plus fluide et immersif. Le système de caméra arrière 8 MP avec IA et la caméra avant 2 MP vous permettent de capturer les moments du quotidien.',
    inBoxEn: ['Type C 2.0 Cable', 'Quick Start Guide', 'SIM card PIN'],
    inBoxFr: ['Câble Type C 2.0', 'Guide de démarrage rapide', 'NIP de carte SIM'],
    voLTE: true,
    buyAtTsc: true,
    brand: 'tcl',
    formFactor: 'smartphone',
    specs: [
      {
        id: 'cpu',
        titleEn: 'CPU & Interface',
        titleFr: 'Processeur et interface',
        rows: [
          { labelEn: 'Processor', labelFr: 'Processeur', valueEn: 'Octa-core 2.2GHz', valueFr: 'Octa-core 2,2 GHz' },
          { labelEn: 'Platform/Operating System', labelFr: 'Plateforme/Système', valueEn: 'Android 16 Go', valueFr: 'Android 16 Go' },
        ],
      },
      {
        id: 'display',
        titleEn: 'Display',
        titleFr: 'Écran',
        rows: [
          { labelEn: 'Size', labelFr: 'Taille', valueEn: '6.6"', valueFr: '6,6 po' },
          { labelEn: 'Resolution', labelFr: 'Résolution', valueEn: '720x1612', valueFr: '720x1612' },
          { labelEn: 'Screen Type', labelFr: "Type d'écran", valueEn: 'NXTVision Display', valueFr: 'Écran NXTVision' },
          { labelEn: 'Refresh Rate', labelFr: 'Fréquence de rafraîchissement', valueEn: '90Hz', valueFr: '90 Hz' },
        ],
      },
      {
        id: 'camera',
        titleEn: 'Camera & Video',
        titleFr: 'Caméra et vidéo',
        rows: [
          { labelEn: 'Resolution (Rear)', labelFr: 'Résolution (arrière)', valueEn: '8MP', valueFr: '8 MP' },
          { labelEn: 'Resolution (Front)', labelFr: 'Résolution (avant)', valueEn: '2MP', valueFr: '2 MP' },
        ],
      },
      {
        id: 'battery',
        titleEn: 'Battery',
        titleFr: 'Batterie',
        rows: [
          { labelEn: 'Capacity', labelFr: 'Capacité', valueEn: '4000mAh', valueFr: '4000 mAh' },
          { labelEn: 'Wired Charging', labelFr: 'Charge filaire', valueEn: 'USB-C', valueFr: 'USB-C' },
          { labelEn: 'Wireless Charging', labelFr: 'Charge sans fil', valueEn: 'No', valueFr: 'Non' },
        ],
      },
      connectivity([
        { labelEn: 'Wi-Fi Calling', labelFr: 'Appels Wi-Fi', valueEn: 'Yes', valueFr: 'Oui' },
        { labelEn: 'VoLTE Support', labelFr: 'Prise en charge VoLTE', valueEn: 'Yes', valueFr: 'Oui' },
        { labelEn: 'LTE Bands', labelFr: 'Bandes LTE', valueEn: 'B1/2/3/4/5/7/12/13/17/20/25/26/28/38/41/66/71' },
        { labelEn: '5G Bands', labelFr: 'Bandes 5G', valueEn: 'N/A' },
        { labelEn: 'SIM Card (physical)', labelFr: 'Carte SIM (physique)', valueEn: 'Nano', valueFr: 'Nano' },
        { labelEn: 'eSIM', labelFr: 'eSIM', valueEn: 'No', valueFr: 'Non' },
      ]),
      memory('64GB', 'Yes', '3GB'),
      dimensions('164.36 x 75.04 x 8.4 mm', '174g', 'Bar'),
      {
        id: 'other',
        titleEn: 'Other',
        titleFr: 'Autre',
        rows: [
          { labelEn: 'Finger Print Sensor', labelFr: "Capteur d'empreintes", valueEn: 'No', valueFr: 'Non' },
          { labelEn: 'Facial Recognition', labelFr: 'Reconnaissance faciale', valueEn: 'Yes', valueFr: 'Oui' },
        ],
      },
    ],
  },
  {
    id: 'nubia-a76',
    image: PHONE_IMAGES['nubia-a76'],
    nameEn: 'Nubia A76',
    nameFr: 'Nubia A76',
    price: 137,
    descriptionEn:
      'With triple-rear cameras and AI smart settings that deliver rich, high-quality photos and video. The Nubia A76 delivers a lot of power with its sleek design and ultra-wide 6.52-inch HD+ display.',
    descriptionFr:
      'Avec trois caméras arrière et des réglages intelligents IA pour des photos et vidéos de haute qualité. Le Nubia A76 offre beaucoup de puissance avec son design élégant et son écran HD+ ultra-large de 6,52 po.',
    inBoxEn: ['Charger', 'USB cable', 'Quick start guide', 'Warranty card'],
    inBoxFr: ['Chargeur', 'Câble USB', 'Guide de démarrage rapide', 'Carte de garantie'],
    voLTE: true,
    buyAtTsc: true,
    brand: 'nubia',
    formFactor: 'smartphone',
    specs: [
      {
        id: 'cpu',
        titleEn: 'CPU & Interface',
        titleFr: 'Processeur et interface',
        rows: [
          { labelEn: 'Processor', labelFr: 'Processeur', valueEn: 'SM6115 Octa-core Max 2.0GHz', valueFr: 'SM6115 Octa-core Max 2,0 GHz' },
          { labelEn: 'Platform/Operating System', labelFr: 'Plateforme/Système', valueEn: 'Android 15', valueFr: 'Android 15' },
        ],
      },
      {
        id: 'display',
        titleEn: 'Display',
        titleFr: 'Écran',
        rows: [
          { labelEn: 'Size', labelFr: 'Taille', valueEn: '6.5"', valueFr: '6,5 po' },
          { labelEn: 'Resolution', labelFr: 'Résolution', valueEn: '1600x720 HD+', valueFr: '1600x720 HD+' },
          { labelEn: 'Refresh Rate', labelFr: 'Fréquence de rafraîchissement', valueEn: '90Hz', valueFr: '90 Hz' },
        ],
      },
      {
        id: 'camera',
        titleEn: 'Camera & Video',
        titleFr: 'Caméra et vidéo',
        rows: [
          { labelEn: 'Resolution (Rear)', labelFr: 'Résolution (arrière)', valueEn: '13MP + 2MP + 2MP', valueFr: '13 MP + 2 MP + 2 MP' },
          { labelEn: 'Resolution (Front)', labelFr: 'Résolution (avant)', valueEn: '8MP', valueFr: '8 MP' },
          { labelEn: 'Video Recording Resolution', labelFr: 'Résolution vidéo', valueEn: '1080p @ 30fps', valueFr: '1080p @ 30 i/s' },
        ],
      },
      {
        id: 'battery',
        titleEn: 'Battery',
        titleFr: 'Batterie',
        rows: [
          { labelEn: 'Capacity', labelFr: 'Capacité', valueEn: '5000 mAh', valueFr: '5000 mAh' },
          { labelEn: 'Wired Charging', labelFr: 'Charge filaire', valueEn: '10W Fast Charging', valueFr: 'Charge rapide 10 W' },
          { labelEn: 'Wireless Charging', labelFr: 'Charge sans fil', valueEn: 'No', valueFr: 'Non' },
        ],
      },
      connectivity([
        { labelEn: 'Wi-Fi Calling', labelFr: 'Appels Wi-Fi', valueEn: 'Yes', valueFr: 'Oui' },
        { labelEn: 'VoLTE Support', labelFr: 'Prise en charge VoLTE', valueEn: 'Yes', valueFr: 'Oui' },
        { labelEn: 'LTE Bands', labelFr: 'Bandes LTE', valueEn: 'B2/4/5/7/12(MFBI)/13/66(MFBI)/B71' },
        { labelEn: 'Bluetooth Support', labelFr: 'Bluetooth', valueEn: 'Yes 5.0', valueFr: 'Oui 5.0' },
        { labelEn: 'SIM Card (physical)', labelFr: 'Carte SIM (physique)', valueEn: 'Nano', valueFr: 'Nano' },
        { labelEn: 'eSIM', labelFr: 'eSIM', valueEn: 'No', valueFr: 'Non' },
      ]),
      memory('64GB', 'Up to 512GB', '4GB'),
      dimensions('164 x 76 x 9 mm', '191g', 'Bar'),
      {
        id: 'other',
        titleEn: 'Other',
        titleFr: 'Autre',
        rows: [
          { labelEn: 'Finger Print Sensor', labelFr: "Capteur d'empreintes", valueEn: 'Yes', valueFr: 'Oui' },
          { labelEn: 'Facial Recognition', labelFr: 'Reconnaissance faciale', valueEn: 'Yes', valueFr: 'Oui' },
        ],
      },
    ],
  },
  {
    id: 'samsung-galaxy-a17',
    image: PHONE_IMAGES['samsung-galaxy-a17'],
    nameEn: 'Samsung Galaxy A17',
    nameFr: 'Samsung Galaxy A17',
    price: 315.89,
    descriptionEn:
      'Capture memories in vivid detail with Galaxy A17. With its triple-lens camera, taking picture-perfect moments feels effortless every time.',
    descriptionFr:
      'Capturez des souvenirs en détail éclatant avec le Galaxy A17. Grâce à sa caméra triple objectif, immortaliser des moments parfaits devient un jeu d\'enfant.',
    inBoxEn: ['Data Cable (C to C)', 'Ejection Pin'],
    inBoxFr: ['Câble de données (C vers C)', "Épingle d'éjection"],
    voLTE: true,
    buyAtTsc: true,
    brand: 'samsung',
    formFactor: 'smartphone',
    specs: [
      {
        id: 'cpu',
        titleEn: 'CPU & Interface',
        titleFr: 'Processeur et interface',
        rows: [
          { labelEn: 'Processor', labelFr: 'Processeur', valueEn: 'Exynos 1330', valueFr: 'Exynos 1330' },
          { labelEn: 'Platform/Operating System', labelFr: 'Plateforme/Système', valueEn: 'Android 16', valueFr: 'Android 16' },
        ],
      },
      {
        id: 'display',
        titleEn: 'Display',
        titleFr: 'Écran',
        rows: [
          { labelEn: 'Size', labelFr: 'Taille', valueEn: '6.7"', valueFr: '6,7 po' },
          { labelEn: 'Resolution', labelFr: 'Résolution', valueEn: '1080 x 2340', valueFr: '1080 x 2340' },
          { labelEn: 'Screen Type', labelFr: "Type d'écran", valueEn: 'FHD+ Super AMOLED', valueFr: 'FHD+ Super AMOLED' },
          { labelEn: 'Refresh Rate', labelFr: 'Fréquence de rafraîchissement', valueEn: '90Hz', valueFr: '90 Hz' },
        ],
      },
      {
        id: 'camera',
        titleEn: 'Camera & Video',
        titleFr: 'Caméra et vidéo',
        rows: [
          {
            labelEn: 'Resolution (Rear)',
            labelFr: 'Résolution (arrière)',
            valueEn: 'Wide: 50MP, Ultrawide: 5MP, Macro: 2MP',
            valueFr: 'Grand angle : 50 MP, Ultra grand angle : 5 MP, Macro : 2 MP',
          },
          { labelEn: 'Resolution (Front)', labelFr: 'Résolution (avant)', valueEn: '13MP', valueFr: '13 MP' },
          { labelEn: 'Video Recording Resolution', labelFr: 'Résolution vidéo', valueEn: 'FHD (1920 x 1080) @30fps', valueFr: 'FHD (1920 x 1080) @30 i/s' },
        ],
      },
      {
        id: 'battery',
        titleEn: 'Battery',
        titleFr: 'Batterie',
        rows: [
          { labelEn: 'Capacity', labelFr: 'Capacité', valueEn: '5000 mAh', valueFr: '5000 mAh' },
          { labelEn: 'Wired Charging', labelFr: 'Charge filaire', valueEn: '25W Charging with Type C Cable', valueFr: 'Charge 25 W avec câble Type C' },
          { labelEn: 'Wireless Charging', labelFr: 'Charge sans fil', valueEn: 'No', valueFr: 'Non' },
        ],
      },
      connectivity([
        { labelEn: 'Wi-Fi Calling', labelFr: 'Appels Wi-Fi', valueEn: 'Yes', valueFr: 'Oui' },
        { labelEn: 'VoLTE Support', labelFr: 'Prise en charge VoLTE', valueEn: 'Yes', valueFr: 'Oui' },
        { labelEn: 'LTE Bands', labelFr: 'Bandes LTE', valueEn: '1, 2, 3, 4, 5, 7, 12, 13, 20, 25, 29, 30, 38, 39, 40, 41, 66, 71' },
        { labelEn: '5G Bands', labelFr: 'Bandes 5G', valueEn: 'n2, n5, n25, n41, n66, n71, n77, n78' },
        { labelEn: 'NFC', labelFr: 'NFC', valueEn: 'Yes', valueFr: 'Oui' },
        { labelEn: 'SIM Card (physical)', labelFr: 'Carte SIM (physique)', valueEn: 'Nano', valueFr: 'Nano' },
        { labelEn: 'eSIM', labelFr: 'eSIM', valueEn: 'Yes', valueFr: 'Oui' },
      ]),
      memory('128 GB', 'Yes', '4 GB'),
      dimensions('77.9 x 164.4 x 7.5mm', '192g', 'Bar'),
      {
        id: 'other',
        titleEn: 'Other',
        titleFr: 'Autre',
        rows: [
          { labelEn: 'Finger Print Sensor', labelFr: "Capteur d'empreintes", valueEn: 'Yes', valueFr: 'Oui' },
          { labelEn: 'Facial Recognition', labelFr: 'Reconnaissance faciale', valueEn: 'Yes', valueFr: 'Oui' },
          { labelEn: 'IP Rating', labelFr: 'Indice IP', valueEn: 'IP54', valueFr: 'IP54' },
        ],
      },
    ],
  },
  {
    id: 'nubia-a75',
    image: PHONE_IMAGES['nubia-a75'],
    nameEn: 'Nubia A75',
    nameFr: 'Nubia A75',
    price: 124.8,
    descriptionEn:
      'The Nubia A75 offers triple rear cameras, a long-lasting battery, a sleek design, and clear audio.',
    descriptionFr:
      'Le Nubia A75 offre trois caméras arrière, une batterie longue durée, un design élégant et un son clair.',
    inBoxEn: ['Charger', 'USB cable', 'Quick start guide', 'Warranty card'],
    inBoxFr: ['Chargeur', 'Câble USB', 'Guide de démarrage rapide', 'Carte de garantie'],
    voLTE: true,
    buyAtTsc: true,
    brand: 'nubia',
    formFactor: 'smartphone',
    specs: [
      {
        id: 'cpu',
        titleEn: 'CPU & Interface',
        titleFr: 'Processeur et interface',
        rows: [
          { labelEn: 'Processor', labelFr: 'Processeur', valueEn: 'MediaTek MT6762 Octa-core 2.0 GHz', valueFr: 'MediaTek MT6762 Octa-core 2,0 GHz' },
          { labelEn: 'Platform/Operating System', labelFr: 'Plateforme/Système', valueEn: 'Android 13', valueFr: 'Android 13' },
        ],
      },
      {
        id: 'display',
        titleEn: 'Display',
        titleFr: 'Écran',
        rows: [
          { labelEn: 'Size', labelFr: 'Taille', valueEn: '6.52"', valueFr: '6,52 po' },
          { labelEn: 'Resolution', labelFr: 'Résolution', valueEn: '1600x720 HD+', valueFr: '1600x720 HD+' },
          { labelEn: 'Refresh Rate', labelFr: 'Fréquence de rafraîchissement', valueEn: '60 Hz', valueFr: '60 Hz' },
        ],
      },
      {
        id: 'camera',
        titleEn: 'Camera & Video',
        titleFr: 'Caméra et vidéo',
        rows: [
          { labelEn: 'Resolution (Rear)', labelFr: 'Résolution (arrière)', valueEn: '13MP + 2MP + 2MP', valueFr: '13 MP + 2 MP + 2 MP' },
          { labelEn: 'Resolution (Front)', labelFr: 'Résolution (avant)', valueEn: '8MP', valueFr: '8 MP' },
          { labelEn: 'Video Recording Resolution', labelFr: 'Résolution vidéo', valueEn: '1080p @ 30fps', valueFr: '1080p @ 30 i/s' },
        ],
      },
      {
        id: 'battery',
        titleEn: 'Battery',
        titleFr: 'Batterie',
        rows: [
          { labelEn: 'Capacity', labelFr: 'Capacité', valueEn: '5000 mAh', valueFr: '5000 mAh' },
          { labelEn: 'Wired Charging', labelFr: 'Charge filaire', valueEn: '10W Fast Charging', valueFr: 'Charge rapide 10 W' },
          { labelEn: 'Wireless Charging', labelFr: 'Charge sans fil', valueEn: 'No', valueFr: 'Non' },
        ],
      },
      connectivity([
        { labelEn: 'VoLTE Support', labelFr: 'Prise en charge VoLTE', valueEn: 'Yes', valueFr: 'Oui' },
        { labelEn: 'LTE Bands', labelFr: 'Bandes LTE', valueEn: 'B2/4/5/7/12(MFBI)/13/66/71' },
        { labelEn: 'Bluetooth Support', labelFr: 'Bluetooth', valueEn: 'Yes 5.0', valueFr: 'Oui 5.0' },
        { labelEn: 'SIM Card (physical)', labelFr: 'Carte SIM (physique)', valueEn: 'Nano', valueFr: 'Nano' },
        { labelEn: 'eSIM', labelFr: 'eSIM', valueEn: 'No', valueFr: 'Non' },
      ]),
      memory('32GB', 'Up to 512GB', '4GB'),
      dimensions('164 x 76 x 9 mm', '170g', 'Bar'),
      {
        id: 'other',
        titleEn: 'Other',
        titleFr: 'Autre',
        rows: [
          { labelEn: 'Finger Print Sensor', labelFr: "Capteur d'empreintes", valueEn: 'Yes', valueFr: 'Oui' },
        ],
      },
    ],
  },
  {
    id: 'nubia-cymbal-2',
    image: PHONE_IMAGES['nubia-cymbal-2'],
    nameEn: 'Nubia Cymbal 2',
    nameFr: 'Nubia Cymbal 2',
    price: 80,
    descriptionEn:
      'The Nubia Cymbal® 2, an easy-to-use phone with dual displays. It features 2MP camera, 1600mAh removable battery, and sophisticated yet compact design allows for convenient storage in pockets or purses.',
    descriptionFr:
      'Le Nubia Cymbal® 2, un téléphone facile à utiliser avec double écran. Il comprend une caméra 2 MP, une batterie amovible de 1600 mAh et un design sophistiqué mais compact pour un rangement pratique.',
    inBoxEn: ['Charging block', 'Micro USB charging cable', 'Removable 1,600 mAh battery', 'Quick start guide'],
    inBoxFr: ['Bloc de charge', 'Câble de charge Micro USB', 'Batterie amovible 1600 mAh', 'Guide de démarrage rapide'],
    voLTE: true,
    buyAtTsc: true,
    brand: 'nubia',
    formFactor: 'flip',
    specs: [
      {
        id: 'cpu',
        titleEn: 'CPU & Interface',
        titleFr: 'Processeur et interface',
        rows: [
          { labelEn: 'Processor', labelFr: 'Processeur', valueEn: 'QM215 Quad Core 1.2GHz', valueFr: 'QM215 Quad Core 1,2 GHz' },
          { labelEn: 'Platform/Operating System', labelFr: 'Plateforme/Système', valueEn: 'LINUX 3.18.71', valueFr: 'LINUX 3.18.71' },
        ],
      },
      {
        id: 'display',
        titleEn: 'Display',
        titleFr: 'Écran',
        rows: [
          { labelEn: 'Size', labelFr: 'Taille', valueEn: '2.8" primary, 1.77" front display', valueFr: '2,8 po principal, 1,77 po avant' },
          { labelEn: 'Resolution', labelFr: 'Résolution', valueEn: '240 x 320, 141 ppi', valueFr: '240 x 320, 141 ppi' },
          { labelEn: 'Screen Type', labelFr: "Type d'écran", valueEn: 'TFT', valueFr: 'TFT' },
        ],
      },
      {
        id: 'camera',
        titleEn: 'Camera & Video',
        titleFr: 'Caméra et vidéo',
        rows: [
          { labelEn: 'Resolution (Front)', labelFr: 'Résolution (avant)', valueEn: '2MP', valueFr: '2 MP' },
          { labelEn: 'Video Recording Resolution', labelFr: 'Résolution vidéo', valueEn: '480p@ 30fps capture, 1080p@ 30fps playback', valueFr: '480p@ 30 i/s capture, 1080p@ 30 i/s lecture' },
        ],
      },
      {
        id: 'battery',
        titleEn: 'Battery',
        titleFr: 'Batterie',
        rows: [
          { labelEn: 'Capacity', labelFr: 'Capacité', valueEn: '1600 mAh Removable', valueFr: '1600 mAh amovible' },
          { labelEn: 'Wired Charging', labelFr: 'Charge filaire', valueEn: 'Yes', valueFr: 'Oui' },
        ],
      },
      connectivity([
        { labelEn: 'Wi-Fi Calling', labelFr: 'Appels Wi-Fi', valueEn: 'No', valueFr: 'Non' },
        { labelEn: 'VoLTE Support', labelFr: 'Prise en charge VoLTE', valueEn: 'Yes', valueFr: 'Oui' },
        { labelEn: 'LTE Bands', labelFr: 'Bandes LTE', valueEn: 'B2/4/5/7/12(MFBI)/13/66' },
        { labelEn: 'NFC', labelFr: 'NFC', valueEn: 'Yes', valueFr: 'Oui' },
        { labelEn: 'SIM Card (physical)', labelFr: 'Carte SIM (physique)', valueEn: 'Nano', valueFr: 'Nano' },
        { labelEn: 'eSIM', labelFr: 'eSIM', valueEn: 'No', valueFr: 'Non' },
      ]),
      memory('8GB', 'Up to 32GB', '1GB'),
      dimensions('109 x 56.1 x 19.5 mm', '135 g', 'Flip phone'),
    ],
  },
  {
    id: 'tcl-502',
    image: PHONE_IMAGES['tcl-502'],
    nameEn: 'TCL 502',
    nameFr: 'TCL 502',
    price: 115,
    descriptionEn:
      'Thanks to its slim and compact design, the TCL 502 can easily fit in your pocket or bag so it\'s always accessible.',
    descriptionFr:
      'Grâce à son design mince et compact, le TCL 502 se glisse facilement dans votre poche ou votre sac pour un accès permanent.',
    inBoxEn: ['TCL 502', 'Quick Reference Guide', 'Product Safety Information', 'USBC-C Cable', '5V 2A Wall Charger', 'LCD Sticker'],
    inBoxFr: ['TCL 502', 'Guide de référence rapide', 'Information de sécurité', 'Câble USB-C', 'Chargeur mural 5 V 2 A', 'Autocollant LCD'],
    voLTE: true,
    buyAtTsc: true,
    brand: 'tcl',
    formFactor: 'smartphone',
    specs: [
      {
        id: 'display',
        titleEn: 'Display',
        titleFr: 'Écran',
        rows: [
          { labelEn: 'Size', labelFr: 'Taille', valueEn: '6"', valueFr: '6 po' },
          { labelEn: 'Resolution', labelFr: 'Résolution', valueEn: '480x960', valueFr: '480x960' },
          { labelEn: 'Screen Type', labelFr: "Type d'écran", valueEn: 'FW+ IPS LCD', valueFr: 'FW+ IPS LCD' },
          { labelEn: 'Refresh Rate', labelFr: 'Fréquence de rafraîchissement', valueEn: '90 Hz', valueFr: '90 Hz' },
        ],
      },
      {
        id: 'camera',
        titleEn: 'Camera & Video',
        titleFr: 'Caméra et vidéo',
        rows: [
          { labelEn: 'Resolution (Rear)', labelFr: 'Résolution (arrière)', valueEn: '5MP', valueFr: '5 MP' },
          { labelEn: 'Resolution (Front)', labelFr: 'Résolution (avant)', valueEn: '2MP', valueFr: '2 MP' },
          { labelEn: 'Video Recording Resolution', labelFr: 'Résolution vidéo', valueEn: '1080P at 30fps', valueFr: '1080P à 30 i/s' },
        ],
      },
      {
        id: 'battery',
        titleEn: 'Battery',
        titleFr: 'Batterie',
        rows: [
          { labelEn: 'Capacity', labelFr: 'Capacité', valueEn: '3000mAh', valueFr: '3000 mAh' },
          { labelEn: 'Wired Charging', labelFr: 'Charge filaire', valueEn: '5V USB Type C', valueFr: '5 V USB Type C' },
          { labelEn: 'Wireless Charging', labelFr: 'Charge sans fil', valueEn: 'No', valueFr: 'Non' },
        ],
      },
      connectivity([
        { labelEn: 'Wi-Fi Calling', labelFr: 'Appels Wi-Fi', valueEn: 'Yes', valueFr: 'Oui' },
        { labelEn: 'VoLTE Support', labelFr: 'Prise en charge VoLTE', valueEn: 'Yes', valueFr: 'Oui' },
        { labelEn: 'LTE Bands', labelFr: 'Bandes LTE', valueEn: 'B2/B4/B5/B7/B12/B13/B17/B66/B71' },
        { labelEn: 'SIM Card (physical)', labelFr: 'Carte SIM (physique)', valueEn: 'Nano', valueFr: 'Nano' },
        { labelEn: 'eSIM', labelFr: 'eSIM', valueEn: 'No', valueFr: 'Non' },
      ]),
      memory('32GB', 'Yes', '2GB'),
    ],
  },
  {
    id: 'tcl-flip',
    image: PHONE_IMAGES['tcl-flip'],
    nameEn: 'TCL Flip',
    nameFr: 'TCL Flip',
    price: 111,
    descriptionEn:
      'Enjoy easy use thanks to the large keypad and dedicated shortcuts; HD Voice and 4G LTE connectivity.',
    descriptionFr:
      'Profitez d\'une utilisation facile grâce au grand clavier et aux raccourcis dédiés; voix HD et connectivité 4G LTE.',
    inBoxEn: ['TCL Flip', 'Quick Reference Guide', '5V1A Charger', 'USBC-C Cable', 'SIM tool', 'Product Safety Information'],
    inBoxFr: ['TCL Flip', 'Guide de référence rapide', 'Chargeur 5V1A', 'Câble USB-C', 'Outil SIM', 'Information de sécurité'],
    voLTE: true,
    buyAtTsc: false,
    brand: 'tcl',
    formFactor: 'flip',
    specs: [
      {
        id: 'display',
        titleEn: 'Display',
        titleFr: 'Écran',
        rows: [
          { labelEn: 'Size', labelFr: 'Taille', valueEn: '2.8"', valueFr: '2,8 po' },
          { labelEn: 'Resolution', labelFr: 'Résolution', valueEn: 'QVGA (320 x 240)', valueFr: 'QVGA (320 x 240)' },
          { labelEn: 'Screen Type', labelFr: "Type d'écran", valueEn: 'LCD', valueFr: 'LCD' },
        ],
      },
      {
        id: 'camera',
        titleEn: 'Camera & Video',
        titleFr: 'Caméra et vidéo',
        rows: [
          { labelEn: 'Resolution (Rear)', labelFr: 'Résolution (arrière)', valueEn: '2 MP, f2.8', valueFr: '2 MP, f2.8' },
          { labelEn: 'Video Recording Resolution', labelFr: 'Résolution vidéo', valueEn: '480p@30fps capture, 1080p@30fps playback', valueFr: '480p@30 i/s capture, 1080p@30 i/s lecture' },
        ],
      },
      {
        id: 'battery',
        titleEn: 'Battery',
        titleFr: 'Batterie',
        rows: [
          { labelEn: 'Capacity', labelFr: 'Capacité', valueEn: '1850 mAh', valueFr: '1850 mAh' },
        ],
      },
      memory('8GB', 'Micro SD up to 32GB', '1GB'),
      connectivity([
        { labelEn: 'Wi-Fi Calling', labelFr: 'Appels Wi-Fi', valueEn: 'Yes', valueFr: 'Oui' },
        { labelEn: 'VoLTE Support', labelFr: 'Prise en charge VoLTE', valueEn: 'Yes', valueFr: 'Oui' },
        { labelEn: 'LTE Bands', labelFr: 'Bandes LTE', valueEn: 'B2/4/5/7/12/17/13/66/71' },
        { labelEn: 'SIM Card (physical)', labelFr: 'Carte SIM (physique)', valueEn: 'Nano', valueFr: 'Nano' },
        { labelEn: 'eSIM', labelFr: 'eSIM', valueEn: 'No', valueFr: 'Non' },
      ]),
    ],
  },
];

export const PHONE_FAQ_ITEMS = [
  {
    id: 'track-order',
    questionEn: 'How do I track my phone order from TSC?',
    questionFr: 'Comment suivre ma commande de téléphone chez TSC?',
    answerEn: 'For orders placed at TSC, visit TSC.ca or call 1-888-2020-888 for support.',
    answerFr: 'Pour les commandes passées chez TSC, visitez TSC.ca ou appelez le 1-888-2020-888.',
  },
  {
    id: 'contact-tsc',
    questionEn: 'How do I contact TSC about my phone order?',
    questionFr: 'Comment contacter TSC au sujet de ma commande?',
    answerEn: 'Visit TSC.ca or call 1-888-2020-888 for order support.',
    answerFr: 'Visitez TSC.ca ou appelez le 1-888-2020-888 pour le soutien aux commandes.',
  },
  {
    id: 'return-phone',
    questionEn: 'How do I return a phone I bought at TSC?',
    questionFr: 'Comment retourner un téléphone acheté chez TSC?',
    answerEn: 'Contact TSC directly for return policies and instructions on phones purchased through their website.',
    answerFr: 'Contactez TSC directement pour les politiques de retour des téléphones achetés sur leur site.',
  },
] as const;

export function getPhoneById(id: string): Phone | undefined {
  return PHONES.find((p) => p.id === id);
}
