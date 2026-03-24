import React from "react";
import { Box, Paper, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuthForm } from "./useAuthForm";
import AuthFormBody from "./AuthFormBody";

/**
 * @param {'fullPage' | 'standalone'} props.variant
 * @param {() => void} [props.onNavigateBack] — shown when variant is fullPage
 * @param {(token: string, user: object) => void} props.onLoginSuccess
 */
const AuthForm = ({ variant = "standalone", onNavigateBack, onLoginSuccess }) => {
  const f = useAuthForm(onLoginSuccess);

  const headerTitle =
    f.isPasswordResetStep ? "Reset Password" : f.isFindUsernameStep ? "Find Username" : "Authentication";

  if (variant === "fullPage") {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5", padding: 2 }}>
        <Box sx={{ maxWidth: 400, margin: "0 auto", padding: 3 }}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              {onNavigateBack && (
                <IconButton onClick={onNavigateBack} aria-label="Back">
                  <ArrowBackIcon />
                </IconButton>
              )}
              <Typography variant="h4" component="h1" sx={{ flexGrow: 1, textAlign: "center" }}>
                {headerTitle}
              </Typography>
            </Box>
            <AuthFormBody f={f} variant={variant} />
          </Paper>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto", padding: 3 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <AuthFormBody f={f} variant={variant} />
      </Paper>
    </Box>
  );
};

export default AuthForm;
