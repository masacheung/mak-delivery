import { apiFetch } from './apiClient';
export function pushSupported() { return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window; }
function decodeKey(value) {
  const decoded = atob(value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '='));
  return Uint8Array.from(decoded, character => character.charCodeAt(0));
}
export async function syncPushSubscription(publicKey, create = false) {
  const registration = await navigator.serviceWorker.register('/service-worker.js');
  await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();
  if (!subscription && create) subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: decodeKey(publicKey) });
  if (!subscription) return false;
  const response = await apiFetch('/api/push/subscriptions', { method: 'POST', auth: 'user', body: subscription.toJSON() });
  if (!response.ok) { const result = await response.json(); throw new Error(result.error || 'Unable to enable notifications.'); }
  return true;
}
export async function stopPushNotifications() {
  if (!pushSupported()) return;
  const registration = await navigator.serviceWorker.getRegistration('/');
  const subscription = await registration?.pushManager.getSubscription();
  if (!subscription) return;
  await subscription.unsubscribe();
  await apiFetch('/api/push/subscriptions', { method: 'DELETE', auth: 'user', body: { endpoint: subscription.endpoint } });
}
