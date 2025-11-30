import React, { useState, useMemo } from 'react';
import { Box, Container, Typography, Stack, Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';

import FilterSidebar, { type FilterState } from '@/components/search/FilterSidebar';
import TripList from '@/components/search/TripList';
import { MOCK_TRIPS } from '@/data/mockTrips';

// Constants
const ITEMS_PER_PAGE = 5;

// Initial Filter State
const INITIAL_FILTERS: FilterState = {
  priceRange: [0, 1000000],
  selectedTimes: [],
  selectedOperators: [],
  selectedTypes: [],
};

const SearchResultsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // --- FILTERING LOGIC ---
  // useMemo ensures this only runs when filters or trips change
  const filteredTrips = useMemo(() => {
    return MOCK_TRIPS.filter((trip) => {
      // 1. Price Filter
      if (trip.base_price < filters.priceRange[0] || trip.base_price > filters.priceRange[1]) {
        return false;
      }

      // 2. Operator Filter
      if (
        filters.selectedOperators.length > 0 &&
        !filters.selectedOperators.includes(trip.bus.operator_name)
      ) {
        return false;
      }

      // 3. Bus Type Filter
      if (filters.selectedTypes.length > 0 && !filters.selectedTypes.includes(trip.bus.type)) {
        return false;
      }

      // 4. Time Filter (Complex)
      if (filters.selectedTimes.length > 0) {
        const hour = new Date(trip.departure_time).getHours();
        const matchesTime = filters.selectedTimes.some((range) => {
          const [start, end] = range.split('-').map(Number);
          return hour >= start && hour < end;
        });
        if (!matchesTime) return false;
      }

      return true;
    });
  }, [filters]);

  // --- PAGINATION LOGIC (Based on Filtered Results) ---
  const count = Math.ceil(filteredTrips.length / ITEMS_PER_PAGE);
  const displayedTrips = filteredTrips.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // --- HANDLERS ---
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1); // Reset to page 1 when filtering changes
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setPage(1);
  };

  return (
    <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh', pb: 8 }}>
      {/* 1. HEADER */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0', py: 2, mb: 4 }}>
        <Container maxWidth="xl">
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              underline="hover"
              sx={{ display: 'flex', alignItems: 'center' }}
              color="inherit"
              href="/"
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Trang chủ
            </Link>
            <Typography sx={{ display: 'flex', alignItems: 'center' }} color="text.primary">
              <SearchIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Kết quả tìm kiếm
            </Typography>
          </Breadcrumbs>

          <Typography variant="h5" fontWeight={800} sx={{ mt: 1 }}>
            Vé xe từ Sài Gòn đi Đà Lạt
          </Typography>
          {/* Show count of FILTERED results */}
          <Typography variant="body2" color="text.secondary">
            {filteredTrips.length} kết quả được tìm thấy
          </Typography>
        </Container>
      </Box>

      {/* 2. MAIN CONTENT */}
      <Container maxWidth="xl">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start">
          {/* LEFT SIDEBAR (Pass props to control it) */}
          <Box sx={{ width: { xs: '100%', md: '280px' }, flexShrink: 0 }}>
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </Box>

          {/* RIGHT LIST (Pass filtered results) */}
          <Box sx={{ flex: 1, width: '100%' }}>
            <TripList
              trips={displayedTrips}
              page={page}
              pageCount={count}
              onPageChange={handlePageChange}
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default SearchResultsPage;
