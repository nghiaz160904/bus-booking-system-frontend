// src/types/admin.ts

export type SeatType = 'standard' | 'premium' | 'aisle' | 'blocked';

export interface RouteStop {
  id: number;
  location: string;
  offset: string; // e.g. "+30 mins"
}

export interface AdminRoute {
  id: number;
  name: string;
  origin: string;
  destination: string;
}

export interface AdminBus {
  id: number;
  name: string;
  model: string;
  capacity: number;
}

export interface ScheduleFormData {
  routeId: string;
  busId: string;
  depDate: string;
  arrDate: string;
  price: string;
  capacity: string;
}
