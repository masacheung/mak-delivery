import { 
  Box, 
  IconButton, 
  Card, 
  CardContent, 
  Typography, 
  Button,
  useTheme,
  useMediaQuery,
  Paper,
  Container,
  Fade,
  Alert
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PaymentIcon from '@mui/icons-material/Payment';
import QrCodeIcon from '@mui/icons-material/QrCode';
import LinkIcon from '@mui/icons-material/Link';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const PaymentMethod = ({order, onClose}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        position: "fixed",
        width: "100%",
        height: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        zIndex: 1300,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflowX: "hidden",
        padding: isMobile ? "16px" : "24px",
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: isMobile ? "16px" : "24px",
          left: isMobile ? "16px" : "24px",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          color: "white",
          width: 48,
          height: 48,
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            transform: "scale(1.1)",
          },
          transition: "all 0.3s ease",
        }}
      >
        <CloseIcon />
      </IconButton>

      <Container maxWidth="md">
        <Fade in={true} timeout={800}>
          <Paper
            elevation={0}
            sx={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: 4,
              padding: isMobile ? "32px 24px" : "48px 40px",
              textAlign: "center",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Header */}
            <Box sx={{ marginBottom: 4 }}>
              <PaymentIcon 
                sx={{ 
                  fontSize: 48, 
                  color: "primary.main", 
                  marginBottom: 2 
                }} 
              />
              <Typography 
                variant={isMobile ? "h4" : "h3"} 
                sx={{
                  fontWeight: 700,
                  color: "primary.main",
                  marginBottom: 1,
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Payment Method
              </Typography>
              <Typography 
                variant="body1" 
                sx={{
                  color: "text.secondary",
                  maxWidth: "500px",
                  margin: "0 auto",
                }}
              >
                Complete your order payment using Venmo
              </Typography>
            </Box>

            {/* QR Code Section */}
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                borderRadius: 3,
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                marginBottom: 3,
                padding: isMobile ? "24px" : "32px",
              }}
            >
              <CardContent sx={{ padding: "0 !important" }}>
                {/* QR Code Header */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 3 }}>
                  <QrCodeIcon sx={{ color: "primary.main", marginRight: 1 }} />
                  <Typography 
                    variant="h6" 
                    sx={{
                      fontWeight: 600,
                      color: "primary.main",
                    }}
                  >
                    Scan to Pay with Venmo
                  </Typography>
                </Box>

                {/* QR Code Image */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 3,
                  }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      padding: 2,
                      borderRadius: 3,
                      backgroundColor: "white",
                      border: "2px solid rgba(102, 126, 234, 0.1)",
                    }}
                  >
                    <img
                      src="/venmo.jpg"
                      alt="Venmo QR Code"
                      style={{ 
                        width: isMobile ? '280px' : '320px', 
                        height: isMobile ? '280px' : '320px',
                        borderRadius: '12px',
                        display: 'block',
                      }}
                    />
                  </Paper>
                </Box>

                {/* Alternative Payment Link */}
                <Box
                  sx={{
                    backgroundColor: "rgba(102, 126, 234, 0.1)",
                    borderRadius: 2,
                    padding: 2,
                    marginBottom: 3,
                  }}
                >
                  <Typography variant="body1" sx={{ marginBottom: 1, fontWeight: 600 }}>
                    Can't scan the QR code?
                  </Typography>
                  <Button
                    variant="outlined"
                    href="https://venmo.com/u/Crystal-Mak-1"
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<LinkIcon />}
                    sx={{
                      borderRadius: "50px",
                      borderColor: "primary.main",
                      color: "primary.main",
                      fontWeight: 600,
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "rgba(102, 126, 234, 0.1)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    Pay via Venmo: Crystal-Mak-1
                  </Button>
                </Box>

                {/* Order ID Alert */}
                <Alert 
                  severity="warning"
                  sx={{ 
                    borderRadius: 2,
                    backgroundColor: "rgba(255, 193, 7, 0.1)",
                    textAlign: "left",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 1 }}>
                    <AssignmentIcon sx={{ color: "warning.main", fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Important: Include your Order ID
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ marginBottom: 1 }}>
                    Please include your Order ID in the Venmo payment description:
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: "rgba(255, 193, 7, 0.2)",
                      borderRadius: 1,
                      padding: 1,
                      marginTop: 1,
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 700, 
                        color: "warning.dark",
                        fontFamily: "monospace",
                        fontSize: "1rem",
                      }}
                    >
                      Order ID: {order.id}
                    </Typography>
                  </Box>
                </Alert>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Box 
              sx={{ 
                display: "flex", 
                flexDirection: isMobile ? "column" : "row", 
                gap: 2,
                justifyContent: "center",
              }}
            >
              <Button 
                variant="contained" 
                size="large"
                onClick={onClose}
                sx={{
                  background: "linear-gradient(45deg, #4CAF50 30%, #45a049 90%)",
                  borderRadius: "50px",
                  height: 48,
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  flex: 1,
                  maxWidth: isMobile ? "100%" : "200px",
                  boxShadow: "0 4px 15px rgba(76, 175, 80, 0.4)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(76, 175, 80, 0.5)",
                  },
                }}
              >
                <CheckCircleIcon sx={{ marginRight: 1 }} />
                Payment Complete
              </Button>
            </Box>

            {/* Footer Note */}
            <Typography 
              variant="caption" 
              sx={{
                display: "block",
                color: "text.secondary",
                marginTop: 3,
                fontStyle: "italic",
              }}
            >
              Your order will be processed once payment is received and verified
            </Typography>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default PaymentMethod;
