import { StatCard } from '../components/StatCard';
import { QuickLinks } from '../components/QuickLinks';
import { DeviceTable } from '../components/DeviceTable';
import { OutlookCalendar } from '../components/OutlookCalendar';
import { OSDistributionChart } from '../components/OSDistributionChart';
import { HardDrive, Wifi, WifiOff, AlertCircle, Monitor } from 'lucide-react';
import { useJamfDevices } from '../hooks/useJamfDevices';

export function Dashboard() {
  const { devices, fetchState, fetchError, lastSync, reload } = useJamfDevices();

  const loading = fetchState === 'idle' || fetchState === 'loading';
  const online = devices.filter(d => d.status === 'online').length;
  const offline = devices.filter(d => d.status === 'offline').length;
  const needsUpdate = devices.filter(d => d.updateStatus === 'needs-update').length;
  const total = devices.length;
  const healthPct = total > 0 ? Math.round(((total - needsUpdate) / total) * 100) : null;

  const val = (n: number) => loading ? '—' : String(n);
  const health = loading ? '—' : healthPct === null ? '—' : `${healthPct}%`;

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <StatCard title="Macs Online" value={val(online)} subtitle="Connected to network" icon={Wifi} variant="yellow" delay={0} />
        <StatCard title="Total Devices" value={val(total)} subtitle="Enrolled in Jamf Pro" icon={Monitor} variant="orange" delay={0.05} />
        <StatCard title="Needs Update" value={val(needsUpdate)} subtitle="Pending macOS update" icon={HardDrive} variant="neutral" delay={0.1} />
        <StatCard title="No Sign of Life" value={val(offline)} subtitle="Offline / no recent contact" icon={WifiOff} variant="coral" delay={0.15} />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <StatCard title="System Health" value={health} subtitle="Devices up to date" icon={AlertCircle} variant="charcoal" delay={0.2} />
        <OSDistributionChart devices={devices} fetchState={fetchState} />
        <QuickLinks />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <OutlookCalendar />
      </div>

      <DeviceTable devices={devices} fetchState={fetchState} fetchError={fetchError} lastSync={lastSync} reload={reload} />
    </div>
  );
}
