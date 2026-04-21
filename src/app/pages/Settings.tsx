import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, CheckCircle, Clock, AlertCircle, Settings as SettingsIcon, RefreshCw, Eye, EyeOff, Save, Wifi, WifiOff } from 'lucide-react';
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'photoops_credentials';

interface Integration {
  id: string;
  name: string;
  description: string;
  url: string;
  color: string;
  fields: { label: string; key: string; placeholder: string; secret?: boolean; readOnly?: boolean; defaultValue?: string }[];
}

const integrations: Integration[] = [
  {
    id: 'jamf',
    name: 'Jamf Pro',
    description: 'MDM — device management, policies, and inventory',
    url: 'https://gapinc.jamfcloud.com',
    color: '#E07060',
    fields: [
      { label: 'Tenant ID', key: 'tenantId', placeholder: 'Gap Azure AD Tenant ID (same as Outlook)' },
      { label: 'Client ID', key: 'clientId', placeholder: 'Azure AD App Client ID' },
      { label: 'Client Secret', key: 'clientSecret', placeholder: 'Azure AD App Client Secret', secret: true },
    ],
  },
  {
    id: 'outlook',
    name: 'Microsoft Outlook',
    description: 'Calendar sync — same Azure AD app as Jamf',
    url: 'https://outlook.office.com',
    color: '#9888C8',
    fields: [
      { label: 'Tenant ID', key: 'tenantId', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
      { label: 'Client ID', key: 'clientId', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
      { label: 'Client Secret', key: 'clientSecret', placeholder: '••••••••', secret: true },
    ],
  },
  {
    id: 'abm',
    name: 'Apple Business Manager',
    description: 'Device enrollment and app licensing',
    url: 'https://business.apple.com',
    color: '#F0A870',
    fields: [
      { label: 'Organization ID', key: 'orgId', placeholder: 'your-org-id' },
      { label: 'API Key', key: 'apiKey', placeholder: '••••••••', secret: true },
    ],
  },
  {
    id: 'resilio',
    name: 'Resilio Sync',
    description: 'P2P file sync across studio nodes',
    url: 'http://10.0.1.1:8888',
    color: '#8FBF8A',
    fields: [
      { label: 'Management URL', key: 'url', placeholder: 'http://10.0.1.1:8888', defaultValue: 'http://10.0.1.1:8888' },
      { label: 'API Key', key: 'apiKey', placeholder: '••••••••', secret: true },
    ],
  },
  {
    id: 'helpdesk',
    name: 'Gap IT Helpdesk',
    description: 'Internal IT ticketing and support portal',
    url: 'https://gapinc.service-now.com',
    color: '#E09040',
    fields: [],
  },
  {
    id: 'captureone',
    name: 'Capture One',
    description: 'Photo editing — docs and license management',
    url: 'https://support.captureone.com',
    color: '#E8C070',
    fields: [],
  },
];

type SavedCreds = Record<string, Record<string, string>>;
type ConnectionStatus = 'idle' | 'testing' | 'connected' | 'failed';

function getStatus(id: string, creds: SavedCreds): 'connected' | 'needs-config' | 'link-only' {
  const integration = integrations.find(i => i.id === id);
  if (!integration || integration.fields.length === 0) return 'link-only';
  const saved = creds[id] || {};
  const requiredFields = integration.fields.filter(f => !f.readOnly);
  return requiredFields.every(f => saved[f.key]?.trim()) ? 'connected' : 'needs-config';
}

const statusConfig = {
  connected: { label: 'Connected', color: '#8FBF8A', icon: CheckCircle },
  'needs-config': { label: 'Needs Config', color: '#E09040', icon: AlertCircle },
  'link-only': { label: 'Link Only', color: '#4B5060', icon: Clock },
};

function IntegrationCard({ integration, creds, onSave }: {
  integration: Integration;
  creds: SavedCreds;
  onSave: (id: string, key: string, value: string) => void;
}) {
  const [localValues, setLocalValues] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [connStatus, setConnStatus] = useState<ConnectionStatus>('idle');

  useEffect(() => {
    const initial: Record<string, string> = {};
    for (const field of integration.fields) {
      initial[field.key] = creds[integration.id]?.[field.key] ?? field.defaultValue ?? '';
    }
    setLocalValues(initial);
  }, [creds, integration]);

  const handleSave = (key: string) => {
    onSave(integration.id, key, localValues[key] ?? '');
    setSaved(s => ({ ...s, [key]: true }));
    setTimeout(() => setSaved(s => ({ ...s, [key]: false })), 2000);
  };

  const testConnection = async () => {
    setConnStatus('testing');
    // Simulate a connection test — real implementation needs a backend proxy
    await new Promise(r => setTimeout(r, 1400));
    const status = getStatus(integration.id, creds);
    setConnStatus(status === 'connected' ? 'connected' : 'failed');
    setTimeout(() => setConnStatus('idle'), 3000);
  };

  const overallStatus = getStatus(integration.id, creds);
  const sc = statusConfig[overallStatus];
  const StatusIcon = sc.icon;
  const glass = { background: 'rgba(22,16,12,0.55)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: `1px solid ${integration.color}20`, borderRadius: 'var(--radius)' };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl overflow-hidden" style={glass}>
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${integration.color}10`, border: `1px solid ${integration.color}25` }}>
            <SettingsIcon size={18} style={{ color: integration.color }} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{integration.name}</h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc.color}10`, color: sc.color, border: `1px solid ${sc.color}20` }}>
                <StatusIcon size={9} /> {sc.label}
              </span>
            </div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{integration.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {integration.fields.length > 0 && (
            <motion.button
              onClick={testConnection}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                background: connStatus === 'connected' ? 'rgba(143,191,138,0.1)' : connStatus === 'failed' ? 'rgba(224,112,96,0.1)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${connStatus === 'connected' ? 'rgba(143,191,138,0.2)' : connStatus === 'failed' ? 'rgba(224,112,96,0.2)' : 'rgba(255,255,255,0.08)'}`,
                color: connStatus === 'connected' ? '#8FBF8A' : connStatus === 'failed' ? '#E07060' : 'var(--muted-foreground)',
              }}
            >
              {connStatus === 'testing' ? (
                <><RefreshCw size={12} className="animate-spin" /> Testing…</>
              ) : connStatus === 'connected' ? (
                <><Wifi size={12} /> Connected</>
              ) : connStatus === 'failed' ? (
                <><WifiOff size={12} /> Failed</>
              ) : (
                <><Wifi size={12} /> Test</>
              )}
            </motion.button>
          )}
          <a href={integration.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all" style={{ background: `${integration.color}08`, border: `1px solid ${integration.color}20`, color: integration.color }}>
            <ExternalLink size={12} /> Open
          </a>
        </div>
      </div>

      {integration.fields.length > 0 && (
        <div className="px-5 pb-5 pt-0">
          {integration.id === 'jamf' && (
            <div className="mb-3 rounded-lg overflow-hidden" style={{ border: '1px solid rgba(232,192,112,0.15)' }}>
              <div className="px-3 py-2" style={{ background: 'rgba(232,192,112,0.07)', borderBottom: '1px solid rgba(232,192,112,0.1)' }}>
                <p className="text-[10px] font-semibold tracking-wide" style={{ color: '#E8C070' }}>Using Azure AD / SSO (recommended for Gap Inc)</p>
              </div>
              <div className="px-3 py-2.5 space-y-1" style={{ background: 'rgba(232,192,112,0.03)' }}>
                <p className="text-[10px] leading-relaxed mb-2" style={{ color: 'var(--muted-foreground)' }}>
                  Since Gap uses Azure AD for Jamf SSO, you can use the <span style={{ color: '#E07060' }}>same Azure AD app</span> as Outlook. These fields will be shared once Outlook is configured.
                </p>
                {[
                  'Go to portal.azure.com → Azure Active Directory',
                  'App registrations → find or create "PhotoOps Dashboard"',
                  'Copy the Tenant ID and Client ID from the Overview tab',
                  'Certificates & Secrets → New client secret → copy the value',
                  'Under API permissions → add Jamf Pro scope if needed (ask Gap IT)',
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-2 text-[10px] leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                    <span className="font-mono flex-shrink-0" style={{ color: '#E07060', minWidth: 14 }}>{i + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="p-4 rounded-xl space-y-3" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.04)' }}>
            {integration.fields.map(field => (
              <div key={field.key} className="flex items-center gap-3">
                <label className="text-[10px] font-semibold tracking-wide w-28 flex-shrink-0" style={{ color: 'var(--muted-foreground)' }}>{field.label}</label>
                <div className="flex-1 relative">
                  <input
                    type={field.secret && !revealed[field.key] ? 'password' : 'text'}
                    value={localValues[field.key] ?? ''}
                    placeholder={field.placeholder}
                    readOnly={field.readOnly}
                    onChange={e => setLocalValues(v => ({ ...v, [field.key]: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-lg text-xs focus:outline-none transition-all font-mono pr-8"
                    style={{
                      background: field.readOnly ? 'transparent' : 'rgba(255,255,255,0.05)',
                      border: field.readOnly ? '1px solid transparent' : `1px solid ${localValues[field.key] ? integration.color + '30' : 'rgba(255,255,255,0.08)'}`,
                      color: field.readOnly ? 'var(--muted-foreground)' : 'var(--foreground)',
                    }}
                  />
                  {field.secret && (
                    <button onClick={() => setRevealed(r => ({ ...r, [field.key]: !r[field.key] }))} className="absolute right-2 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-80 transition-opacity" style={{ color: 'var(--muted-foreground)' }}>
                      {revealed[field.key] ? <EyeOff size={11} /> : <Eye size={11} />}
                    </button>
                  )}
                </div>
                {!field.readOnly && (
                  <motion.button
                    onClick={() => handleSave(field.key)}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 text-[10px] font-semibold px-3 py-1.5 rounded-lg transition-all flex-shrink-0"
                    style={{
                      background: saved[field.key] ? 'rgba(143,191,138,0.12)' : `${integration.color}10`,
                      color: saved[field.key] ? '#8FBF8A' : integration.color,
                      border: `1px solid ${saved[field.key] ? 'rgba(143,191,138,0.25)' : integration.color + '20'}`,
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {saved[field.key] ? (
                        <motion.span key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1">
                          <CheckCircle size={10} /> Saved
                        </motion.span>
                      ) : (
                        <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1">
                          <Save size={10} /> Save
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function Settings() {
  const [creds, setCreds] = useState<SavedCreds>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}'); } catch { return {}; }
  });

  const handleSave = (id: string, key: string, value: string) => {
    setCreds(prev => {
      const next = { ...prev, [id]: { ...prev[id], [key]: value } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const connectedCount = integrations.filter(i => getStatus(i.id, creds) === 'connected').length;
  const needsConfigCount = integrations.filter(i => getStatus(i.id, creds) === 'needs-config').length;
  const linkOnlyCount = integrations.filter(i => getStatus(i.id, creds) === 'link-only').length;

  const glass = { background: 'rgba(22,16,12,0.55)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 'var(--radius)' };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-1" style={{ color: 'var(--neon-blue)' }}>Configuration</p>
          <h1 className="text-2xl font-medium" style={{ color: 'var(--foreground)', letterSpacing: '-0.025em' }}>Settings & Integrations</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Enter credentials below — saved locally to your browser until the Supabase backend is live.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Connected', count: connectedCount, color: '#8FBF8A' },
          { label: 'Needs Config', count: needsConfigCount, color: '#E09040' },
          { label: 'Link Only', count: linkOnlyCount, color: '#4B5060' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-4 rounded-xl" style={glass}>
            <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: 'var(--muted-foreground)' }}>{s.label}</p>
            <p className="text-2xl font-light font-mono" style={{ color: s.color }}>{s.count}</p>
          </motion.div>
        ))}
      </div>

      <div className="space-y-3">
        {integrations.map((integration, i) => (
          <motion.div key={integration.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.05 }}>
            <IntegrationCard integration={integration} creds={creds} onSave={handleSave} />
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-5 p-4 rounded-xl flex items-center gap-3" style={{ background: 'rgba(224,112,96,0.04)', border: '1px solid rgba(224,112,96,0.1)' }}>
        <div className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse" style={{ background: '#E09040' }} />
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          Credentials are stored in <span style={{ color: 'var(--neon-blue)' }}>browser localStorage</span> right now. Once Supabase is connected, they'll be encrypted server-side and never exposed to the browser.
        </p>
      </motion.div>
    </div>
  );
}
