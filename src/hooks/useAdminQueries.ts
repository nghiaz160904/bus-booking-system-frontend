import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import type { ScheduleFormData, RouteStop, SeatType } from '@/types/admin';

// Keys for caching
export const ADMIN_KEYS = {
  routes: ['admin', 'routes'],
  buses: ['admin', 'buses'],
};

// --- QUERIES ---

export const useAdminRoutes = () => {
  return useQuery({
    queryKey: ADMIN_KEYS.routes,
    queryFn: adminApi.getRoutes,
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 mins
  });
};

export const useAdminBuses = () => {
  return useQuery({
    queryKey: ADMIN_KEYS.buses,
    queryFn: adminApi.getBuses,
    staleTime: 5 * 60 * 1000,
  });
};

// --- MUTATIONS ---

export const useCreateTripMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ScheduleFormData) => adminApi.createTrip(data),
    onSuccess: () => {
      // In a real app, you might invalidate 'trips' list here
      // queryClient.invalidateQueries({ queryKey: ['admin', 'trips'] });
      alert('Trip created successfully!');
    },
    onError: (error) => {
      console.error('Failed to create trip', error);
      alert('Failed to create trip');
    },
  });
};

export const useSaveRouteMutation = () => {
  return useMutation({
    mutationFn: (data: { name: string; stops: RouteStop[] }) => adminApi.saveRoute(data),
    onSuccess: () => {
      alert('Route saved successfully!');
    },
  });
};

export const useSaveSeatMapMutation = () => {
  return useMutation({
    mutationFn: (data: { rows: number; cols: number; map: SeatType[] }) =>
      adminApi.saveSeatMap(data),
    onSuccess: () => {
      alert('Seat map configuration saved!');
    },
  });
};
