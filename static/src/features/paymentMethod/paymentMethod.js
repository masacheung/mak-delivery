import { Box, IconButton, Card, CardContent, Typography, Divider, List, ListItem, ListItemText, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Import Close Icon

const PaymentMethod = ({order, onClose}) => {

  return (
    <>
      <Box
        sx={{
          position: "fixed",  // Ensure the container stays fixed
          width: "100%",      // Full width
          height: "100vh",    // Full height of the viewport
          backgroundColor: "white",  // White background
          zIndex: 1300,       // Ensure it's above other content
          display: "flex",     // Flexbox layout
          flexDirection: "column",  // Stack the content vertically
          alignItems: "center",     // Center content horizontally
          overflowX: "hidden"  // Prevent horizontal overflow
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
          <CloseIcon />
        </IconButton>
        <Typography variant="h4" gutterBottom
          sx={{
          fontWeight: "bold",
          fontFamily: "Poppins, sans-serif",
          marginTop: 5, // Space above the title
          }}
        >
          Payment Method
        </Typography>

        {/* QR Code Display */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            height: "80vh", // Adjust the height for better visibility
          }}
        >
          <Typography variant="h8" fontWeight="bold">
            Scan the QR code to pay with Venmo
          </Typography>
          <img
          src="/venmo.jpg" // Reference the image in the public folder
          alt="Venmo QR Code"
          style={{ width: '400px', height: '400px', margin: '1rem' }}
          />

          <Typography variant="body1" sx={{ mt: 2 }}>
            Can't scan? Pay via Venmo: 
            <a href="https://venmo.com/u/Crystal-Mak-1" target="_blank" rel="noopener noreferrer">
              Crystal-Mak-1
            </a>
          </Typography>

          <Typography variant="body2" color="textSecondary" sx={{ mt: 1, wordBreak: 'break-word', fontSize: '0.875rem', whiteSpace: 'normal', maxWidth: '80%', textAlign: 'center' }}>
            Please include your order ID <Typography variant="body2" component="span" sx={{ fontWeight: 'bold', color: 'black' }}>{order.id}</Typography> in the Venmo payment description.
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default PaymentMethod;
