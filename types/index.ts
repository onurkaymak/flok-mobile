export type UserRole = 'MANAGER' | 'AUTO DETAILER' | 'CUSTOMER SERVICE AGENT';

export interface User {
  userName: string;
  userId: string;
  token: string;
  tokenExpTime: string;
  userRole: UserRole;
}

export interface Vehicle {
  vehicleId: number;
  vin: string;
  make: string;
  model: string;
  color: string;
  mileage: number;
  class: string;
  classCode: string;
  state: string;
  licensePlate: string;
  isRented: boolean;
}

export interface RentalService {
  id: number;
  contactName: string;
  contactEmail: string;
  contactNum: string;
  reservationStart: string;
  reservationEnd: string;
  make: string;
  model: string;
  vin: string;
  color: string;
}

export interface RentalServiceResponse {
  rentalServiceId: number;
  reservationStart: string;
  reservationEnd: string;
  customer: {
    name: string;
    email: string;
    phoneNum: string;
  };
  vehicle: {
    make: string;
    model: string;
    vin: string;
    color: string;
  };
}

export interface DetailingService {
  id: number;
  vin: string;
  make: string;
  model: string;
  detailerName: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  name: string;
  count: number;
}

export interface UiNotification {
  title: string;
  message: string;
}
