"use client";

import { RegistrationForm } from "@/components/registration-form";

export function ParticipationRegistrationSection() {
  return (
    <section id="participation-registration" className="section participation-section">
      <div className="container participation-layout">
        <RegistrationForm />
      </div>
    </section>
  );
}
