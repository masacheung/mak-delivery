import React from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Tab,
  Tabs,
  Alert,
  Checkbox,
  FormControlLabel,
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
                <Tab label="Register" disabled={Boolean(f.authBusy)} />
                <Tab label="Login" disabled={Boolean(f.authBusy)} />
              </Tabs>

              {f.pendingRegistration && <Alert severity="info" sx={{ mt: 2 }}>
                Registration is not finished for <strong>{f.pendingRegistration.username}</strong>.
                <Button fullWidth onClick={f.handleContinueVerification} disabled={Boolean(f.authBusy)} sx={{ mt: 1 }}>Continue phone verification</Button>
                <Button fullWidth onClick={f.handleUseAnotherAccount} disabled={Boolean(f.authBusy)}>Use another account</Button>
              </Alert>}

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
                  <Button type="submit" fullWidth variant="contained" disabled={Boolean(f.authBusy)} sx={{ mt: 3, mb: 2 }}>
                    {f.authBusy === 'register' ? 'Creating account…' : 'Register'}
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
                  <FormControlLabel control={<Checkbox checked={f.rememberMe} onChange={event => f.setRememberMe(event.target.checked)} />} label="Keep me signed in for 30 days" />
                  <Button type="submit" fullWidth variant="contained" disabled={Boolean(f.authBusy)} sx={{ mt: 3, mb: 2 }}>
                    {f.authBusy === 'login' ? 'Signing in…' : 'Login'}
                  </Button>
                  <Button fullWidth variant="text" disabled={Boolean(f.authBusy)} onClick={() => f.setIsFindUsernameStep(true)} sx={{ mt: 1 }}>
                    Forget Username?
                  </Button>
                  <Button fullWidth variant="text" disabled={Boolean(f.authBusy)} onClick={() => f.setIsPasswordResetStep(true)} sx={{ mt: 0.5 }}>
                    Forgot Password?
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Finish creating your account
              </Typography>
              <Alert severity="info" sx={{ my: 2 }}>Your account is not ready yet. Verify your phone to finish signing up.</Alert>
              <Typography variant="body2" gutterBottom>
                Username: <strong>{f.formData.username}</strong>
              </Typography>
              <Typography variant="body2" gutterBottom>
                Verification phone: <strong>{f.formData.phoneNumber}</strong>. Enter the 6-digit code when it arrives, or request one below.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                You can close this page and continue later on this device.
              </Typography>
              {f.isChangingPhone ? (
                <Box key="change-phone" component="form" onSubmit={f.handleChangeVerificationPhone} sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" component="h2" fontWeight={700}>Change phone number</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Keep the same account. Confirm your password to update the number and request a code.</Typography>
                  <TextField fullWidth label="New phone number" name="phoneNumber" type="tel" value={f.phoneChangeForm.phoneNumber} onChange={f.handlePhoneChangeInput} autoComplete="tel" inputProps={{ inputMode: 'tel' }} margin="normal" required disabled={Boolean(f.authBusy)} helperText="US phone number starting with +1" />
                  <TextField fullWidth label="Account password" name="password" type="password" value={f.phoneChangeForm.password} onChange={f.handlePhoneChangeInput} autoComplete="current-password" margin="normal" required disabled={Boolean(f.authBusy)} />
                  <Button type="submit" fullWidth variant="contained" disabled={Boolean(f.authBusy)} sx={{ mt: 2, mb: 1 }}>{f.authBusy === 'change-phone' ? 'Updating number…' : 'Update number & send code'}</Button>
                  <Button type="button" fullWidth disabled={Boolean(f.authBusy)} onClick={f.handleCancelPhoneChange}>Back to verification</Button>
                </Box>
              ) : <Box key="verify-phone" component="form" onSubmit={f.handleVerification}>
              <TextField
                fullWidth
                label="Verification Code"
                name="verificationCode"
                value={f.formData.verificationCode}
                onChange={f.handleInputChange}
                margin="normal"
                required
                autoComplete="one-time-code"
                inputProps={{ maxLength: 6, inputMode: 'numeric', pattern: '[0-9]{6}' }}
                disabled={Boolean(f.authBusy)}
              />
              <Button type="submit" fullWidth variant="contained" disabled={Boolean(f.authBusy)} sx={{ mt: 2, mb: 1 }}>
                {f.authBusy === 'verify' ? 'Verifying…' : 'Verify phone'}
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>Didn't receive a code? Check the number above and your signal. A new SMS is only requested when you press the button below.</Typography>
              <Button
                type="button"
                fullWidth
                variant="outlined"
                onClick={f.pendingRegistration?.verificationToken ? f.handleResendVerification : f.handleBackToLogin}
                sx={{ mb: 1 }}
                disabled={(Boolean(f.pendingRegistration?.verificationToken) && f.resendCooldown > 0) || Boolean(f.authBusy)}
              >
                {!f.pendingRegistration?.verificationToken ? 'Sign in to request a new code' : f.authBusy === 'resend' ? 'Requesting code…' : f.resendCooldown > 0 ? `Resend Code (${f.resendCooldown}s)` : "Resend Code"}
              </Button>
              <Button type="button" fullWidth variant="text" disabled={Boolean(f.authBusy)} onClick={f.handleStartPhoneChange} sx={{ mb: 1 }}>Wrong phone number? Change phone number</Button>
              </Box>}
              <Button fullWidth variant="text" disabled={Boolean(f.authBusy)} onClick={f.handleBackToLogin}>
                Back to Login
              </Button>
              <Button fullWidth variant="text" disabled={Boolean(f.authBusy)} onClick={f.handleUseAnotherAccount}>
                Use another account
              </Button>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default AuthFormBody;
