import React from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Tab,
  Tabs,
  Alert,
} from "@mui/material";

/** All auth step UIs (find username, reset password, register/login, verify). `f` is from `useAuthForm`. */
const AuthFormBody = ({ f, variant }) => {
  const standaloneTitle =
    f.isPasswordResetStep ? "Reset Password" : f.isFindUsernameStep ? "Find Username" : "User Authentication";

  return (
    <>
      {f.message && (
        <Alert severity={f.messageType} sx={{ mb: 2 }}>
          {f.message}
        </Alert>
      )}

      {f.isFindUsernameStep ? (
        <Box component="form" onSubmit={f.handleFindUsername} sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Find Your Username
          </Typography>
          <Typography variant="body2" gutterBottom>
            Enter your phone number to retrieve your username
          </Typography>
          <TextField
            fullWidth
            label="Phone Number"
            name="findUsernamePhoneNumber"
            value={f.findUsernamePhoneNumber}
            onChange={f.handleFindUsernamePhoneChange}
            margin="normal"
            placeholder="+1234567890"
            required
          />
          {f.foundUsername && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: "#e3f2fd", borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Your username is:
              </Typography>
              <Typography variant="h6" sx={{ mt: 1, fontWeight: "bold" }}>
                {f.foundUsername}
              </Typography>
            </Box>
          )}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 1 }}>
            Find Username
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => {
              f.setIsFindUsernameStep(false);
              f.setFoundUsername("");
              f.setFindUsernamePhoneNumber("+1");
            }}
          >
            Back to Login
          </Button>
        </Box>
      ) : f.isPasswordResetStep ? (
        <Box component="form" onSubmit={f.handlePasswordReset} sx={{ mt: 2 }}>
          {f.passwordResetStage === "request" && (
            <>
              <Typography variant="h6" gutterBottom>
                Reset Password
              </Typography>
              <Typography variant="body2" gutterBottom>
                Enter your username and phone number to reset your password
              </Typography>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={f.formData.username}
                onChange={f.handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={f.formData.phoneNumber}
                onChange={f.handleInputChange}
                margin="normal"
                placeholder="+1234567890"
                required
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 1 }}>
                Submit
              </Button>
            </>
          )}

          {f.passwordResetStage === "update" && (
            <>
              <Typography variant="h6" gutterBottom>
                Set New Password
              </Typography>
              <Typography variant="body2" gutterBottom>
                Enter your new password
              </Typography>
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type="password"
                value={f.formData.newPassword}
                onChange={f.handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={f.formData.confirmPassword}
                onChange={f.handleInputChange}
                margin="normal"
                required
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 1 }}>
                Update Password
              </Button>
            </>
          )}

          <Button
            fullWidth
            variant="text"
            onClick={() => {
              f.setIsPasswordResetStep(false);
              f.setPasswordResetStage("request");
              f.setTempResetToken("");
              f.setFormData({
                ...f.formData,
                username: "",
                newPassword: "",
                confirmPassword: "",
                phoneNumber: "+1",
              });
            }}
          >
            Back to Login
          </Button>
        </Box>
      ) : (
        <>
          {!f.isVerificationStep ? (
            <>
              {variant === "standalone" && (
                <Typography variant="h4" component="h1" gutterBottom align="center">
                  {standaloneTitle}
                </Typography>
              )}
              <Tabs value={f.activeTab} onChange={f.handleTabChange} centered>
                <Tab label="Register" />
                <Tab label="Login" />
              </Tabs>

              {f.activeTab === 0 && (
                <Box component="form" onSubmit={f.handleRegister} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={f.formData.username}
                    onChange={f.handleInputChange}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={f.formData.password}
                    onChange={f.handleInputChange}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={f.formData.phoneNumber}
                    onChange={f.handleInputChange}
                    margin="normal"
                    placeholder="+1234567890"
                    helperText="US phone number starting with +1"
                    required
                  />
                  <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Register
                  </Button>
                </Box>
              )}

              {f.activeTab === 1 && (
                <Box component="form" onSubmit={f.handleLogin} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={f.formData.username}
                    onChange={f.handleInputChange}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={f.formData.password}
                    onChange={f.handleInputChange}
                    margin="normal"
                    required
                  />
                  <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Login
                  </Button>
                  <Button fullWidth variant="text" onClick={() => f.setIsFindUsernameStep(true)} sx={{ mt: 1 }}>
                    Forget Username?
                  </Button>
                  <Button fullWidth variant="text" onClick={() => f.setIsPasswordResetStep(true)} sx={{ mt: 0.5 }}>
                    Forgot Password?
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <Box component="form" onSubmit={f.handleVerification} sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Phone Verification
              </Typography>
              <Typography variant="body2" gutterBottom>
                Please enter the 6-digit verification code sent to {f.formData.phoneNumber}
              </Typography>
              <TextField
                fullWidth
                label="Verification Code"
                name="verificationCode"
                value={f.formData.verificationCode}
                onChange={f.handleInputChange}
                margin="normal"
                required
                inputProps={{ maxLength: 6 }}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 1 }}>
                Verify
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={f.handleResendVerification}
                sx={{ mb: 1 }}
                disabled={f.resendCooldown > 0}
              >
                {f.resendCooldown > 0 ? `Resend Code (${f.resendCooldown}s)` : "Resend Code"}
              </Button>
              <Button fullWidth variant="text" onClick={() => f.setIsVerificationStep(false)}>
                Back to Registration
              </Button>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default AuthFormBody;
