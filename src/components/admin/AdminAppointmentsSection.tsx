import React, { useMemo, useState } from 'react';
import {
  Calendar,
  Check,
  CheckCircle2,
  ExternalLink,
  Info,
  Plus,
  Search,
  StickyNote,
  Trash2,
  X,
  XCircle,
} from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import type { Appointment, AppointmentStatus } from '../../types/site';
import {
  filterAppointments,
  getTodayIsoDate,
  resolveBookingDestination,
  validateAppointmentInput,
} from '../../utils/siteLogic';

const STATUS_BADGE: Record<AppointmentStatus, string> = {
  pending: 'bg-[#FBF3E4] text-[#9A6B2F] border border-[#EAD4AE]',
  confirmed: 'bg-[#E9F3EC] text-[#2D6A4F] border border-[#C3DFCB]',
  completed: 'bg-[#F2E8DF] text-[#382D28] border border-[#E0CFC2]',
  cancelled: 'bg-[#FDF1F0] text-[#9B3B33] border border-[#EBC5C0]',
};

export function AdminAppointmentsSection() {
  const {
    appointments,
    services,
    customers,
    businessConfig,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  } = useSite();

  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>(
    'all'
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [newAppt, setNewAppt] = useState({
    customerId: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    serviceId: services[0]?.id ?? '',
    serviceName: services[0]?.name ?? 'Eyelash Extensions',
    appointmentDate: getTodayIsoDate(),
    appointmentTime: '11:00',
    status: 'confirmed' as AppointmentStatus,
    internalNotes: '',
  });

  const filtered = useMemo(
    () =>
      filterAppointments(appointments, {
        search,
        date: dateFilter,
        status: statusFilter,
      }),
    [appointments, search, dateFilter, statusFilter]
  );

  const bookingDest = resolveBookingDestination(businessConfig);

  const handleSelectExistingCustomer = (customerId: string) => {
    const found = customers.find((c) => c.id === customerId);
    if (!found) {
      setNewAppt((prev) => ({ ...prev, customerId: '' }));
      return;
    }
    setNewAppt((prev) => ({
      ...prev,
      customerId: found.id,
      customerName: found.fullName,
      customerPhone: found.phone,
      customerEmail: found.email,
    }));
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const err = validateAppointmentInput(newAppt);
    if (err) {
      setFormError(err);
      return;
    }
    setCreating(true);
    try {
      await createAppointment({
        customerId: newAppt.customerId || undefined,
        customerName: newAppt.customerName,
        customerPhone: newAppt.customerPhone,
        customerEmail: newAppt.customerEmail,
        serviceId: newAppt.serviceId || undefined,
        serviceName: newAppt.serviceName,
        appointmentDate: newAppt.appointmentDate,
        appointmentTime: newAppt.appointmentTime,
        status: newAppt.status,
        source: 'manual',
        internalNotes: newAppt.internalNotes,
      });
      setNewAppt({
        customerId: '',
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        serviceId: services[0]?.id ?? '',
        serviceName: services[0]?.name ?? 'Eyelash Extensions',
        appointmentDate: getTodayIsoDate(),
        appointmentTime: '11:00',
        status: 'confirmed',
        internalNotes: '',
      });
      setShowAddForm(false);
    } catch {
      setFormError('Could not save appointment. Please check your inputs and try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (
    apt: Appointment,
    nextStatus: AppointmentStatus
  ) => {
    setBusyId(apt.id);
    try {
      await updateAppointment(apt.id, { status: nextStatus });
    } finally {
      setBusyId(null);
    }
  };

  const handleSaveNotes = async (apt: Appointment) => {
    setBusyId(apt.id);
    try {
      await updateAppointment(apt.id, { internalNotes: notesDraft });
      setEditingNotesId(null);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    try {
      await deleteAppointment(id);
      setConfirmDeleteId(null);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#A58A78] mb-1">
            Bookings &amp; Schedule
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#382D28]">
            Appointment Management
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm((v) => !v)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#C5A27E] text-white text-xs uppercase tracking-[0.14em] rounded-md hover:bg-[#b5916c] transition-colors cursor-pointer"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? 'Close Form' : 'New Appointment'}
        </button>
      </div>

      {/* Honest External Booking System Integration Card */}
      <div className="bg-[#F2E8DF]/75 border border-[#E8D5CA] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-[#C5A27E] shrink-0 mt-0.5" />
          <div className="text-xs text-[#594A42] leading-relaxed">
            <p className="font-medium text-[#382D28] mb-0.5">
              External Booking System Status:{' '}
              <span className="uppercase tracking-[0.08em] text-[#A58A78]">
                {businessConfig.bookingIntegrationMode.replace('_', ' ')}
              </span>
            </p>
            <p>
              {bookingDest.isConfigured
                ? `Public "Book Appointment" buttons route directly to your configured booking link (${businessConfig.bookingProviderLabel}). External booking applications are not automatically synchronised unless provider API keys and webhooks are explicitly connected.`
                : 'Your external booking link has not yet been confirmed in Business Settings. Public booking buttons direct clients to enquire via WhatsApp or the Contact form until you add your booking provider URL. External bookings are never falsely marked as auto-synced.'}
            </p>
          </div>
        </div>
        {bookingDest.isConfigured && bookingDest.url && (
          <a
            href={bookingDest.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#E8D5CA] text-[#382D28] text-xs uppercase tracking-[0.12em] rounded-md hover:bg-[#F8F3EE] transition-colors"
          >
            Open Booking App
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Create Appointment Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateAppointment}
          className="bg-white border border-[#E8D5CA] rounded-xl p-6 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-[#F2E8DF] pb-3">
            <h3 className="font-serif text-2xl text-[#382D28]">
              Record New Appointment
            </h3>
            {customers.length > 0 && (
              <select
                value={newAppt.customerId}
                onChange={(e) => handleSelectExistingCustomer(e.target.value)}
                className="text-xs bg-[#F8F3EE] border border-[#E8D5CA] rounded-md px-3 py-1.5 text-[#382D28]"
              >
                <option value="">Fill from existing client...</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName} ({c.phone})
                  </option>
                ))}
              </select>
            )}
          </div>

          {formError && (
            <div className="bg-[#FDF3F2] border border-[#E5B8B2] text-[#8A2C22] rounded-lg px-4 py-2.5 text-xs">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                Client Name *
              </label>
              <input
                type="text"
                required
                value={newAppt.customerName}
                onChange={(e) =>
                  setNewAppt((p) => ({ ...p, customerName: e.target.value }))
                }
                placeholder="e.g. Sophie Davies"
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={newAppt.customerPhone}
                onChange={(e) =>
                  setNewAppt((p) => ({ ...p, customerPhone: e.target.value }))
                }
                placeholder="+44 7..."
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                Email (Optional)
              </label>
              <input
                type="email"
                value={newAppt.customerEmail}
                onChange={(e) =>
                  setNewAppt((p) => ({ ...p, customerEmail: e.target.value }))
                }
                placeholder="client@example.co.uk"
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                Treatment Service *
              </label>
              <select
                value={newAppt.serviceName}
                onChange={(e) => {
                  const chosen = services.find((s) => s.name === e.target.value);
                  setNewAppt((p) => ({
                    ...p,
                    serviceId: chosen?.id ?? '',
                    serviceName: e.target.value,
                  }));
                }}
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.serviceGroup})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={newAppt.appointmentDate}
                onChange={(e) =>
                  setNewAppt((p) => ({ ...p, appointmentDate: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                Time *
              </label>
              <input
                type="time"
                required
                value={newAppt.appointmentTime}
                onChange={(e) =>
                  setNewAppt((p) => ({ ...p, appointmentTime: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                Initial Status
              </label>
              <select
                value={newAppt.status}
                onChange={(e) =>
                  setNewAppt((p) => ({
                    ...p,
                    status: e.target.value as AppointmentStatus,
                  }))
                }
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                Internal Notes (Patch test, preferences, allergies)
              </label>
              <input
                type="text"
                value={newAppt.internalNotes}
                onChange={(e) =>
                  setNewAppt((p) => ({ ...p, internalNotes: e.target.value }))
                }
                placeholder="Private staff notes — never visible on the public website"
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2.5 bg-[#F8F3EE] border border-[#E8D5CA] text-xs uppercase tracking-[0.14em] rounded-md cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-6 py-2.5 bg-[#C5A27E] text-white text-xs uppercase tracking-[0.14em] rounded-md hover:bg-[#b5916c] disabled:opacity-60 cursor-pointer"
            >
              {creating ? 'Saving...' : 'Save Appointment'}
            </button>
          </div>
        </form>
      )}

      {/* Search & Filters */}
      <div className="bg-white border border-[#E8D5CA] rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-[#A58A78] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, phone, treatment or notes..."
            className="w-full pl-10 pr-3.5 py-2 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
          />
        </div>
        <div className="relative">
          <Calendar className="w-4 h-4 text-[#A58A78] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            aria-label="Filter by appointment date"
            className="w-full pl-9 pr-3 py-2 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as AppointmentStatus | 'all')
            }
            aria-label="Filter by booking status"
            className="flex-1 px-3 py-2 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          {(search || dateFilter || statusFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setDateFilter('');
                setStatusFilter('all');
              }}
              className="px-3 py-2 text-xs text-[#A58A78] hover:text-[#382D28] border border-[#E8D5CA] rounded-md cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Appointments List */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#E8D5CA] rounded-xl p-12 text-center">
          <Calendar className="w-8 h-8 text-[#C5A27E] mx-auto mb-3" />
          <p className="font-serif text-2xl text-[#382D28] mb-1">
            No matching appointments
          </p>
          <p className="text-xs text-[#6B5A50]">
            {appointments.length === 0
              ? 'Click "New Appointment" above to add your first scheduled salon booking.'
              : 'Adjust your search, date, or status filters to see other bookings.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((apt) => (
            <div
              key={apt.id}
              className="bg-white border border-[#E8D5CA] rounded-xl p-5 space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-serif text-xl text-[#382D28]">
                      {apt.customerName}
                    </h3>
                    <span
                      className={`px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] rounded-sm ${STATUS_BADGE[apt.status]}`}
                    >
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B5A50]">
                    <span className="font-medium text-[#382D28]">
                      {apt.serviceName}
                    </span>{' '}
                    &middot; {apt.appointmentDate} at {apt.appointmentTime}{' '}
                    &middot;{' '}
                    <a
                      href={`tel:${apt.customerPhone.replace(/[^\d+]/g, '')}`}
                      className="underline hover:text-[#C5A27E]"
                    >
                      {apt.customerPhone}
                    </a>
                    {apt.customerEmail ? ` · ${apt.customerEmail}` : ''}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {apt.status !== 'confirmed' && apt.status !== 'completed' && (
                    <button
                      type="button"
                      disabled={busyId === apt.id}
                      onClick={() => void handleStatusChange(apt, 'confirmed')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E9F3EC] text-[#2D6A4F] border border-[#C3DFCB] text-[11px] uppercase tracking-[0.1em] rounded-md hover:bg-[#d9ece0] cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Confirm
                    </button>
                  )}
                  {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                    <button
                      type="button"
                      disabled={busyId === apt.id}
                      onClick={() => void handleStatusChange(apt, 'completed')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F2E8DF] text-[#382D28] border border-[#E0CFC2] text-[11px] uppercase tracking-[0.1em] rounded-md hover:bg-[#e8dacd] cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Complete
                    </button>
                  )}
                  {apt.status !== 'cancelled' && (
                    <button
                      type="button"
                      disabled={busyId === apt.id}
                      onClick={() => void handleStatusChange(apt, 'cancelled')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FDF1F0] text-[#9B3B33] border border-[#EBC5C0] text-[11px] uppercase tracking-[0.1em] rounded-md hover:bg-[#f9e1de] cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (editingNotesId === apt.id) {
                        setEditingNotesId(null);
                      } else {
                        setEditingNotesId(apt.id);
                        setNotesDraft(apt.internalNotes);
                      }
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F8F3EE] border border-[#E8D5CA] text-[#6B5A50] text-[11px] uppercase tracking-[0.1em] rounded-md hover:text-[#382D28] cursor-pointer"
                  >
                    <StickyNote className="w-3.5 h-3.5" />
                    Notes
                  </button>

                  {confirmDeleteId === apt.id ? (
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={busyId === apt.id}
                        onClick={() => void handleDelete(apt.id)}
                        className="px-2.5 py-1.5 bg-[#9B3B33] text-white text-[11px] uppercase tracking-[0.1em] rounded-md cursor-pointer"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-1.5 text-[11px] text-[#6B5A50] cursor-pointer"
                      >
                        Keep
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      aria-label="Delete appointment"
                      onClick={() => setConfirmDeleteId(apt.id)}
                      className="p-1.5 text-[#A58A78] hover:text-[#9B3B33] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {apt.internalNotes && editingNotesId !== apt.id && (
                <div className="bg-[#F8F3EE]/80 border border-[#F2E8DF] rounded-lg px-3.5 py-2 text-xs text-[#594A42]">
                  <span className="font-medium text-[#A58A78] uppercase tracking-[0.1em] text-[10px] mr-2">
                    Internal Note:
                  </span>
                  {apt.internalNotes}
                </div>
              )}

              {editingNotesId === apt.id && (
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <input
                    type="text"
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    placeholder="Add internal salon notes..."
                    className="flex-1 px-3.5 py-2 bg-[#F8F3EE] border border-[#E8D5CA] rounded-md text-xs"
                  />
                  <button
                    type="button"
                    disabled={busyId === apt.id}
                    onClick={() => void handleSaveNotes(apt)}
                    className="px-4 py-2 bg-[#C5A27E] text-white text-xs uppercase tracking-[0.12em] rounded-md cursor-pointer"
                  >
                    Save Note
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
