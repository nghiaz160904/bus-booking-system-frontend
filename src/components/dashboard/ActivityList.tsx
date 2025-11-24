import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications'; // or History, Article, etc.
import { useAuth } from '@/context/AuthContext';
import { activities } from '@/types/dashboard';

const ActivityList: React.FC = () => {
  const { userRole } = useAuth();

  // Filter logic remains the same
  const visible = activities.filter(
    (a) => !a.roleVisibility || (userRole && a.roleVisibility.includes(userRole)),
  );

  return (
    <Card elevation={3} sx={{ borderRadius: 2, height: '100%' }}>
      <CardHeader
        title="Recent Activity"
        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
        sx={{ pb: 1 }}
      />
      <Divider />
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        {visible.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" fontStyle="italic">
              No activity available
            </Typography>
          </Box>
        ) : (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {visible.map((a, index) => (
              <React.Fragment key={a.id}>
                <ListItem alignItems="flex-start">
                  {/* Optional: Add an icon avatar for a polished look */}
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>
                      <NotificationsIcon fontSize="small" />
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Typography variant="body2" color="text.primary" fontWeight={500}>
                        {a.message}
                      </Typography>
                    }
                    secondary={
                      <Typography component="span" variant="caption" color="text.secondary">
                        {a.timestamp}
                      </Typography>
                    }
                  />
                </ListItem>
                {/* Add a divider between items, but not after the last one */}
                {index < visible.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityList;
