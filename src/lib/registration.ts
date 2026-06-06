import { translations, type Language } from "@/lib/i18n";

export type ContactMethod = "Email" | "Phone" | "Either";

export const AGE_RANGES = ["18-24", "25-34", "35-44", "45-54", "55+"] as const;
export const CHILD_AGE_RANGES = ["0-4", "5-9", "10-14", "15-18", "19+"] as const;
export const CONTACT_METHODS: ContactMethod[] = ["Email", "Phone", "Either"];

export type RegistrationPayload = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  ageRange: string;
  childAgeRange: string;
  preferredContact: ContactMethod;
  comments: string;
  consentToContact: boolean;
};

export type RegistrationResult = {
  referenceId: string;
  message: string;
  duplicate: boolean;
};

export async function submitRegistration(
  payload: RegistrationPayload,
  language: Language
): Promise<RegistrationResult> {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ ...payload, language })
  });

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  const typedData = (typeof data === "object" && data !== null
    ? data
    : {}) as {
    referenceId?: string;
    message?: string;
    duplicate?: boolean;
    error?: string;
  };

  if (typedData.error) {
    throw new Error(typedData.error);
  }

  if (!response.ok || typeof data !== "object" || data === null) {
    throw new Error(
      `${translations[language].form.genericError} (HTTP ${response.status})`
    );
  }

  if (!typedData.referenceId) {
    throw new Error(translations[language].form.genericError);
  }

  return {
    referenceId: typedData.referenceId,
    message:
      typedData.message ??
      translations[language].form.successFallback,
    duplicate: Boolean(typedData.duplicate)
  };
}
