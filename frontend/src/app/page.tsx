"use client";

import { useState } from "react";
import EmailCard from "@/components/EmailCard";
import OtpCard from "@/components/OtpCard";

export default function Home() {
  const [step, setStep] = useState<"email" | "otp">("otp");
  const [email, setEmail] = useState("");

  const handleEmailSubmitted = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setStep("otp");
  };

  const handleOtpVerified = () => {
    console.log("OTP Verified")
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

    </main>
  );
}
