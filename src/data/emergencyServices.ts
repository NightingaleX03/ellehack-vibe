import {EmergencyService} from '../types';

/**
 * Hardcoded emergency services for Downtown Toronto (M5H 2N2)
 * Real hospitals, clinics, and police stations near the Financial District
 */

export const EMERGENCY_SERVICES: EmergencyService[] = [
  // Hospitals
  {
    name: 'Toronto General Hospital',
    type: 'hospital',
    address: '200 Elizabeth St, Toronto, ON M5G 2C4',
    distance: '1.2 km',
    phone: '(416) 340-4800',
  },
  {
    name: 'St. Michael\'s Hospital',
    type: 'hospital',
    address: '30 Bond St, Toronto, ON M5B 1W8',
    distance: '0.8 km',
    phone: '(416) 360-4000',
  },
  {
    name: 'Mount Sinai Hospital',
    type: 'hospital',
    address: '600 University Ave, Toronto, ON M5G 1X5',
    distance: '1.0 km',
    phone: '(416) 596-4200',
  },
  {
    name: 'Toronto Western Hospital',
    type: 'hospital',
    address: '399 Bathurst St, Toronto, ON M5T 2S8',
    distance: '1.5 km',
    phone: '(416) 603-5800',
  },
  
  // Clinics
  {
    name: 'Medcan Clinic',
    type: 'clinic',
    address: '150 York St, Toronto, ON M5H 3S5',
    distance: '0.2 km',
    phone: '(416) 350-5900',
  },
  {
    name: 'Appletree Medical Group - Bay Street',
    type: 'clinic',
    address: '150 Bay St, Toronto, ON M5J 1T6',
    distance: '0.3 km',
    phone: '(416) 967-7171',
  },
  {
    name: 'Shoppers Drug Mart Clinic',
    type: 'clinic',
    address: '220 Yonge St, Toronto, ON M5B 2H1',
    distance: '0.7 km',
    phone: '(416) 979-2424',
  },
  {
    name: 'Toronto Walk-In Clinic - King Street',
    type: 'clinic',
    address: '200 King St W, Toronto, ON M5H 3T4',
    distance: '0.4 km',
    phone: '(416) 599-0777',
  },
  {
    name: 'Medisys Health Group',
    type: 'clinic',
    address: '150 Bloor St W, Toronto, ON M5S 2X9',
    distance: '1.1 km',
    phone: '(416) 964-9664',
  },
  
  // Police Stations
  {
    name: 'Toronto Police Service - 52 Division',
    type: 'police',
    address: '255 Dundas St W, Toronto, ON M5G 1Z9',
    distance: '0.6 km',
    phone: '(416) 808-5200',
  },
  {
    name: 'Toronto Police Service - 14 Division',
    type: 'police',
    address: '350 Dovercourt Rd, Toronto, ON M6J 3E5',
    distance: '2.0 km',
    phone: '(416) 808-1400',
  },
  {
    name: 'Toronto Police Service - 51 Division',
    type: 'police',
    address: '51 Parliament St, Toronto, ON M5A 2Y4',
    distance: '1.8 km',
    phone: '(416) 808-5100',
  },
];

/**
 * Get hardcoded emergency services for a postal code
 * Currently returns services for Downtown Toronto (M5H 2N2)
 */
export const getHardcodedEmergencyServices = (
  postalCode?: string
): EmergencyService[] => {
  // For now, return all services for Downtown Toronto
  // In the future, could filter by postal code area
  return EMERGENCY_SERVICES;
};

