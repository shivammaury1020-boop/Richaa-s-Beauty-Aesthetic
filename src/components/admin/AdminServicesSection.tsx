import React, { useMemo, useState } from 'react';
import {
  Edit3,
  Eye,
  EyeOff,
  Plus,
  Star,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { BRAND_IMAGES } from '../../data/initialData';
import { uploadSalonImage } from '../../lib/imageUpload';
import type {
  AdminServiceCategory,
  ServiceIconKey,
  TreatmentService,
} from '../../types/site';
import {
  ADMIN_SERVICE_CATEGORIES,
  formatServicePrice,
  mapServiceGroupToPricingCategory,
  slugifyTreatmentName,
} from '../../utils/siteLogic';

interface ServiceFormState {
  id: string | null;
  name: string;
  serviceGroup: AdminServiceCategory;
  shortDescription: string;
  fullDescription: string;
  priceLabel: string;
  durationLabel: string;
  image: string;
  imageAlt: string;
  icon: ServiceIconKey;
  featured: boolean;
  active: boolean;
}

const EMPTY_FORM: ServiceFormState = {
  id: null,
  name: '',
  serviceGroup: 'Eyelash Extensions',
  shortDescription: '',
  fullDescription: '',
  priceLabel: '',
  durationLabel: '',
  image: BRAND_IMAGES.lashes,
  imageAlt: '',
  icon: 'sparkles',
  featured: false,
  active: true,
};

export function AdminServicesSection() {
  const { services, createService, updateService, deleteService } = useSite();

  const [categoryFilter, setCategoryFilter] = useState<
    AdminServiceCategory | 'All'
  >('All');
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<ServiceFormState>(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredServices = useMemo(() => {
    if (categoryFilter === 'All') return services;
    return services.filter((s) => s.serviceGroup === categoryFilter);
  }, [services, categoryFilter]);

  const openCreateForm = () => {
    setForm(EMPTY_FORM);
    setErrorMsg(null);
    setFormOpen(true);
  };

  const openEditForm = (srv: TreatmentService) => {
    setForm({
      id: srv.id,
      name: srv.name,
      serviceGroup: srv.serviceGroup,
      shortDescription: srv.shortDescription,
      fullDescription: srv.fullDescription,
      priceLabel: srv.priceLabel ?? '',
      durationLabel: srv.durationLabel ?? '',
      image: srv.image,
      imageAlt: srv.imageAlt,
      icon: srv.icon,
      featured: srv.featured,
      active: srv.active,
    });
    setErrorMsg(null);
    setFormOpen(true);
  };

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg(null);
    setUploading(true);
    try {
      const result = await uploadSalonImage(file, 'services');
      setForm((prev) => ({
        ...prev,
        image: result.url,
        imageAlt: prev.imageAlt || prev.name || file.name,
      }));
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (form.name.trim().length < 2) {
      setErrorMsg('Please enter a service name.');
      return;
    }
    if (form.shortDescription.trim().length < 5) {
      setErrorMsg('Please enter a brief service summary.');
      return;
    }

    setSaving(true);
    try {
      const category = mapServiceGroupToPricingCategory(form.serviceGroup);
      if (form.id) {
        await updateService(form.id, {
          name: form.name.trim(),
          slug: slugifyTreatmentName(form.name),
          category,
          serviceGroup: form.serviceGroup,
          shortDescription: form.shortDescription.trim(),
          fullDescription:
            form.fullDescription.trim() || form.shortDescription.trim(),
          priceLabel: form.priceLabel.trim() || null,
          durationLabel: form.durationLabel.trim() || null,
          image: form.image,
          imageAlt: form.imageAlt.trim() || form.name.trim(),
          icon: form.icon,
          featured: form.featured,
          active: form.active,
        });
      } else {
        await createService({
          slug: slugifyTreatmentName(form.name),
          name: form.name.trim(),
          category,
          serviceGroup: form.serviceGroup,
          shortDescription: form.shortDescription.trim(),
          fullDescription:
            form.fullDescription.trim() || form.shortDescription.trim(),
          benefits: [
            'Personalised consultation tailored to your natural features',
            'Delivered in a calm, hygienic luxury treatment suite',
          ],
          treatmentSteps: [
            'Personalised pre-treatment consultation',
            'Careful treatment delivery with attention to detail',
            'Tailored aftercare guidance',
          ],
          aftercareNotes: [
            'Follow the bespoke aftercare advice provided at your appointment.',
          ],
          image: form.image || BRAND_IMAGES.facial,
          imageAlt: form.imageAlt.trim() || form.name.trim(),
          icon: form.icon,
          priceLabel: form.priceLabel.trim() || null,
          promoPriceLabel: null,
          durationLabel: form.durationLabel.trim() || null,
          pricingNotes: null,
          featured: form.featured,
          active: form.active,
          sortOrder: services.length + 1,
        });
      }
      setFormOpen(false);
    } catch {
      setErrorMsg('Could not save service. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#A58A78] mb-1">
            Treatment Menu
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#382D28]">
            Services Management
          </h2>
        </div>
        <button
          type="button"
          onClick={formOpen ? () => setFormOpen(false) : openCreateForm}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#C5A27E] text-white text-xs uppercase tracking-[0.14em] rounded-md hover:bg-[#b5916c] transition-colors cursor-pointer"
        >
          {formOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {formOpen ? 'Close Editor' : 'Add New Service'}
        </button>
      </div>

      {/* Category Filter Bar covering all 10 categories */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategoryFilter('All')}
          className={`px-3 py-1.5 text-xs rounded-md border transition-colors cursor-pointer ${
            categoryFilter === 'All'
              ? 'bg-[#382D28] text-white border-[#382D28]'
              : 'bg-white text-[#6B5A50] border-[#E8D5CA] hover:border-[#C5A27E]'
          }`}
        >
          All ({services.length})
        </button>
        {ADMIN_SERVICE_CATEGORIES.map((cat) => {
          const count = services.filter((s) => s.serviceGroup === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs rounded-md border transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#C5A27E] text-white border-[#C5A27E]'
                  : 'bg-white text-[#6B5A50] border-[#E8D5CA] hover:border-[#C5A27E]'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Add / Edit Service Form */}
      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#E8D5CA] rounded-xl p-6 space-y-5"
        >
          <h3 className="font-serif text-2xl text-[#382D28] border-b border-[#F2E8DF] pb-3">
            {form.id ? `Edit Service: ${form.name}` : 'Add New Treatment Service'}
          </h3>

          {errorMsg && (
            <div className="bg-[#FDF3F2] border border-[#E5B8B2] text-[#8A2C22] rounded-lg px-4 py-2.5 text-xs">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                Service Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Russian Volume Eyelash Extensions"
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                Service Category *
              </label>
              <select
                value={form.serviceGroup}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    serviceGroup: e.target.value as AdminServiceCategory,
                  }))
                }
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              >
                {ADMIN_SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                Price (Leave blank for &ldquo;Price information coming soon.&rdquo;)
              </label>
              <input
                type="text"
                value={form.priceLabel}
                onChange={(e) =>
                  setForm((p) => ({ ...p, priceLabel: e.target.value }))
                }
                placeholder="e.g. £55 or From £45"
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                Treatment Duration (Optional)
              </label>
              <input
                type="text"
                value={form.durationLabel}
                onChange={(e) =>
                  setForm((p) => ({ ...p, durationLabel: e.target.value }))
                }
                placeholder="e.g. 60 mins"
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
              Short Summary *
            </label>
            <textarea
              rows={2}
              required
              value={form.shortDescription}
              onChange={(e) =>
                setForm((p) => ({ ...p, shortDescription: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
              Full Treatment Description
            </label>
            <textarea
              rows={3}
              value={form.fullDescription}
              onChange={(e) =>
                setForm((p) => ({ ...p, fullDescription: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
            />
          </div>

          {/* Service Image Upload */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-lg p-4">
            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#F2E8DF] border border-[#E8D5CA]">
              {form.image ? (
                <img
                  src={form.image}
                  alt={form.imageAlt || form.name}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
            <div className="md:col-span-2 space-y-3">
              <p className="text-xs font-medium text-[#382D28]">
                Service Photograph
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E8D5CA] rounded-md text-xs uppercase tracking-[0.12em] text-[#382D28] hover:border-[#C5A27E] cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-[#C5A27E]" />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageFile}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] text-[#A58A78]">
                  JPG, PNG or WebP up to 5 MB
                </span>
              </div>
              <input
                type="text"
                value={form.imageAlt}
                onChange={(e) =>
                  setForm((p) => ({ ...p, imageAlt: e.target.value }))
                }
                placeholder="Image description (alt text)"
                className="w-full px-3 py-2 bg-white border border-[#E8D5CA] rounded-md text-xs"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap items-center gap-6">
              <label className="inline-flex items-center gap-2 text-xs text-[#382D28] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, active: e.target.checked }))
                  }
                  className="accent-[#C5A27E]"
                />
                Active (visible on public website)
              </label>
              <label className="inline-flex items-center gap-2 text-xs text-[#382D28] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, featured: e.target.checked }))
                  }
                  className="accent-[#C5A27E]"
                />
                Featured on Homepage
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="px-4 py-2.5 bg-[#F8F3EE] border border-[#E8D5CA] text-xs uppercase tracking-[0.14em] rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || uploading}
                className="px-6 py-2.5 bg-[#C5A27E] text-white text-xs uppercase tracking-[0.14em] rounded-md hover:bg-[#b5916c] disabled:opacity-60 cursor-pointer"
              >
                {saving ? 'Saving...' : form.id ? 'Update Service' : 'Create Service'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className={`bg-white border rounded-xl p-4 flex gap-4 ${
              srv.active ? 'border-[#E8D5CA]' : 'border-[#E8D5CA]/60 opacity-75'
            }`}
          >
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-[#F2E8DF] shrink-0">
              <img
                src={srv.image}
                alt={srv.imageAlt}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.14em] text-[#A58A78]">
                      {srv.serviceGroup}
                    </p>
                    <h3 className="font-serif text-xl text-[#382D28] leading-snug">
                      {srv.name}
                    </h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] rounded-sm shrink-0 ${
                      srv.active
                        ? 'bg-[#E9F3EC] text-[#2D6A4F]'
                        : 'bg-[#F2E8DF] text-[#6B5A50]'
                    }`}
                  >
                    {srv.active ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <p className="text-xs text-[#6B5A50] line-clamp-2 mt-1">
                  {srv.shortDescription}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-2 border-t border-[#F2E8DF]">
                <span className="text-xs font-medium text-[#382D28]">
                  {formatServicePrice(srv.priceLabel)}
                  {srv.durationLabel ? ` · ${srv.durationLabel}` : ''}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    title={srv.featured ? 'Remove from Homepage' : 'Feature on Homepage'}
                    onClick={() =>
                      void updateService(srv.id, { featured: !srv.featured })
                    }
                    className={`p-1.5 rounded border transition-colors cursor-pointer ${
                      srv.featured
                        ? 'bg-[#FBF3E4] border-[#EAD4AE] text-[#C5A27E]'
                        : 'border-[#E8D5CA] text-[#A58A78] hover:text-[#382D28]'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title={srv.active ? 'Deactivate service' : 'Activate service'}
                    onClick={() =>
                      void updateService(srv.id, { active: !srv.active })
                    }
                    className="p-1.5 rounded border border-[#E8D5CA] text-[#6B5A50] hover:text-[#382D28] cursor-pointer"
                  >
                    {srv.active ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    title="Edit service"
                    onClick={() => openEditForm(srv)}
                    className="p-1.5 rounded border border-[#E8D5CA] text-[#6B5A50] hover:text-[#382D28] cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  {confirmDeleteId === srv.id ? (
                    <button
                      type="button"
                      onClick={() => {
                        void deleteService(srv.id);
                        setConfirmDeleteId(null);
                      }}
                      className="px-2 py-1 bg-[#9B3B33] text-white text-[10px] uppercase tracking-[0.1em] rounded cursor-pointer"
                    >
                      Confirm
                    </button>
                  ) : (
                    <button
                      type="button"
                      title="Delete service"
                      onClick={() => setConfirmDeleteId(srv.id)}
                      className="p-1.5 rounded border border-[#E8D5CA] text-[#A58A78] hover:text-[#9B3B33] cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
