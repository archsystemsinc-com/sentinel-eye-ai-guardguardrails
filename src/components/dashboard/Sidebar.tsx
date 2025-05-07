
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Shield,
  History,
  AlertTriangle,
  FileText,
  Settings,
  Terminal,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: 'Monitor',
    href: '/monitor',
    icon: <Terminal className="h-5 w-5" />,
  },
  {
    title: 'Incidents',
    href: '/incidents',
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  {
    title: 'Audit Log',
    href: '/audit',
    icon: <History className="h-5 w-5" />,
  },
  {
    title: 'Policies',
    href: '/policies',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: 'Rules',
    href: '/rules',
    icon: <Shield className="h-5 w-5" />,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
  },
];

const Sidebar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  return (
    <aside
      className={cn(
        "fixed left-0 top-16 z-10 h-[calc(100vh-4rem)] w-64 transform bg-gray-50 dark:bg-gray-900 border-r overflow-y-auto transition-transform duration-200 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <nav className="p-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                  isActive
                    ? "bg-sentinel-primary text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-sentinel-accent/50 hover:text-sentinel-primary"
                )
              }
            >
              {item.icon}
              <span>{item.title}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
