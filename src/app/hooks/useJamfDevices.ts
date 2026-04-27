import { useState, useEffect, useCallback } from 'react';

export interface JamfDevice {
  name: string;
  category: string;
  location: string;
  os: string;
  status: 'online' | 'offline';
  updateStatus: 'current' | 'needs-update';
  ipAddress: string;
  jamfId?: string;
}

export type FetchState = 'idle' | 'loading' | 'success' | 'no-creds' | 'auth' | 'network' | 'error';

function getCreds() {
  try {
    const creds = JSON.parse(localStorage.getItem('photoops_credentials') ?? '{}');
    const config = JSON.parse(localStorage.getItem('photoops_studio_config') ?? '{}');
    return {
      clientId: creds.jamf?.clientId ?? '',
      clientSecret: creds.jamf?.clientSecret ?? '',
      jamfUrl: config.jamfUrl ?? 'https://gapinc.jamfcloud.com',
    };
  } catch {
    return { clientId: '', clientSecret: '', jamfUrl: 'https://gapinc.jamfcloud.com' };
  }
}

const LATEST_OS = '15.';

export function useJamfDevices() {
  const [devices, setDevices] = useState<JamfDevice[]>([]);
  const [fetchState, setFetchState] = useState<FetchState>('idle');
  const [lastSync, setLastSync] = useState('');

  const load = useCallback(async () => {
    const { clientId, clientSecret, jamfUrl } = getCreds();
    if (!clientId || !clientSecret) { setFetchState('no-creds'); return; }

    setFetchState('loading');
    try {
      const res = await fetch('/.netlify/functions/jamf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, clientSecret, jamfUrl }),
      });

      if (res.status === 401) throw new Error('auth');
      if (!res.ok) throw new Error('error');

      const data = await res.json();
      const mapped: JamfDevice[] = (data.results ?? []).map((c: Record<string, unknown>) => {
        const lastContact = c.lastContactTime ? new Date(c.lastContactTime as string) : null;
        const minutesSince = lastContact ? (Date.now() - lastContact.getTime()) / 60000 : Infinity;
        return {
          name: (c.name as string) ?? 'Unknown',
          category: (c.model as string) ?? (c.modelIdentifier as string) ?? '—',
          location: (c.site as { name?: string })?.name && (c.site as { name: string }).name !== 'None'
            ? (c.site as { name: string }).name : '—',
          os: c.operatingSystemVersion ? `macOS ${c.operatingSystemVersion as string}` : '—',
          status: minutesSince < 15 ? 'online' : 'offline',
          updateStatus: (c.operatingSystemVersion as string)?.startsWith(LATEST_OS) ? 'current' : 'needs-update',
          ipAddress: (c.ipAddress as string) ?? '—',
          jamfId: c.id as string,
        };
      });

      setDevices(mapped);
      setFetchState('success');
      setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (e) {
      const err = e as Error;
      if (err.message === 'auth') setFetchState('auth');
      else if (err.message === 'Failed to fetch') setFetchState('network');
      else setFetchState('error');
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { devices, fetchState, lastSync, reload: load };
}
