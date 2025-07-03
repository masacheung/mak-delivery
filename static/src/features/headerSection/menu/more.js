import {
  Box, IconButton, Typography, Card, CardContent, List, ListItem
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const MoreMenu = ({onClose}) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '50%',
        height: '100vh',
        backgroundColor: 'white',
        zIndex: 1300,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowX: 'hidden',
        boxShadow: '2px 0 5px rgba(0,0,0,0.3)',
        paddingTop: 4,
      }}
    >
      <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: "0.5rem",
            left: "0.25rem",
            backgroundColor: "gray",
            color: "white",
            zIndex: 1100, // Ensure the button stays above all content
          }}
        >
          <ArrowBackIcon />
        </IconButton>

      
      {/* Content container pushed down from the top */}
      <Box
        sx={{
          mt: 5, // margin-top (equivalent to Tailwind's mt-20)
          width: '80%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2, // equivalent to space-y-4
        }}
      >
        <Box
          onClick={() => {
            onClose();
            navigate('/pick-up-locations');
          }}
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 80,
            width: '100%',
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#374151',
            cursor: 'pointer',
            boxShadow: 1,
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          🏠 Pick-up Location
        </Box>

        <Box
          onClick={() => {
            onClose();
            navigate('/restaurant-support');
          }}
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 80,
            width: '100%',
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#374151',
            cursor: 'pointer',
            boxShadow: 1,
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          🛍️ Our Restaurant Partners
        </Box>

        <Box
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 80,
            width: '100%',
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#374151',
            cursor: 'pointer',
            boxShadow: 1,
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          ⭐ Restaurant Reviews
        </Box>
      </Box>
    </Box>
  );
};

export default MoreMenu;
