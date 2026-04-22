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

  const tokenRes = await fetch('/api/jamf/api/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret }),
  });

  if (!tokenRes.ok) throw new Error('auth');
  const { access_token } = await tokenRes.json();

  const res = await fetch('/api/jamf/api/v1/computers-preview', {
    headers: { Authorization: `Bearer ${access_token}`, Accept: 'application/json' },
  });

  if (!res.ok) throw new Error('fetch');
  const data = await res.json();

  const LATEST_OS = '15.';

  return (data.results ?? []).map((c: Record<string, string>) => {
    const lastContact = c.lastContactTime ? new Date(c.lastContactTime) : null;
    const minutesSince = lastContact ? (Date.now() - lastContact.getTime()) / 60000 : Infinity;
    return {
      name: c.name ?? 'Unknown',
      category: c.model ?? c.modelIdentifier ?? '—',
      location: c.site?.name && c.site.name !== 'None' ? c.site.name : '—',
      os: c.operatingSystemVersion ? `macOS ${c.operatingSystemVersion}` : '—',
      status: minutesSince < 15 ? 'online' : 'offline',
      updateStatus: c.operatingSystemVersion?.startsWith(LATEST_OS) ? 'current' : 'needs-update',
      ipAddress: c.ipAddress ?? '—',
      jamfId: c.id,
    } as Device;
  });
}

export function useJamfDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [fetchState, setFetchState] = useState<FetchState>('idle');
  const [lastSync, setLastSync] = useState<string>('');

  const load = useCallback(async () => {
    const { clientId, clientSecret } = getJamfCreds();
    if (!clientId || !clientSecret) { setFetchState('no-creds'); return; }

    setFetchState('loading');
    try {
      const data = await fetchJamfDevices();
      setDevices(data);
      setFetchState('success');
      setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (e) {
      const err = e as Error;
      if (err.message === 'auth') setFetchState('auth');
      else if (err.message === 'Failed to fetch') setFetchState(navigator.onLine ? 'cors' : 'network');
      else setFetchState('error');
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { devices, fetchState, lastSync, reload: load };
}
