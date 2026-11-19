import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Eye,
  Mail,
  MessageSquare,
  Phone,
  Search,
  Trash2,
} from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import type { EnquiryStatus } from '../../types/site';

export function AdminEnquiriesSection() {
  const { enquiries, updateEnquiryStatus, deleteEnquiry } = useSite();
  const [statusFilter, setStatusFilter] = useState<EnquiryStatus | 'All'>('All');
  const [search, setSearch] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enquiries.filter((item) => {
      if (statusFilter !== 'All' && item.status !== statusFilter) return false;
      if (q) {
        const hay = `${item.fullName} ${item.email} ${item.phone} ${item.treatmentInterest} ${item.message}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [enquiries, statusFilter, search]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#A58A78] mb-1">
          Client Messages
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-[#382D28]">
          Customer Enquiries
        </h2>
        <p className="text-xs text-[#6B5A50] mt-1">
          Enquiries submitted through your website Contact page are stored
          securely and visible only to authorised administrators.
        </p>
      </div>

      <div className="bg-white border border-[#E8D5CA] rounded-xl p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#A58A78] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, email, phone or treatment..."
            className="w-full pl-10 pr-3.5 py-2 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(['All', 'New', 'Read', 'Resolved'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-2 text-xs rounded-md border transition-colors cursor-pointer ${
                statusFilter === status
                  ? 'bg-[#382D28] text-white border-[#382D28]'
                  : 'bg-[#F8F3EE]/60 text-[#6B5A50] border-[#E8D5CA] hover:border-[#C5A27E]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-[#E8D5CA] rounded-xl p-12 text-center">
          <MessageSquare className="w-8 h-8 text-[#C5A27E] mx-auto mb-3" />
          <p className="font-serif text-2xl text-[#382D28] mb-1">
            No enquiries found
          </p>
          <p className="text-xs text-[#6B5A50]">
            {enquiries.length === 0
              ? 'New client contact form submissions will appear here in real time.'
              : 'Try clearing your search or status filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((enq) => (
            <div
              key={enq.id}
              className={`bg-white border rounded-xl p-5 space-y-4 ${
                enq.status === 'New'
                  ? 'border-[#C5A27E] shadow-[0_8px_24px_rgba(197,162,126,0.08)]'
                  : 'border-[#E8D5CA]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-1">
                    <h3 className="font-serif text-2xl text-[#382D28]">
                      {enq.fullName}
                    </h3>
                    <span
                      className={`px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] rounded-sm ${
                        enq.status === 'New'
                          ? 'bg-[#FBF3E4] text-[#9A6B2F] border border-[#EAD4AE]'
                          : enq.status === 'Resolved'
                          ? 'bg-[#E9F3EC] text-[#2D6A4F] border border-[#C3DFCB]'
                          : 'bg-[#F2E8DF] text-[#6B5A50] border border-[#E0CFC2]'
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#A58A78]">
                    Interested in:{' '}
                    <span className="text-[#382D28] font-medium">
                      {enq.treatmentInterest}
                    </span>{' '}
                    &middot; {new Date(enq.createdAt).toLocaleString('en-GB')}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {enq.status !== 'Read' && (
                    <button
                      type="button"
                      onClick={() => void updateEnquiryStatus(enq.id, 'Read')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F3EE] border border-[#E8D5CA] text-[#382D28] text-[11px] uppercase tracking-[0.1em] rounded-md hover:bg-[#F2E8DF] cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Mark Read
                    </button>
                  )}
                  {enq.status !== 'Resolved' && (
                    <button
                      type="button"
                      onClick={() =>
                        void updateEnquiryStatus(enq.id, 'Resolved')
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E9F3EC] border border-[#C3DFCB] text-[#2D6A4F] text-[11px] uppercase tracking-[0.1em] rounded-md hover:bg-[#d8ebde] cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Resolve
                    </button>
                  )}
                  {confirmDeleteId === enq.id ? (
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          void deleteEnquiry(enq.id);
                          setConfirmDeleteId(null);
                        }}
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
                      title="Delete enquiry"
                      onClick={() => setConfirmDeleteId(enq.id)}
                      className="p-1.5 text-[#A58A78] hover:text-[#9B3B33] cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-[#F8F3EE]/70 border border-[#F2E8DF] rounded-lg p-4 text-sm text-[#382D28] leading-relaxed whitespace-pre-wrap">
                {enq.message}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B5A50]">
                <a
                  href={`mailto:${enq.email}?subject=${encodeURIComponent(
                    `Re: Your enquiry at Richaa's Beauty & Aesthetic`
                  )}`}
                  className="inline-flex items-center gap-1.5 hover:text-[#C5A27E] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#C5A27E]" />
                  {enq.email}
                </a>
                {enq.phone && enq.phone !== 'Not provided' && (
                  <a
                    href={`tel:${enq.phone.replace(/[^\d+]/g, '')}`}
                    className="inline-flex items-center gap-1.5 hover:text-[#C5A27E] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#C5A27E]" />
                    {enq.phone}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
