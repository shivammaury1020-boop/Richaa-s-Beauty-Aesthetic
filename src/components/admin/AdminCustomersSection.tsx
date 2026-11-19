import React, { useMemo, useState } from 'react';
import {
  Calendar,
  Edit3,
  Mail,
  Phone,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import type { Customer } from '../../types/site';

interface CustomerFormState {
  id: string | null;
  fullName: string;
  email: string;
  phone: string;
  preferredTreatments: string;
  notes: string;
}

const EMPTY_CUSTOMER: CustomerFormState = {
  id: null,
  fullName: '',
  email: '',
  phone: '',
  preferredTreatments: '',
  notes: '',
};

export function AdminCustomersSection() {
  const {
    customers,
    appointments,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  } = useSite();

  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<CustomerFormState>(EMPTY_CUSTOMER);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) =>
      `${c.fullName} ${c.email} ${c.phone} ${c.preferredTreatments} ${c.notes}`
        .toLowerCase()
        .includes(q)
    );
  }, [customers, search]);

  const countAppointmentsForCustomer = (customer: Customer) => {
    const cleanPhone = customer.phone.replace(/[\s\-()]/g, '');
    return appointments.filter(
      (a) =>
        a.customerId === customer.id ||
        (cleanPhone && a.customerPhone.replace(/[\s\-()]/g, '') === cleanPhone)
    ).length;
  };

  const openEdit = (customer: Customer) => {
    setForm({
      id: customer.id,
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      preferredTreatments: customer.preferredTreatments,
      notes: customer.notes,
    });
    setErrorMsg(null);
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (form.fullName.trim().length < 2) {
      setErrorMsg('Please enter the client full name.');
      return;
    }
    if (form.phone.trim().length < 5) {
      setErrorMsg('Please enter a valid client phone number.');
      return;
    }

    setSaving(true);
    try {
      if (form.id) {
        await updateCustomer(form.id, {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          preferredTreatments: form.preferredTreatments.trim(),
          notes: form.notes.trim(),
        });
      } else {
        await createCustomer({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          preferredTreatments: form.preferredTreatments.trim(),
          notes: form.notes.trim(),
        });
      }
      setForm(EMPTY_CUSTOMER);
      setFormOpen(false);
    } catch {
      setErrorMsg('Could not save client profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#A58A78] mb-1">
            Client Directory
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#382D28]">
            Customers
          </h2>
        </div>
        <button
          type="button"
          onClick={() => {
            if (formOpen) {
              setFormOpen(false);
            } else {
              setForm(EMPTY_CUSTOMER);
              setErrorMsg(null);
              setFormOpen(true);
            }
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#C5A27E] text-white text-xs uppercase tracking-[0.14em] rounded-md hover:bg-[#b5916c] transition-colors cursor-pointer"
        >
          {formOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {formOpen ? 'Close Form' : 'Add Customer'}
        </button>
      </div>

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#E8D5CA] rounded-xl p-6 space-y-4"
        >
          <h3 className="font-serif text-2xl text-[#382D28] border-b border-[#F2E8DF] pb-3">
            {form.id ? `Edit Client: ${form.fullName}` : 'New Client Profile'}
          </h3>

          {errorMsg && (
            <div className="bg-[#FDF3F2] border border-[#E5B8B2] text-[#8A2C22] rounded-lg px-4 py-2.5 text-xs">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, fullName: e.target.value }))
                }
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
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                Preferred Treatments
              </label>
              <input
                type="text"
                value={form.preferredTreatments}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    preferredTreatments: e.target.value,
                  }))
                }
                placeholder="e.g. Brow Lamination, Bespoke Facials"
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                Client Notes (Skin sensitivities, patch test dates)
              </label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) =>
                  setForm((p) => ({ ...p, notes: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="px-4 py-2.5 bg-[#F8F3EE] border border-[#E8D5CA] text-xs uppercase tracking-[0.14em] rounded-md cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#C5A27E] text-white text-xs uppercase tracking-[0.14em] rounded-md hover:bg-[#b5916c] disabled:opacity-60 cursor-pointer"
            >
              {saving ? 'Saving...' : form.id ? 'Update Client' : 'Save Client'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-[#E8D5CA] rounded-xl p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-[#A58A78] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients by name, phone, email or treatment preferences..."
            className="w-full pl-10 pr-3.5 py-2 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-[#E8D5CA] rounded-xl p-12 text-center">
          <Users className="w-8 h-8 text-[#C5A27E] mx-auto mb-3" />
          <p className="font-serif text-2xl text-[#382D28] mb-1">
            No client profiles yet
          </p>
          <p className="text-xs text-[#6B5A50]">
            Add regular salon clients to keep patch-test records, treatment
            preferences and contact details organised privately.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((customer) => {
            const apptCount = countAppointmentsForCustomer(customer);
            return (
              <div
                key={customer.id}
                className="bg-white border border-[#E8D5CA] rounded-xl p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-serif text-2xl text-[#382D28]">
                        {customer.fullName}
                      </h3>
                      <p className="text-[11px] text-[#A58A78] inline-flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {apptCount} recorded appointment
                        {apptCount === 1 ? '' : 's'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        title="Edit customer"
                        onClick={() => openEdit(customer)}
                        className="p-1.5 rounded border border-[#E8D5CA] text-[#6B5A50] hover:text-[#382D28] cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      {confirmDeleteId === customer.id ? (
                        <button
                          type="button"
                          onClick={() => {
                            void deleteCustomer(customer.id);
                            setConfirmDeleteId(null);
                          }}
                          className="px-2 py-1 bg-[#9B3B33] text-white text-[10px] uppercase tracking-[0.1em] rounded cursor-pointer"
                        >
                          Confirm
                        </button>
                      ) : (
                        <button
                          type="button"
                          title="Delete customer"
                          onClick={() => setConfirmDeleteId(customer.id)}
                          className="p-1.5 rounded border border-[#E8D5CA] text-[#A58A78] hover:text-[#9B3B33] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#6B5A50]">
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#C5A27E]" />
                      {customer.phone}
                    </span>
                    {customer.email && (
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#C5A27E]" />
                        {customer.email}
                      </span>
                    )}
                  </div>

                  {customer.preferredTreatments && (
                    <p className="text-xs text-[#382D28]">
                      <span className="text-[#A58A78]">Preferred: </span>
                      {customer.preferredTreatments}
                    </p>
                  )}
                  {customer.notes && (
                    <p className="text-xs text-[#6B5A50] bg-[#F8F3EE] border border-[#F2E8DF] rounded-md px-3 py-2">
                      {customer.notes}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
