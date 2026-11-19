import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Bell,
  Calendar,
  Check,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Sparkles,
  Tag,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { AdminAppointmentsSection } from '../components/admin/AdminAppointmentsSection';
import { AdminCustomersSection } from '../components/admin/AdminCustomersSection';
import { AdminEnquiriesSection } from '../components/admin/AdminEnquiriesSection';
import { AdminGallerySection } from '../components/admin/AdminGallerySection';
import { AdminLoginView } from '../components/admin/AdminLoginView';
import {
  AdminOverviewSection,
  type AdminSectionId,
} from '../components/admin/AdminOverviewSection';
import { AdminPricingSection } from '../components/admin/AdminPricingSection';
import { AdminServicesSection } from '../components/admin/AdminServicesSection';
import { AdminSettingsSection } from '../components/admin/AdminSettingsSection';
import { BrandMark } from '../components/BrandMark';
import { useSite } from '../context/SiteContext';

export function AdminDashboardPage() {
  const {
    adminAuth,
    businessConfig,
    enquiries,
    appointments,
    notifications,
    navigate,
    signOutAdmin,
    markNotificationRead,
    deleteNotification,
  } = useSite();

  const [activeSection, setActiveSection] = useState<AdminSectionId>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const newEnquiryCount = useMemo(
    () => enquiries.filter((e) => e.status === 'New').length,
    [enquiries]
  );

  const pendingApptCount = useMemo(
    () => appointments.filter((a) => a.status === 'pending').length,
    [appointments]
  );

  const unreadNotificationCount = useMemo(
    () =>
      notifications.filter((n) => !n.read).length + newEnquiryCount,
    [notifications, newEnquiryCount]
  );

  // Strict route protection: unauthenticated or unauthorised users see only AdminLoginView
  if (!adminAuth.authReady || !adminAuth.isAdmin) {
    return <AdminLoginView />;
  }

  const navItems: Array<{
    id: AdminSectionId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }> = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: Calendar,
      badge: pendingApptCount > 0 ? pendingApptCount : undefined,
    },
    { id: 'services', label: 'Services', icon: Sparkles },
    { id: 'pricing', label: 'Pricing', icon: Tag },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    {
      id: 'enquiries',
      label: 'Enquiries',
      icon: MessageSquare,
      badge: newEnquiryCount > 0 ? newEnquiryCount : undefined,
    },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'settings', label: 'Business Settings', icon: Settings },
  ];

  const handleSelectSection = (section: AdminSectionId) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-6 border-b border-[#E8D5CA]">
        <BrandMark size="sm" logoUrl={businessConfig.logoUrl} />
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#A58A78] mt-3">
          Salon Admin Portal
        </p>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto" aria-label="Admin sidebar navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectSection(item.id)}
              className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                active
                  ? 'bg-[#382D28] text-white'
                  : 'text-[#594A42] hover:bg-[#E8D5CA]/45 hover:text-[#382D28]'
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    active ? 'text-[#C5A27E]' : 'text-[#A58A78]'
                  }`}
                />
                <span>{item.label}</span>
              </span>
              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-medium rounded-sm tabular-nums ${
                    active
                      ? 'bg-[#C5A27E] text-white'
                      : 'bg-[#C5A27E]/20 text-[#8B6B4A]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[#E8D5CA] space-y-1.5">
        <button
          type="button"
          onClick={() => navigate({ page: 'home' })}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs uppercase tracking-[0.12em] text-[#6B5A50] hover:bg-[#E8D5CA]/45 hover:text-[#382D28] transition-colors cursor-pointer"
        >
          <span>View Public Site</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A27E]" />
        </button>

        <button
          type="button"
          onClick={() => void signOutAdmin()}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-[#9B3B33] hover:bg-[#FDF1F0] transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F3EE] text-[#382D28] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-[#F2E8DF] border-r border-[#E8D5CA]">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#382D28]/40 backdrop-blur-[2px]"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-[#F2E8DF] border-r border-[#E8D5CA] h-full z-10 flex flex-col">
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#6B5A50] hover:text-[#382D28] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            {renderSidebarContent()}
          </aside>
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Admin Header */}
        <header className="sticky top-0 z-30 bg-[#F8F3EE]/95 backdrop-blur-sm border-b border-[#E8D5CA] px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open admin menu"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-[#382D28] hover:bg-[#F2E8DF] rounded-md cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <p className="text-xs uppercase tracking-[0.16em] text-[#A58A78] truncate">
              {navItems.find((n) => n.id === activeSection)?.label ?? 'Dashboard'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs text-[#6B5A50] truncate max-w-[220px]">
              {adminAuth.user?.email}
            </span>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                aria-label="Open notifications"
                onClick={() => setNotificationsOpen((v) => !v)}
                className="relative p-2 bg-white border border-[#E8D5CA] rounded-md text-[#382D28] hover:border-[#C5A27E] transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#C5A27E] text-white text-[10px] font-medium rounded-full flex items-center justify-center tabular-nums">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E8D5CA] rounded-xl shadow-[0_20px_50px_rgba(56,45,40,0.12)] z-40 overflow-hidden">
                  <div className="px-4 py-3 bg-[#F2E8DF]/70 border-b border-[#E8D5CA] flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.14em] text-[#382D28] font-medium">
                      Notifications
                    </p>
                    <button
                      type="button"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-[#6B5A50] hover:text-[#382D28] cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="max-h-96 overflow-y-auto divide-y divide-[#F2E8DF]">
                    {newEnquiryCount > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setNotificationsOpen(false);
                          setActiveSection('enquiries');
                        }}
                        className="w-full text-left px-4 py-3 bg-[#FDF8F2] hover:bg-[#F8EFE4] transition-colors cursor-pointer"
                      >
                        <p className="text-xs font-medium text-[#382D28]">
                          {newEnquiryCount} New Customer Enquir
                          {newEnquiryCount === 1 ? 'y' : 'ies'}
                        </p>
                        <p className="text-[11px] text-[#6B5A50] mt-0.5">
                          Click to review and respond in Enquiries.
                        </p>
                      </button>
                    )}

                    {notifications.length === 0 && newEnquiryCount === 0 ? (
                      <div className="px-4 py-8 text-center text-xs text-[#A58A78]">
                        You are all caught up. New enquiries and booking
                        updates appear here.
                      </div>
                    ) : (
                      notifications.map((ntf) => (
                        <div
                          key={ntf.id}
                          className={`px-4 py-3 flex items-start justify-between gap-2 ${
                            ntf.read ? 'bg-white' : 'bg-[#F8F3EE]/60'
                          }`}
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-[#382D28]">
                              {ntf.title}
                            </p>
                            <p className="text-[11px] text-[#6B5A50] mt-0.5">
                              {ntf.body}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {!ntf.read && (
                              <button
                                type="button"
                                title="Mark read"
                                onClick={() => void markNotificationRead(ntf.id)}
                                className="p-1 text-[#2D6A4F] hover:bg-[#E9F3EC] rounded cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              title="Remove notification"
                              onClick={() => void deleteNotification(ntf.id)}
                              className="p-1 text-[#A58A78] hover:text-[#9B3B33] rounded cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Active Section Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto">
          {activeSection === 'overview' && (
            <AdminOverviewSection onSelectSection={handleSelectSection} />
          )}
          {activeSection === 'appointments' && <AdminAppointmentsSection />}
          {activeSection === 'services' && <AdminServicesSection />}
          {activeSection === 'pricing' && <AdminPricingSection />}
          {activeSection === 'gallery' && <AdminGallerySection />}
          {activeSection === 'enquiries' && <AdminEnquiriesSection />}
          {activeSection === 'customers' && <AdminCustomersSection />}
          {activeSection === 'settings' && <AdminSettingsSection />}
        </main>
      </div>
    </div>
  );
}
