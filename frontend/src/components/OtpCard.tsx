"use client"
import { useState, useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { verifyOtp } from "@/lib/api";

interface OtpCardProps {
  email: string;
  onSuccess?: () => void;
  onBack?: () => void;
}

export default function OtpCard({ email, onSuccess, onBack }: OtpCardProps) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const otpValue = digits.join("");
  const isComplete = otpValue.length === 6;

  const handleChange = (index: number, value: string) => {
    const numericChar = value.replace(/\D/g, "").slice(-1);

    const nextDigits = [...digits];
    nextDigits[index] = numericChar;
    setDigits(nextDigits);

    if (error) setError(null);

    if (numericChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        const nextDigits = [...digits];
        nextDigits[index - 1] = "";
        setDigits(nextDigits);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);

    if (!pastedData) return;

    const nextDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      nextDigits[i] = pastedData[i] || "";
    }
    setDigits(nextDigits);

    if (error) setError(null);

    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async (e?: React.SubmitEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!isComplete || isLoading) return;

    setError(null);
    setIsLoading(true);

    try {
      await verifyOtp(email, otpValue);
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid or expired OTP. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-400 bg-white p-8 shadow-xl shadow-black-950/5">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-xl font-semibold text-black-900">
          Enter verification code
        </h1>
        {email && (
          <p className="mt-1.5 text-sm text-gray-600">
            Sent to <span className="font-medium text-gray-900">{email}</span>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="ml-2 text-xs text-blue-600 hover:underline hover:cursor-pointer"
              >
                Change
              </button>
            )}
          </p>
        )}
      </div>

      <form onSubmit={handleVerify} className="mt-6 space-y-5">
        <div className="flex justify-between gap-2">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              disabled={isLoading}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`h-12 w-11 rounded-lg border bg-white text-center text-xl font-semibold text-black-900 outline-none transition disabled:opacity-60 ${
                error
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-center text-xs text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!isComplete || isLoading}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-50 hover:cursor-pointer"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <span>Verifying OTP...</span>
            </span>
          ) : (
            <span>Verify OTP</span>
          )}
        </button>
      </form>
    </div>
  );
}
