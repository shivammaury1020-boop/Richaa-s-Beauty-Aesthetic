import React, { useState } from 'react';
import { Check, Save, Tag } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import type { TreatmentService } from '../../types/site';
import { PRICE_COMING_SOON, PRICING_CATEGORIES } from '../../utils/siteLogic';

interface PricingDraft {
  priceLabel: string;
  promoPriceLabel: string;
  durationLabel: string;
  pricingNotes: string;
}

export function AdminPricingSection() {
  const { services, updateService } = useSite();
  const [drafts, setDrafts] = useState<Record<string, PricingDraft>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const getDraft = (srv: TreatmentService): PricingDraft => {
    return (
      drafts[srv.id] ?? {
        priceLabel: srv.priceLabel ?? '',
        promoPriceLabel: srv.promoPriceLabel ?? '',
        durationLabel: srv.durationLabel ?? '',
        pricingNotes: srv.pricingNotes ?? '',
      }
    );
  };

  const updateDraftField = (
    srv: TreatmentService,
    field: keyof PricingDraft,
    value: string
  ) => {
    const current = getDraft(srv);
    setDrafts((prev) => ({
      ...prev,
      [srv.id]: { ...current, [field]: value },
    }));
  };

  const handleSave = async (srv: TreatmentService) => {
    const draft = getDraft(srv);
    setSavingId(srv.id);
    try {
      await updateService(srv.id, {
        priceLabel: draft.priceLabel.trim() || null,
        promoPriceLabel: draft.promoPriceLabel.trim() || null,
        durationLabel: draft.durationLabel.trim() || null,
        pricingNotes: draft.pricingNotes.trim() || null,
      });
      setSavedId(srv.id);
      window.setTimeout(() => {
        setSavedId((prev) => (prev === srv.id ? null : prev));
      }, 2200);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#A58A78] mb-1">
          Live Tariff Editor
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-[#382D28]">
          Pricing Management
        </h2>
        <p className="text-xs text-[#6B5A50] mt-1.5 max-w-2xl">
          Update regular prices, promotional prices, treatment durations and
          optional pricing notes. Saving any row updates the public Pricing and
          Service pages immediately. Leave a regular price blank to display{' '}
          <span className="italic text-[#382D28]">&ldquo;{PRICE_COMING_SOON}&rdquo;</span>.
        </p>
      </div>

      <div className="space-y-6">
        {PRICING_CATEGORIES.map((category) => {
          const items = services.filter((s) => s.category === category);
          if (items.length === 0) return null;

          return (
            <div
              key={category}
              className="bg-white border border-[#E8D5CA] rounded-xl overflow-hidden"
            >
              <div className="px-5 py-3.5 bg-[#F2E8DF]/70 border-b border-[#E8D5CA] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#C5A27E]" />
                  <h3 className="font-serif text-xl text-[#382D28]">
                    {category}
                  </h3>
                </div>
                <span className="text-[11px] uppercase tracking-[0.12em] text-[#A58A78]">
                  {items.length} treatment{items.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="divide-y divide-[#F2E8DF]">
                {items.map((srv) => {
                  const draft = getDraft(srv);
                  const isSaving = savingId === srv.id;
                  const isSaved = savedId === srv.id;

                  return (
                    <div key={srv.id} className="p-5 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm text-[#382D28]">
                            {srv.name}
                          </p>
                          <p className="text-[11px] text-[#A58A78]">
                            {srv.serviceGroup}
                            {!srv.active ? ' · Hidden from public site' : ''}
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={() => void handleSave(srv)}
                          className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-[0.12em] rounded-md transition-colors cursor-pointer ${
                            isSaved
                              ? 'bg-[#2D6A4F] text-white'
                              : 'bg-[#C5A27E] text-white hover:bg-[#b5916c]'
                          } disabled:opacity-60`}
                        >
                          {isSaved ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              Saved Live
                            </>
                          ) : (
                            <>
                              <Save className="w-3.5 h-3.5" />
                              {isSaving ? 'Saving...' : 'Save Row'}
                            </>
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                            Regular Price
                          </label>
                          <input
                            type="text"
                            value={draft.priceLabel}
                            onChange={(e) =>
                              updateDraftField(srv, 'priceLabel', e.target.value)
                            }
                            placeholder="e.g. £55"
                            className="w-full px-3 py-2 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-xs text-[#382D28]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                            Promotional Price (Optional)
                          </label>
                          <input
                            type="text"
                            value={draft.promoPriceLabel}
                            onChange={(e) =>
                              updateDraftField(
                                srv,
                                'promoPriceLabel',
                                e.target.value
                              )
                            }
                            placeholder="e.g. £45 Intro Offer"
                            className="w-full px-3 py-2 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-xs text-[#382D28]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                            Treatment Duration
                          </label>
                          <input
                            type="text"
                            value={draft.durationLabel}
                            onChange={(e) =>
                              updateDraftField(
                                srv,
                                'durationLabel',
                                e.target.value
                              )
                            }
                            placeholder="e.g. 60 mins"
                            className="w-full px-3 py-2 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-xs text-[#382D28]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                            Optional Pricing Note
                          </label>
                          <input
                            type="text"
                            value={draft.pricingNotes}
                            onChange={(e) =>
                              updateDraftField(
                                srv,
                                'pricingNotes',
                                e.target.value
                              )
                            }
                            placeholder="e.g. Includes consultation & patch test"
                            className="w-full px-3 py-2 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-xs text-[#382D28]"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
