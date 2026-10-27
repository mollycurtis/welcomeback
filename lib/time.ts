export type TimeOfDay = 'morning' | 'afternoon' | 'dusk' | 'night';

export function timeOfDay(d = new Date()): TimeOfDay {
  const h = d.getHours();
  if (h >= 5 && h < 11) return 'morning';
  if (h >= 11 && h < 17) return 'afternoon';
  if (h >= 17 && h < 21) return 'dusk';
  return 'night';
}

export function isLateNight(d = new Date()): boolean {
  const h = d.getHours();
  return h >= 23 || h < 5;
}

export function clockString(d = new Date()): string {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}
