import React, { useState } from 'react';
import { Box, Stack, Pagination } from '@mui/material';
import TripCard from './TripCard';
import SortBar from './SortBar';
import { type Trip } from '@/types/trip';

interface TripListProps {
  trips: Trip[];
  page: number;
  pageCount: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const TripList: React.FC<TripListProps> = ({ trips, page, pageCount, onPageChange }) => {
  const [currentSort, setCurrentSort] = useState<
    'earliest' | 'latest' | 'lowest_price' | 'highest_rating'
  >('earliest');

  // NOTE: In a real app, this sorting logic might happen on the backend or in a parent hook
  const sortedTrips = [...trips].sort((a, b) => {
    switch (currentSort) {
      case 'earliest':
        return new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime();
      case 'latest':
        return new Date(b.departure_time).getTime() - new Date(a.departure_time).getTime();
      case 'lowest_price':
        return a.base_price - b.base_price;
      case 'highest_rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <Box>
      {/* 1. SORT BAR */}
      <SortBar currentSort={currentSort} onSortChange={setCurrentSort} resultCount={trips.length} />

      {/* 2. TRIP CARDS */}
      <Stack spacing={2}>
        {sortedTrips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </Stack>

      {/* 3. PAGINATION */}
      {pageCount > 1 && (
        <Stack alignItems="center" sx={{ mt: 4, mb: 4 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={onPageChange}
            color="primary"
            size="large"
            shape="rounded"
          />
        </Stack>
      )}
    </Box>
  );
};

export default TripList;
