import { IncidentData } from '../types/telemetry';

export function formatDistressMessage(data: IncidentData): string {
  const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const mapLink = `https://www.openstreetmap.org/?mlat=${data.location.lat.toFixed(5)}&mlon=${data.location.lng.toFixed(5)}#map=17/${data.location.lat.toFixed(5)}/${data.location.lng.toFixed(5)}`;

  let text = `🚨 KAAVALU SAFETY ALERT: ${data.userName || 'Transit User'} needs assistance!\n`;
  text += `📍 Location: ${data.location.lat.toFixed(4)}, ${data.location.lng.toFixed(4)}\n`;
  text += `🗺️ Corridor: ${data.corridorName}\n`;
  text += `⏰ Time: ${timeStr} | Battery: ${data.batteryPercentage}%\n`;

  if (data.nearestSanctuary) {
    text += `🏪 Nearest Safe Haven: ${data.nearestSanctuary.name} (${data.nearestSanctuary.address})\n`;
  }

  if (data.threatDetails) {
    text += `⚠️ Situation: ${data.threatDetails}\n`;
  }

  text += `🔗 Live GPS: ${mapLink}`;
  return text;
}

export function dispatchNativeSms(
  recipientPhoneNumber: string = '112',
  data: IncidentData
): boolean {
  const message = formatDistressMessage(data);
  const encodedBody = encodeURIComponent(message);

  // iOS uses '&body=', Android uses '?body='
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const separator = isIOS ? '&' : '?';
  const smsUri = `sms:${recipientPhoneNumber}${separator}body=${encodedBody}`;

  console.log('[KAAVALU EmergencyDispatcher] Triggering native cellular SMS:', smsUri);

  try {
    window.location.href = smsUri;
    return true;
  } catch (err) {
    console.warn('[KAAVALU EmergencyDispatcher] Native SMS URI failed, trying fallback:', err);
    return false;
  }
}

export async function shareDistressAlert(data: IncidentData): Promise<boolean> {
  const message = formatDistressMessage(data);

  if (navigator.share) {
    try {
      await navigator.share({
        title: '🚨 KAAVALU Transit Safety Alert',
        text: message,
      });
      return true;
    } catch {
      return false;
    }
  }

  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(message);
    alert('Distress briefing copied to clipboard. Paste into your family WhatsApp or SMS!');
    return true;
  } catch {
    return false;
  }
}
