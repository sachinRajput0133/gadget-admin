import React from 'react';
import { 
  Drawer, 
  Box, 
  Typography, 
  IconButton, 
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const FormDrawer = ({ 
  open, 
  onClose, 
  title, 
  children, 
  width = 500,
  fullScreen = false
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Determine drawer width based on screen size
  const drawerWidth = isMobile ? '100%' : (fullScreen ? '100%' : `${width}px`);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          padding: 0,
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={onClose} edge="end" aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
      </Box>
      
      <Box sx={{ p: 2, overflowY: 'auto', height: 'calc(100% - 70px)' }}>
        {children}
      </Box>
    </Drawer>
  );
};

export default FormDrawer;