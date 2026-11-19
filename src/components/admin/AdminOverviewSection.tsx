import React from 'react';
import {
  ArrowRight,
  Calendar,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  Clock,
  MessageSquare,
  XCircle,
} from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { computeDashboardMetrics, getTodayIsoDate } from '../../utils/siteLogic';

export type AdminSectionId =
  | 'overview'
  | 'appointments'
  | 'services'
  | 'pricing'
  | 'gallery'
  | 'enquiries'
  | 'customers'
  | 'settings';

export function AdminOverviewSection({
  onSelectSection,
}: {
  onSelectSection: (section: AdminSectionId) => void;
}) {
  const { appointments, enquiries, services, gallery, customers } = useSite();
  const todayIso = getTodayIsoDate();
  const metrics = computeDashboardMetrics(appointments, enquiries, todayIso);

  const todaysList = appointments
    .filter((a) => a.appointmentDate === todayIso)
    .sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime));

  const recentEnquiries = enquiries.slice(0, 5);

  const statCards = [
    {
      label: 'Total Appointments',
      value: metrics.totalAppointments,
      sub: 'All recorded bookings',
      icon: Calendar,
      accent: 'text-[#382D28]',
      section: 'appointments' as AdminSectionId,
    },
    {
      label: "Today's Appointments",
      value: metrics.todaysAppointments,
      sub: todayIso,
      icon: CalendarClock,
      accent: 'text-[#C5A27E]',
      section: 'appointments' as AdminSectionId,
    },
    {
      label: 'Pending Bookings',
      value: metrics.pendingBookings,
      sub: 'Awaiting confirmation',
      icon: Clock,
      accent: 'text-[#9A6B2F]',
      section: 'appointments' as AdminSectionId,
    },
    {
      label: 'Confirmed Bookings',
      value: metrics.confirmedBookings,
      sub: 'Scheduled visits',
      icon: CalendarCheck,
      accent: 'text-[#2D6A4F]',
      section: 'appointments' as AdminSectionId,
    },
    {
      label: 'Completed Appointments',
      value: metrics.completedAppointments,
      sub: 'Finished treatments',
      icon: CheckCircle2,
      accent: 'text-[#382D28]',
      section: 'appointments' as AdminSectionId,
    },
    {
      label: 'Cancelled Appointments',
      value: metrics.cancelledAppointments,
      sub: 'Cancelled or declined',
      icon: XCircle,
      accent: 'text-[#9B3B33]',
      section: 'appointments' as AdminSectionId,
    },
    {
      label: 'Total Customer Enquiries',
      value: metrics.totalEnquiries,
      sub:
        metrics.unreadEnquiries > 0
          ? `${metrics.unreadEnquiries} unread enquiry${metrics.unreadEnquiries === 1 ? '' : 'ies'}`
          : 'All enquiries reviewed',
      icon: MessageSquare,
      accent: 'text-[#C5A27E]',
      section: 'enquiries' as AdminSectionId,
    },
  ];

  const totalForBars = Math.max(metrics.totalAppointments, 1);
  const statusBars = [
    {
      label: 'Pending',
      count: metrics.pendingBookings,
      pct: Math.round((metrics.pendingBookings / totalForBars) * 100),
      color: 'bg-[#D4A359]',
    },
    {
      label: 'Confirmed',
      count: metrics.confirmedBookings,
      pct: Math.round((metrics.confirmedBookings / totalForBars) * 100),
      color: 'bg-[#5E8C6A]',
    },
    {
      label: 'Completed',
      count: metrics.completedAppointments,
      pct: Math.round((metrics.completedAppointments / totalForBars) * 100),
      color: 'bg-[#382D28]',
    },
    {
      label: 'Cancelled',
      count: metrics.cancelledAppointments,
      pct: Math.round((metrics.cancelledAppointments / totalForBars) * 100),
      color: 'bg-[#B86B62]',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#A58A78] mb-1">
            Salon Overview
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#382D28]">
            Dashboard Summary
          </h2>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => onSelectSection('appointments')}
            className="px-4 py-2.5 bg-[#C5A27E] text-white text-xs uppercase tracking-[0.14em] rounded-md hover:bg-[#b5916c] transition-colors cursor-pointer"
          >
            Manage Appointments
          </button>
          <button
            type="button"
            onClick={() => onSelectSection('pricing')}
            className="px-4 py-2.5 bg-white border border-[#E8D5CA] text-[#382D28] text-xs uppercase tracking-[0.14em] rounded-md hover:bg-[#F2E8DF] transition-colors cursor-pointer"
          >
            Update Pricing
          </button>
        </div>
      </div>

      {/* 7 Required Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              type="button"
              onClick={() => onSelectSection(card.section)}
              className="text-left bg-white border border-[#E8D5CA] rounded-xl p-5 hover:border-[#C5A27E] transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#A58A78]">
                  {card.label}
                </p>
                <Icon className={`w-4 h-4 ${card.accent} shrink-0`} />
              </div>
              <p className="font-serif text-3xl text-[#382D28] tabular-nums mb-1">
                {card.value}
              </p>
              <p className="text-xs text-[#6B5A50]">{card.sub}</p>
            </button>
          );
        })}

        {/* Quick Catalog Snapshot Card */}
        <div className="bg-[#F2E8DF]/70 border border-[#E8D5CA] rounded-xl p-5 flex flex-col justify-between">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#A58A78] mb-3">
            Live Website Snapshot
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/80 rounded-lg py-2 px-1 border border-[#E8D5CA]/70">
              <p className="font-serif text-xl text-[#382D28] tabular-nums">
                {services.filter((s) => s.active).length}
              </p>
              <p className="text-[10px] uppercase tracking-[0.1em] text-[#A58A78]">
                Services
              </p>
            </div>
            <div className="bg-white/80 rounded-lg py-2 px-1 border border-[#E8D5CA]/70">
              <p className="font-serif text-xl text-[#382D28] tabular-nums">
                {gallery.filter((g) => g.visible).length}
              </p>
              <p className="text-[10px] uppercase tracking-[0.1em] text-[#A58A78]">
                Gallery
              </p>
            </div>
            <div className="bg-white/80 rounded-lg py-2 px-1 border border-[#E8D5CA]/70">
              <p className="font-serif text-xl text-[#382D28] tabular-nums">
                {customers.length}
              </p>
              <p className="text-[10px] uppercase tracking-[0.1em] text-[#A58A78]">
                Clients
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Statistics Breakdown */}
      <div className="bg-white border border-[#E8D5CA] rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h3 className="font-serif text-2xl text-[#382D28]">
              Appointment Status Statistics
            </h3>
            <p className="text-xs text-[#6B5A50]">
              Distribution across all recorded salon bookings
            </p>
          </div>
          <span className="text-xs text-[#A58A78] tabular-nums">
            {metrics.totalAppointments} total booking
            {metrics.totalAppointments === 1 ? '' : 's'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {statusBars.map((bar) => (
            <div key={bar.label} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#382D28] font-medium">{bar.label}</span>
                <span className="text-[#6B5A50] tabular-nums">
                  {bar.count} ({metrics.totalAppointments > 0 ? `${bar.pct}%` : '0%'})
                </span>
              </div>
              <div className="h-2 bg-[#F2E8DF] rounded-full overflow-hidden">
                <div
                  className={`h-full ${bar.color} rounded-full transition-all duration-300`}
                  style={{
                    width:
                      metrics.totalAppointments > 0 ? `${bar.pct}%` : '0%',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Schedule + Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E8D5CA] rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-2xl text-[#382D28]">
              Today&apos;s Schedule
            </h3>
            <button
              type="button"
              onClick={() => onSelectSection('appointments')}
              className="inline-flex items-center gap-1 text-xs text-[#A58A78] hover:text-[#382D28] cursor-pointer"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {todaysList.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10 bg-[#F8F3EE]/60 rounded-lg border border-dashed border-[#E8D5CA]">
              <Calendar className="w-6 h-6 text-[#C5A27E] mb-2" />
              <p className="text-sm text-[#382D28] font-medium">
                No appointments scheduled for today ({todayIso})
              </p>
              <p className="text-xs text-[#6B5A50] mt-1 max-w-xs">
                Add manual bookings or confirmed studio visits from the
                Appointments tab.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#F2E8DF]">
              {todaysList.map((apt) => (
                <div
                  key={apt.id}
                  className="py-3.5 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-medium text-[#382D28]">
                      {apt.customerName}
                    </p>
                    <p className="text-xs text-[#6B5A50]">
                      {apt.serviceName} &middot; {apt.customerPhone}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-[#382D28] tabular-nums">
                      {apt.appointmentTime}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] rounded-sm bg-[#F2E8DF] text-[#382D28]">
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-[#E8D5CA] rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-2xl text-[#382D28]">
              Recent Customer Enquiries
            </h3>
            <button
              type="button"
              onClick={() => onSelectSection('enquiries')}
              className="inline-flex items-center gap-1 text-xs text-[#A58A78] hover:text-[#382D28] cursor-pointer"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentEnquiries.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10 bg-[#F8F3EE]/60 rounded-lg border border-dashed border-[#E8D5CA]">
              <MessageSquare className="w-6 h-6 text-[#C5A27E] mb-2" />
              <p className="text-sm text-[#382D28] font-medium">
                No customer enquiries yet
              </p>
              <p className="text-xs text-[#6B5A50] mt-1 max-w-xs">
                Messages submitted via your public Contact page appear here
                automatically in real time.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#F2E8DF]">
              {recentEnquiries.map((enq) => (
                <div key={enq.id} className="py-3.5">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-[#382D28]">
                      {enq.fullName}
                    </p>
                    <span
                      className={`px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] rounded-sm ${
                        enq.status === 'New'
                          ? 'bg-[#C5A27E]/20 text-[#8B6B4A]'
                          : enq.status === 'Resolved'
                          ? 'bg-[#E6EFE7] text-[#2D5A30]'
                          : 'bg-[#F2E8DF] text-[#6B5A50]'
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#A58A78] mb-1">
                    {enq.treatmentInterest} &middot; {enq.email}
                  </p>
                  <p className="text-xs text-[#6B5A50] line-clamp-2">
                    {enq.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
