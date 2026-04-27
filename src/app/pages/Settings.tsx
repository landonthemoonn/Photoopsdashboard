import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, CheckCircle, AlertCircle, Settings as SettingsIcon, RefreshCw, Eye, EyeOff, Save, Wifi, WifiOff, ChevronRight, ChevronLeft, Plus, Trash2, Sparkles, User, Building2, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const CREDS_KEY = 'photoops_credentials';
const CONFIG_KEY = 'photoops_studio_config';

interface TeamMember { name: string; role: string }
interface StudioConfig {
  studioName: string;
  adminName: string;
  adminRole: string;
  jamfUrl: string;
  teamMembers: TeamMember[];
}

function loadConfig(): StudioConfig {
  try { return { studioName: '', adminName: '', adminRole: '', jamfUrl: 'https://gapinc.jamfcloud.com', teamMembers: [], ...JSON.parse(localStorage.getItem(CONFIG_KEY) ?? '{}') }; }
  catch { return { studioName: '', adminName: '', adminRole: '', jamfUrl: 'https://gapinc.jamfcloud.com', teamMembers: [] }; }
}
function saveConfig(c: StudioConfig) { localStorage.setItem(CONFIG_KEY, JSON.stringify(c)); }

// ── Setup Wizard ───────────────────────────────────────────────────────────────

function WizardStep({ label, index, current, total }: { label: string; index: number; current: number; total: number }) {
  const done = index < current;
  const active = index === current;
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-all"
        style={{ background: done ? 'rgba(143,191,138,0.2)' : active ? 'rgba(224,112,96,0.2)' : 'rgba(255,255,255,0.04)', color: done ? '#8FBF8A' : active ? '#E07060' : 'var(--muted-foreground)', border: `1px solid ${done ? 'rgba(143,191,138,0.3)' : active ? 'rgba(224,112,96,0.3)' : 'rgba(255,255,255,0.08)'}` }}>
        {done ? '✓' : index + 1}
      </div>
      <span className="text-[11px] font-medium hidden sm:block" style={{ color: active ? 'var(--foreground)' : 'var(--muted-foreground)' }}>{label}</span>
      {index < total - 1 && <div className="w-6 h-px mx-1 hidden sm:block" style={{ background: done ? 'rgba(143,191,138,0.3)' : 'rgba(255,255,255,0.07)' }} />}
    </div>
  );
}

interface WizardProps { onClose: () => void }

function SetupWizard({ onClose }: WizardProps) {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState<StudioConfig>(loadConfig);
  const [creds, setCreds] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem(CREDS_KEY) ?? '{}').jamf ?? {}; } catch { return {}; }
  });
  const [newMember, setNewMember] = useState({ name: '', role: '' });
  const [revealed, setRevealed] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'idle' | 'ok' | 'fail'>('idle');

  const steps = ['Studio', 'Team', 'Jamf Pro', 'Done'];

  const set = (k: keyof StudioConfig, v: string) => setConfig(p => ({ ...p, [k]: v }));

  const addMember = () => {
    if (!newMember.name.trim()) return;
    setConfig(p => ({ ...p, teamMembers: [...p.teamMembers, { name: newMember.name.trim(), role: newMember.role.trim() || 'Team Member' }] }));
    setNewMember({ name: '', role: '' });
  };

  const removeMember = (i: number) =>
    setConfig(p => ({ ...p, teamMembers: p.teamMembers.filter((_, idx) => idx !== i) }));

  const testJamf = async () => {
    setTesting(true); setTestResult('idle');
    try {
      const res = await fetch('/.netlify/functions/jamf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: creds.clientId, clientSecret: creds.clientSecret, jamfUrl: config.jamfUrl }),
      });
      setTestResult(res.ok ? 'ok' : 'fail');
    } catch { setTestResult('fail'); }
    setTesting(false);
  };

  const finish = () => {
    saveConfig(config);
    const all = (() => { try { return JSON.parse(localStorage.getItem(CREDS_KEY) ?? '{}'); } catch { return {}; } })();
    localStorage.setItem(CREDS_KEY, JSON.stringify({ ...all, jamf: creds }));
    onClose();
  };

  const glass = { background: 'rgba(22,16,12,0.96)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 'var(--radius)' };
  const input = (extra?: string) => `w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-all ${extra ?? ''}`;
  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--foreground)' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} className="w-full max-w-lg" style={glass}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2">
            <Sparkles size={16} style={{ color: '#E07060' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Setup Wizard</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5" style={{ color: 'var(--muted-foreground)' }}>
            <X size={14} />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-1 px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          {steps.map((label, i) => <WizardStep key={label} label={label} index={i} current={step} total={steps.length} />)}
        </div>

        {/* Step content */}
        <div className="px-6 py-5 min-h-[260px]">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-4">
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>Studio Name</p>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={inputStyle}>
                    <Building2 size={14} style={{ color: 'var(--muted-foreground)' }} />
                    <input className={input('flex-1 bg-transparent border-none p-0 focus:outline-none')} placeholder="e.g. Gap Photo Studio" value={config.studioName} onChange={e => set('studioName', e.target.value)} style={{ color: 'var(--foreground)' }} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>Your Name</p>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={inputStyle}>
                    <User size={14} style={{ color: 'var(--muted-foreground)' }} />
                    <input className={input('flex-1 bg-transparent border-none p-0 focus:outline-none')} placeholder="e.g. Alex Kim" value={config.adminName} onChange={e => set('adminName', e.target.value)} style={{ color: 'var(--foreground)' }} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>Your Role</p>
                  <input className={input()} style={inputStyle} placeholder="e.g. Studio Tech Lead" value={config.adminRole} onChange={e => set('adminRole', e.target.value)} />
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-3">
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Add everyone on your studio team.</p>
                <div className="flex gap-2">
                  <input className={input('flex-1')} style={inputStyle} placeholder="Name" value={newMember.name} onChange={e => setNewMember(p => ({ ...p, name: e.target.value }))} onKeyDown={e => e.key === 'Enter' && addMember()} />
                  <input className={input('w-32')} style={inputStyle} placeholder="Role" value={newMember.role} onChange={e => setNewMember(p => ({ ...p, role: e.target.value }))} onKeyDown={e => e.key === 'Enter' && addMember()} />
                  <button onClick={addMember} className="px-3 py-2 rounded-lg flex items-center gap-1 text-xs font-semibold" style={{ background: 'rgba(224,112,96,0.1)', color: '#E07060', border: '1px solid rgba(224,112,96,0.2)' }}>
                    <Plus size={13} />
                  </button>
                </div>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {config.teamMembers.length === 0 && (
                    <p className="text-xs text-center py-4" style={{ color: 'var(--muted-foreground)', opacity: 0.4 }}>No team members added yet</p>
                  )}
                  {config.teamMembers.map((m, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div>
                        <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{m.name}</span>
                        <span className="text-[10px] ml-2" style={{ color: 'var(--muted-foreground)' }}>{m.role}</span>
                      </div>
                      <button onClick={() => removeMember(i)} className="opacity-40 hover:opacity-80 transition-opacity" style={{ color: '#E07060' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-4">
                <div className="px-3 py-2.5 rounded-lg text-xs" style={{ background: 'rgba(232,192,112,0.05)', border: '1px solid rgba(232,192,112,0.15)', color: 'var(--muted-foreground)' }}>
                  In Jamf under <span style={{ color: '#E07060' }}>Settings → System → API Roles and Clients</span> — create a client and paste the ID and Secret below.
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>Jamf Pro URL</p>
                  <input className={input()} style={inputStyle} placeholder="https://yourorg.jamfcloud.com" value={config.jamfUrl} onChange={e => set('jamfUrl', e.target.value)} />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>Client ID</p>
                  <input className={input('font-mono')} style={inputStyle} placeholder="Paste Client ID" value={creds.clientId ?? ''} onChange={e => setCreds(p => ({ ...p, clientId: e.target.value }))} />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>Client Secret</p>
                  <div className="relative">
                    <input type={revealed ? 'text' : 'password'} className={input('font-mono pr-9')} style={inputStyle} placeholder="Paste Client Secret" value={creds.clientSecret ?? ''} onChange={e => setCreds(p => ({ ...p, clientSecret: e.target.value }))} />
                    <button onClick={() => setRevealed(r => !r)} className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-80 transition-opacity" style={{ color: 'var(--muted-foreground)' }}>
                      {revealed ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                </div>
                <button onClick={testJamf} disabled={testing || !creds.clientId || !creds.clientSecret} className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-40"
                  style={{ background: testResult === 'ok' ? 'rgba(143,191,138,0.1)' : testResult === 'fail' ? 'rgba(224,112,96,0.1)' : 'rgba(255,255,255,0.05)', color: testResult === 'ok' ? '#8FBF8A' : testResult === 'fail' ? '#E07060' : 'var(--muted-foreground)', border: `1px solid ${testResult === 'ok' ? 'rgba(143,191,138,0.2)' : testResult === 'fail' ? 'rgba(224,112,96,0.2)' : 'rgba(255,255,255,0.08)'}` }}>
                  {testing ? <><RefreshCw size={12} className="animate-spin" /> Testing…</> : testResult === 'ok' ? <><CheckCircle size={12} /> Connected!</> : testResult === 'fail' ? <><WifiOff size={12} /> Failed — check credentials</> : <><Wifi size={12} /> Test Connection</>}
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="flex flex-col items-center justify-center py-8 gap-4 text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(143,191,138,0.1)', border: '1px solid rgba(143,191,138,0.2)' }}>
                  <CheckCircle size={28} style={{ color: '#8FBF8A' }} />
                </div>
                <div>
                  <p className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
                    {config.studioName ? `${config.studioName} is ready` : "You're all set"}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                    {config.adminName ? `Welcome, ${config.adminName}.` : ''} Click Finish to load your Jamf data.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 pb-6">
          <button onClick={() => step === 0 ? onClose() : setStep(s => s - 1)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-colors" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--muted-foreground)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <ChevronLeft size={13} /> {step === 0 ? 'Cancel' : 'Back'}
          </button>
          {step < steps.length - 1 ? (
            <button onClick={() => { if (step === 2) saveConfig(config); setStep(s => s + 1); }} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all" style={{ background: 'rgba(224,112,96,0.12)', color: '#E07060', border: '1px solid rgba(224,112,96,0.25)' }}>
              Next <ChevronRight size={13} />
            </button>
          ) : (
            <button onClick={finish} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all" style={{ background: 'rgba(143,191,138,0.12)', color: '#8FBF8A', border: '1px solid rgba(143,191,138,0.25)' }}>
              <CheckCircle size={13} /> Finish
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ── Integration cards ──────────────────────────────────────────────────────────

const integrations = [
  { id: 'jamf', name: 'Jamf Pro', description: 'MDM — device management, policies, and inventory', url: 'https://gapinc.jamfcloud.com', color: '#E07060', fields: [{ label: 'Client ID', key: 'clientId', placeholder: 'paste Client ID from Jamf' }, { label: 'Client Secret', key: 'clientSecret', placeholder: '••••••••', secret: true }] },
  { id: 'outlook', name: 'Microsoft Outlook', description: 'Calendar sync via Microsoft Graph API', url: 'https://outlook.office.com', color: '#9888C8', fields: [{ label: 'Tenant ID', key: 'tenantId', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }, { label: 'Client ID', key: 'clientId', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }, { label: 'Client Secret', key: 'clientSecret', placeholder: '••••••••', secret: true }] },
  { id: 'abm', name: 'Apple Business Manager', description: 'Device enrollment and app licensing', url: 'https://business.apple.com', color: '#F0A870', fields: [{ label: 'Org ID', key: 'orgId', placeholder: 'your-org-id' }, { label: 'API Key', key: 'apiKey', placeholder: '••••••••', secret: true }] },
  { id: 'resilio', name: 'Resilio Sync', description: 'P2P file sync across studio nodes', url: 'http://10.0.1.1:8888', color: '#8FBF8A', fields: [{ label: 'URL', key: 'url', placeholder: 'http://10.0.1.1:8888' }, { label: 'API Key', key: 'apiKey', placeholder: '••••••••', secret: true }] },
  { id: 'helpdesk', name: 'Gap IT Helpdesk', description: 'Internal IT ticketing and support portal', url: 'https://gapinc.service-now.com', color: '#E09040', fields: [] },
  { id: 'captureone', name: 'Capture One', description: 'Photo editing — docs and license management', url: 'https://support.captureone.com', color: '#E8C070', fields: [] },
];

type SavedCreds = Record<string, Record<string, string>>;

function getStatus(id: string, creds: SavedCreds) {
  const intg = integrations.find(i => i.id === id);
  if (!intg || intg.fields.length === 0) return 'link-only';
  const saved = creds[id] ?? {};
  return intg.fields.every(f => saved[f.key]?.trim()) ? 'connected' : 'needs-config';
}

const statusConfig = {
  connected: { label: 'Connected', color: '#8FBF8A', Icon: CheckCircle },
  'needs-config': { label: 'Needs Config', color: '#E09040', Icon: AlertCircle },
  'link-only': { label: 'Link Only', color: '#4B5060', Icon: ExternalLink },
};

function IntegrationCard({ intg, creds, onSave }: { intg: typeof integrations[0]; creds: SavedCreds; onSave: (id: string, key: string, val: string) => void }) {
  const [local, setLocal] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const init: Record<string, string> = {};
    for (const f of intg.fields) init[f.key] = creds[intg.id]?.[f.key] ?? '';
    setLocal(init);
  }, [creds, intg]);

  const handleSave = (key: string) => {
    onSave(intg.id, key, local[key] ?? '');
    setSaved(s => ({ ...s, [key]: true }));
    setTimeout(() => setSaved(s => ({ ...s, [key]: false })), 2000);
  };

  const status = getStatus(intg.id, creds);
  const sc = statusConfig[status];
  const glass = { background: 'rgba(22,16,12,0.55)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: `1px solid ${intg.color}20`, borderRadius: 'var(--radius)' };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl overflow-hidden" style={glass}>
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${intg.color}10`, border: `1px solid ${intg.color}25` }}>
            <SettingsIcon size={18} style={{ color: intg.color }} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{intg.name}</h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc.color}10`, color: sc.color, border: `1px solid ${sc.color}20` }}>
                <sc.Icon size={9} /> {sc.label}
              </span>
            </div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{intg.description}</p>
          </div>
        </div>
        <a href={intg.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium" style={{ background: `${intg.color}08`, border: `1px solid ${intg.color}20`, color: intg.color }}>
          <ExternalLink size={12} /> Open
        </a>
      </div>

      {intg.fields.length > 0 && (
        <div className="px-5 pb-5">
          <div className="p-4 rounded-xl space-y-3" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.04)' }}>
            {intg.fields.map(field => (
              <div key={field.key} className="flex items-center gap-3">
                <label className="text-[10px] font-semibold tracking-wide w-24 flex-shrink-0" style={{ color: 'var(--muted-foreground)' }}>{field.label}</label>
                <div className="flex-1 relative">
                  <input
                    type={(field as { secret?: boolean }).secret && !revealed[field.key] ? 'password' : 'text'}
                    value={local[field.key] ?? ''}
                    placeholder={field.placeholder}
                    onChange={e => setLocal(v => ({ ...v, [field.key]: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-lg text-xs focus:outline-none transition-all font-mono pr-8"
                    style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${local[field.key] ? intg.color + '30' : 'rgba(255,255,255,0.08)'}`, color: 'var(--foreground)' }}
                  />
                  {(field as { secret?: boolean }).secret && (
                    <button onClick={() => setRevealed(r => ({ ...r, [field.key]: !r[field.key] }))} className="absolute right-2 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-80 transition-opacity" style={{ color: 'var(--muted-foreground)' }}>
                      {revealed[field.key] ? <EyeOff size={11} /> : <Eye size={11} />}
                    </button>
                  )}
                </div>
                <motion.button onClick={() => handleSave(field.key)} whileTap={{ scale: 0.95 }} className="flex items-center gap-1 text-[10px] font-semibold px-3 py-1.5 rounded-lg transition-all flex-shrink-0"
                  style={{ background: saved[field.key] ? 'rgba(143,191,138,0.12)' : `${intg.color}10`, color: saved[field.key] ? '#8FBF8A' : intg.color, border: `1px solid ${saved[field.key] ? 'rgba(143,191,138,0.25)' : intg.color + '20'}` }}>
                  <AnimatePresence mode="wait">
                    {saved[field.key]
                      ? <motion.span key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1"><CheckCircle size={10} /> Saved</motion.span>
                      : <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1"><Save size={10} /> Save</motion.span>}
                  </AnimatePresence>
                </motion.button>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ── Settings page ──────────────────────────────────────────────────────────────

export function Settings() {
  const [creds, setCreds] = useState<SavedCreds>(() => {
    try { return JSON.parse(localStorage.getItem(CREDS_KEY) ?? '{}'); } catch { return {}; }
  });
  const [wizardOpen, setWizardOpen] = useState(false);
  const config = loadConfig();

  const handleSave = (id: string, key: string, value: string) => {
    setCreds(prev => {
      const next = { ...prev, [id]: { ...prev[id], [key]: value } };
      localStorage.setItem(CREDS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const connectedCount = integrations.filter(i => getStatus(i.id, creds) === 'connected').length;
  const needsConfigCount = integrations.filter(i => getStatus(i.id, creds) === 'needs-config').length;
  const glass = { background: 'rgba(22,16,12,0.55)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 'var(--radius)' };

  return (
    <>
      <AnimatePresence>
        {wizardOpen && <SetupWizard onClose={() => { setWizardOpen(false); setCreds(() => { try { return JSON.parse(localStorage.getItem(CREDS_KEY) ?? '{}'); } catch { return {}; } }); }} />}
      </AnimatePresence>

      <div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-1" style={{ color: 'var(--warm-coral)' }}>Configuration</p>
            <h1 className="text-2xl font-medium" style={{ color: 'var(--foreground)', letterSpacing: '-0.025em' }}>Settings & Integrations</h1>
            {config.studioName && <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>{config.studioName}{config.adminName ? ` · ${config.adminName}` : ''}</p>}
          </div>
          <motion.button onClick={() => setWizardOpen(true)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ background: 'rgba(224,112,96,0.1)', color: '#E07060', border: '1px solid rgba(224,112,96,0.25)' }}>
            <Sparkles size={14} /> Setup Wizard
          </motion.button>
        </motion.div>

        {/* Studio info summary */}
        {(config.studioName || config.teamMembers.length > 0) && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-5 p-4 rounded-xl" style={glass}>
            <div className="flex items-center gap-3 mb-3">
              <Building2 size={14} style={{ color: '#E07060' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{config.studioName || 'Studio'}</span>
            </div>
            {config.teamMembers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {config.teamMembers.map((m, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <User size={10} style={{ color: 'var(--muted-foreground)' }} />
                    <span className="text-[11px]" style={{ color: 'var(--foreground)' }}>{m.name}</span>
                    <span className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>{m.role}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[{ label: 'Connected', count: connectedCount, color: '#8FBF8A' }, { label: 'Needs Config', count: needsConfigCount, color: '#E09040' }, { label: 'Team Members', count: config.teamMembers.length, color: '#9888C8' }].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-4 rounded-xl" style={glass}>
              <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: 'var(--muted-foreground)' }}>{s.label}</p>
              <p className="text-2xl font-light font-mono" style={{ color: s.color }}>{s.count}</p>
            </motion.div>
          ))}
        </div>

        <div className="space-y-3">
          {integrations.map((intg, i) => (
            <motion.div key={intg.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.05 }}>
              <IntegrationCard intg={intg} creds={creds} onSave={handleSave} />
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
