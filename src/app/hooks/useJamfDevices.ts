import { useState, useEffect, useCallback } from 'react';

export interface Device {
  name: string;
  category: string;
  location: string;
  os: string;
  status: 'online' | 'offline';
  updateStatus: 'current' | 'needs-update' | 'pending';
  ipAddress: string;
  jamfId?: string;
}

export type FetchState = 'idle' | 'loading' | 'success' | 'no-creds' | 'cors' | 'auth' | 'network' | 'error';

function getJamfCreds() {
  try {
    const all = JSON.parse(localStorage.getItem('photoops_credentials') ?? '{}');
    return { clientId: all.jamf?.clientId ?? '', clientSecret: all.jamf?.clientSecret ?? '' };
  } catch { return { clientId: '', clientSecret: '' }; }
}

async function fetchJamfDevices(): Promise<Device[]> {
  const { clientId, clientSecret } = getJamfCreds();

  // Step 1: get token
  const tokenRes = await fetch('/api/jamf/api/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret }),
  });

  if (!tokenRes.ok) {
    const body = await tokenRes.text().catch(() => '');
    console.error('[Jamf] Token failed', tokenRes.status, body);
    throw new Error('auth');
  }

  const { access_token } = await tokenRes.json();
  console.log('[Jamf] Token OK');

  // Step 2: fetch computers — try v1/computers-preview, fall back to classic API
  let data: Record<string, unknown> | null = null;

  const previewRes = await fetch('/api/jamf/api/v1/computers-preview?page-size=200', {
    headers: { Authorization: `Bearer ${access_token}`, Accept: 'application/json' },
  });

  if (previewRes.ok) {
    data = await previewRes.json();
    console.log('[Jamf] computers-preview OK, total:', (data as Record<string, unknown[]>).results?.length);
  } else {
    console.warn('[Jamf] computers-preview failed', previewRes.status, '— trying classic API');
    const classicRes = await fetch('/api/jamf/JSSResource/computers', {
      headers: { Authorization: `Bearer ${access_token}`, Accept: 'application/json' },
    });
    if (!classicRes.ok) {
      const body = await classicRes.text().catch(() => '');
      console.error('[Jamf] Classic API also failed', classicRes.status, body);
      throw new Error('fetch');
    }
    const classicData = await classicRes.json();
    console.log('[Jamf] Classic API OK');
    // Classic API returns { computers: [{ id, name, ... }] }
    const computers = classicData.computers ?? [];
    return computers.map((c: Record<string, string>) => ({
      name: c.name ?? 'Unknown',
      category: '—',
      location: '—',
      os: '—',
      status: 'offline' as const,
      updateStatus: 'pending' as const,
      ipAddress: '—',
      jamfId: String(c.id),
    }));
  }

  const LATEST_OS = '15.';
  const results = ((data as Record<string, unknown[]>).results ?? []) as Record<string, unknown>[];

  return results.map(c => {
    const lastContact = typeof c.lastContactTime === 'string' ? new Date(c.lastContactTime) : null;
    const minutesSince = lastContact ? (Date.now() - lastContact.getTime()) / 60000 : Infinity;
    const site = c.site as Record<string, string> | undefined;
    return {
      name: (c.name as string) ?? 'Unknown',
      category: (c.model as string) ?? (c.modelIdentifier as string) ?? '—',
      location: site?.name && site.name !== 'None' ? site.name : '—',
      os: c.operatingSystemVersion ? `macOS ${c.operatingSystemVersion}` : '—',
      status: minutesSince < 15 ? 'online' : 'offline',
      updateStatus: (c.operatingSystemVersion as string)?.startsWith(LATEST_OS) ? 'current' : 'needs-update',
      ipAddress: (c.ipAddress as string) ?? '—',
      jamfId: String(c.id),
    } as Device;
  });
}

export function useJamfDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [fetchState, setFetchState] = useState<FetchState>('idle');
  const [lastSync, setLastSync] = useState<string>('');
  const [errorDetail, setErrorDetail] = useState<string>('');

  const load = useCallback(async () => {
    const { clientId, clientSecret } = getJamfCreds();
    if (!clientId || !clientSecret) { setFetchState('no-creds'); return; }

    setFetchState('loading');
    setErrorDetail('');
    try {
      const data = await fetchJamfDevices();
      setDevices(data);
      setFetchState('success');
      setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (e) {
      const err = e as Error;
      console.error('[Jamf] Load error:', err.message);
      setErrorDetail(err.message);
      if (err.message === 'auth') setFetchState('auth');
      else if (err.message === 'Failed to fetch') setFetchState(navigator.onLine ? 'cors' : 'network');
      else setFetchState('error');
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { devices, fetchState, lastSync, errorDetail, reload: load };
}
