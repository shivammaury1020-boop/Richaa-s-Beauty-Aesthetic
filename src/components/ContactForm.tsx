import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import {
  ContactFormInput,
  validateContactForm,
} from '../utils/siteLogic';

interface ContactFormProps {
  preselectedTreatment?: string;
}

export function ContactForm({ preselectedTreatment }: ContactFormProps) {
  const { services, submitEnquiry } = useSite();
  const activeServices = services.filter((s) => s.active);

  const [form, setForm] = useState<ContactFormInput>({
    fullName: '',
    email: '',
    phone: '',
    treatmentInterest: preselectedTreatment || '',
    message: '',
    consent: false,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormInput, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedName, setSubmittedName] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedTreatment) {
      setForm((prev) => ({ ...prev, treatmentInterest: preselectedTreatment }));
    }
  }, [preselectedTreatment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const validation = validateContactForm(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const saved = await submitEnquiry(form);
      setSubmittedName(saved.fullName);
      setForm({
        fullName: '',
        email: '',
        phone: '',
        treatmentInterest: '',
        message: '',
        consent: false,
      });
    } catch {
      setSubmitError(
        'We could not submit your enquiry right now. Please try again or reach us directly on WhatsApp or by telephone.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedName) {
    return (
      <div
        className="bg-[#FFFFFF] border border-[#E8D5CA] rounded-[12px] p-8 sm:p-10 text-center space-y-4 animate-luxury-fade"
        role="status"
      >
        <div className="w-12 h-12 rounded-full bg-[#F2E8DF] border border-[#E8D5CA] flex items-center justify-center mx-auto text-[#C5A27E]">
          <CheckCircle2 className="w-6 h-6" strokeWidth={1.6} />
        </div>
        <h3 className="font-serif text-[28px] text-[#382D28]">
          Thank You, {submittedName}
        </h3>
        <p className="text-[14px] leading-relaxed text-[#5A4A42] max-w-md mx-auto">
          Your enquiry has been received by Richaa&apos;s Beauty &amp; Aesthetic.
          We will respond personally as soon as possible.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setSubmittedName(null)}
            className="px-6 py-2.5 text-[13px] font-medium text-[#382D28] bg-[#F8F3EE] border border-[#E8D5CA] hover:bg-[#F2E8DF] rounded-[4px] transition-colors cursor-pointer"
          >
            Send Another Enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-[#FFFFFF] border border-[#E8D5CA] rounded-[12px] p-6 sm:p-8 lg:p-10 space-y-5"
    >
      <div>
        <h3 className="font-serif text-[28px] text-[#382D28] leading-snug">
          Send an Enquiry
        </h3>
        <p className="mt-1 text-[14px] text-[#5A4A42]">
          Have a question about a treatment or suitability? Share a few details
          below and Richaa will get back to you.
        </p>
      </div>

      {submitError && (
        <div
          role="alert"
          className="bg-[#FDF3F2] border border-[#E5B8B2] text-[#8A2C22] rounded-[6px] px-4 py-3 text-[13px]"
        >
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="contact-fullName"
            className="block text-[13px] font-medium text-[#382D28] mb-1.5"
          >
            Full Name <span className="text-[#A58A78]">*</span>
          </label>
          <input
            id="contact-fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            value={form.fullName}
            onChange={(e) => {
              setForm({ ...form, fullName: e.target.value });
              if (errors.fullName) setErrors({ ...errors, fullName: undefined });
            }}
            placeholder="Your full name"
            aria-invalid={Boolean(errors.fullName)}
            className={`w-full px-4 py-3 text-[14px] bg-[#F8F3EE]/60 border rounded-[4px] text-[#382D28] placeholder:text-[#A58A78]/80 focus:outline-none focus:bg-[#FFFFFF] focus:border-[#C5A27E] transition-colors ${
              errors.fullName ? 'border-[#9B4D42]' : 'border-[#E8D5CA]'
            }`}
          />
          {errors.fullName && (
            <p className="mt-1.5 text-[12px] text-[#9B4D42]" role="alert">
              {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="block text-[13px] font-medium text-[#382D28] mb-1.5"
          >
            Email Address <span className="text-[#A58A78]">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: undefined });
            }}
            placeholder="you@example.co.uk"
            aria-invalid={Boolean(errors.email)}
            className={`w-full px-4 py-3 text-[14px] bg-[#F8F3EE]/60 border rounded-[4px] text-[#382D28] placeholder:text-[#A58A78]/80 focus:outline-none focus:bg-[#FFFFFF] focus:border-[#C5A27E] transition-colors ${
              errors.email ? 'border-[#9B4D42]' : 'border-[#E8D5CA]'
            }`}
          />
          {errors.email && (
            <p className="mt-1.5 text-[12px] text-[#9B4D42]" role="alert">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="contact-phone"
            className="block text-[13px] font-medium text-[#382D28] mb-1.5"
          >
            Telephone Number
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => {
              setForm({ ...form, phone: e.target.value });
              if (errors.phone) setErrors({ ...errors, phone: undefined });
            }}
            placeholder="+44 7..."
            aria-invalid={Boolean(errors.phone)}
            className={`w-full px-4 py-3 text-[14px] bg-[#F8F3EE]/60 border rounded-[4px] text-[#382D28] placeholder:text-[#A58A78]/80 focus:outline-none focus:bg-[#FFFFFF] focus:border-[#C5A27E] transition-colors ${
              errors.phone ? 'border-[#9B4D42]' : 'border-[#E8D5CA]'
            }`}
          />
          {errors.phone && (
            <p className="mt-1.5 text-[12px] text-[#9B4D42]" role="alert">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="contact-treatment"
            className="block text-[13px] font-medium text-[#382D28] mb-1.5"
          >
            Treatment of Interest
          </label>
          <select
            id="contact-treatment"
            name="treatmentInterest"
            value={form.treatmentInterest}
            onChange={(e) =>
              setForm({ ...form, treatmentInterest: e.target.value })
            }
            className="w-full px-4 py-3 text-[14px] bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-[4px] text-[#382D28] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#C5A27E] transition-colors"
          >
            <option value="">General Enquiry</option>
            {activeServices.map((srv) => (
              <option key={srv.id} value={srv.name}>
                {srv.name} ({srv.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="block text-[13px] font-medium text-[#382D28] mb-1.5"
        >
          Your Message <span className="text-[#A58A78]">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          required
          value={form.message}
          onChange={(e) => {
            setForm({ ...form, message: e.target.value });
            if (errors.message) setErrors({ ...errors, message: undefined });
          }}
          placeholder="Tell us which treatment you are considering or any questions you have..."
          aria-invalid={Boolean(errors.message)}
          className={`w-full px-4 py-3 text-[14px] bg-[#F8F3EE]/60 border rounded-[4px] text-[#382D28] placeholder:text-[#A58A78]/80 focus:outline-none focus:bg-[#FFFFFF] focus:border-[#C5A27E] transition-colors resize-y ${
            errors.message ? 'border-[#9B4D42]' : 'border-[#E8D5CA]'
          }`}
        />
        {errors.message && (
          <p className="mt-1.5 text-[12px] text-[#9B4D42]" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            id="contact-consent"
            type="checkbox"
            checked={form.consent}
            onChange={(e) => {
              setForm({ ...form, consent: e.target.checked });
              if (errors.consent) setErrors({ ...errors, consent: undefined });
            }}
            className="mt-1 w-4 h-4 rounded border-[#C5A27E] accent-[#C5A27E] shrink-0"
          />
          <span className="text-[13px] leading-relaxed text-[#5A4A42]">
            I consent to Richaa&apos;s Beauty &amp; Aesthetic contacting me in
            response to this enquiry in accordance with the Privacy Policy.
          </span>
        </label>
        {errors.consent && (
          <p className="mt-1.5 text-[12px] text-[#9B4D42]" role="alert">
            {errors.consent}
          </p>
        )}
      </div>

      <div className="pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[14px] font-medium tracking-[0.03em] text-white bg-[#C5A27E] hover:bg-[#B28E68] disabled:opacity-70 rounded-[4px] transition-colors cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sending Enquiry...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" strokeWidth={1.6} />
              <span>Send Enquiry</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
