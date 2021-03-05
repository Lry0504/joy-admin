import dayjs from 'dayjs';

// Determine whether the incoming timestamp is less than today's timestamp
export function isLessThanTodayTimestamp (current: dayjs.ConfigType | null): boolean {
  const todayTimestamp = new Date().setHours(0, 0, 0, 0);
  if (current && current?.valueOf() > todayTimestamp) {
    return false;
  }
  return true;
}