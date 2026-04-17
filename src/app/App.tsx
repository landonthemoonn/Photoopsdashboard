import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StatCard } from './components/StatCard';
import { QuickLinks } from './components/QuickLinks';
import { DeviceTable } from './components/DeviceTable';
import { OutlookCalendar } from './components/OutlookCalendar';
import { OSDistributionChart } from './components/OSDistributionChart';
import {
  HardDrive,
  Wifi,
  WifiOff,
  AlertCircle,
  Apple,
  Activity
} from 'lucide-react';

export default function App() {
  return (
    <div className="size-full flex bg-[var(--background)]">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto px-8 py-6 scroll-smooth">
          <div className="grid grid-cols-4 gap-5 mb-5">
            <StatCard
              title="Macs Online"
              value="21"
              subtitle="Connected to network"
              icon={Wifi}
              variant="yellow"
              delay={0}
            />
            <StatCard
              title="Production On"
              value="18"
              subtitle="Active production systems"
              icon={Activity}
              variant="orange"
              delay={0.05}
            />
            <StatCard
              title="Production Laydown"
              value="6"
              subtitle="Staged for deployment"
              icon={HardDrive}
              variant="neutral"
              delay={0.1}
            />
            <StatCard
              title="No Sign of Life"
              value="3"
              subtitle="Offline / unresponsive"
              icon={WifiOff}
              variant="coral"
              delay={0.15}
            />
          </div>

          <div className="grid grid-cols-3 gap-5 mb-5">
            <StatCard
              title="System Health"
              value="98%"
              subtitle="Devices with no critical issues"
              icon={AlertCircle}
              variant="charcoal"
              delay={0.2}
            />
            <OSDistributionChart />
            <QuickLinks />
          </div>

          <div className="grid grid-cols-3 gap-5 mb-5">
            <OutlookCalendar />
          </div>

          <DeviceTable />
        </main>
      </div>
    </div>
  );
}