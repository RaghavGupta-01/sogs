"use client";

import { useState } from "react";
import EmailCard from "@/components/EmailCard";
import OtpCard from "@/components/OtpCard";

export default function Home() {
  const [step, setStep] = useState<"email" | "otp" | "success">("email");
  const [email, setEmail] = useState("");

  const handleEmailSubmitted = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setStep("otp");
  };

  const handleOtpVerified = () => {
    setStep("success");
  };

  const handleReset = () => {
    setEmail("");
    setStep("email");
  };

  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center p-4">
      {step === "email" && <EmailCard onSubmit={handleEmailSubmitted} />}

      {step === "otp" && (
        <OtpCard
          email={email}
          onSuccess={handleOtpVerified}
          onBack={() => setStep("email")}
        />
      )}

      {step === "success" && (
        <div className="w-full max-w-md rounded-2xl border border-gray-400 bg-white p-8 text-center shadow-xl shadow-black-950/5">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-black-900">
            Verification Successful
          </h1>
          <p className="mt-1.5 text-sm text-gray-600">
            Your email <span className="font-medium text-gray-900">{email}</span> has been verified.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 hover:cursor-pointer"
          >
            Start over
          </button>
        </div>
      )}
    </main>
  );
}
