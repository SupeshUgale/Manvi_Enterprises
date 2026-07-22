import amaronBike from '../assets/product/amaron_bike.png';
import amaronB1 from '../assets/product/amrogon_b1.png';
import castrolGTX from '../assets/product/CastrolGTX.png';
import castrolMagnatec from '../assets/product/CastrolMagnatec.png';
import dreams2Eoil from '../assets/product/Dreams2_Eoil.png';
import dreams3Eoil from '../assets/product/Dreams3_Eoil.png';
import dreams4Eoil from '../assets/product/Dreams4_Eoil.png';
import dreamsEoil from '../assets/product/DreamsEoil.png';
import exideGQP850 from '../assets/product/ExideGQP850.png';
import exideGQP1050 from '../assets/product/ExideGQP1050.png';
import luminousEcoVoltNeo1050 from '../assets/product/LuminousEcoVoltNeo1050.png';
import luminousZelio1100 from '../assets/product/luminousZelio1100.png';
import masterLine1L from '../assets/product/MasterLine_1L.jpg';
import masterLineMP3Eoil from '../assets/product/MasterLineMP_3Eoil.png';
import powerzoneB1 from '../assets/product/Powerzone_b1.png';
import powerzoneBike from '../assets/product/powerzone_bick.png';
import shellHelixUltra from '../assets/product/ShellHelixUltra.png';


let products = [
  {
    id: 1,
    name: "Amaron Car Battery",
    category: "Battery",
    subCategory: "Car Battery",
    brand: "Amaron",
    model: "AR60L",
    capacity: "60 Ah",
    warranty: "48 Months",
    technology: "Calcium Maintenance Free",
    rating: 4.8,
    reviews: 156,
    price: 6200,
    originalPrice: 6900,
    discount: 10,
    badge: "Best Seller",
    stock: 40,
    sku: "AMARON-CAR-60AH",
    description: "High-performance maintenance-free Amaron car battery with superior starting power and long service life.",
    features: [
      "Maintenance Free",
      "High Cranking Power",
      "Long Service Life"
    ],
    specifications: {
      voltage: "12V",
      capacity: "60 Ah",
      warranty: "48 Months",
      technology: "Calcium"
    },
    image: amaronB1,
    images: [amaronB1]
  },
  {
    id: 2,
    name: "Powerzone Car Battery",
    category: "Battery",
    subCategory: "Car Battery",
    brand: "Powerzone",
    model: "PZ65D26R",
    capacity: "65 Ah",
    warranty: "48 Months",
    technology: "Calcium",
    rating: 4.7,
    reviews: 132,
    price: 5900,
    originalPrice: 6600,
    discount: 11,
    badge: "Popular",
    stock: 35,
    sku: "POWERZONE-CAR-65AH",
    description: "Reliable maintenance-free Powerzone battery for all passenger cars.",
    features: [
      "Maintenance Free",
      "High Starting Power",
      "Long Battery Life"
    ],
    specifications: {
      voltage: "12V",
      capacity: "65 Ah",
      warranty: "48 Months",
      technology: "Calcium"
    },
    image: powerzoneB1,
    images: [powerzoneB1]
  },
  {
    id: 3,
    name: "Amaron Bike Battery",
    category: "Battery",
    subCategory: "Bike Battery",
    brand: "Amaron",
    model: "APBTZ5L",
    capacity: "5 Ah",
    warranty: "48 Months",
    technology: "VRLA",
    rating: 4.8,
    reviews: 218,
    price: 1850,
    originalPrice: 2100,
    discount: 12,
    badge: "Top Rated",
    stock: 75,
    sku: "AMARON-BIKE-5AH",
    description: "Premium VRLA bike battery delivering reliable starting performance.",
    features: [
      "Leak Proof",
      "Maintenance Free",
      "Quick Start"
    ],
    specifications: {
      voltage: "12V",
      capacity: "5 Ah",
      warranty: "48 Months",
      technology: "VRLA"
    },
    image: amaronBike,
    images: [amaronBike]
  },
  {
    id: 4,
    name: "Powerzone Bike Battery",
    category: "Battery",
    subCategory: "Bike Battery",
    brand: "Powerzone",
    model: "PZ-BTZ5",
    capacity: "5 Ah",
    warranty: "36 Months",
    technology: "VRLA",
    rating: 4.6,
    reviews: 94,
    price: 1550,
    originalPrice: 1800,
    discount: 14,
    badge: "Hot",
    stock: 60,
    sku: "POWERZONE-BIKE-5AH",
    description: "Compact maintenance-free motorcycle battery with dependable performance.",
    features: [
      "Maintenance Free",
      "Leak Proof",
      "Easy Installation"
    ],
    specifications: {
      voltage: "12V",
      capacity: "5 Ah",
      warranty: "36 Months",
      technology: "VRLA"
    },
    image: powerzoneBike,
    images: [powerzoneBike]
  },
  {
    id: 7,
    name: 'Castrol GTX Essential 20W-50 Engine Oil',
    category: 'Engine Oil',
    subCategory: 'Car Engine Oil',
    brand: 'Castrol',
    model: 'GTX-E-20W50-3L',
    capacity: '3 Litres',
    warranty: 'No Warranty',
    technology: 'Mineral Oil',
    rating: 4.6,
    reviews: 420,
    price: 1350,
    originalPrice: 1650,
    discount: 18,
    badge: 'Value Pack',
    stock: 200,
    sku: 'MANVI-OIL-CAS50',
    description: 'Provides superior anti-sludge protection to extend your car engine life, keeping the engine channels clean and free-flowing.',
    features: [
      'Advanced anti-sludge formula',
      'High thermal stability',
      'Protects against viscosity breakdown'
    ],
    specifications: {
      viscosity: '20W-50',
      oilType: 'Mineral',
      compatibility: 'Petrol and Diesel Engines',
      certification: 'API SN'
    },
    image: castrolGTX,
    images: [castrolGTX]
  },
  {
    id: 8,
    name: 'Castrol Magnatec 5W-30 Full Synthetic Engine Oil',
    category: 'Engine Oil',
    subCategory: 'Car Engine Oil',
    brand: 'Castrol',
    model: 'MAG-5W30-3.5L',
    capacity: '3.5 Litres',
    warranty: 'No Warranty',
    technology: 'Dualock Synthetic Technology',
    rating: 4.8,
    reviews: 512,
    price: 2450,
    originalPrice: 3100,
    discount: 20,
    badge: 'Premium',
    stock: 150,
    sku: 'MANVI-OIL-CAS30',
    description: 'Clinging intelligent molecules provide continuous protection from the exact second you start your car, reducing warm-up wear drastically.',
    features: [
      'Dualock technology reduces engine wear by 50%',
      'Maintains peak performance under high stress',
      'Improves fuel economy'
    ],
    specifications: {
      viscosity: '5W-30',
      oilType: 'Full Synthetic',
      compatibility: 'BS6 Petrol and Diesel Cars',
      certification: 'API SP / ACEA A5/B5'
    },
    image: castrolMagnatec,
    images: [castrolMagnatec]
  },
  {
    id: 9,
    name: 'Dreams EcoDrive 2 10W-30 4T Bike Engine Oil',
    category: 'Engine Oil',
    subCategory: 'Bike Engine Oil',
    brand: 'Dreams',
    model: 'DR-ED2-10W30',
    capacity: '1 Litre',
    warranty: 'No Warranty',
    technology: 'Premium Mineral',
    rating: 4.2,
    reviews: 64,
    price: 399,
    originalPrice: 499,
    discount: 20,
    badge: 'New Launch',
    stock: 300,
    sku: 'MANVI-OIL-DRM02',
    description: 'Engineered for smooth gear shifts and enhanced clutch grip in modern commuter motorcycles running in heavy city traffic.',
    features: [
      'Optimized friction management',
      'Resists high temperature oxidation',
      'Keeps engine components clean'
    ],
    specifications: {
      viscosity: '10W-30',
      oilType: 'Premium Mineral',
      compatibility: '4-Stroke Motorcycles',
      certification: 'JASO MA2 / API SL'
    },
    image: dreams2Eoil,
    images: [dreams2Eoil]
  },
  {
    id: 10,
    name: 'Dreams EcoDrive 3 20W-40 Premium Engine Oil',
    category: 'Engine Oil',
    subCategory: 'Bike Engine Oil',
    brand: 'Dreams',
    model: 'DR-ED3-20W40',
    capacity: '1 Litre',
    warranty: 'No Warranty',
    technology: 'Semi-Synthetic',
    rating: 4.3,
    reviews: 72,
    price: 440,
    originalPrice: 550,
    discount: 20,
    badge: 'Popular',
    stock: 250,
    sku: 'MANVI-OIL-DRM03',
    description: 'High-viscosity stability engine oil custom formulated to minimize engine noise and vibrations in cruiser and heavy-duty commuter bikes.',
    features: [
      'Excellent film strength',
      'Reduces operational engine noise',
      'Enhanced wear protection for valve trains'
    ],
    specifications: {
      viscosity: '20W-40',
      oilType: 'Semi-Synthetic',
      compatibility: 'Heavy Commuter / Cruiser Bikes',
      certification: 'JASO MA2 / API SM'
    },
    image: dreams3Eoil,
    images: [dreams3Eoil]
  },
  {
    id: 11,
    name: 'Dreams EcoDrive 4 15W-50 Synthetic Blend Oil',
    category: 'Engine Oil',
    subCategory: 'Bike Engine Oil',
    brand: 'Dreams',
    model: 'DR-ED4-15W50',
    capacity: '1 Litre',
    warranty: 'No Warranty',
    technology: 'Synthetic Blend',
    rating: 4.4,
    reviews: 53,
    price: 499,
    originalPrice: 650,
    discount: 23,
    badge: 'Top Rated',
    stock: 180,
    sku: 'MANVI-OIL-DRM04',
    description: 'Heavy-duty performance synthetic blend formulated specifically for touring motorcycles requiring robust high-temperature stability.',
    features: [
      'Excellent thermal shear resistance',
      'Prevents clutch slippage structural issues',
      'Reduces carbon deposits'
    ],
    specifications: {
      viscosity: '15W-50',
      oilType: 'Synthetic Blend',
      compatibility: 'Touring / Performance Bikes',
      certification: 'JASO MA2 / API SN'
    },
    image: dreams4Eoil,
    images: [dreams4Eoil]
  },
  {
    id: 12,
    name: 'Dreams Standard 10W-40 4T Engine Oil',
    category: 'Engine Oil',
    subCategory: 'Bike Engine Oil',
    brand: 'Dreams',
    model: 'DR-STD-10W40',
    capacity: '1 Litre',
    warranty: 'No Warranty',
    technology: 'Mineral Base',
    rating: 4.1,
    reviews: 41,
    price: 375,
    originalPrice: 450,
    discount: 16,
    badge: 'Standard',
    stock: 400,
    sku: 'MANVI-OIL-DRMSTD',
    description: 'Cost-effective everyday engine oil offering uniform lubrication and heat management for entry-level regular commuter bikes.',
    features: [
      'Uniform operational lubrication film',
      'Prevents piston ring scuffing',
      'Affordable maintenance profile'
    ],
    specifications: {
      viscosity: '10W-40',
      oilType: 'Mineral',
      compatibility: 'Standard 4-Stroke Scooters/Bikes',
      certification: 'JASO MB / API SL'
    },
    image: dreamsEoil,
    images: [dreamsEoil]
  },
  {
    id: 13,
    name: 'Exide GQP 850VA Square Wave Inverter',
    category: 'Inverter',
    subCategory: 'Home Inverter',
    brand: 'Exide',
    model: 'EX-GQP-850',
    capacity: '850VA',
    warranty: '24 Months',
    technology: 'Square Wave',
    rating: 4.3,
    reviews: 148,
    price: 4900,
    originalPrice: 6200,
    discount: 20,
    badge: 'Reliable',
    stock: 50,
    sku: 'MANVI-INV-EX850',
    description: 'Economical home inverter featuring advanced microcontroller-based design to deliver stable backup power during outages.',
    features: [
      'Microcontroller-based intelligent control',
      'Fast battery charging cycle',
      'Smart overload sensing protection'
    ],
    specifications: {
      outputWaveform: 'Square Wave',
      inputVoltage: '100V - 290V AC',
      efficiency: '> 85%',
      weight: '8.4 kg'
    },
    image: exideGQP850,
    images: [exideGQP850]
  },
  {
    id: 14,
    name: 'Exide GQP 1050VA Pure Sine Wave Inverter',
    category: 'Inverter',
    subCategory: 'Home Inverter',
    brand: 'Exide',
    model: 'EX-GQP-1050',
    capacity: '1050VA',
    warranty: '24 Months',
    technology: 'Pure Sine Wave',
    rating: 4.6,
    reviews: 195,
    price: 6499,
    originalPrice: 8200,
    discount: 20,
    badge: 'Top Choice',
    stock: 40,
    sku: 'MANVI-INV-EX1050',
    description: 'Premium pure sine wave inverter ensuring zero humming noise and complete protection for your sensitive home appliances and electronics.',
    features: [
      'Pure sine wave output protects appliances',
      'Auto-smart battery charging technology',
      'Dual-stage short circuit protection'
    ],
    specifications: {
      outputWaveform: 'Pure Sine Wave',
      inputVoltage: '90V - 300V AC',
      efficiency: '> 88%',
      weight: '9.8 kg'
    },
    image: exideGQP1050,
    images: [exideGQP1050]
  },
  {
    id: 15,
    name: 'Luminous Eco Volt Neo 1050 Smart Inverter',
    category: 'Inverter',
    subCategory: 'Home Inverter',
    brand: 'Luminous',
    model: 'ECO-VOLT-NEO-1050',
    capacity: '900VA',
    warranty: '24 Months',
    technology: 'Pure Sine Wave',
    rating: 4.5,
    reviews: 289,
    price: 6199,
    originalPrice: 7700,
    discount: 19,
    badge: 'Best Seller',
    stock: 75,
    sku: 'MANVI-INV-LUM1050',
    description: 'High-efficiency residential pure sine wave inverter that charges even at low input voltages down to 90V AC.',
    features: [
      'Supports wide battery profiles (Flat/Tubular)',
      'Intelligent thermal management',
      'ECO & UPS dual mode configuration'
    ],
    specifications: {
      outputWaveform: 'Pure Sine Wave',
      ratedPower: '756 Watts',
      inputVoltage: '90V - 290V AC',
      weight: '9.2 kg'
    },
    image: luminousEcoVoltNeo1050,
    images: [luminousEcoVoltNeo1050]
  },
  {
    id: 16,
    name: 'Luminous Zelio+ 1100 Intelligent Home UPS',
    category: 'Inverter',
    subCategory: 'Home Inverter',
    brand: 'Luminous',
    model: 'ZELIO-PLUS-1100',
    capacity: '900VA',
    warranty: '24 Months',
    technology: 'Pure Sine Wave (Intelligent)',
    rating: 4.7,
    reviews: 342,
    price: 6899,
    originalPrice: 8600,
    discount: 19,
    badge: 'Smart Tech',
    stock: 55,
    sku: 'MANVI-INV-LUMZELIO',
    description: 'Indias most intelligent home UPS featuring a digital display that shows backup and charging time remaining in hours & minutes.',
    features: [
      'Intelligent LED display dashboard',
      'Advanced 32-bit processor control',
      'Safe for sensitive electronic gear'
    ],
    specifications: {
      outputWaveform: 'Pure Sine Wave',
      ratedPower: '756 Watts',
      inputVoltage: '110V - 290V AC',
      weight: '10.1 kg'
    },
    image: luminousZelio1100,
    images: [luminousZelio1100]
  },
  {
    id: 17,
    name: 'MasterLine Performance 1L Premium Engine Oil',
    category: 'Engine Oil',
    subCategory: 'Bike Engine Oil',
    brand: 'MasterLine',
    model: 'ML-PERF-1L',
    capacity: '1 Litre',
    warranty: 'No Warranty',
    technology: 'Premium Mineral',
    rating: 4.0,
    reviews: 38,
    price: 360,
    originalPrice: 450,
    discount: 20,
    badge: 'Value Choice',
    stock: 190,
    sku: 'MANVI-OIL-ML01',
    description: 'High quality engine lubrication oil tailored to provide uniform heat reduction and reduce engine friction wear profiles.',
    features: [
      'Stable engine wear protection grids',
      'Effective carbon deposit cleanup',
      'Smooth clutch engagement profiles'
    ],
    specifications: {
      viscosity: '20W-40',
      oilType: 'Premium Mineral',
      compatibility: 'Standard 4T Motorcycles',
      certification: 'JASO MA / API SG'
    },
    image: masterLine1L,
    images: [masterLine1L]
  },
  {
    id: 18,
    name: 'MasterLine MP3 MaxPower 4T Engine Oil',
    category: 'Engine Oil',
    subCategory: 'Bike Engine Oil',
    brand: 'MasterLine',
    model: 'ML-MP3-MAX',
    capacity: '1 Litre',
    warranty: 'No Warranty',
    technology: 'Semi-Synthetic',
    rating: 4.2,
    reviews: 45,
    price: 425,
    originalPrice: 530,
    discount: 19,
    badge: 'New Arrival',
    stock: 140,
    sku: 'MANVI-OIL-MLMP3',
    description: 'Advanced MP3 formulation helps unleash engine power by reducing drag and maximizing torque output seamlessly.',
    features: [
      'Active engine power additive packages',
      'Excellent high shear stabilization',
      'Corrosion resistant protection film'
    ],
    specifications: {
      viscosity: '10W-30',
      oilType: 'Semi-Synthetic',
      compatibility: 'Modern 4-Stroke Engines',
      certification: 'JASO MA2 / API SL'
    },
    image: masterLineMP3Eoil,
    images: [masterLineMP3Eoil]
  },
  {
    id: 21,
    name: 'Powerzone DIN60 Premium Car Battery',
    category: 'Car Battery',
    subCategory: 'Four Wheeler Battery',
    brand: 'Powerzone',
    model: 'PZ-DIN60-L',
    capacity: '60Ah',
    warranty: '48 Months',
    technology: 'Calcium-Silver Alloy',
    rating: 4.4,
    reviews: 132,
    price: 5499,
    originalPrice: 6900,
    discount: 20,
    badge: 'Heavy Duty',
    stock: 45,
    sku: 'MANVI-CAR-PZ60',
    description: 'High cranking performance maintenance-free car battery engineered by Amara Raja to suit demanding luxury passenger vehicles.',
    features: [
      'High cold cranking amp capacity',
      'Patented silver alloy grid tech',
      'Factory filled and factory sealed'
    ],
    specifications: {
      voltage: '12V',
      weight: '15.2 kg',
      dimensions: '242 x 175 x 190 mm',
      cca: '540 A'
    },
    image: powerzoneB1,
    images: [powerzoneB1]
  },
  {
    id: 22,
    name: 'Powerzone 2.5LC Motorcycle VRLA Battery',
    category: 'Bike Battery',
    subCategory: 'VRLA Battery',
    brand: 'Powerzone',
    model: 'PZ-2.5LC',
    capacity: '2.5Ah',
    warranty: '24 Months',
    technology: 'VRLA Maintenance Free',
    rating: 4.3,
    reviews: 178,
    price: 950,
    originalPrice: 1200,
    discount: 20,
    badge: 'Value Pick',
    stock: 160,
    sku: 'MANVI-BIK-PZ2.5',
    description: 'Reliable entry-level bike battery offering high safety standards and reliable start triggers for economy commuter bikes.',
    features: [
      'Gas recombination system features',
      'Absorbent Glass Mat technology design',
      'Leak-proof performance casing'
    ],
    specifications: {
      voltage: '12V',
      weight: '1.1 kg',
      dimensions: '80 x 70 x 105 mm',
      cca: '35 A'
    },
    image: powerzoneBike,
    images: [powerzoneBike]
  },
  {
    id: 23,
    name: 'Shell Helix Ultra 5W-40 Fully Synthetic Motor Oil',
    category: 'Engine Oil',
    subCategory: 'Car Engine Oil',
    brand: 'Shell',
    model: 'HELIX-ULTRA-4L',
    capacity: '4 Litres',
    warranty: 'No Warranty',
    technology: 'PurePlus Technology (Gas-to-Liquid)',
    rating: 4.9,
    reviews: 642,
    price: 3450,
    originalPrice: 4500,
    discount: 23,
    badge: 'Premium Plus',
    stock: 95,
    sku: 'MANVI-OIL-SHL4L',
    description: 'Top-tier fully synthetic engine oil manufactured from natural gas, delivering ultimate engine cleanliness and superior wear protection.',
    features: [
      'Formulated from natural gas pure base',
      'Unsurpassed sludge build-up defenses',
      'Excellent extreme cold start flow properties'
    ],
    specifications: {
      viscosity: '5W-40',
      oilType: 'Fully Synthetic',
      compatibility: 'High-End Petrol/Diesel Cars',
      certification: 'API SN PLUS / ACEA A3/B4'
    },
    image: shellHelixUltra,
    images: [shellHelixUltra]
  },
  
];

export default products;