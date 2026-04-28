import { useState, useEffect, useCallback } from 'react';

export interface JamfDevice {
  name: string;
  category: string;
  location: string;
  os: string;
  status: 'online' | 'offline';
  updateStatus: 'current' | 'needs-update';
  ipAddress: string;
  serial: string;
  jamfId?: string;
}

export type FetchState = 'idle' | 'loading' | 'success' | 'no-creds' | 'auth' | 'network' | 'error';
export type FetchError = { status?: number; detail?: string } | null;

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

async function syncCredsFromDb(): Promise<boolean> {
  try {
    const res = await fetch('/.netlify/functions/settings');
    if (!res.ok) return false;
    const { credentials, config } = await res.json();
    let updated = false;
    if (credentials?.jamf?.clientId) {
      localStorage.setItem('photoops_credentials', JSON.stringify(credentials));
      updated = true;
    }
    if (config?.studioName !== undefined) {
      localStorage.setItem('photoops_studio_config', JSON.stringify(config));
    }
    return updated;
  } catch {
    return false;
  }
}

const LATEST_OS = '15.';

export function useJamfDevices() {
  const [devices, setDevices] = useState<JamfDevice[]>([]);
  const [fetchState, setFetchState] = useState<FetchState>('idle');
  const [fetchError, setFetchError] = useState<FetchError>(null);
  const [lastSync, setLastSync] = useState('');

  const load = useCallback(async () => {
    const { clientId, clientSecret, jamfUrl } = getCreds();
    if (!clientId || !clientSecret) { setFetchState('no-creds'); return; }

    setFetchState('loading');
    setFetchError(null);
    try {
      const res = await fetch('/.netlify/functions/jamf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, clientSecret, jamfUrl }),
      });

      if (res.status === 401) { setFetchState('auth'); return; }

      if (!res.ok) {
        let detail = '';
        try { const body = await res.json(); detail = body.error ?? body.detail ?? ''; } catch { /* ignore */ }
        setFetchError({ status: res.status, detail });
        setFetchState('error');
        return;
      }

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
          serial: (c.serialNumber as string) ?? '—',
          jamfId: c.id as string,
        };
      });

      setDevices(mapped);
      setFetchState('success');
      setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (e) {
      const err = e as Error;
      if (err.message === 'Failed to fetch') setFetchState('network');
      else { setFetchError({ detail: err.message }); setFetchState('error'); }
    }
  }, []);

  // On mount: pull creds from DB, then load devices
  useEffect(() => {
    syncCredsFromDb().then(synced => {
      if (synced) window.dispatchEvent(new Event('jamf-creds-updated'));
    });
    load();
  }, [load]);

  useEffect(() => {
    window.addEventListener('jamf-creds-updated', load);
    return () => window.removeEventListener('jamf-creds-updated', load);
  }, [load]);

  return { devices, fetchState, fetchError, lastSync, reload: load };
}
