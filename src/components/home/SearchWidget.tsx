import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  IconButton,
  Autocomplete,
  TextField,
} from '@mui/material';
import {
  DirectionsBusFilled,
  Flight,
  Train,
  DirectionsCar,
  RadioButtonChecked,
  LocationOn,
  CalendarToday,
  SwapHoriz,
  Close,
} from '@mui/icons-material';

// --- DATA ---
const PROVINCES = [
  'Hồ Chí Minh',
  'Hà Nội',
  'Đà Nẵng',
  'Đồng Tháp',
  'An Giang',
  'Cần Thơ',
  'Bà Rịa - Vũng Tàu',
  'Bình Dương',
  'Đồng Nai',
  'Khánh Hòa',
  'Lâm Đồng',
  'Thừa Thiên Huế',
  'Hải Phòng',
  'Quảng Ninh',
  'Thanh Hóa',
  'Nghệ An',
  'Bình Thuận',
  'Kiên Giang',
  'Cà Mau',
  'Tiền Giang',
  'Long An',
  'Bến Tre',
  'Vĩnh Long',
  'Trà Vinh',
  'Hậu Giang',
  'Sóc Trăng',
  'Bạc Liêu',
  'Bình Định',
  'Phú Yên',
  'Quảng Nam',
  'Quảng Ngãi',
  'Gia Lai',
  'Đắk Lắk',
  'Bình Phước',
];

// --- HELPERS ---
const formatDate = (dateString: string | null) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

const getTodayString = () => new Date().toISOString().split('T')[0];

const BannerTab = ({
  label,
  icon,
  isActive,
  badgeText,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  badgeText?: string;
  onClick: () => void;
}) => (
  <Box
    onClick={onClick}
    sx={{
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      pb: 1.5,
      borderBottom: isActive ? '3px solid #0060c4' : '3px solid transparent',
      color: isActive ? '#0060c4' : '#555',
      position: 'relative',
      transition: 'all 0.2s',
      '&:hover': { color: '#0060c4' },
    }}
  >
    {icon}
    <Typography fontWeight={isActive ? 700 : 500} variant="body1">
      {label}
    </Typography>
    {badgeText && (
      <Box
        sx={{
          position: 'absolute',
          top: -8,
          right: -20,
          bgcolor: '#ff3333',
          color: 'white',
          fontSize: '0.65rem',
          px: 0.6,
          borderRadius: '4px',
          fontWeight: 'bold',
        }}
      >
        {badgeText}
      </Box>
    )}
  </Box>
);

const BannerInput = ({
  icon,
  placeholder,
  value,
  isLast = false,
  showDivider = true,
  onClick,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value?: string;
  isLast?: boolean;
  showDivider?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}) => (
  <Box
    onClick={onClick}
    sx={{
      display: 'flex',
      alignItems: 'center',
      flex: 1,
      py: 1,
      cursor: 'pointer',
      minWidth: 0,
    }}
  >
    <Box sx={{ mr: 1.5, display: 'flex', alignItems: 'center' }}>{icon}</Box>
    <Box sx={{ flex: 1, overflow: 'hidden' }}>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }} display="block">
        {placeholder}
      </Typography>
      <Typography
        variant="body1"
        fontWeight={700}
        color={value ? 'text.primary' : 'text.disabled'}
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {value || 'Chọn...'}
      </Typography>
    </Box>
    {!isLast && showDivider && (
      <Divider
        orientation="vertical"
        flexItem
        sx={{ mx: 2, height: '30px', alignSelf: 'center' }}
      />
    )}
  </Box>
);

const LocationAutocomplete = ({
  icon,
  label,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  onChange: (newValue: string | null) => void;
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, py: 1 }}>
      <Box sx={{ mr: 1.5, display: 'flex', alignItems: 'center' }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Autocomplete
          options={PROVINCES}
          value={value}
          onChange={(_e, newValue) => onChange(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              variant="standard"
              InputLabelProps={{
                shrink: true,
                style: { fontSize: '0.85rem', color: 'rgba(0, 0, 0, 0.6)' },
              }}
              InputProps={{
                ...params.InputProps,
                disableUnderline: true,
                style: { fontWeight: 700, fontSize: '1rem' },
              }}
              placeholder="Chọn tỉnh thành..."
            />
          )}
        />
      </Box>
    </Box>
  );
};

export default function SearchWidget() {
  const [activeTab, setActiveTab] = useState(0);
  const [origin, setOrigin] = useState<string | null>(null);
  const [destination, setDestination] = useState<string | null>(null);
  const [departDate, setDepartDate] = useState<string>('');
  const [returnDate, setReturnDate] = useState<string>('');

  const departInputRef = useRef<HTMLInputElement>(null);
  const returnInputRef = useRef<HTMLInputElement>(null);

  const handleSwapLocation = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const handleClearReturnDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReturnDate('');
    if (returnInputRef.current) returnInputRef.current.value = '';
  };

  return (
    <Paper
      elevation={4}
      sx={{
        borderRadius: 3,
        maxWidth: '96%',
        mx: 'auto',
        overflow: 'hidden',
        bgcolor: 'white',
        boxShadow: '0px 10px 40px rgba(0,0,0,0.1)',
      }}
    >
      {/* Tabs */}
      <Box
        sx={{
          display: 'flex',
          gap: 4,
          px: 3,
          pt: 2.5,
          borderBottom: '1px solid #f0f0f0',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <BannerTab
          label="Xe khách"
          icon={<DirectionsBusFilled />}
          isActive={activeTab === 0}
          onClick={() => setActiveTab(0)}
        />
        <BannerTab
          label="Máy bay"
          icon={<Flight />}
          isActive={activeTab === 1}
          badgeText="-30K"
          onClick={() => setActiveTab(1)}
        />
        <BannerTab
          label="Tàu hỏa"
          icon={<Train />}
          isActive={activeTab === 2}
          badgeText="-25%"
          onClick={() => setActiveTab(2)}
        />
        <BannerTab
          label="Thuê xe"
          icon={<DirectionsCar />}
          isActive={activeTab === 3}
          badgeText="Mới"
          onClick={() => setActiveTab(3)}
        />
      </Box>

      {/* Input Row */}
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              lg: 'minmax(0, 3.25fr) minmax(0, 4fr) minmax(0, 1fr)',
            },
            gap: 2,
            alignItems: 'center',
          }}
        >
          {/* Locations */}
          <Box>
            <Paper
              variant="outlined"
              sx={{
                display: 'flex',
                borderRadius: 2,
                borderColor: '#e0e0e0',
                alignItems: 'center',
                px: 2,
              }}
            >
              <LocationAutocomplete
                icon={<RadioButtonChecked color="primary" />}
                label="Nơi xuất phát"
                value={origin}
                onChange={setOrigin}
              />
              <IconButton
                size="small"
                sx={{ bgcolor: '#f5f5f5', border: '1px solid #eee' }}
                onClick={handleSwapLocation}
              >
                <SwapHoriz fontSize="small" color="action" />
              </IconButton>
              <Box sx={{ ml: 2, flex: 1 }}>
                <LocationAutocomplete
                  icon={<LocationOn color="error" />}
                  label="Nơi đến"
                  value={destination}
                  onChange={setDestination}
                />
              </Box>
            </Paper>
          </Box>

          {/* Dates */}
          <Box>
            <Paper
              variant="outlined"
              sx={{
                display: 'flex',
                borderRadius: 2,
                borderColor: '#e0e0e0',
                alignItems: 'center',
                px: 2,
                position: 'relative',
              }}
            >
              <Box sx={{ flex: 1 }}>
                <input
                  type="date"
                  ref={departInputRef}
                  style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                  value={departDate}
                  min={getTodayString()}
                  onChange={(e) => setDepartDate(e.target.value)}
                />
                <BannerInput
                  icon={<CalendarToday color="primary" />}
                  placeholder="Ngày đi"
                  value={formatDate(departDate)}
                  showDivider={false}
                  onClick={() => departInputRef.current?.showPicker()}
                />
              </Box>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ mx: 2, height: '30px', alignSelf: 'center' }}
              />
              <Box sx={{ flex: 1, position: 'relative' }}>
                <input
                  type="date"
                  ref={returnInputRef}
                  style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                  value={returnDate}
                  min={departDate || getTodayString()}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
                <BannerInput
                  icon={<CalendarToday color="action" />}
                  placeholder="Ngày về"
                  value={formatDate(returnDate)}
                  isLast
                  showDivider={false}
                  onClick={() => returnInputRef.current?.showPicker()}
                />
                {returnDate && (
                  <IconButton
                    size="small"
                    onClick={handleClearReturnDate}
                    sx={{
                      position: 'absolute',
                      right: -8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 5,
                      bgcolor: 'rgba(255,255,255,0.8)',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' },
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Paper>
          </Box>

          {/* Button */}
          <Box>
            <Button
              fullWidth
              variant="contained"
              sx={{
                bgcolor: '#FFC107',
                color: '#212121',
                fontWeight: 700,
                fontSize: '1.1rem',
                height: '56px',
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#ffca2c', boxShadow: 'none' },
              }}
            >
              Tìm kiếm
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
