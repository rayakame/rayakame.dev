/** UTC offset of an IANA time zone at `date`, e.g. 'UTC+02' or 'UTC+05:30'. */
export const utcOffset = (timeZone: string, date = new Date()): string => {
  const name =
    new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' })
      .formatToParts(date)
      .find((part) => part.type === 'timeZoneName')?.value ?? 'GMT';
  // longOffset is a bare 'GMT' at offset zero.
  return `UTC${name.replace('GMT', '').replace(/:00$/, '') || '+00'}`;
};
