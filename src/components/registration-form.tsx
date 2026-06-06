"use client";

import { FormEvent, useRef, useState } from "react";
import {
  AGE_RANGES,
  CHILD_AGE_RANGES,
  CONTACT_METHODS,
  submitRegistration,
  type RegistrationPayload
} from "@/lib/registration";
import { useLanguage } from "@/components/language-provider";

const initialFormState: RegistrationPayload = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  ageRange: "",
  childAgeRange: "",
  preferredContact: "Email",
  comments: "",
  consentToContact: false
};

type SubmissionState = {
  mode: "idle" | "success" | "error";
  message: string;
  referenceId?: string;
};

export function RegistrationForm() {
  const { direction, language, t } = useLanguage();
  const [formData, setFormData] = useState<RegistrationPayload>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lastSuccessfulFingerprint = useRef<string>("");
  const lastSuccessfulAt = useRef<number>(0);
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    mode: "idle",
    message: ""
  });

  function onFieldChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  function onConsentToggle(event: React.ChangeEvent<HTMLInputElement>) {
    setFormData((previous) => ({
      ...previous,
      consentToContact: event.target.checked
    }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionState({ mode: "idle", message: "" });

    const payloadFingerprint = JSON.stringify({
      ...formData,
      comments: formData.comments.trim()
    });
    const duplicateCooldownMs = 25000;

    if (
      payloadFingerprint === lastSuccessfulFingerprint.current &&
      Date.now() - lastSuccessfulAt.current < duplicateCooldownMs
    ) {
      setSubmissionState({
        mode: "error",
        message: t.form.duplicate
      });
      return;
    }

    if (!formData.consentToContact) {
      setSubmissionState({
        mode: "error",
        message: t.form.consentRequired
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await submitRegistration(formData, language);
      lastSuccessfulFingerprint.current = payloadFingerprint;
      lastSuccessfulAt.current = Date.now();
      setSubmissionState({
        mode: "success",
        message: result.message,
        referenceId: result.referenceId
      });
      setFormData(initialFormState);
    } catch (error) {
      console.error("[registration-form] Submission failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : t.form.genericError;
      setSubmissionState({
        mode: "error",
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div id="registration" className="registration-block">
      <div className="registration-form-header">
        <p className="eyebrow">{t.form.eyebrow}</p>
        <h3>{t.form.title}</h3>
        <p>{t.form.description}</p>
      </div>

      <form className="registration-form" onSubmit={onSubmit} noValidate>
          <div className="form-grid">
            <label>
              {t.form.fields.fullName}
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={onFieldChange}
                autoComplete="name"
                required
              />
            </label>

            <label>
              {t.form.fields.email}
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onFieldChange}
                autoComplete="email"
                dir="ltr"
                required
              />
            </label>

            <label>
              {t.form.fields.phone}
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={onFieldChange}
                autoComplete="tel"
                dir="ltr"
                required
              />
            </label>

            <label>
              {t.form.fields.city}
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={onFieldChange}
                autoComplete="address-level2"
                required
              />
            </label>

            <label>
              {t.form.fields.ageRange}
              <select
                name="ageRange"
                value={formData.ageRange}
                onChange={onFieldChange}
                required
              >
                <option value="">{t.form.placeholders.select}</option>
                {AGE_RANGES.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </label>

            <label>
              {t.form.fields.childAgeRange}
              <select
                name="childAgeRange"
                value={formData.childAgeRange}
                onChange={onFieldChange}
                required
              >
                <option value="">{t.form.placeholders.select}</option>
                {CHILD_AGE_RANGES.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <fieldset className="contact-method-fieldset">
            <legend>{t.form.fields.preferredContact}</legend>
            <div className="radio-row">
              {CONTACT_METHODS.map((option) => (
                <label key={option} className="radio-option">
                  <input
                    type="radio"
                    name="preferredContact"
                    value={option}
                    checked={formData.preferredContact === option}
                    onChange={onFieldChange}
                  />
                  {t.form.contactMethods[option]}
                </label>
              ))}
            </div>
          </fieldset>

          <label>
            {t.form.fields.comments}
            <textarea
              name="comments"
              rows={4}
              value={formData.comments}
              onChange={onFieldChange}
              placeholder={t.form.placeholders.comments}
              dir={direction}
            />
          </label>

          <label className="checkbox-row consent-callout">
            <input
              type="checkbox"
              name="consentToContact"
              checked={formData.consentToContact}
              onChange={onConsentToggle}
              aria-describedby="consent-helper"
            />
            <span className="consent-copy">
              <span className="consent-title">{t.form.consentTitle}</span>
              <span id="consent-helper" className="consent-helper">
                {t.form.consentHelper}
              </span>
            </span>
          </label>

          <button className="btn primary submit-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? t.form.submitting : t.form.submit}
          </button>

          {submissionState.mode !== "idle" && (
            <p
              className={
                submissionState.mode === "success"
                  ? "submission-message success"
                  : "submission-message error"
              }
              role="status"
              aria-live="polite"
            >
              {submissionState.message}
              {submissionState.referenceId
                ? ` ${t.form.referenceId}: ${submissionState.referenceId}`
                : null}
            </p>
          )}
      </form>
    </div>
  );
}
