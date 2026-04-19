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
    <div className="size-full flex relative overflow-hidden" style={{ background: 'var(--background)' }}>
      {/* Deep ambient glow orbs — subtle on dark bg */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(200, 167, 90, 0.04) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(123, 130, 240, 0.04) 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }}
      />
      <div
        className="absolute top-1/2 right-1/3 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(45, 212, 191, 0.025) 0%, transparent 70%)', transform: 'translateY(-50%)' }}
      />

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto px-7 py-6 scroll-smooth" style={{ scrollbarWidth: 'none' }}>
          {/* Stat cards row */}
          <div className="grid grid-cols-4 gap-4 mb-4">
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

          {/* Second row */}
          <div className="grid grid-cols-3 gap-4 mb-4">
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

          {/* Calendar row */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <OutlookCalendar />
          </div>

          {/* Device table */}
          <DeviceTable />
        </main>
      </div>
    </div>
  );
}
