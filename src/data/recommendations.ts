import {Recommendation} from '../types';

/**
 * Hardcoded recommendations for Downtown Toronto (M5H 2N2)
 * Real places near the Financial District
 */

const FOOD_RECOMMENDATIONS: Recommendation[] = [
  {
    name: 'Canoe Restaurant',
    category: 'food',
    distance: '0.3 km',
    address: '66 Wellington St W, Toronto, ON M5K 1H6',
    description: 'Upscale Canadian cuisine with stunning CN Tower views. Perfect for special occasions.',
  },
  {
    name: 'Richmond Station',
    category: 'food',
    distance: '0.5 km',
    address: '1 Richmond St W, Toronto, ON M5H 3W4',
    description: 'Modern Canadian bistro with seasonal menu. Great for lunch or dinner.',
  },
  {
    name: 'Pai Northern Thai Kitchen',
    category: 'food',
    distance: '0.4 km',
    address: '18 Duncan St, Toronto, ON M5H 3G8',
    description: 'Authentic Thai street food. Budget-friendly and delicious.',
  },
  {
    name: 'Fresh on Front',
    category: 'food',
    distance: '0.6 km',
    address: '147 Spadina Ave, Toronto, ON M5V 2L7',
    description: 'Healthy vegetarian and vegan options. Great for quick lunch.',
  },
  {
    name: 'The Keg Steakhouse',
    category: 'food',
    distance: '0.2 km',
    address: '515 Front St W, Toronto, ON M5V 0B3',
    description: 'Classic steakhouse chain. Reliable and family-friendly.',
  },
  {
    name: 'Terroni',
    category: 'food',
    distance: '0.7 km',
    address: '57 Adelaide St E, Toronto, ON M5C 1K6',
    description: 'Authentic Italian pizzeria. Casual atmosphere, great for groups.',
  },
  {
    name: 'Banh Mi Boys',
    category: 'food',
    distance: '0.5 km',
    address: '392 Queen St W, Toronto, ON M5V 2A9',
    description: 'Vietnamese sandwiches and Asian fusion. Quick, affordable, and tasty.',
  },
];

const NIGHTLIFE_RECOMMENDATIONS: Recommendation[] = [
  {
    name: 'The Ballroom',
    category: 'nightlife',
    distance: '0.4 km',
    address: '145 John St, Toronto, ON M5V 2E2',
    description: 'Bowling alley and bar. Fun atmosphere with drinks and games.',
  },
  {
    name: 'The Pilot',
    category: 'nightlife',
    distance: '0.6 km',
    address: '22 Cumberland St, Toronto, ON M4W 1J5',
    description: 'Rooftop bar with great views. Popular spot for after-work drinks.',
  },
  {
    name: 'Baro',
    category: 'nightlife',
    distance: '0.5 km',
    address: '485 King St W, Toronto, ON M5V 1K4',
    description: 'Latin-inspired bar and restaurant. Lively atmosphere with cocktails.',
  },
  {
    name: 'The Drake Hotel',
    category: 'nightlife',
    distance: '0.8 km',
    address: '1150 Queen St W, Toronto, ON M6J 1J3',
    description: 'Trendy hotel bar with live music. Hipster vibe.',
  },
  {
    name: 'Crocodile Rock',
    category: 'nightlife',
    distance: '0.3 km',
    address: '240 Adelaide St W, Toronto, ON M5H 1W7',
    description: 'Dive bar with cheap drinks. Casual and unpretentious.',
  },
  {
    name: 'Bar Hop',
    category: 'nightlife',
    distance: '0.4 km',
    address: '391 King St W, Toronto, ON M5V 1K1',
    description: 'Craft beer bar with extensive selection. Great for beer lovers.',
  },
  {
    name: 'The Rooftop at the Broadview Hotel',
    category: 'nightlife',
    distance: '1.2 km',
    address: '106 Broadview Ave, Toronto, ON M4M 2G1',
    description: 'Rooftop bar with panoramic city views. Perfect for sunset drinks.',
  },
];

const PARKS_RECOMMENDATIONS: Recommendation[] = [
  {
    name: 'Harbourfront Centre',
    category: 'parks',
    distance: '0.8 km',
    address: '235 Queens Quay W, Toronto, ON M5J 2G8',
    description: 'Waterfront park with walking trails, events, and lake views. Great for families.',
  },
  {
    name: 'Trinity Bellwoods Park',
    category: 'parks',
    distance: '1.1 km',
    address: '790 Queen St W, Toronto, ON M6J 1G3',
    description: 'Large park with sports fields, dog park, and community events. Very popular.',
  },
  {
    name: 'Osgoode Hall',
    category: 'parks',
    distance: '0.3 km',
    address: '130 Queen St W, Toronto, ON M5H 2N5',
    description: 'Historic building with beautiful grounds. Peaceful green space downtown.',
  },
  {
    name: 'Nathan Phillips Square',
    category: 'parks',
    distance: '0.5 km',
    address: '100 Queen St W, Toronto, ON M5H 2N2',
    description: 'City Hall square with skating rink in winter, events year-round. Iconic Toronto spot.',
  },
  {
    name: 'Sugar Beach',
    category: 'parks',
    distance: '0.9 km',
    address: '11 Dockside Dr, Toronto, ON M5A 1B6',
    description: 'Urban beach park with pink umbrellas. Great for relaxing by the water.',
  },
  {
    name: 'Berczy Park',
    category: 'parks',
    distance: '0.4 km',
    address: '35 Wellington St E, Toronto, ON M5E 1C6',
    description: 'Small park with dog fountain. Quaint and charming.',
  },
  {
    name: 'David Pecaut Square',
    category: 'parks',
    distance: '0.6 km',
    address: '215 King St W, Toronto, ON M5V 3A2',
    description: 'Modern square near theatres. Hosts festivals and events.',
  },
];

const EVENTS_RECOMMENDATIONS: Recommendation[] = [
  {
    name: 'Roy Thomson Hall',
    category: 'events',
    distance: '0.4 km',
    address: '60 Simcoe St, Toronto, ON M5J 2H5',
    description: 'Concert hall hosting classical music and performances. World-class acoustics.',
  },
  {
    name: 'Princess of Wales Theatre',
    category: 'events',
    distance: '0.5 km',
    address: '300 King St W, Toronto, ON M5V 1J2',
    description: 'Broadway-style theatre with major productions. Check schedule for shows.',
  },
  {
    name: 'TIFF Bell Lightbox',
    category: 'events',
    distance: '0.6 km',
    address: '350 King St W, Toronto, ON M5V 3X5',
    description: 'Toronto International Film Festival headquarters. Year-round film screenings.',
  },
  {
    name: 'Harbourfront Centre',
    category: 'events',
    distance: '0.8 km',
    address: '235 Queens Quay W, Toronto, ON M5J 2G8',
    description: 'Cultural centre with festivals, concerts, and events. Check their calendar.',
  },
  {
    name: 'The Second City',
    category: 'events',
    distance: '0.7 km',
    address: '51 Mercer St, Toronto, ON M5V 9G4',
    description: 'Comedy club and improv theatre. Famous for launching comedy careers.',
  },
  {
    name: 'CN Tower',
    category: 'events',
    distance: '0.9 km',
    address: '290 Bremner Blvd, Toronto, ON M5V 3L9',
    description: 'Iconic tower with observation deck. Special events and dining available.',
  },
  {
    name: 'Ripley\'s Aquarium of Canada',
    category: 'events',
    distance: '0.8 km',
    address: '288 Bremner Blvd, Toronto, ON M5V 3L9',
    description: 'Aquarium with educational programs and special events. Great for families.',
  },
];

const SHOPPING_RECOMMENDATIONS: Recommendation[] = [
  {
    name: 'Eaton Centre',
    category: 'shopping',
    distance: '0.7 km',
    address: '220 Yonge St, Toronto, ON M5B 2H1',
    description: 'Major shopping mall with 250+ stores. Everything you need in one place.',
  },
  {
    name: 'Hudson\'s Bay',
    category: 'shopping',
    distance: '0.6 km',
    address: '176 Yonge St, Toronto, ON M5C 2L7',
    description: 'Historic department store. Great for clothing, home goods, and more.',
  },
  {
    name: 'Queen Street West',
    category: 'shopping',
    distance: '0.8 km',
    address: 'Queen St W, Toronto, ON',
    description: 'Trendy shopping district with independent boutiques and vintage stores.',
  },
  {
    name: 'St. Lawrence Market',
    category: 'shopping',
    distance: '0.9 km',
    address: '93 Front St E, Toronto, ON M5E 1C3',
    description: 'Historic market with fresh food, artisanal products, and local vendors.',
  },
  {
    name: 'Saks Fifth Avenue',
    category: 'shopping',
    distance: '0.5 km',
    address: '176 Yonge St, Toronto, ON M5C 2L7',
    description: 'Luxury department store. High-end fashion and accessories.',
  },
  {
    name: 'Uniqlo',
    category: 'shopping',
    distance: '0.6 km',
    address: '220 Yonge St, Toronto, ON M5B 2H1',
    description: 'Japanese fast-fashion retailer. Affordable basics and quality clothing.',
  },
  {
    name: 'Indigo Books & Music',
    category: 'shopping',
    distance: '0.5 km',
    address: '220 Yonge St, Toronto, ON M5B 2H1',
    description: 'Bookstore with gifts, home decor, and stationery. Cozy atmosphere.',
  },
];

const CULTURE_RECOMMENDATIONS: Recommendation[] = [
  {
    name: 'Art Gallery of Ontario (AGO)',
    category: 'culture',
    distance: '1.2 km',
    address: '317 Dundas St W, Toronto, ON M5T 1G4',
    description: 'Major art museum with Canadian and international collections. Free on Wednesday evenings.',
  },
  {
    name: 'Royal Ontario Museum (ROM)',
    category: 'culture',
    distance: '1.5 km',
    address: '100 Queen\'s Park, Toronto, ON M5S 2C6',
    description: 'Natural history and world cultures museum. Fascinating exhibits for all ages.',
  },
  {
    name: 'Toronto Reference Library',
    category: 'culture',
    distance: '0.9 km',
    address: '789 Yonge St, Toronto, ON M4W 2G8',
    description: 'Beautiful modern library with extensive collections. Great study space.',
  },
  {
    name: 'Mackenzie House',
    category: 'culture',
    distance: '0.6 km',
    address: '82 Bond St, Toronto, ON M5B 1X2',
    description: 'Historic home of Toronto\'s first mayor. Museum with guided tours.',
  },
  {
    name: 'The Distillery District',
    category: 'culture',
    distance: '1.1 km',
    address: '55 Mill St, Toronto, ON M5A 3C4',
    description: 'Historic pedestrian-only district with galleries, shops, and restaurants. Beautiful architecture.',
  },
  {
    name: 'Gardiner Museum',
    category: 'culture',
    distance: '1.3 km',
    address: '111 Queen\'s Park, Toronto, ON M5S 2C7',
    description: 'Ceramic art museum. Unique collection in beautiful building.',
  },
  {
    name: 'Bata Shoe Museum',
    category: 'culture',
    distance: '1.4 km',
    address: '327 Bloor St W, Toronto, ON M5S 1W7',
    description: 'World\'s largest shoe collection. Quirky and fascinating museum.',
  },
];

/**
 * Get hardcoded recommendations by category
 */
export const getHardcodedRecommendations = (category: string): Recommendation[] => {
  const normalizedCategory = category.toLowerCase().trim();
  
  switch (normalizedCategory) {
    case 'food':
    case 'food & restaurants':
      return FOOD_RECOMMENDATIONS;
    
    case 'nightlife':
      return NIGHTLIFE_RECOMMENDATIONS;
    
    case 'parks':
    case 'parks & recreation':
      return PARKS_RECOMMENDATIONS;
    
    case 'events':
    case 'events & activities':
    case 'things to do':
      return EVENTS_RECOMMENDATIONS;
    
    case 'shopping':
      return SHOPPING_RECOMMENDATIONS;
    
    case 'culture':
    case 'culture & arts':
      return CULTURE_RECOMMENDATIONS;
    
    default:
      // Return food as default
      return FOOD_RECOMMENDATIONS;
  }
};

/**
 * Filter recommendations by user budget preference
 */
export const filterByBudget = (
  recommendations: Recommendation[],
  budget: 'low' | 'medium' | 'high'
): Recommendation[] => {
  // For now, return all recommendations
  // In a real app, you'd filter based on price data
  return recommendations;
};

