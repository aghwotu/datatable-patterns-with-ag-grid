import { Injectable } from '@angular/core';
import { of, delay } from 'rxjs';

export interface TimingPhases {
  dns: number;
  connection: number;
  tls: number;
  ttfb: number;
  transfer: number;
}

export type StatusLevel = 'success' | 'warning' | 'error';

export interface ObservabilityEvent {
  id: string;
  timestamp: number; // epoch ms
  statusCode: number;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  host: string;
  pathname: string;
  latencyMs: number;
  region: string;
  timing: TimingPhases;
  percentile: number;
  requestId: string;
  headers: Record<string, string>;
  level: StatusLevel;
}

const METHODS: ObservabilityEvent['method'][] = ['GET', 'POST', 'PUT', 'DELETE'];
const HOSTS = ['api.acme-shop.com', 'acme-shop.com', 'api.acme.com'];
const PATHS = ['/v1/customers', '/v1/products', '/bikes/gravel/road', '/v1/orders', '/v1/payments'];
const REGIONS = [
  'iad Washington D.C.',
  'ams Amsterdam',
  'gru Sao Paulo',
  'syd Sydney',
  'hkg Hong Kong',
  'fra Frankfurt',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function statusForLevel(level: StatusLevel): number {
  if (level === 'success') return 200;
  if (level === 'warning') return pick([400, 401, 403, 404, 429]);
  return pick([500, 502, 503]);
}

export function levelFromStatus(status: number): StatusLevel {
  if (status >= 500) return 'error';
  if (status >= 400) return 'warning';
  return 'success';
}

function buildTimingPhases(latencyMs: number): TimingPhases {
  // Allocate percentages across phases
  const dns = Math.max(2, Math.round(latencyMs * 0.06));
  const connection = Math.max(6, Math.round(latencyMs * 0.14));
  const tls = Math.max(6, Math.round(latencyMs * 0.06));
  const ttfb = Math.max(20, Math.round(latencyMs * 0.6));
  const transfer = Math.max(2, latencyMs - (dns + connection + tls + ttfb));
  return { dns, connection, tls, ttfb, transfer };
}

function makeEvent(id: number, baseTime: number): ObservabilityEvent {
  const level = pick<StatusLevel>(['success', 'success', 'success', 'warning', 'error']);
  const statusCode = statusForLevel(level);
  const latencyMs = Math.floor(700 + Math.random() * 700); // 700-1400ms
  const region = pick(REGIONS);
  const host = pick(HOSTS);
  const pathname = pick(PATHS);
  const method = pick(METHODS);
  const timestamp = baseTime - id * 60_000 + Math.floor(Math.random() * 20_000);

  return {
    id: `evt-${id}`,
    timestamp,
    statusCode,
    method,
    host,
    pathname,
    latencyMs,
    region,
    timing: buildTimingPhases(latencyMs),
    percentile: Math.round(80 + Math.random() * 19), // 80-99
    requestId: crypto.randomUUID(),
    headers: {
      'cache-control': pick([
        'private, no-cache, no-store, max-age=0, must-revalidate',
        'public, max-age=60',
        'private, max-age=0',
      ]),
      server: pick(['Cloudflare', 'Fastly', 'Akamai']),
      'content-type': 'application/json; charset=utf-8',
    },
    level: levelFromStatus(statusCode),
  };
}

function createMockEvents(count = 120): ObservabilityEvent[] {
  const now = Date.now();
  return Array.from({ length: count }, (_, idx) => makeEvent(idx, now));
}

export const MOCK_OBSERVABILITY_EVENTS = createMockEvents();

@Injectable({ providedIn: 'root' })
export class ObservabilityApiService {
  getEvents() {
    return of(MOCK_OBSERVABILITY_EVENTS).pipe(delay(150));
  }
}
