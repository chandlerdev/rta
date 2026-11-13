// ============================================================================
// CENTRALIZED SERVICE — all API handling lives here.
// Mirrors the Angular DoctorService + PaymentserviceService.
// Pages import { service } and call service.postmet(...), service.getMethod(...), etc.
// ============================================================================

import CryptoJS from 'crypto-js';

// Single source of truth for the API base URL — change it here only.
// Relative on purpose: the browser calls /api on whichever domain served the
// page (the web server proxies /api to the backend), so one build works for
// every site and nothing site-specific is baked into it.
export const DYNAMIC_BASE = '/api/';

export const environment = {
  production: false,
  ApiUrl: DYNAMIC_BASE,
};

// ---------------------------------------------------------------------------
// Storage helpers (SSR-safe). `session` mirrors the `sessionstorage` npm pkg,
// `local` mirrors window.localStorage usage in the Angular app.
// ---------------------------------------------------------------------------
export const session = {
  get: (k: string) =>
    typeof window === 'undefined' ? null : window.sessionStorage.getItem(k),
  set: (k: string, v: string) => {
    if (typeof window !== 'undefined') window.sessionStorage.setItem(k, v);
  },
  remove: (k: string) => {
    if (typeof window !== 'undefined') window.sessionStorage.removeItem(k);
  },
  clear: () => {
    if (typeof window !== 'undefined') window.sessionStorage.clear();
  },
};

export const local = {
  get: (k: string) =>
    typeof window === 'undefined' ? null : window.localStorage.getItem(k),
  set: (k: string, v: string) => {
    if (typeof window !== 'undefined') window.localStorage.setItem(k, v);
  },
  remove: (k: string) => {
    if (typeof window !== 'undefined') window.localStorage.removeItem(k);
  },
  clear: () => {
    if (typeof window !== 'undefined') window.localStorage.clear();
  },
};

// ---------------------------------------------------------------------------
// Crypto helpers (AES with empty key, base64 — matching the Angular code)
// ---------------------------------------------------------------------------
export const crypto = {
  encrypt(value: any): string {
    return CryptoJS.AES.encrypt(value, '').toString();
  },
  encryptJSON(value: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(value), '').toString();
  },
  decrypt(cipher: string): string {
    const bytes = CryptoJS.AES.decrypt(cipher, '');
    return bytes.toString(CryptoJS.enc.Utf8);
  },
  // base64 of an AES-encrypted token, as stored in sessionStorage 'tok'
  decodeToken(stored: string): string {
    try {
      const bytes = atob(stored);
      return CryptoJS.AES.decrypt(bytes, '').toString(CryptoJS.enc.Utf8);
    } catch {
      return '';
    }
  },
  b64encode: (s: string) => btoa(s),
  b64decode: (s: string) => atob(s),
  // Decrypt the :enc URL segment (base64 of AES-encrypted JSON) -> original value
  decodeEnc(enc: string): any {
    try {
      // The URL segment may arrive percent-encoded (e.g. trailing %3D for '=')
      // and/or with stray whitespace; normalise before base64-decoding.
      let s = enc || '';
      try {
        s = decodeURIComponent(s);
      } catch {
        /* already decoded */
      }
      const bytes = atob(s.trim());
      const byte = CryptoJS.AES.decrypt(bytes, '');
      return JSON.parse(byte.toString(CryptoJS.enc.Utf8));
    } catch {
      return null;
    }
  },
};

function getToken(): string {
  const raw = session.get('tok');
  return raw ? crypto.decodeToken(raw) : '';
}

function authHeaders(json = true): Record<string, string> {
  const h: Record<string, string> = {};
  if (json) h['Content-Type'] = 'application/json';
  const t = getToken();
  if (t) h['Authorization'] = 'Token ' + t;
  return h;
}

// ---------------------------------------------------------------------------
// Transparent GET cache. Two jobs, no behaviour change:
//   1. De-dupe in-flight identical GETs — when the sidebar shell and a view
//      both request e.g. admin/doctors on the same render, they share ONE fetch.
//   2. Serve a very short-lived (TTL) cache so repeat reads of the same list
//      across navigations don't re-hit the network.
// Any write (POST/PUT/PATCH/DELETE) calls bustGetCache(), so every
// mutate-then-reload flow still reads fresh data — semantics are unchanged.
// ---------------------------------------------------------------------------
const GET_TTL = 5000; // ms — short enough to stay fresh, long enough to de-dup
const _getCache = new Map<string, { ts: number; data: any }>();
const _inflight = new Map<string, Promise<any>>();

function bustGetCache(): void {
  _getCache.clear();
  _inflight.clear();
}

async function cachedGet<T = any>(url: string): Promise<T> {
  const hit = _getCache.get(url);
  if (hit && Date.now() - hit.ts < GET_TTL) return hit.data as T;

  const pending = _inflight.get(url);
  if (pending) return pending as Promise<T>;

  const p = fetch(url)
    .then(async (res) => {
      const data = await res.json();
      _getCache.set(url, { ts: Date.now(), data });
      _inflight.delete(url);
      return data;
    })
    .catch((e) => {
      _inflight.delete(url);
      throw e;
    });
  _inflight.set(url, p);
  return p as Promise<T>;
}

// ---------------------------------------------------------------------------
// THE SERVICE — every API method the app needs.
// Method names intentionally match the Angular service for 1:1 tracing.
// All return parsed JSON (Angular returned Observables; here we return Promises).
// ---------------------------------------------------------------------------
export const service = {
  // ---- token (call once on app load if needed) ----
  TokenMethod: getToken,
  getTokenValue: getToken,

  // postmet(api, data) — dynamic API, accepts FormData or object
  async postmet<T = any>(api: string, data: FormData | object): Promise<T> {
    const isForm = typeof FormData !== 'undefined' && data instanceof FormData;
    const res = await fetch(DYNAMIC_BASE + api, {
      method: 'POST',
      body: isForm ? (data as FormData) : JSON.stringify(data),
      headers: isForm ? undefined : { 'Content-Type': 'application/json' },
    });
    bustGetCache();
    return res.json();
  },

  // postMethod(act, data) — ApiUrl + act, with token
  async postMethod<T = any>(act: string, data: any): Promise<T> {
    const res = await fetch(environment.ApiUrl + act, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    bustGetCache();
    return res.json();
  },

  // PostMethod(Url, data) — absolute URL, with token
  async PostMethod<T = any>(url: string, data: any): Promise<T> {
    const res = await fetch(url, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    bustGetCache();
    return res.json();
  },

  // post(act, data) — ApiUrl + act, no token
  async post<T = any>(act: string, data: any): Promise<T> {
    const res = await fetch(environment.ApiUrl + act, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    bustGetCache();
    return res.json();
  },

  // get(act) — ApiUrl + act (cached)
  async get<T = any>(act: string): Promise<T> {
    return cachedGet<T>(environment.ApiUrl + act);
  },

  // getMethod(act) — absolute url GET (cached)
  async getMethod<T = any>(url: string): Promise<T> {
    return cachedGet<T>(url);
  },

  // GetMethod(url) — absolute url GET (alias used in some components, cached)
  async GetMethod<T = any>(url: string): Promise<T> {
    return cachedGet<T>(url);
  },

  async PutMethod<T = any>(act: string, dat: any): Promise<T> {
    const res = await fetch(environment.ApiUrl + act, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(dat),
    });
    bustGetCache();
    return res.json();
  },

  async PutMethod2<T = any>(act: string, dat: any): Promise<T> {
    const res = await fetch(environment.ApiUrl + act, {
      method: 'PUT',
      headers: { Authorization: 'Token ' + getToken() },
      body: dat,
    });
    bustGetCache();
    return res.json();
  },

  async PatchMethod<T = any>(act: string, dat: any): Promise<T> {
    const res = await fetch(environment.ApiUrl + act, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(dat),
    });
    bustGetCache();
    return res.json();
  },

  // DeleteMethod(url) — absolute url DELETE
  async DeleteMethod<T = any>(url: string): Promise<T> {
    const res = await fetch(url, { method: 'DELETE' });
    bustGetCache();
    return res.json().catch(() => ({}) as T);
  },

  // Imgpost(url, formData)
  async Imgpost<T = any>(url: string, data: FormData): Promise<T> {
    const res = await fetch(url, { method: 'POST', body: data });
    bustGetCache();
    return res.json();
  },

  // PostMethod2(url) — GET returning observable in Angular; Promise here (cached)
  async PostMethod2<T = any>(url: string): Promise<T> {
    return cachedGet<T>(url);
  },

  // ===== Payment (Authorize.net) — from PaymentserviceService =====
  payment: {
    apiUrl: 'https://api.authorize.net',
    api: 'https://apitest.authorize.net/xml/v1/request.api',
    apiLoginId: '95xNG5jyeK',
    transactionKey: '4h9EC3X25gy74Y3H',

    async processPayment(paymentData: any) {
      const requestData = {
        merchantAuthentication: {
          name: this.apiLoginId,
          transactionKey: this.transactionKey,
        },
        transactionRequest: {
          transactionType: 'authCaptureTransaction',
          amount: paymentData.amount,
          payment: {
            creditCard: {
              cardNumber: paymentData.cardNumber,
              expirationDate: paymentData.expirationDate,
              cardCode: paymentData.cardCode,
            },
          },
        },
      };
      const res = await fetch(`${this.apiUrl}/createTransaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      return res.json();
    },

    async pay(yusuf: any, dob: any, price: any) {
      const lng = local.get('price_title_lng');
      const HospitalName = local.get('HospitalName');
      const data = {
        ARBCreateSubscriptionRequest: {
          merchantAuthentication: {
            name: '95xNG5jyeK',
            transactionKey: '7dy7t87aL5J6mV4v',
          },
          refId: '1',
          subscription: {
            name: HospitalName || 'Subscription',
            paymentSchedule: {
              interval: { length: '1', unit: 'months' },
              startDate: dob,
              // Authorize.net totalOccurrences must be 1-9999 (Int16); 9999 =
              // ongoing/no end date. Never send an empty string.
              totalOccurrences: lng || '9999',
              trialOccurrences: '0',
            },
            amount: price,
            trialAmount: price,
            payment: {
              creditCard: {
                cardNumber: yusuf.crdnum,
                expirationDate: yusuf.expyer + '-' + yusuf.expmon,
              },
            },
            billTo: { firstName: yusuf.namecard, lastName: yusuf.namecard },
          },
        },
      };
      const res = await fetch(`${this.api}/createTransaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },

    async sucess(responseed: any) {
      const paymentsucess = {
        ARBGetSubscriptionStatusRequest: {
          merchantAuthentication: {
            name: '95xNG5jyeK',
            transactionKey: '7dy7t87aL5J6mV4v',
          },
          refId: responseed.authRefId,
          subscriptionId: responseed.authSubscriptionId,
        },
      };
      const res = await fetch(`${this.api}/createTransaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentsucess),
      });
      return res.json();
    },
  },
};

export default service;
