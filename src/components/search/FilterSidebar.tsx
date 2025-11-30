import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// --- CONSTANTS ---
export const OPERATORS = ['Phương Trang', 'Thành Bưởi', 'Xe Nhà', 'SkyBus'];
export const BUS_TYPES = ['Ghế ngồi', 'Giường nằm', 'Limousine'];
export const TIME_RANGES = [
  { label: 'Sáng sớm (00:00 - 06:00)', value: '0-6' },
  { label: 'Buổi sáng (06:00 - 12:00)', value: '6-12' },
  { label: 'Buổi chiều (12:00 - 18:00)', value: '12-18' },
  { label: 'Buổi tối (18:00 - 24:00)', value: '18-24' },
];

// --- TYPES ---
export interface FilterState {
  priceRange: number[];
  selectedTimes: string[]; // e.g. ['0-6', '12-18']
  selectedOperators: string[];
  selectedTypes: string[];
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFilterChange, onReset }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumSignificantDigits: 3,
    }).format(value);
  };

  // --- HANDLERS ---

  // 1. Handle Price Slider
  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    onFilterChange({ ...filters, priceRange: newValue as number[] });
  };

  // 2. Generic Checkbox Handler (for Arrays like operators, types, times)
  const handleCheckboxChange = (category: keyof FilterState, value: string) => {
    const currentList = filters[category] as string[];
    const newList = currentList.includes(value)
      ? currentList.filter((item) => item !== value) // Remove if exists
      : [...currentList, value]; // Add if not exists

    onFilterChange({ ...filters, [category]: newList });
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 3, bgcolor: 'white', position: 'sticky', top: 24 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          Bộ lọc
        </Typography>
        <Button size="small" onClick={onReset} sx={{ textTransform: 'none' }}>
          Xóa lọc
        </Button>
      </Box>

      {/* 1. PRICE RANGE */}
      <Box sx={{ mb: 3, px: 1 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Giá vé
        </Typography>
        <Slider
          value={filters.priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={1000000}
          step={50000}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {formatCurrency(filters.priceRange[0])}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatCurrency(filters.priceRange[1])}
          </Typography>
        </Box>
      </Box>

      {/* 2. DEPARTURE TIME */}
      <Accordion
        defaultExpanded
        elevation={0}
        disableGutters
        sx={{ '&:before': { display: 'none' } }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0, minHeight: 48 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Giờ đi
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <FormGroup>
            {TIME_RANGES.map((range) => (
              <FormControlLabel
                key={range.value}
                control={
                  <Checkbox
                    size="small"
                    checked={filters.selectedTimes.includes(range.value)}
                    onChange={() => handleCheckboxChange('selectedTimes', range.value)}
                  />
                }
                label={range.label}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* 3. OPERATOR */}
      <Accordion
        defaultExpanded
        elevation={0}
        disableGutters
        sx={{ '&:before': { display: 'none' } }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Nhà xe
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <FormGroup>
            {OPERATORS.map((op) => (
              <FormControlLabel
                key={op}
                control={
                  <Checkbox
                    size="small"
                    checked={filters.selectedOperators.includes(op)}
                    onChange={() => handleCheckboxChange('selectedOperators', op)}
                  />
                }
                label={op}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* 4. BUS TYPE */}
      <Accordion
        defaultExpanded
        elevation={0}
        disableGutters
        sx={{ '&:before': { display: 'none' } }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Loại xe
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <FormGroup>
            {BUS_TYPES.map((type) => (
              <FormControlLabel
                key={type}
                control={
                  <Checkbox
                    size="small"
                    checked={filters.selectedTypes.includes(type)}
                    onChange={() => handleCheckboxChange('selectedTypes', type)}
                  />
                }
                label={type}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default FilterSidebar;
