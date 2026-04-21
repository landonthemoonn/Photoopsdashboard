import { motion } from 'motion/react';
import { ExternalLink, CheckCircle, Clock, AlertCircle, Settings as SettingsIcon, RefreshCw } from 'lucide-react';

const integrations = [
  {
    name: 'Jamf Pro',
    description: 'MDM — Device management, policies, and inventory',
    url: 'https://gapinc.jamfcloud.com',
    status: 'needs-config',
    color: '#00B4FF',
    fields: [
      { label: 'Instance URL', value: 'https://gapinc.jamfcloud.com', editable: false },
      { label: 'Username', value: '(not set)', editable: true },
      { label: 'API Token', value: '(not set)', editable: true, secret: true },
    ],
  },
  {
    name: 'Microsoft Outlook',
    description: 'Calendar sync for studio shoot schedules',
    url: 'https://outlook.office.com',
    status: 'needs-config',
    color: '#00B4FF',
    fields: [
      { label: 'Tenant ID', value: '(not set)', editable: true },
      { label: 'Client ID', value: '(not set)', editable: true },
      { label: 'Client Secret', value: '(not set)', editable: true, secret: true },
    ],
  },
  {
    name: 'Apple Business Manager',
    description: 'Device enrollment and app licensing',
    url: 'https://business.apple.com',
    status: 'needs-config',
    color: '#BF5AF2',
    fields: [
      { label: 'Organization ID', value: '(not set)', editable: true },
      { label: 'API Key', value: '(not set)', editable: true, secret: true },
    ],
  },
  {
    name: 'Resilio Sync',
    description: 'P2P file sync across studio nodes',
    url: 'http://10.0.1.1:8888',
    status: 'needs-config',
    color: '#00FF90',
    fields: [
      { label: 'Management URL', value: 'http://10.0.1.1:8888', editable: true },
      { label: 'API Key', value: '(not set)', editable: true, secret: true },
    ],
  },
  {
    name: 'Gap IT Helpdesk',
    description: 'Internal IT ticketing and support portal',
    url: 'https://gapinc.service-now.com',
    status: 'link-only',
    color: '#FF9500',
    fields: [],
  },
  {
    name: 'Capture One',
    description: 'Photo editing — docs and license management',
    url: 'https://support.captureone.com',
    status: 'link-only',
    color: '#FFD60A',
    fields: [],
  },
];

const statusConfig = {
  connected: { label: 'Connected', color: '#00FF90', icon: CheckCircle },
  'needs-config': { label: 'Needs Config', color: '#FF9500', icon: AlertCircle },
  'link-only': { label: 'Link Only', color: '#4B5060', icon: Clock },
};

export function Settings() {
  const glass = { background: 'rgba(10,12,22,0.55)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 'var(--radius)' };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-1" style={{ color: 'var(--neon-blue)' }}>Configuration</p>
          <h1 className="text-2xl font-medium" style={{ color: 'var(--foreground)', letterSpacing: '-0.025em' }}>Settings & Integrations</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Connect your studio tools. All credentials stored securely via Supabase.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all" style={{ background: 'rgba(0,180,255,0.08)', border: '1px solid rgba(0,180,255,0.15)', color: 'var(--neon-blue)' }}>
          <RefreshCw size={14} /> Test All Connections
        </button>
      </motion.div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Connected', count: integrations.filter(i => i.status === 'connected').length, color: '#00FF90' },
          { label: 'Needs Config', count: integrations.filter(i => i.status === 'needs-config').length, color: '#FF9500' },
          { label: 'Link Only', count: integrations.filter(i => i.status === 'link-only').length, color: '#4B5060' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-4 rounded-xl" style={glass}>
            <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: 'var(--muted-foreground)' }}>{s.label}</p>
            <p className="text-2xl font-light font-mono" style={{ color: s.color }}>{s.count}</p>
          </motion.div>
        ))}
      </div>

      {/* Integration cards */}
      <div className="space-y-3">
        {integrations.map((integration, i) => {
          const sc = statusConfig[integration.status as keyof typeof statusConfig];
          const StatusIcon = sc.icon;
          return (
            <motion.div key={integration.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06 }} className="rounded-xl overflow-hidden" style={{ ...glass, borderColor: `${integration.color}20` }}>
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
                <a href={integration.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all" style={{ background: `${integration.color}08`, border: `1px solid ${integration.color}20`, color: integration.color }}>
                  <ExternalLink size={12} /> Open
                </a>
              </div>

              {integration.fields.length > 0 && (
                <div className="px-5 pb-5 pt-0">
                  <div className="p-4 rounded-xl space-y-3" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    {integration.fields.map(field => (
                      <div key={field.label} className="flex items-center gap-3">
                        <label className="text-[10px] font-semibold tracking-wide w-28 flex-shrink-0" style={{ color: 'var(--muted-foreground)' }}>{field.label}</label>
                        <input
                          type={field.secret ? 'password' : 'text'}
                          defaultValue={field.value.startsWith('(') ? '' : field.value}
                          placeholder={field.value.startsWith('(') ? field.value : undefined}
                          readOnly={!field.editable}
                          className="flex-1 px-3 py-1.5 rounded-lg text-xs focus:outline-none transition-all font-mono"
                          style={{ background: field.editable ? 'rgba(255,255,255,0.05)' : 'transparent', border: field.editable ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent', color: field.editable ? 'var(--foreground)' : 'var(--muted-foreground)' }}
                        />
                        {field.editable && (
                          <button className="text-[10px] font-medium px-3 py-1.5 rounded-lg transition-all" style={{ background: `${integration.color}10`, color: integration.color, border: `1px solid ${integration.color}20` }}>
                            Save
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Supabase note */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-5 p-4 rounded-xl flex items-center gap-3" style={{ background: 'rgba(0,180,255,0.04)', border: '1px solid rgba(0,180,255,0.1)' }}>
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--neon-blue)', opacity: 0.6 }} />
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          Credentials will be stored encrypted via <span style={{ color: 'var(--neon-blue)' }}>Supabase</span> and proxied server-side — never exposed to the browser. Backend integration coming next.
        </p>
      </motion.div>
    </div>
  );
}
