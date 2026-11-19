import React, { useEffect, useState } from 'react';
import {
  Bell,
  Check,
  Info,
  Plus,
  Save,
  Star,
  Trash2,
  Upload,
} from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { uploadSalonImage } from '../../lib/imageUpload';
import type { BookingIntegrationMode, BusinessConfig } from '../../types/site';

export function AdminSettingsSection() {
  const {
    businessConfig,
    updateBusinessConfig,
    reviews,
    addVerifiedReview,
    toggleReviewPublished,
    deleteReview,
  } = useSite();

  const [form, setForm] = useState<BusinessConfig>(businessConfig);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Verified Review Publisher state
  const [reviewForm, setReviewForm] = useState({
    clientName: '',
    treatment: '',
    rating: 5,
    comment: '',
    dateLabel: '',
    verifiedSource: 'Google Review',
    published: true,
  });
  const [addingReview, setAddingReview] = useState(false);

  useEffect(() => {
    setForm(businessConfig);
  }, [businessConfig]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg(null);
    setUploadingLogo(true);
    try {
      const res = await uploadSalonImage(file, 'branding');
      setForm((prev) => ({ ...prev, logoUrl: res.url }));
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Logo upload failed.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSaving(true);
    try {
      await updateBusinessConfig({
        ...form,
        bookingUrlConfigured: form.bookingUrl.trim().length > 0,
        instagramConfigured: form.instagramUrl.trim().length > 0,
        reviewPlatformConfigured: form.reviewPlatformUrl.trim().length > 0,
      });
      setSavedNotice(true);
      window.setTimeout(() => setSavedNotice(false), 2500);
    } catch {
      setErrorMsg('Could not save business settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      reviewForm.clientName.trim().length < 2 ||
      reviewForm.comment.trim().length < 5
    ) {
      return;
    }
    setAddingReview(true);
    try {
      await addVerifiedReview({
        clientName: reviewForm.clientName.trim(),
        treatment: reviewForm.treatment.trim() || 'Beauty Treatment',
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim(),
        dateLabel:
          reviewForm.dateLabel.trim() ||
          new Date().toLocaleDateString('en-GB', {
            month: 'long',
            year: 'numeric',
          }),
        verifiedSource: reviewForm.verifiedSource.trim() || 'Verified Client',
        published: reviewForm.published,
      });
      setReviewForm({
        clientName: '',
        treatment: '',
        rating: 5,
        comment: '',
        dateLabel: '',
        verifiedSource: 'Google Review',
        published: true,
      });
    } finally {
      setAddingReview(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#A58A78] mb-1">
          Brand &amp; Operations
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-[#382D28]">
          Business Settings
        </h2>
        <p className="text-xs text-[#6B5A50] mt-1">
          Changes saved here sync directly to your public website header,
          footer, contact details, booking links and WhatsApp buttons.
        </p>
      </div>

      {errorMsg && (
        <div className="bg-[#FDF3F2] border border-[#E5B8B2] text-[#8A2C22] rounded-lg px-4 py-3 text-xs">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Identity & Logo */}
        <div className="bg-white border border-[#E8D5CA] rounded-xl p-6 space-y-5">
          <h3 className="font-serif text-2xl text-[#382D28] border-b border-[#F2E8DF] pb-3">
            Brand Identity &amp; Website Logo
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                Business Name *
              </label>
              <input
                type="text"
                required
                value={form.brandName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, brandName: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) =>
                  setForm((p) => ({ ...p, tagline: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
              Business Description
            </label>
            <textarea
              rows={3}
              value={form.businessDescription}
              onChange={(e) =>
                setForm((p) => ({ ...p, businessDescription: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-[#F8F3EE]/70 border border-[#E8D5CA] rounded-lg p-4">
            <div className="w-24 h-16 rounded-md bg-white border border-[#E8D5CA] flex items-center justify-center overflow-hidden shrink-0">
              {form.logoUrl ? (
                <img
                  src={form.logoUrl}
                  alt="Custom salon logo"
                  className="max-w-full max-h-full object-contain p-1"
                />
              ) : (
                <span className="text-[10px] uppercase tracking-[0.12em] text-[#A58A78] text-center px-2">
                  Default Crest
                </span>
              )}
            </div>
            <div className="space-y-2 flex-1">
              <p className="text-xs font-medium text-[#382D28]">
                Custom Website Logo (Optional)
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E8D5CA] rounded-md text-xs uppercase tracking-[0.12em] text-[#382D28] hover:border-[#C5A27E] cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-[#C5A27E]" />
                  {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleLogoUpload}
                    disabled={uploadingLogo}
                    className="hidden"
                  />
                </label>
                {form.logoUrl && (
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, logoUrl: '' }))}
                    className="text-xs text-[#9B3B33] hover:underline cursor-pointer"
                  >
                    Revert to Botanical Crest
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Details, Address & Opening Hours */}
        <div className="bg-white border border-[#E8D5CA] rounded-xl p-6 space-y-5">
          <h3 className="font-serif text-2xl text-[#382D28] border-b border-[#F2E8DF] pb-3">
            Contact Details, Studio Address &amp; Opening Hours
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={form.phoneDisplay}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phoneDisplay: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                WhatsApp Number
              </label>
              <input
                type="text"
                value={form.whatsappDigits}
                onChange={(e) =>
                  setForm((p) => ({ ...p, whatsappDigits: e.target.value }))
                }
                placeholder="+447405517720"
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50]">
                  Business Address
                </label>
                <label className="inline-flex items-center gap-1.5 text-[11px] text-[#382D28] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.addressConfirmed}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        addressConfirmed: e.target.checked,
                      }))
                    }
                    className="accent-[#C5A27E]"
                  />
                  Confirmed
                </label>
              </div>
              <input
                type="text"
                value={form.addressText}
                onChange={(e) =>
                  setForm((p) => ({ ...p, addressText: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50]">
                  Opening Hours
                </label>
                <label className="inline-flex items-center gap-1.5 text-[11px] text-[#382D28] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.openingHoursConfirmed}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        openingHoursConfirmed: e.target.checked,
                      }))
                    }
                    className="accent-[#C5A27E]"
                  />
                  Confirmed
                </label>
              </div>
              <input
                type="text"
                value={form.openingHoursText}
                onChange={(e) =>
                  setForm((p) => ({ ...p, openingHoursText: e.target.value }))
                }
                placeholder="e.g. Tue–Sat: 9:30 AM – 6:30 PM · Sun–Mon: Closed"
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              />
            </div>
          </div>
        </div>

        {/* Booking App & Social Links */}
        <div className="bg-white border border-[#E8D5CA] rounded-xl p-6 space-y-5">
          <h3 className="font-serif text-2xl text-[#382D28] border-b border-[#F2E8DF] pb-3">
            Booking Platform &amp; Social Links
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                External Booking Application URL
              </label>
              <input
                type="url"
                value={form.bookingUrl}
                onChange={(e) =>
                  setForm((p) => ({ ...p, bookingUrl: e.target.value }))
                }
                placeholder="https://your-booking-provider.com/richaas-beauty"
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                Booking Integration Mode
              </label>
              <select
                value={form.bookingIntegrationMode}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    bookingIntegrationMode: e.target
                      .value as BookingIntegrationMode,
                  }))
                }
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              >
                <option value="external_link">
                  External Booking Link (Recommended when provider has no API)
                </option>
                <option value="embedded_widget">
                  Supported Embedded Widget (Only if provider allows iframes)
                </option>
                <option value="api_ready">
                  API / Webhook Ready (Requires provider API credentials)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                value={form.instagramUrl}
                onChange={(e) =>
                  setForm((p) => ({ ...p, instagramUrl: e.target.value }))
                }
                placeholder="https://instagram.com/..."
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                Instagram Handle Label
              </label>
              <input
                type="text"
                value={form.instagramHandle}
                onChange={(e) =>
                  setForm((p) => ({ ...p, instagramHandle: e.target.value }))
                }
                placeholder="@richaasbeautyaesthetic"
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white border border-[#E8D5CA] rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#F2E8DF] pb-3">
            <Bell className="w-4 h-4 text-[#C5A27E]" />
            <h3 className="font-serif text-2xl text-[#382D28]">
              Notification Preferences
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <label className="inline-flex items-start gap-2.5 text-xs text-[#382D28] cursor-pointer">
              <input
                type="checkbox"
                checked={form.emailNotificationsEnabled}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    emailNotificationsEnabled: e.target.checked,
                  }))
                }
                className="accent-[#C5A27E] mt-0.5"
              />
              <span>
                <strong>Optional Email Notification Preference</strong>
                <span className="block text-[#6B5A50] mt-0.5">
                  Store your preferred alert address for new enquiries and
                  booking status changes.
                </span>
              </span>
            </label>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                Alert Recipient Email
              </label>
              <input
                type="email"
                value={form.notificationEmail}
                onChange={(e) =>
                  setForm((p) => ({ ...p, notificationEmail: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              />
            </div>
          </div>

          <div className="bg-[#F8F3EE] border border-[#E8D5CA] rounded-lg p-3.5 flex items-start gap-2.5 text-xs text-[#6B5A50]">
            <Info className="w-4 h-4 text-[#C5A27E] shrink-0 mt-0.5" />
            <p>
              In-dashboard notifications for new enquiries, newly recorded
              appointments, and status changes are active live. Automated
              outbound email, SMS, or WhatsApp dispatch requires connecting an
              external provider (such as Resend, SendGrid, or Twilio) via a
              server-side function.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || uploadingLogo}
            className={`inline-flex items-center gap-2 px-7 py-3 text-xs uppercase tracking-[0.16em] rounded-md transition-colors cursor-pointer ${
              savedNotice
                ? 'bg-[#2D6A4F] text-white'
                : 'bg-[#C5A27E] text-white hover:bg-[#b5916c]'
            } disabled:opacity-60`}
          >
            {savedNotice ? (
              <>
                <Check className="w-4 h-4" />
                Settings Saved Live
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {saving ? 'Saving Settings...' : 'Save Business Settings'}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Verified Client Reviews Publisher */}
      <div className="bg-white border border-[#E8D5CA] rounded-xl p-6 space-y-5">
        <div>
          <h3 className="font-serif text-2xl text-[#382D28]">
            Verified Client Reviews
          </h3>
          <p className="text-xs text-[#6B5A50] mt-1">
            Publish genuine, verified client testimonials to the public Reviews
            page. No placeholder or invented reviews are displayed by default.
          </p>
        </div>

        <form onSubmit={handleAddReview} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-lg p-4">
          <input
            type="text"
            required
            value={reviewForm.clientName}
            onChange={(e) =>
              setReviewForm((p) => ({ ...p, clientName: e.target.value }))
            }
            placeholder="Client Name *"
            className="px-3 py-2 bg-white border border-[#E8D5CA] rounded-md text-xs"
          />
          <input
            type="text"
            value={reviewForm.treatment}
            onChange={(e) =>
              setReviewForm((p) => ({ ...p, treatment: e.target.value }))
            }
            placeholder="Treatment Received"
            className="px-3 py-2 bg-white border border-[#E8D5CA] rounded-md text-xs"
          />
          <select
            value={reviewForm.rating}
            onChange={(e) =>
              setReviewForm((p) => ({ ...p, rating: Number(e.target.value) }))
            }
            className="px-3 py-2 bg-white border border-[#E8D5CA] rounded-md text-xs"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} Stars
              </option>
            ))}
          </select>
          <textarea
            rows={2}
            required
            value={reviewForm.comment}
            onChange={(e) =>
              setReviewForm((p) => ({ ...p, comment: e.target.value }))
            }
            placeholder="Verified client quote *"
            className="md:col-span-2 px-3 py-2 bg-white border border-[#E8D5CA] rounded-md text-xs"
          />
          <div className="flex flex-col justify-between gap-2">
            <input
              type="text"
              value={reviewForm.verifiedSource}
              onChange={(e) =>
                setReviewForm((p) => ({ ...p, verifiedSource: e.target.value }))
              }
              placeholder="Source (e.g. Google Review)"
              className="px-3 py-2 bg-white border border-[#E8D5CA] rounded-md text-xs"
            />
            <button
              type="submit"
              disabled={addingReview}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#382D28] text-white text-xs uppercase tracking-[0.12em] rounded-md hover:bg-[#4a3c36] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              {addingReview ? 'Adding...' : 'Add Verified Review'}
            </button>
          </div>
        </form>

        {reviews.length > 0 && (
          <div className="divide-y divide-[#F2E8DF]">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#382D28]">
                      {rev.clientName}
                    </p>
                    <span className="inline-flex items-center gap-0.5 text-[#C5A27E] text-xs">
                      <Star className="w-3 h-3 fill-current" />
                      {rev.rating}
                    </span>
                    <span className="text-[11px] text-[#A58A78]">
                      {rev.treatment} · {rev.verifiedSource}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B5A50] mt-1">{rev.comment}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => void toggleReviewPublished(rev.id)}
                    className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] rounded-md border cursor-pointer ${
                      rev.published
                        ? 'bg-[#E9F3EC] text-[#2D6A4F] border-[#C3DFCB]'
                        : 'bg-[#F8F3EE] text-[#6B5A50] border-[#E8D5CA]'
                    }`}
                  >
                    {rev.published ? 'Published' : 'Draft'}
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteReview(rev.id)}
                    className="p-1.5 text-[#A58A78] hover:text-[#9B3B33] cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
