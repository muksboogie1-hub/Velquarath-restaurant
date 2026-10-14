import React, { useState } from 'react';
import {
  Utensils,
  FileText,
  Image as ImageIcon,
  Palette,
  Clock,
  Calendar,
  Settings,
  ExternalLink,
  LogOut,
  Menu as MenuIcon,
  X,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { MenuManager } from './MenuManager';
import { ContentManager } from './ContentManager';
import { BrandingManager } from './BrandingManager';
import { AppearanceManager } from './AppearanceManager';
import { HoursAndContactManager } from './HoursAndContactManager';
import { ReservationsManager } from './ReservationsManager';
import { StaffManager } from './StaffManager';
import { SiteSettingsManager } from './SiteSettingsManager';
import { adminSignOut } from '../services/authService';

export type AdminTab =
  | 'menu'
  | 'content'
  | 'branding'
  | 'appearance'
  | 'hours'
  | 'reservations'
  | 'staff'
  | 'settings';

interface AdminLayoutProps {
  onNavigateHome: () => void;
  onLogout: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onNavigateHome, onLogout }) => {
  const { reservations, currentUser, setCurrentUser } = useContent();
  const [activeTab, setActiveTab] = useState<AdminTab>('menu');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingReservationsCount = reservations.filter((r) => r.status === 'pending').length;

  const handleSignOut = async () => {
    await adminSignOut();
    setCurrentUser(null);
    onLogout();
  };

  const navItems = [
    { id: 'menu', label: 'Menu Management', icon: Utensils },
    { id: 'content', label: 'Website Content', icon: FileText },
    { id: 'branding', label: 'Images & Branding', icon: ImageIcon },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'hours', label: 'Opening Hours & Contact', icon: Clock },
    {
      id: 'reservations',
      label: 'Reservations',
      icon: Calendar,
      badge: pendingReservationsCount > 0 ? pendingReservationsCount : undefined,
    },
    { id: 'staff', label: 'Staff & Admins', icon: Users },
    { id: 'settings', label: 'Site Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#141210] text-[#F4ECDA] flex flex-col">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-[#1E1B17]/95 backdrop-blur-md border-b border-[#332E26] px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-[#26221D] text-[#B8AD96] hover:text-[#F4ECDA] cursor-pointer"
              aria-label="Toggle admin navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg text-[#F4ECDA]">
                Velquarath
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#C9A24B] text-[#141210]">
                Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Supabase Status Pill */}
            {currentUser?.isSupabaseAuth ? (
              <div
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border bg-emerald-950/60 text-emerald-300 border-emerald-700/60"
                title="Connected to live Supabase database and authentication"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Supabase Cloud Active</span>
              </div>
            ) : (
              <div
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border bg-amber-950/60 text-amber-300 border-amber-700/60"
                title="Preview Sandbox Mode: edits are stored in browser local storage. On the live website, use Supabase login."
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Preview Sandbox Mode</span>
              </div>
            )}

            {/* View Live Website Button */}
            <button
              type="button"
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#26221D] hover:bg-[#332E26] text-xs font-semibold text-[#B8AD96] hover:text-[#C9A24B] border border-[#332E26] transition-colors cursor-pointer"
            >
              <span>View Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Sign Out Button */}
            <button
              type="button"
              onClick={handleSignOut}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav Desktop */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-1">
          <div className="p-3 mb-2 rounded-xl bg-[#1E1B17] border border-[#332E26]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#736B5E]">
              Dashboard Menu
            </div>
            <p className="text-xs text-[#B8AD96] mt-0.5">Select a category to edit:</p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id as AdminTab)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#C9A24B] text-[#141210] font-semibold shadow-lg'
                      : 'bg-[#1E1B17] text-[#B8AD96] hover:text-[#F4ECDA] hover:bg-[#26221D] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#141210]' : 'text-[#C9A24B]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-[#141210] text-[#C9A24B]'
                          : 'bg-amber-500 text-[#141210]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="pt-6">
            <div className="p-4 rounded-xl bg-[#1E1B17] border border-[#332E26] text-[11px] text-[#B8AD96] space-y-2">
              <div className="flex items-center gap-1.5 text-[#C9A24B] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero-Code Live Sync</span>
              </div>
              <p className="leading-relaxed text-[#736B5E]">
                All edits save directly to the database. Visitors see updates instantly without triggering GitHub commits or Cloudflare redeploys.
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer / Horizontal scroll */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#1E1B17] border border-[#332E26] rounded-xl p-3 space-y-1 mb-4 shadow-2xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id as AdminTab);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#C9A24B] text-[#141210] font-semibold'
                      : 'text-[#B8AD96] hover:bg-[#26221D]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-[#141210] font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'menu' && <MenuManager />}
          {activeTab === 'content' && <ContentManager />}
          {activeTab === 'branding' && <BrandingManager />}
          {activeTab === 'appearance' && <AppearanceManager />}
          {activeTab === 'hours' && <HoursAndContactManager />}
          {activeTab === 'reservations' && <ReservationsManager />}
          {activeTab === 'staff' && <StaffManager />}
          {activeTab === 'settings' && <SiteSettingsManager onLoggedOut={handleSignOut} />}
        </main>
      </div>
    </div>
  );
};
