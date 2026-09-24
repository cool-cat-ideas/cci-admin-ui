// Admin dates have one presentation format across products and platforms.
// SQL/calendar values already represent site-local time; only instants are zoned.
const formatters = new Map();
const MAX_CACHED_TIME_ZONES = 16;
const CALENDAR_DATE = /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,9})?)?(Z|[+-]\d{2}:?\d{2})?)?$/i;

export function formatAdminDateTime(value, config = {}, includeTime = true) {
  const parsed = parseDateValue(value);
  if (!parsed) return '';

  const parts = parsed.parts || instantParts(parsed.date, config?.timeZone);
  const date = `${parts.year}-${parts.month}-${parts.day}`;
  return includeTime ? `${date} ${parts.hour}:${parts.minute}` : date;
}

function parseDateValue(value) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : { date: value };
  }
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || value <= 0) return null;
    const date = new Date(value < 100000000000 ? value * 1000 : value);
    return Number.isNaN(date.getTime()) ? null : { date };
  }
  if (typeof value !== 'string') return null;

  const source = value.trim();
  if (/^\d{10,13}$/.test(source)) return parseDateValue(Number(source));
  const match = CALENDAR_DATE.exec(source);
  if (!match) return null;

  const [, year, month, day, hour = '00', minute = '00', second = '00', zone] = match;
  const leapYear = +year % 4 === 0 && (+year % 100 !== 0 || +year % 400 === 0);
  const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (+year === 0 || +month < 1 || +month > 12 || +day < 1 || +day > daysInMonth[+month - 1]
      || +hour > 23 || +minute > 59 || +second > 59) return null;

  if (!zone) return { parts: { year, month, day, hour, minute } };
  const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}${zone.toUpperCase()}`);
  return Number.isNaN(date.getTime()) ? null : { date };
}

function instantParts(date, configuredTimeZone) {
  let timeZone = String(configuredTimeZone || '').trim() || 'UTC';
  // WordPress also exposes fixed offsets. Support them in browsers whose Intl
  // implementation only accepts named IANA zones.
  const offset = /^([+-])(\d{2}):(\d{2})$/.exec(timeZone);
  if (offset && +offset[2] <= 23 && +offset[3] <= 59) {
    const minutes = (+offset[2] * 60 + +offset[3]) * (offset[1] === '+' ? 1 : -1);
    date = new Date(date.getTime() + minutes * 60000);
    timeZone = 'UTC';
  }
  let formatter = formatters.get(timeZone);
  if (!formatter) {
    const options = {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone,
    };
    try {
      formatter = new Intl.DateTimeFormat('en-GB-u-ca-gregory-nu-latn', options);
    } catch {
      formatter = new Intl.DateTimeFormat('en-GB-u-ca-gregory-nu-latn', { ...options, timeZone: 'UTC' });
    }
    if (formatters.size >= MAX_CACHED_TIME_ZONES) formatters.delete(formatters.keys().next().value);
    formatters.set(timeZone, formatter);
  }
  return Object.fromEntries(formatter.formatToParts(date).map(({ type, value }) => [type, value]));
}
