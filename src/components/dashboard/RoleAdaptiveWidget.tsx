import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Button,
} from '@mui/material';

// Icons for visual context
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MapIcon from '@mui/icons-material/Map';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';

import { useAuth } from '@/context/AuthContext';

const RoleAdaptiveWidget: React.FC = () => {
  const { userRole } = useAuth();

  // Helper to render consistent list items
  const renderActionItem = (text: string, icon: React.ReactNode, onClick?: () => void) => (
    <ListItem disablePadding>
      <ListItemButton onClick={onClick}>
        <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );

  if (userRole === 'ADMIN') {
    return (
      <Card elevation={3} sx={{ borderRadius: 2, height: '100%' }}>
        <CardHeader
          avatar={<AdminPanelSettingsIcon color="error" />} // Visual cue for Admin
          title="Admin Controls"
          titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
          sx={{ pb: 1 }}
        />
        <Divider />
        <List>
          {renderActionItem('Manage Routes', <MapIcon />)}
          {renderActionItem('Review Cancellations', <WarningAmberIcon />)}
          {renderActionItem('System Health', <MonitorHeartIcon />)}
        </List>
      </Card>
    );
  }

  if (userRole === 'USER') {
    return (
      <Card elevation={3} sx={{ borderRadius: 2, height: '100%' }}>
        <CardHeader
          title="Your Quick Actions"
          titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
          subheader="Manage your journey"
          sx={{ pb: 1 }}
        />
        <Divider />
        <List>
          {renderActionItem('View Upcoming Trips', <DirectionsCarIcon />)}
          {renderActionItem('Search Routes', <SearchIcon />)}
          {renderActionItem('Update Profile', <PersonIcon />)}
        </List>
      </Card>
    );
  }

  // Guest / Default View
  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <CardContent sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" gutterBottom>
          Welcome
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Please log in to access full dashboard features and manage your trips.
        </Typography>
        <Button variant="contained" startIcon={<LoginIcon />}>
          Log In
        </Button>
      </CardContent>
    </Card>
  );
};

export default RoleAdaptiveWidget;
