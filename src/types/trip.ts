// src/types/trip.ts

export type TripStatus = 'SCHEDULED' | 'CANCELLED' | 'COMPLETED' | 'DELAYED';

export type BusType = 'Limousine' | 'Giường nằm' | 'Ghế ngồi';

export interface Bus {
  id: string;
  operator_id: string;
  operator_name: string; // In real DB this comes from operator table, we mock it here
  plate_number: string;
  model: string;
  seat_capacity: number;
  type: BusType; // Derived from model typically
  images: string[]; // For UI display
}

export interface Trip {
  id: string;
  route_id: string;
  // In a real app, these come from the Route table. We mock them for the card UI.
  from_station: string;
  to_station: string;

  // The Join Relationship
  bus: Bus;

  // Time & Price
  departure_time: string; // ISO 8601 String
  arrival_time: string; // ISO 8601 String
  base_price: number;

  // Status & Logic
  status: TripStatus;
  available_seats: number; // Calculated field (capacity - booked)
  rating: number; // Mocked rating (0-5)
  review_count: number;
}
