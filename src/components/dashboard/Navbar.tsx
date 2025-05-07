
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Menu, X, BellDot } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useMonitoring } from '@/contexts/MonitoringContext';

const Navbar: React.FC<{ toggleSidebar: () => void, isSidebarOpen: boolean }> = ({ toggleSidebar, isSidebarOpen }) => {
  const { incidents } = useMonitoring();
  const openIncidents = incidents.filter(i => i.status === 'open' || i.status === 'investigating').length;

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 h-16 border-b bg-white dark:bg-gray-900">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="mr-2 lg:hidden"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
        
        <Link 
          to="/" 
          className="flex items-center space-x-2"
        >
          <ShieldCheck className="h-7 w-7 text-sentinel-primary" />
          <span className="font-bold text-xl hidden sm:inline text-sentinel-primary">
            Sentinel Eye
          </span>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <Link to="/incidents">
          <Button variant="ghost" size="sm" className="relative">
            <BellDot className="h-5 w-5" />
            {openIncidents > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                {openIncidents}
              </span>
            )}
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
