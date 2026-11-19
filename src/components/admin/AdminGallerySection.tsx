import React, { useState } from 'react';
import {
  Edit3,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Plus,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { uploadSalonImage } from '../../lib/imageUpload';
import type { GalleryCategory, GalleryItem } from '../../types/site';

const GALLERY_CATEGORIES: Array<Exclude<GalleryCategory, 'All'>> = [
  'Lashes',
  'Brows',
  'Facials & Skin',
  'Salon Environment',
  'Permanent Makeup',
];

interface GalleryFormState {
  id: string | null;
  title: string;
  category: Exclude<GalleryCategory, 'All'>;
  caption: string;
  itemType: 'standard' | 'before_after';
  image: string;
  beforeImage: string;
  imageAlt: string;
  visible: boolean;
}

const EMPTY_GALLERY_FORM: GalleryFormState = {
  id: null,
  title: '',
  category: 'Lashes',
  caption: '',
  itemType: 'standard',
  image: '',
  beforeImage: '',
  imageAlt: '',
  visible: true,
};

export function AdminGallerySection() {
  const { gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem } =
    useSite();

  const [categoryFilter, setCategoryFilter] = useState<GalleryCategory>('All');
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<GalleryFormState>(EMPTY_GALLERY_FORM);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingBefore, setUploadingBefore] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const visibleItems =
    categoryFilter === 'All'
      ? gallery
      : gallery.filter((g) => g.category === categoryFilter);

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    slot: 'main' | 'before'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg(null);
    if (slot === 'main') setUploadingMain(true);
    else setUploadingBefore(true);

    try {
      const res = await uploadSalonImage(file, 'gallery');
      setForm((prev) => ({
        ...prev,
        ...(slot === 'main'
          ? { image: res.url, imageAlt: prev.imageAlt || prev.title || file.name }
          : { beforeImage: res.url }),
      }));
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not upload photo.');
    } finally {
      if (slot === 'main') setUploadingMain(false);
      else setUploadingBefore(false);
    }
  };

  const openEdit = (item: GalleryItem) => {
    setForm({
      id: item.id,
      title: item.title,
      category: item.category,
      caption: item.caption,
      itemType: item.itemType,
      image: item.image,
      beforeImage: item.beforeImage ?? '',
      imageAlt: item.imageAlt,
      visible: item.visible,
    });
    setErrorMsg(null);
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (form.title.trim().length < 2) {
      setErrorMsg('Please enter an image title.');
      return;
    }
    if (!form.image) {
      setErrorMsg(
        form.itemType === 'before_after'
          ? 'Please upload the After photograph.'
          : 'Please upload a photograph.'
      );
      return;
    }
    if (form.itemType === 'before_after' && !form.beforeImage) {
      setErrorMsg('Please upload the Before photograph for a Before & After pair.');
      return;
    }

    setSaving(true);
    try {
      const payload: Omit<GalleryItem, 'id'> = {
        title: form.title.trim(),
        category: form.category,
        caption: form.caption.trim(),
        itemType: form.itemType,
        image: form.image,
        beforeImage:
          form.itemType === 'before_after' ? form.beforeImage : undefined,
        imageAlt: form.imageAlt.trim() || form.title.trim(),
        isPlaceholder: false,
        visible: form.visible,
      };

      if (form.id) {
        await updateGalleryItem(form.id, payload);
      } else {
        await addGalleryItem(payload);
      }
      setForm(EMPTY_GALLERY_FORM);
      setFormOpen(false);
    } catch {
      setErrorMsg('Could not save gallery item. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#A58A78] mb-1">
            Portfolio &amp; Results
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#382D28]">
            Gallery Management
          </h2>
        </div>
        <button
          type="button"
          onClick={() => {
            if (formOpen) {
              setFormOpen(false);
            } else {
              setForm(EMPTY_GALLERY_FORM);
              setErrorMsg(null);
              setFormOpen(true);
            }
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#C5A27E] text-white text-xs uppercase tracking-[0.14em] rounded-md hover:bg-[#b5916c] transition-colors cursor-pointer"
        >
          {formOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {formOpen ? 'Close Uploader' : 'Upload Photograph'}
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {(['All', ...GALLERY_CATEGORIES] as GalleryCategory[]).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 text-xs rounded-md border transition-colors cursor-pointer ${
              categoryFilter === cat
                ? 'bg-[#382D28] text-white border-[#382D28]'
                : 'bg-white text-[#6B5A50] border-[#E8D5CA] hover:border-[#C5A27E]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Upload / Edit Form */}
      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#E8D5CA] rounded-xl p-6 space-y-5"
        >
          <h3 className="font-serif text-2xl text-[#382D28] border-b border-[#F2E8DF] pb-3">
            {form.id ? 'Edit Gallery Item' : 'Upload New Gallery Photograph'}
          </h3>

          {errorMsg && (
            <div className="bg-[#FDF3F2] border border-[#E5B8B2] text-[#8A2C22] rounded-lg px-4 py-2.5 text-xs">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                Image Title *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="e.g. Classic Lash Transformation"
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                Gallery Category
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    category: e.target.value as Exclude<GalleryCategory, 'All'>,
                  }))
                }
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              >
                {GALLERY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
                Layout Type
              </label>
              <select
                value={form.itemType}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    itemType: e.target.value as 'standard' | 'before_after',
                  }))
                }
                className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
              >
                <option value="standard">Standard Salon / Treatment Photo</option>
                <option value="before_after">Before &amp; After Pair</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.12em] text-[#6B5A50] mb-1">
              Caption
            </label>
            <input
              type="text"
              value={form.caption}
              onChange={(e) =>
                setForm((p) => ({ ...p, caption: e.target.value }))
              }
              placeholder="Brief editorial caption for the public gallery"
              className="w-full px-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm"
            />
          </div>

          {/* Photo Upload Slots */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {form.itemType === 'before_after' && (
              <div className="bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-lg p-4 space-y-3">
                <p className="text-xs font-medium text-[#382D28]">
                  Before Photograph *
                </p>
                {form.beforeImage ? (
                  <div className="aspect-[4/3] rounded-md overflow-hidden border border-[#E8D5CA]">
                    <img
                      src={form.beforeImage}
                      alt="Before preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] rounded-md border border-dashed border-[#D6BFA9] flex flex-col items-center justify-center text-[#A58A78] text-xs">
                    <ImageIcon className="w-6 h-6 mb-1.5" />
                    No Before photo uploaded yet
                  </div>
                )}
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E8D5CA] rounded-md text-xs uppercase tracking-[0.12em] text-[#382D28] hover:border-[#C5A27E] cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-[#C5A27E]" />
                  {uploadingBefore ? 'Uploading...' : 'Upload Before Photo'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => void handleUpload(e, 'before')}
                    disabled={uploadingBefore}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            <div className="bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-lg p-4 space-y-3">
              <p className="text-xs font-medium text-[#382D28]">
                {form.itemType === 'before_after'
                  ? 'After Photograph *'
                  : 'Treatment / Studio Photograph *'}
              </p>
              {form.image ? (
                <div className="aspect-[4/3] rounded-md overflow-hidden border border-[#E8D5CA]">
                  <img
                    src={form.image}
                    alt="Gallery preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] rounded-md border border-dashed border-[#D6BFA9] flex flex-col items-center justify-center text-[#A58A78] text-xs">
                  <ImageIcon className="w-6 h-6 mb-1.5" />
                  No photograph selected yet
                </div>
              )}
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E8D5CA] rounded-md text-xs uppercase tracking-[0.12em] text-[#382D28] hover:border-[#C5A27E] cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-[#C5A27E]" />
                {uploadingMain
                  ? 'Uploading...'
                  : form.itemType === 'before_after'
                  ? 'Upload After Photo'
                  : 'Choose Photograph'}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => void handleUpload(e, 'main')}
                  disabled={uploadingMain}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <label className="inline-flex items-center gap-2 text-xs text-[#382D28] cursor-pointer">
              <input
                type="checkbox"
                checked={form.visible}
                onChange={(e) =>
                  setForm((p) => ({ ...p, visible: e.target.checked }))
                }
                className="accent-[#C5A27E]"
              />
              Visible on public Gallery page
            </label>
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
                disabled={saving || uploadingMain || uploadingBefore}
                className="px-6 py-2.5 bg-[#C5A27E] text-white text-xs uppercase tracking-[0.14em] rounded-md hover:bg-[#b5916c] disabled:opacity-60 cursor-pointer"
              >
                {saving ? 'Saving...' : form.id ? 'Update Item' : 'Publish to Gallery'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleItems.map((item) => (
          <div
            key={item.id}
            className={`bg-white border rounded-xl overflow-hidden flex flex-col ${
              item.visible ? 'border-[#E8D5CA]' : 'border-[#E8D5CA]/60 opacity-75'
            }`}
          >
            {item.itemType === 'before_after' && item.beforeImage ? (
              <div className="grid grid-cols-2 aspect-[4/3] bg-[#F2E8DF] relative">
                <div className="relative overflow-hidden border-r border-white">
                  <img
                    src={item.beforeImage}
                    alt={`Before - ${item.title}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-[#382D28]/80 text-white text-[10px] uppercase tracking-[0.12em] px-2 py-0.5 rounded-sm">
                    Before
                  </span>
                </div>
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={`After - ${item.title}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 bg-[#C5A27E] text-white text-[10px] uppercase tracking-[0.12em] px-2 py-0.5 rounded-sm">
                    After
                  </span>
                </div>
              </div>
            ) : (
              <div className="aspect-[4/3] bg-[#F2E8DF] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-[#A58A78]">
                    {item.category}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.1em] text-[#6B5A50]">
                    {item.visible ? 'Published' : 'Hidden'}
                  </span>
                </div>
                <h3 className="font-serif text-xl text-[#382D28]">
                  {item.title}
                </h3>
                {item.caption && (
                  <p className="text-xs text-[#6B5A50] mt-1 line-clamp-2">
                    {item.caption}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-[#F2E8DF]">
                <button
                  type="button"
                  title={item.visible ? 'Hide from public site' : 'Show on public site'}
                  onClick={() =>
                    void updateGalleryItem(item.id, { visible: !item.visible })
                  }
                  className="p-1.5 rounded border border-[#E8D5CA] text-[#6B5A50] hover:text-[#382D28] cursor-pointer"
                >
                  {item.visible ? (
                    <Eye className="w-3.5 h-3.5" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  title="Edit title & details"
                  onClick={() => openEdit(item)}
                  className="p-1.5 rounded border border-[#E8D5CA] text-[#6B5A50] hover:text-[#382D28] cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                {confirmDeleteId === item.id ? (
                  <button
                    type="button"
                    onClick={() => {
                      void deleteGalleryItem(item.id);
                      setConfirmDeleteId(null);
                    }}
                    className="px-2.5 py-1 bg-[#9B3B33] text-white text-[10px] uppercase tracking-[0.1em] rounded cursor-pointer"
                  >
                    Confirm
                  </button>
                ) : (
                  <button
                    type="button"
                    title="Delete photo"
                    onClick={() => setConfirmDeleteId(item.id)}
                    className="p-1.5 rounded border border-[#E8D5CA] text-[#A58A78] hover:text-[#9B3B33] cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
