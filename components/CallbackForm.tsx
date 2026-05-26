"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

// Matches the canonical primary CTA (see ui/cta-button.tsx) but as a real
// <button> for form submission.
const SUBMIT_BTN =
  "inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-px hover:bg-primary-700 hover:shadow-md active:translate-y-0 active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 sm:w-auto";

const FIELD =
  "w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200";
const FIELD_LABEL = "mb-1.5 block text-sm font-medium text-slate-700";

export function CallbackForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Demo site — no backend wired up yet. Validation is handled by the
    // browser (required / type=email / type=tel); on a valid submit we just
    // show the confirmation. Hook this up to an email/CRM endpoint later.
    setSubmitted(true);
  }

  return (
    <section id="contact" className="bg-stone-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
        {/* LEFT — owner welcome video + personal note. */}
        <FadeIn>
          <span className="inline-flex items-center rounded-full bg-white/60 px-3.5 py-1.5 text-xs font-semibold tracking-widest text-slate-600 ring-1 ring-inset ring-slate-900/10 backdrop-blur-md">
            A NOTE FROM THE OWNER
          </span>

          {/* Placeholder welcome video — swap src/poster for Ed's real clip. */}
          <video
            controls
            preload="metadata"
            poster="/images/hero-scene.jpg"
            className="mt-5 aspect-video w-full rounded-2xl border border-slate-200 bg-slate-900 object-cover shadow-sm"
          >
            <source src="/video/shingles.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
            Hi, I&apos;m Ed Bordi.
          </h2>
          <p className="mt-3 text-slate-600">
            When you reach out to Bordi &amp; Sons, you&apos;re not getting a
            call center — you&apos;re getting my family. I started this company
            to do roofing the honest way: premium materials, careful work, and
            straight answers. Leave your details and I&apos;ll personally make
            sure someone gets back to you. No pressure, no sales games — just
            neighbors helping neighbors keep a good roof overhead.
          </p>
          <div className="mt-5">
            <p className="font-semibold text-slate-900">Ed Bordi</p>
            <p className="text-sm text-slate-500">
              Owner &amp; Founder, Bordi &amp; Sons Roofing
            </p>
          </div>
        </FadeIn>

        {/* RIGHT — callback form. */}
        <FadeIn delay={0.1}>
          {submitted ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <CheckCircle2 className="mx-auto size-12 text-accent-700" />
              <h3 className="mt-4 text-2xl font-bold text-slate-900">
                Thanks — we&apos;ll be in touch.
              </h3>
              <p className="mx-auto mt-2 max-w-md text-slate-600">
                A member of the Bordi &amp; Sons team will reach out shortly to
                talk through what you&apos;re looking for.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <h3 className="text-2xl font-bold text-slate-900">
                Request a free callback
              </h3>
              <p className="mt-1.5 text-sm text-slate-600">
                Fill this out and a Bordi will call you back — no obligation.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="cb-first" className={FIELD_LABEL}>
                    First name
                  </label>
                  <input
                    id="cb-first"
                    name="firstName"
                    type="text"
                    required
                    autoComplete="given-name"
                    className={FIELD}
                  />
                </div>
                <div>
                  <label htmlFor="cb-last" className={FIELD_LABEL}>
                    Last name
                  </label>
                  <input
                    id="cb-last"
                    name="lastName"
                    type="text"
                    required
                    autoComplete="family-name"
                    className={FIELD}
                  />
                </div>
                <div>
                  <label htmlFor="cb-email" className={FIELD_LABEL}>
                    Email
                  </label>
                  <input
                    id="cb-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className={FIELD}
                  />
                </div>
                <div>
                  <label htmlFor="cb-phone" className={FIELD_LABEL}>
                    Phone
                  </label>
                  <input
                    id="cb-phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    className={FIELD}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="cb-address" className={FIELD_LABEL}>
                    Property address
                  </label>
                  <input
                    id="cb-address"
                    name="address"
                    type="text"
                    required
                    autoComplete="street-address"
                    className={FIELD}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="cb-message" className={FIELD_LABEL}>
                    What can we help you with?
                  </label>
                  <textarea
                    id="cb-message"
                    name="message"
                    rows={4}
                    placeholder="A few words about your roof or what you're looking for…"
                    className={`${FIELD} resize-y`}
                  />
                </div>
              </div>

              {/* A2P 10DLC SMS consent — explicit, unchecked by default, required. */}
              <label className="mt-6 flex items-start gap-3">
                <input
                  type="checkbox"
                  name="smsConsent"
                  required
                  className="mt-0.5 size-4 shrink-0 rounded border-slate-300 text-primary-600 focus:ring-2 focus:ring-primary-300"
                />
                <span className="text-xs leading-relaxed text-slate-500">
                  By checking this box, I agree to receive SMS text messages and
                  phone calls from Bordi &amp; Sons Roofing at the number
                  provided regarding my inquiry. Consent is not a condition of
                  purchase. Message and data rates may apply, and message
                  frequency varies. Reply STOP to opt out or HELP for help. See
                  our{" "}
                  <a href="#" className="font-medium text-slate-700 underline">
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a href="#" className="font-medium text-slate-700 underline">
                    Terms
                  </a>
                  .
                </span>
              </label>

              <div className="mt-7">
                <button type="submit" className={SUBMIT_BTN}>
                  Request My Callback
                </button>
              </div>
            </form>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
