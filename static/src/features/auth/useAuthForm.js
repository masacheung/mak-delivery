import { useState, useEffect, useCallback, useRef } from 'react';
import { apiFetch } from '../../utils/apiClient';
import { readPendingRegistration, savePendingRegistration, clearPendingRegistration, remainingResendSeconds, resendDeadline } from './pendingRegistration';

const initialFormData = () => ({
  username: '',
  password: '',
  phoneNumber: '+1',
  verificationCode: '',
  resetCode: '',
  newPassword: '',
  confirmPassword: '',
});

/**
 * Shared register / login / verify / reset / find-username state and API handlers.
 * @param {(token: string, user: object) => void} onLoginSuccess
 */
export function useAuthForm(onLoginSuccess) {
  const [rememberMe, setRememberMe] = useState(true);
  const onLoginSuccessRef = useRef(onLoginSuccess);
  useEffect(() => {
    onLoginSuccessRef.current = onLoginSuccess;
  }, [onLoginSuccess]);

  const [initialPending] = useState(readPendingRegistration);
  const [pendingRegistration, setPendingRegistration] = useState(initialPending);
  const [activeTab, setActiveTab] = useState(1);
  const [formData, setFormData] = useState(() => ({ ...initialFormData(), ...(initialPending && { username: initialPending.username, phoneNumber: initialPending.phoneNumber }) }));
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [isVerificationStep, setIsVerificationStep] = useState(Boolean(initialPending));
  const [isPasswordResetStep, setIsPasswordResetStep] = useState(false);
  const [isFindUsernameStep, setIsFindUsernameStep] = useState(false);
  const [passwordResetStage, setPasswordResetStage] = useState('request');
  const [resendCooldown, setResendCooldown] = useState(() => remainingResendSeconds(initialPending));
  const [authBusy, setAuthBusy] = useState('');
  const authBusyRef = useRef('');
  const [tempResetToken, setTempResetToken] = useState('');
  const [foundUsername, setFoundUsername] = useState('');
  const [findUsernamePhoneNumber, setFindUsernamePhoneNumber] = useState('+1');
  const [isChangingPhone, setIsChangingPhone] = useState(false);
  const [phoneChangeForm, setPhoneChangeForm] = useState({ phoneNumber: '', password: '' });

  const resendAvailableAt = pendingRegistration?.resendAvailableAt || 0;
  useEffect(() => {
    const remaining = () => remainingResendSeconds({ resendAvailableAt });
    setResendCooldown(remaining());
    if (!remaining()) return;
    const timer = setInterval(() => {
      const seconds = remaining();
      setResendCooldown(seconds);
      if (!seconds) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendAvailableAt]);

  const showMessage = useCallback((text, type = 'info') => {
    setMessage(text);
    setMessageType(type);
  }, []);

  const beginAuthAction = (action) => {
    if (authBusyRef.current) return false;
    authBusyRef.current = action;
    setAuthBusy(action);
    setMessage('');
    return true;
  };
  const endAuthAction = () => { authBusyRef.current = ''; setAuthBusy(''); };
  const forgetPendingRegistration = () => {
    clearPendingRegistration();
    setPendingRegistration(null);
  };
  const continueVerification = (account, result = {}, codeRequested = false) => {
    const sameAccount = pendingRegistration?.username === account?.username && pendingRegistration?.phoneNumber === account?.phoneNumber;
    const pending = savePendingRegistration({
      username: account?.username,
      phoneNumber: account?.phoneNumber,
      verificationToken: account?.verificationToken || (sameAccount ? pendingRegistration.verificationToken : undefined),
      savedAt: sameAccount ? pendingRegistration.savedAt : Date.now(),
      resendAvailableAt: resendDeadline(result, codeRequested ? Date.now() + 60000 : sameAccount ? pendingRegistration.resendAvailableAt : 0),
    });
    if (!pending) { showMessage('Unable to resume phone verification. Please try signing in again.', 'error'); return; }
    setPendingRegistration(pending);
    setFormData({ ...initialFormData(), username: pending.username, phoneNumber: pending.phoneNumber });
    setIsVerificationStep(true);
    setIsPasswordResetStep(false);
    setIsFindUsernameStep(false);
    setIsChangingPhone(false);
    setPhoneChangeForm({ phoneNumber: '', password: '' });
    showMessage('Your account is waiting for phone verification.', 'info');
  };
  const handleContinueVerification = () => {
    if (!authBusyRef.current && pendingRegistration) continueVerification(pendingRegistration);
  };
  const handleBackToLogin = () => {
    if (authBusyRef.current) return;
    setIsVerificationStep(false);
    setIsChangingPhone(false);
    setPhoneChangeForm({ phoneNumber: '', password: '' });
    setActiveTab(1);
    setMessage('');
    setFormData({ ...initialFormData(), username: pendingRegistration?.username || formData.username });
  };
  const handleUseAnotherAccount = () => {
    if (authBusyRef.current) return;
    forgetPendingRegistration();
    setIsVerificationStep(false);
    setIsChangingPhone(false);
    setPhoneChangeForm({ phoneNumber: '', password: '' });
    setActiveTab(1);
    setMessage('');
    setFormData(initialFormData());
  };

  const handleTabChange = (_event, newValue) => {
    if (authBusyRef.current) return;
    setActiveTab(newValue);
    setMessage('');
    setIsVerificationStep(false);
    setIsChangingPhone(false);
    setPhoneChangeForm({ phoneNumber: '', password: '' });
    setIsPasswordResetStep(false);
    setIsFindUsernameStep(false);
    setPasswordResetStage('request');
    setTempResetToken('');
    setFoundUsername('');
    setFindUsernamePhoneNumber('+1');
    setFormData(initialFormData());
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phoneNumber') {
      let formattedValue = value.replace(/[^\d+]/g, '');
      if (!formattedValue.startsWith('+1')) {
        formattedValue = '+1' + formattedValue.replace(/^\+?1?/, '');
      }
      if (formattedValue.length > 12) {
        formattedValue = formattedValue.substring(0, 12);
      }
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validatePhoneNumber = (phone) => /^\+1\d{10}$/.test(phone);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password || !formData.phoneNumber) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      showMessage('Please enter a valid US phone number (+1 followed by 10 digits)', 'error');
      return;
    }

    if (!beginAuthAction('register')) return;
    try {
      const response = await apiFetch('/api/users/register', {
        method: 'POST',
        auth: 'none',
        body: {
          username: formData.username,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        continueVerification(data.verification || data.user, data, true);
        showMessage(data.message || 'Your account is waiting for phone verification.', 'info');
      } else if (data.requiresVerification && data.verification) {
        continueVerification(data.verification, data);
        if (data.message) showMessage(data.message, response.ok ? 'info' : 'error');
      } else {
        showMessage(data.message, 'error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showMessage('Registration failed. Please try again.', 'error');
    } finally { endAuthAction(); }
  };

  const handleVerification = async (e) => {
    e.preventDefault();

    const verificationCode = String(formData.verificationCode).replace(/\s/g, '').trim();
    if (!verificationCode) {
      showMessage('Please enter the verification code', 'error');
      return;
    }

    if (!beginAuthAction('verify')) return;
    try {
      const response = await apiFetch('/api/users/verify', {
        method: 'POST',
        auth: 'none',
        body: {
          phoneNumber: formData.phoneNumber,
          verificationCode,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        forgetPendingRegistration();
        showMessage(data.message, 'success');
        setIsVerificationStep(false);
        setActiveTab(1);
        setFormData({
          username: data.user?.username || formData.username,
          password: '',
          phoneNumber: '+1',
          verificationCode: '',
          resetCode: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        showMessage(data.message || 'Verification failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Verification error:', error);
      showMessage('Verification failed. Please try again.', 'error');
    } finally { endAuthAction(); }
  };

  const handleResendVerification = async () => {
    if (authBusyRef.current) return;
    if (!pendingRegistration?.verificationToken) {
      handleBackToLogin();
      showMessage('Please sign in to your unfinished account before requesting a new code.', 'info');
      return;
    }
    if (resendCooldown > 0) {
      showMessage(`Please wait ${resendCooldown} seconds before resending`, 'warning');
      return;
    }

    if (!beginAuthAction('resend')) return;
    try {
      const response = await apiFetch('/api/users/resend-verification', {
        method: 'POST',
        auth: 'none',
        body: { phoneNumber: pendingRegistration.phoneNumber, verificationToken: pendingRegistration.verificationToken },
      });

      const data = await response.json();

      const deadline = resendDeadline(data, response.ok && data.success ? Date.now() + 60000 : pendingRegistration.resendAvailableAt);
      if (deadline !== pendingRegistration.resendAvailableAt) {
        const pending = savePendingRegistration({ ...pendingRegistration, resendAvailableAt: deadline });
        setPendingRegistration(pending);
        setResendCooldown(remainingResendSeconds(pending));
      }
      if (response.ok && data.success) {
        showMessage(data.message || 'SMS request accepted. It may take a moment to arrive.', 'success');
      } else {
        if (data.code === 'VERIFICATION_SESSION_EXPIRED') handleBackToLoginAfterRequest();
        showMessage(data.message || 'Unable to request a code. Please try again later.', 'error');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      showMessage('Failed to resend verification code. Please try again.', 'error');
    } finally { endAuthAction(); }
  };

  const handleBackToLoginAfterRequest = () => {
    setIsVerificationStep(false);
    setIsChangingPhone(false);
    setPhoneChangeForm({ phoneNumber: '', password: '' });
    setActiveTab(1);
    setFormData({ ...initialFormData(), username: pendingRegistration?.username || formData.username });
  };

  const handleStartPhoneChange = (event) => {
    event?.preventDefault();
    if (authBusyRef.current) return;
    setMessage('');
    setPhoneChangeForm({ phoneNumber: pendingRegistration?.phoneNumber || formData.phoneNumber, password: '' });
    setIsChangingPhone(true);
  };
  const handleCancelPhoneChange = (event) => {
    event?.preventDefault();
    if (authBusyRef.current) return;
    setIsChangingPhone(false);
    setPhoneChangeForm({ phoneNumber: '', password: '' });
    setMessage('');
  };
  const handlePhoneChangeInput = (event) => {
    const { name, value } = event.target;
    const formatted = name === 'phoneNumber' ? '+1' + value.replace(/[^\d]/g, '').replace(/^1/, '').slice(0, 10) : value;
    setPhoneChangeForm(previous => ({ ...previous, [name]: formatted }));
  };
  const handleChangeVerificationPhone = async (event) => {
    event.preventDefault();
    if (authBusyRef.current) return;
    if (!pendingRegistration) {
      handleBackToLogin();
      showMessage('Please sign in to your unfinished account before changing the number.', 'info');
      return;
    }
    if (!validatePhoneNumber(phoneChangeForm.phoneNumber)) {
      showMessage('Please enter a valid US phone number (+1 followed by 10 digits)', 'error');
      return;
    }
    if (phoneChangeForm.phoneNumber === pendingRegistration?.phoneNumber) {
      showMessage('Enter a different phone number, or go back to request another code.', 'warning');
      return;
    }
    if (!phoneChangeForm.password) {
      showMessage('Enter your account password to change your phone number.', 'error');
      return;
    }
    if (!beginAuthAction('change-phone')) return;
    try {
      const response = await apiFetch('/api/users/change-verification-phone', {
        method: 'POST', auth: 'none',
        body: { username: pendingRegistration.username, currentPhoneNumber: pendingRegistration.phoneNumber, phoneNumber: phoneChangeForm.phoneNumber, password: phoneChangeForm.password },
      });
      const data = await response.json();
      if (data.verification && (data.success || data.requiresVerification)) {
        continueVerification(data.verification, data, response.ok && data.success);
      } else {
        const deadline = resendDeadline(data, pendingRegistration.resendAvailableAt);
        if (deadline !== pendingRegistration.resendAvailableAt) setPendingRegistration(savePendingRegistration({ ...pendingRegistration, resendAvailableAt: deadline }));
      }
      showMessage(data.message || (response.ok && data.success ? 'Number updated. SMS request accepted; it may take a moment to arrive.' : 'Unable to update your number. Please try again.'), response.ok && data.success ? 'success' : 'error');
    } catch (error) {
      showMessage('Unable to confirm whether your number was updated. Please sign in again before retrying.', 'error');
    } finally {
      setPhoneChangeForm(previous => ({ ...previous, password: '' }));
      endAuthAction();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    if (!beginAuthAction('login')) return;
    try {
      const response = await apiFetch('/api/users/login', {
        method: 'POST',
        auth: 'none',
        body: {
          username: formData.username,
          password: formData.password,
          rememberMe,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        forgetPendingRegistration();
        onLoginSuccessRef.current(data.token, data.user);
        showMessage(rememberMe && data.remembered === false ? 'Signed in for 24 hours. Keep-login is not available yet.' : data.message, 'success');
      } else if (data.requiresVerification && data.verification) {
        continueVerification(data.verification, data);
        if (data.message) showMessage(data.message, 'info');
      } else {
        showMessage(data.message, 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      showMessage('Login failed. Please try again.', 'error');
    } finally { endAuthAction(); }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (passwordResetStage === 'request') {
      if (!formData.username || !formData.phoneNumber) {
        showMessage('Please enter your username and phone number', 'error');
        return;
      }

      if (!validatePhoneNumber(formData.phoneNumber)) {
        showMessage('Please enter a valid US phone number (+1 followed by 10 digits)', 'error');
        return;
      }

      try {
        const response = await apiFetch('/api/users/reset-password-request', {
          method: 'POST',
          auth: 'none',
          body: {
            username: formData.username,
            phoneNumber: formData.phoneNumber,
          },
        });

        const data = await response.json();

        if (data.success) {
          showMessage(data.message, 'success');
          setPasswordResetStage('update');
        } else {
          showMessage(data.message, 'error');
        }
      } catch (error) {
        console.error('Password reset request error:', error);
        showMessage('Failed to verify credentials. Please try again.', 'error');
      }
    } else if (passwordResetStage === 'update') {
      if (!formData.newPassword || !formData.confirmPassword) {
        showMessage('Please enter your new password and confirm it', 'error');
        return;
      }

      if (formData.newPassword.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
      }

      try {
        const response = await apiFetch('/api/users/reset-password-update', {
          method: 'POST',
          auth: 'none',
          body: {
            username: formData.username,
            phoneNumber: formData.phoneNumber,
            newPassword: formData.newPassword,
          },
        });

        const data = await response.json();

        if (data.success) {
          showMessage(data.message, 'success');
          setIsPasswordResetStep(false);
          setPasswordResetStage('request');
          setTempResetToken('');
          setFormData(initialFormData());
        } else {
          showMessage(data.message, 'error');
        }
      } catch (error) {
        console.error('Password update error:', error);
        showMessage('Failed to update password. Please try again.', 'error');
      }
    }
  };

  const handleFindUsername = async (e) => {
    e.preventDefault();

    if (!findUsernamePhoneNumber) {
      showMessage('Please enter your phone number', 'error');
      return;
    }

    if (!validatePhoneNumber(findUsernamePhoneNumber)) {
      showMessage('Please enter a valid US phone number (+1 followed by 10 digits)', 'error');
      return;
    }

    try {
      const response = await apiFetch('/api/users/find-username', {
        method: 'POST',
        auth: 'none',
        body: { phoneNumber: findUsernamePhoneNumber },
      });

      const data = await response.json();

      if (data.success) {
        setFoundUsername(data.username);
        showMessage(data.message, 'success');
      } else {
        showMessage(data.message, 'error');
        setFoundUsername('');
      }
    } catch (error) {
      console.error('Find username error:', error);
      showMessage('Failed to find username. Please try again.', 'error');
      setFoundUsername('');
    }
  };

  const handleFindUsernamePhoneChange = (e) => {
    let formattedValue = e.target.value.replace(/[^\d+]/g, '');
    if (!formattedValue.startsWith('+1')) {
      formattedValue = '+1' + formattedValue.replace(/^\+?1?/, '');
    }
    if (formattedValue.length > 12) {
      formattedValue = formattedValue.substring(0, 12);
    }
    setFindUsernamePhoneNumber(formattedValue);
  };

  return {
    rememberMe, setRememberMe,
    activeTab,
    formData,
    message,
    messageType,
    isVerificationStep,
    isPasswordResetStep,
    isFindUsernameStep,
    passwordResetStage,
    resendCooldown,
    pendingRegistration,
    authBusy,
    isChangingPhone,
    phoneChangeForm,
    handleStartPhoneChange,
    handleCancelPhoneChange,
    handlePhoneChangeInput,
    handleChangeVerificationPhone,
    handleContinueVerification,
    handleBackToLogin,
    handleUseAnotherAccount,
    foundUsername,
    findUsernamePhoneNumber,
    handleTabChange,
    handleInputChange,
    handleRegister,
    handleVerification,
    handleResendVerification,
    handleLogin,
    handlePasswordReset,
    handleFindUsername,
    handleFindUsernamePhoneChange,
    setIsFindUsernameStep,
    setFoundUsername,
    setFindUsernamePhoneNumber,
    setIsPasswordResetStep,
    setPasswordResetStage,
    setTempResetToken,
    setIsVerificationStep,
    setFormData,
  };
}
