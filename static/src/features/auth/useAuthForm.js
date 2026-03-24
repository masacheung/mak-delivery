import { useState, useEffect, useCallback, useRef } from 'react';
import { apiFetch } from '../../utils/apiClient';

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
  const onLoginSuccessRef = useRef(onLoginSuccess);
  useEffect(() => {
    onLoginSuccessRef.current = onLoginSuccess;
  }, [onLoginSuccess]);

  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [isPasswordResetStep, setIsPasswordResetStep] = useState(false);
  const [isFindUsernameStep, setIsFindUsernameStep] = useState(false);
  const [passwordResetStage, setPasswordResetStage] = useState('request');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [tempResetToken, setTempResetToken] = useState('');
  const [foundUsername, setFoundUsername] = useState('');
  const [findUsernamePhoneNumber, setFindUsernamePhoneNumber] = useState('+1');

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const showMessage = useCallback((text, type = 'info') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  }, []);

  const handleTabChange = (_event, newValue) => {
    setActiveTab(newValue);
    setMessage('');
    setIsVerificationStep(false);
    setIsPasswordResetStep(false);
    setIsFindUsernameStep(false);
    setPasswordResetStage('request');
    setResendCooldown(0);
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

      if (data.success) {
        showMessage(data.message, 'success');
        setIsVerificationStep(true);
        setResendCooldown(60);
      } else {
        showMessage(data.message, 'error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showMessage('Registration failed. Please try again.', 'error');
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();

    const verificationCode = String(formData.verificationCode).replace(/\s/g, '').trim();
    if (!verificationCode) {
      showMessage('Please enter the verification code', 'error');
      return;
    }

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
        showMessage(data.message, 'success');
        setIsVerificationStep(false);
        setActiveTab(1);
        setFormData({
          username: formData.username,
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
    }
  };

  const handleResendVerification = async () => {
    if (resendCooldown > 0) {
      showMessage(`Please wait ${resendCooldown} seconds before resending`, 'warning');
      return;
    }

    try {
      const response = await apiFetch('/api/users/resend-verification', {
        method: 'POST',
        auth: 'none',
        body: { phoneNumber: formData.phoneNumber },
      });

      const data = await response.json();

      if (data.success) {
        showMessage(data.message, 'success');
        setResendCooldown(60);
      } else {
        showMessage(data.message, 'error');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      showMessage('Failed to resend verification code. Please try again.', 'error');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    try {
      const response = await apiFetch('/api/users/login', {
        method: 'POST',
        auth: 'none',
        body: {
          username: formData.username,
          password: formData.password,
        },
      });

      const data = await response.json();

      if (data.success) {
        onLoginSuccessRef.current(data.token, data.user);
        showMessage(data.message, 'success');
      } else {
        showMessage(data.message, 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      showMessage('Login failed. Please try again.', 'error');
    }
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
    activeTab,
    formData,
    message,
    messageType,
    isVerificationStep,
    isPasswordResetStep,
    isFindUsernameStep,
    passwordResetStage,
    resendCooldown,
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
