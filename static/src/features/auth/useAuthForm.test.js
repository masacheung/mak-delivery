import React from 'react';
import { act, cleanup, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { apiFetch } from '../../utils/apiClient';
import { useAuthForm } from './useAuthForm';
import AuthFormBody from './AuthFormBody';
import { readPendingRegistration, savePendingRegistration } from './pendingRegistration';

jest.mock('../../utils/apiClient');
const account = { username: 'pending-user', phoneNumber: '+12025550123' };
const event = { preventDefault: jest.fn() };
const response = (ok, body) => Promise.resolve({ ok, json: async () => body });
const remember = (extra = {}) => savePendingRegistration({ ...account, savedAt: Date.now(), resendAvailableAt: 0, ...extra });
function fillAccount(result) {
  act(() => {
    Object.entries({ ...account, password: 'not-stored-password' }).forEach(([name, value]) => result.current.handleInputChange({ target: { name, value } }));
  });
}
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-10-09T12:00:00Z'));
  localStorage.clear();
  apiFetch.mockReset();
});
afterEach(() => { cleanup(); jest.clearAllTimers(); jest.useRealTimers(); });

test('new signup survives closing and reopening without saving the password or SMS code or sending another SMS', async () => {
  apiFetch.mockImplementation(() => response(true, { success: true, user: account }));
  const login = jest.fn();
  const first = renderHook(() => useAuthForm(login));
  fillAccount(first.result);
  await act(async () => first.result.current.handleRegister(event));
  expect(first.result.current.isVerificationStep).toBe(true);
  expect(first.result.current.resendCooldown).toBe(60);
  act(() => first.result.current.handleInputChange({ target: { name: 'verificationCode', value: '123456' } }));
  first.unmount();
  const reopened = renderHook(() => useAuthForm(login));
  expect(reopened.result.current.isVerificationStep).toBe(true);
  expect(reopened.result.current.formData).toEqual(expect.objectContaining({ ...account, password: '', verificationCode: '' }));
  expect(readPendingRegistration()).toEqual({ ...account, savedAt: Date.now(), resendAvailableAt: Date.now() + 60000 });
  expect(localStorage.getItem('makPendingRegistration.v1')).not.toMatch(/password|123456/);
  expect(apiFetch).toHaveBeenCalledTimes(1);
  expect(login).not.toHaveBeenCalled();
});

test.each(['handleLogin', 'handleRegister'])('%s resumes an existing account from server metadata without signing in or resending SMS', async (handler) => {
  apiFetch.mockImplementation(() => response(false, { success: false, requiresVerification: true, verification: account }));
  const login = jest.fn();
  const { result } = renderHook(() => useAuthForm(login));
  fillAccount(result);
  await act(async () => result.current[handler](event));
  expect(result.current.isVerificationStep).toBe(true);
  expect(result.current.formData.password).toBe('');
  expect(result.current.formData.phoneNumber).toBe(account.phoneNumber);
  expect(result.current.resendCooldown).toBe(0);
  expect(readPendingRegistration().username).toBe(account.username);
  expect(apiFetch).toHaveBeenCalledTimes(1);
  expect(login).not.toHaveBeenCalled();
});

test('incorrect login or failed signup does not create a saved verification flow', async () => {
  apiFetch.mockImplementation(() => response(false, { success: false, message: 'Invalid credentials' }));
  const login = jest.fn();
  const { result } = renderHook(() => useAuthForm(login));
  fillAccount(result);
  await act(async () => result.current.handleLogin(event));
  expect(result.current.isVerificationStep).toBe(false);
  expect(readPendingRegistration()).toBeNull();
  await act(async () => result.current.handleRegister(event));
  expect(result.current.isVerificationStep).toBe(false);
  expect(readPendingRegistration()).toBeNull();
  expect(login).not.toHaveBeenCalled();
});

test('failed or offline verification keeps progress; successful verification clears it and prefills login', async () => {
  remember();
  const { result } = renderHook(() => useAuthForm(jest.fn()));
  act(() => result.current.handleInputChange({ target: { name: 'verificationCode', value: '123456' } }));
  apiFetch.mockImplementationOnce(() => response(false, { success: false, message: 'Invalid or expired code' }));
  await act(async () => result.current.handleVerification(event));
  expect(result.current.message).toBe('Invalid or expired code');
  expect(result.current.isVerificationStep).toBe(true);
  expect(readPendingRegistration()).not.toBeNull();
  apiFetch.mockImplementationOnce(() => response(true, { success: true, user: account, message: 'Phone verified' }));
  await act(async () => result.current.handleVerification(event));
  expect(readPendingRegistration()).toBeNull();
  expect(result.current.pendingRegistration).toBeNull();
  expect(result.current.isVerificationStep).toBe(false);
  expect(result.current.activeTab).toBe(1);
  expect(result.current.formData.username).toBe(account.username);
  expect(result.current.formData.verificationCode).toBe('');
});

test('resend cooldown is based on elapsed time and survives refresh; failed resends keep progress', async () => {
  remember({ verificationToken: 'resume-capability', resendAvailableAt: Date.now() + 60000 });
  const first = renderHook(() => useAuthForm(jest.fn()));
  act(() => jest.advanceTimersByTime(45000));
  first.unmount();
  const { result } = renderHook(() => useAuthForm(jest.fn()));
  expect(result.current.resendCooldown).toBe(15);
  await act(async () => result.current.handleResendVerification());
  expect(apiFetch).not.toHaveBeenCalled();
  act(() => jest.advanceTimersByTime(15000));
  expect(result.current.resendCooldown).toBe(0);
  apiFetch.mockImplementationOnce(() => response(false, { success: false, message: 'Unable to send code' }));
  await act(async () => result.current.handleResendVerification());
  expect(result.current.resendCooldown).toBe(0);
  expect(readPendingRegistration()).not.toBeNull();
  apiFetch.mockImplementationOnce(() => response(true, { success: true, message: 'Code resent' }));
  await act(async () => result.current.handleResendVerification());
  expect(result.current.resendCooldown).toBe(60);
  expect(readPendingRegistration().resendAvailableAt).toBe(Date.now() + 60000);
  expect(apiFetch).toHaveBeenLastCalledWith('/api/users/resend-verification', expect.objectContaining({ body: { phoneNumber: account.phoneNumber, verificationToken: 'resume-capability' } }));
});

test('a repeated submit while signup is pending sends only one request', async () => {
  let finish;
  apiFetch.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  const { result } = renderHook(() => useAuthForm(jest.fn()));
  fillAccount(result);
  let signup;
  act(() => { signup = result.current.handleRegister(event); });
  expect(result.current.authBusy).toBe('register');
  await act(async () => result.current.handleRegister(event));
  expect(apiFetch).toHaveBeenCalledTimes(1);
  await act(async () => { finish({ ok: true, json: async () => ({ success: true, user: account }) }); await signup; });
  expect(result.current.authBusy).toBe('');
  expect(result.current.isVerificationStep).toBe(true);
});

test('verification page can return to login, continue again, or forget this device without deleting the account', () => {
  remember();
  function Form() { const f = useAuthForm(jest.fn()); return <AuthFormBody f={f} variant="standalone" />; }
  render(<Form />);
  expect(screen.getByText('Finish creating your account')).toBeInTheDocument();
  expect(screen.getByLabelText(/Verification Code/)).toHaveAttribute('autocomplete', 'one-time-code');
  fireEvent.click(screen.getByRole('button', { name: 'Back to Login' }));
  expect(screen.getByLabelText(/Username/)).toHaveValue(account.username);
  expect(readPendingRegistration()).not.toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Continue phone verification' }));
  expect(screen.getByText('Finish creating your account')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Use another account' }));
  expect(readPendingRegistration()).toBeNull();
  expect(screen.getByLabelText(/Username/)).toHaveValue('');
  expect(apiFetch).not.toHaveBeenCalled();
});

test('successful sign in clears stale local signup details', async () => {
  remember();
  apiFetch.mockImplementation(() => response(true, { success: true, token: 'test-token', user: account, message: 'Signed in' }));
  const login = jest.fn();
  const { result } = renderHook(() => useAuthForm(login));
  act(() => result.current.handleBackToLogin());
  fillAccount(result);
  await act(async () => result.current.handleLogin(event));
  expect(readPendingRegistration()).toBeNull();
  expect(login).toHaveBeenCalledWith('test-token', account);
});

test('expired, malformed or invalid local data is ignored; persistence excludes unapproved fields', () => {
  remember({ password: 'secret', verificationCode: '123456' });
  expect(localStorage.getItem('makPendingRegistration.v1')).not.toMatch(/password|verificationCode|secret/);
  jest.setSystemTime(Date.now() + 8 * 86400000);
  expect(readPendingRegistration()).toBeNull();
  localStorage.setItem('makPendingRegistration.v1', '{bad json');
  expect(readPendingRegistration()).toBeNull();
  localStorage.setItem('makPendingRegistration.v1', JSON.stringify({ ...account, phoneNumber: 'incorrect', savedAt: Date.now() }));
  expect(readPendingRegistration()).toBeNull();
});

test('server verification metadata and longer retry limits survive reopening without any automatic SMS', async () => {
  const verification = { ...account, verificationToken: 'short-lived-resend-capability' };
  const available = Date.now() + 3600000;
  apiFetch.mockImplementationOnce(() => response(true, { success: true, verification, resendAvailableAt: available, retryAfterSeconds: 3600, message: 'SMS request accepted' }));
  const first = renderHook(() => useAuthForm(jest.fn()));
  fillAccount(first.result);
  await act(async () => first.result.current.handleRegister(event));
  expect(first.result.current.resendCooldown).toBe(3600);
  expect(readPendingRegistration()).toEqual(expect.objectContaining({ ...verification, resendAvailableAt: available }));
  expect(readPendingRegistration()).not.toHaveProperty('password');
  expect(readPendingRegistration()).not.toHaveProperty('verificationCode');
  first.unmount();
  const reopened = renderHook(() => useAuthForm(jest.fn()));
  act(() => jest.advanceTimersByTime(120000));
  expect(reopened.result.current.resendCooldown).toBe(3480);
  expect(apiFetch).toHaveBeenCalledTimes(1);
});

test('old saved registrations cannot request an SMS with only a phone number', async () => {
  remember();
  const { result } = renderHook(() => useAuthForm(jest.fn()));
  await act(async () => result.current.handleResendVerification());
  expect(apiFetch).not.toHaveBeenCalled();
  expect(result.current.isVerificationStep).toBe(false);
  expect(result.current.formData.username).toBe(account.username);
  expect(result.current.message).toMatch(/sign in/i);
  expect(readPendingRegistration()).not.toBeNull();
});

test('signup account created but SMS failed resumes it while keeping the truthful error and retry limit', async () => {
  const verification = { ...account, verificationToken: 'resume-after-provider-failure' };
  apiFetch.mockImplementationOnce(() => response(false, { success: false, requiresVerification: true, verification, retryAfterSeconds: 300, message: 'Your account was created, but the SMS could not be requested. Please try again later.' }));
  const { result } = renderHook(() => useAuthForm(jest.fn()));
  fillAccount(result);
  await act(async () => result.current.handleRegister(event));
  expect(result.current.isVerificationStep).toBe(true);
  expect(result.current.formData.password).toBe('');
  expect(result.current.messageType).toBe('error');
  expect(result.current.message).toBe('Your account was created, but the SMS could not be requested. Please try again later.');
  expect(result.current.resendCooldown).toBe(300);
  expect(readPendingRegistration()).toEqual(expect.objectContaining(verification));
  await act(async () => result.current.handleResendVerification());
  expect(apiFetch).toHaveBeenCalledTimes(1);
});

test.each([429, 503])('resend %s persists the server wait and does not repeatedly send or hide the error', async () => {
  remember({ verificationToken: 'resume-capability' });
  apiFetch.mockImplementationOnce(() => response(false, { success: false, retryAfterSeconds: 1800, message: 'SMS temporarily unavailable. Please wait.' }));
  const first = renderHook(() => useAuthForm(jest.fn()));
  await act(async () => first.result.current.handleResendVerification());
  expect(first.result.current.resendCooldown).toBe(1800);
  act(() => jest.advanceTimersByTime(10000));
  expect(first.result.current.message).toBe('SMS temporarily unavailable. Please wait.');
  first.unmount();
  const next = renderHook(() => useAuthForm(jest.fn()));
  expect(next.result.current.resendCooldown).toBe(1790);
  await act(async () => next.result.current.handleResendVerification());
  expect(apiFetch).toHaveBeenCalledTimes(1);
});

function changePhone(result, phoneNumber = '+12025550124', password = 'reentered-password') {
  act(() => result.current.handleStartPhoneChange());
  act(() => {
    result.current.handlePhoneChangeInput({ target: { name: 'phoneNumber', value: phoneNumber } });
    result.current.handlePhoneChangeInput({ target: { name: 'password', value: password } });
  });
}

test('correcting the phone updates the same account and clears the reentered password', async () => {
  remember({ verificationToken: 'old-capability' });
  const nextAccount = { ...account, phoneNumber: '+12025550124', verificationToken: 'replacement-capability' };
  apiFetch.mockImplementationOnce(() => response(true, { success: true, verification: nextAccount, retryAfterSeconds: 60, message: 'Number updated. SMS request accepted.' }));
  const { result } = renderHook(() => useAuthForm(jest.fn()));
  changePhone(result);
  await act(async () => result.current.handleChangeVerificationPhone(event));
  expect(apiFetch).toHaveBeenCalledWith('/api/users/change-verification-phone', expect.objectContaining({ body: { username: account.username, currentPhoneNumber: account.phoneNumber, phoneNumber: nextAccount.phoneNumber, password: 'reentered-password' } }));
  expect(result.current.isVerificationStep).toBe(true);
  expect(result.current.isChangingPhone).toBe(false);
  expect(result.current.formData.phoneNumber).toBe(nextAccount.phoneNumber);
  expect(result.current.phoneChangeForm.password).toBe('');
  expect(readPendingRegistration()).toEqual(expect.objectContaining({ ...nextAccount, resendAvailableAt: Date.now() + 60000 }));
  expect(localStorage.getItem('makPendingRegistration.v1')).not.toMatch(/password|reentered-password|verificationCode/);
  expect(apiFetch).toHaveBeenCalledTimes(1);
});

test('invalid phone and incorrect password keep the original pending account', async () => {
  const original = remember({ verificationToken: 'old-capability' });
  const { result } = renderHook(() => useAuthForm(jest.fn()));
  changePhone(result, '+123');
  await act(async () => result.current.handleChangeVerificationPhone(event));
  expect(apiFetch).not.toHaveBeenCalled();
  expect(readPendingRegistration()).toEqual(original);
  act(() => result.current.handlePhoneChangeInput({ target: { name: 'phoneNumber', value: '+12025550124' } }));
  apiFetch.mockImplementationOnce(() => response(false, { success: false, message: 'Password is incorrect' }));
  await act(async () => result.current.handleChangeVerificationPhone(event));
  expect(readPendingRegistration()).toEqual(original);
  expect(result.current.isChangingPhone).toBe(true);
  expect(result.current.phoneChangeForm.password).toBe('');
  expect(result.current.message).toBe('Password is incorrect');
  act(() => jest.advanceTimersByTime(15000));
  expect(result.current.message).toBe('Password is incorrect');
});

test('phone changed but SMS failed keeps the new resumable number and reports the failure', async () => {
  remember({ verificationToken: 'old-capability' });
  const verification = { ...account, phoneNumber: '+12025550124', verificationToken: 'new-capability' };
  apiFetch.mockImplementationOnce(() => response(false, { success: false, requiresVerification: true, verification, retryAfterSeconds: 120, message: 'Phone number updated, but SMS is unavailable. Try again later.' }));
  const { result } = renderHook(() => useAuthForm(jest.fn()));
  changePhone(result);
  await act(async () => result.current.handleChangeVerificationPhone(event));
  expect(result.current.formData.phoneNumber).toBe(verification.phoneNumber);
  expect(result.current.isChangingPhone).toBe(false);
  expect(readPendingRegistration()).toEqual(expect.objectContaining(verification));
  expect(result.current.messageType).toBe('error');
  expect(result.current.message).toBe('Phone number updated, but SMS is unavailable. Try again later.');
  expect(result.current.resendCooldown).toBe(120);
});

test.each(['resend', 'change-phone'])('only one SMS action can run while %s is pending', async (action) => {
  remember({ verificationToken: 'resume-capability' });
  let finish;
  apiFetch.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
  const { result } = renderHook(() => useAuthForm(jest.fn()));
  changePhone(result);
  let pending;
  act(() => { pending = action === 'resend' ? result.current.handleResendVerification() : result.current.handleChangeVerificationPhone(event); });
  expect(result.current.authBusy).toBe(action);
  await act(async () => {
    result.current.handleResendVerification();
    result.current.handleChangeVerificationPhone(event);
  });
  expect(apiFetch).toHaveBeenCalledTimes(1);
  await act(async () => { finish({ ok: true, json: async () => ({ success: true, message: 'SMS request accepted', verification: { ...account, verificationToken: 'resume-capability' }, retryAfterSeconds: 60 }) }); await pending; });
  expect(result.current.authBusy).toBe('');
  expect(apiFetch).toHaveBeenCalledTimes(1);
});

test('verification UI shows the number, manual resend and protected phone correction controls', async () => {
  remember({ verificationToken: 'resume-capability', resendAvailableAt: Date.now() + 60000 });
  function Form() { const f = useAuthForm(jest.fn()); return <AuthFormBody f={f} variant="standalone" />; }
  render(<Form />);
  expect(screen.getByText(account.phoneNumber)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Resend Code (60s)' })).toBeDisabled();
  expect(apiFetch).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Wrong phone number? Change phone number' }));
  expect(screen.getByLabelText(/New phone number/)).toHaveValue(account.phoneNumber);
  expect(screen.getByLabelText(/Account password/)).toHaveAttribute('type', 'password');
  fireEvent.change(screen.getByLabelText(/New phone number/), { target: { value: '+12025550124' } });
  fireEvent.change(screen.getByLabelText(/Account password/), { target: { value: 'reentered-password' } });
  let finish;
  apiFetch.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
  fireEvent.click(screen.getByRole('button', { name: 'Update number & send code' }));
  expect(screen.getByRole('button', { name: 'Updating number…' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Back to verification' })).toBeDisabled();
  expect(screen.getByLabelText(/Account password/)).toBeDisabled();
  await act(async () => finish({ ok: false, json: async () => ({ success: false, message: 'Password is incorrect' }) }));
  expect(screen.getByLabelText(/Account password/)).toHaveValue('');
});

test('an expired resend capability returns to sign in without deleting the pending account or retrying SMS', async () => {
  const pending = remember({ verificationToken: 'expired-capability' });
  apiFetch.mockImplementationOnce(() => response(false, { success: false, code: 'VERIFICATION_SESSION_EXPIRED', message: 'Please sign in again to request another code.' }));
  const { result } = renderHook(() => useAuthForm(jest.fn()));
  await act(async () => result.current.handleResendVerification());
  expect(result.current.isVerificationStep).toBe(false);
  expect(result.current.activeTab).toBe(1);
  expect(result.current.formData.username).toBe(account.username);
  expect(result.current.formData.password).toBe('');
  expect(readPendingRegistration()).toEqual(pending);
  expect(result.current.message).toBe('Please sign in again to request another code.');
  expect(apiFetch).toHaveBeenCalledTimes(1);
});

test('opening and canceling phone correction never submits either form or keeps the reentered password', () => {
  remember({ verificationToken: 'resume-capability' });
  function Form() { const f = useAuthForm(jest.fn()); return <AuthFormBody f={f} variant="standalone" />; }
  render(<Form />);
  fireEvent.click(screen.getByRole('button', { name: 'Wrong phone number? Change phone number' }));
  fireEvent.change(screen.getByLabelText(/Account password/), { target: { value: 'temporary-password' } });
  fireEvent.click(screen.getByRole('button', { name: 'Back to verification' }));
  expect(screen.getByLabelText(/Verification Code/)).toBeInTheDocument();
  expect(screen.queryByLabelText(/Account password/)).not.toBeInTheDocument();
  expect(apiFetch).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Wrong phone number? Change phone number' }));
  expect(screen.getByLabelText(/Account password/)).toHaveValue('');
});
