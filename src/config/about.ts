// Content of the About page. Everything here is filler to be rewritten; the
// structure (numbered sections) is what the page lays out.

export const about = {
  /** 01 · Profile: short paragraphs. Links are written as [text](url). */
  profile: [
    'I am Christopher, a software developer in Munich, currently studying Electrical Engineering and Information Technology (B.Sc.) at [TUM](https://www.tum.de/).',
    'I write Go and Python most days and a handful of other languages when the job asks for it. Backends and the systems underneath them are where I am happiest; I will build a frontend when I have to, but I would rather make the thing behind it fast and reliable.',
    'I love open source, both maintaining projects and working on them, and I self-host more of my own tools at home every year.',
  ],

  /** 02 · Now: what is on the bench at the moment. Links are written as [text](url). */
  now: [
    'Building the Go backend of a fitness app',
    'Maintaining [hikari](https://github.com/hikari-py/hikari) and its component library',
    'Studying Electrical Engineering and Information Technology at [TUM](https://www.tum.de/)',
    'Getting comfortable with C on microcontrollers',
  ],

  /** 03 · Stack: tools I reach for. */
  stack: ['Go', 'Python', 'C', 'C++', 'Lua', 'TypeScript', 'PostgreSQL', 'sqlc', 'Docker', 'Linux', 'Caddy', 'Grafana', 'ESP-IDF', 'Git', 'Proxmox'],

  /** 04 · Self-hosted: what runs at home. */
  selfHosted: ['Grafana', 'Home Assistant', 'Caddy', 'AdGuard Home', 'Uptime Kuma', 'File server'],

  /**
   * Spec readout (right panel on desktop, last section elsewhere). Static rows;
   * local time, uptime and weather are added live below them.
   */
  specs: [
    { key: 'Timezone', value: 'UTC+02' },
    { key: 'OS', value: 'CachyOS' },
    { key: 'Editor', value: 'JetBrains' },
    { key: 'Shell', value: 'fish' },
  ],
  /** IANA time zone for the live clock. */
  timeZone: 'Europe/Berlin',
  /** Uptime counts the days since this date (ISO), e.g. the last reboot of the home server. */
  uptimeSince: '2026-09-16',
  /** Current weather from Open-Meteo (no API key) for these coordinates. */
  weather: { latitude: 48.10, longitude: 11.53 },
};
