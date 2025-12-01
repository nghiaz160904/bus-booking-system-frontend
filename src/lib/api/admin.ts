import { MOCK_ADMIN_ROUTES, MOCK_ADMIN_BUSES } from '@/data/adminMockData';
import type { AdminRoute, AdminBus, ScheduleFormData, RouteStop, SeatType } from '@/types/admin';

// Helper to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const adminApi = {
  // --- FETCHING ---
  getRoutes: async (): Promise<AdminRoute[]> => {
    await delay(500); // Simulate latency
    return [...MOCK_ADMIN_ROUTES];
  },

  getBuses: async (): Promise<AdminBus[]> => {
    await delay(500);
    return [...MOCK_ADMIN_BUSES];
  },

  // --- MUTATIONS ---
  createTrip: async (tripData: ScheduleFormData): Promise<{ success: boolean; id: string }> => {
    await delay(1000); // Simulate processing
    console.log('API: Creating Trip', tripData);
    return { success: true, id: `trip-${Date.now()}` };
  },

  saveRoute: async (data: { name: string; stops: RouteStop[] }): Promise<{ success: boolean }> => {
    await delay(800);
    console.log('API: Saving Route', data);
    return { success: true };
  },

  saveSeatMap: async (data: {
    rows: number;
    cols: number;
    map: SeatType[];
  }): Promise<{ success: boolean }> => {
    await delay(800);
    console.log('API: Saving Seat Map', data);
    return { success: true };
  },
};
