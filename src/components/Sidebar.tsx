
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Activity, 
  BarChart, 
  Settings, 
  Menu, 
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type SidebarLink = {
  icon: React.ElementType;
  label: string;
  path: string;
};

const links: SidebarLink[] = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Employees', path: '/employees' },
  { icon: Activity, label: 'KPI Tracker', path: '/kpi-tracker' },
  { icon: BarChart, label: 'Reports', path: '/reports' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div 
      className={cn(
        "h-screen bg-sidebar sticky top-0 transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="text-sidebar-foreground font-bold text-xl">StaffSpark</div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <Menu /> : <ArrowLeft />}
        </Button>
      </div>

      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.path}>
              <Link to={link.path}>
                <div 
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    location.pathname === link.path 
                      ? "bg-sidebar-accent text-sidebar-foreground" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <link.icon size={20} />
                  {!collapsed && <span>{link.label}</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        {!collapsed && (
          <div className="text-sidebar-foreground text-xs">
            © 2025 StaffSpark
          </div>
        )}
      </div>
    </div>
  );
}
