import { StatCard } from '../components/StatCard';
import { QuickLinks } from '../components/QuickLinks';
import { DeviceTable } from '../components/DeviceTable';
import { OutlookCalendar } from '../components/OutlookCalendar';
import { OSDistributionChart } from '../components/OSDistributionChart';
import { HardDrive, Wifi, WifiOff, AlertCircle, Activity } from 'lucide-react';
import { useJamfDevices } from '../hooks/useJamfDevices';

export function Dashboard() {
  const { devices, fetchState } = useJamfDevices();

  const live = fetchState === 'success';
  const online = devices.filter(d => d.status === 'online').length;
  const offline = devices.filter(d => d.status === 'offline').length;
  const needsUpdate = devices.filter(d => d.updateStatus === 'needs-update').length;
  const total = devices.length;
  const healthPct = total > 0 ? Math.round(((total - needsUpdate) / total) * 100) : 98;

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <StatCard title="Macs Online" value={live ? String(online) : '—'} subtitle={live ? `of ${total} total devices` : 'Connect to Gap network'} icon={Wifi} variant="yellow" delay={0} />
        <StatCard title="Production On" value={live ? String(online) : '—'} subtitle="Active production systems" icon={Activity} variant="orange" delay={0.05} />
        <StatCard title="Needs Update" value={live ? String(needsUpdate) : '—'} subtitle={live ? `of ${total} devices` : 'Connect to Gap network'} icon={HardDrive} variant="neutral" delay={0.1} />
        <StatCard title="No Sign of Life" value={live ? String(offline) : '—'} subtitle="Offline / unresponsive" icon={WifiOff} variant="coral" delay={0.15} />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <StatCard title="System Health" value={live ? `${healthPct}%` : '—'} subtitle="Devices on latest macOS" icon={AlertCircle} variant="charcoal" delay={0.2} />
        <OSDistributionChart />
        <QuickLinks />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <OutlookCalendar />
      </div>

      <DeviceTable />
    </div>
  );
}
