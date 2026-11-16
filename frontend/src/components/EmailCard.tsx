"use client";

import { useState } from "react";
import { requestOtp } from "@/lib/api";

interface EmailCardProps {
  onSubmit?: (email: string) => void;
}

export default function EmailCard({ onSubmit }: EmailCardProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Email address is required.");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await requestOtp(trimmedEmail);
      onSubmit?.(trimmedEmail);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to generate OTP. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-400 bg-white p-8 shadow-xl shadow-black-950/5">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-xl font-semibold text-black-900">
          Enter your email
        </h1>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider text-gray-700"
          >
            Email Address
          </label>
          <div className="relative mt-1.5">
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              disabled={isLoading}
              placeholder="you@example.com"
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-black-900 outline-none transition placeholder:text-black-400 disabled:opacity-60 ${error
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                }`}
            />
          </div>
          {error && (
            <p className="mt-1.5 text-xs text-red-500">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !email.trim()}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-50 hover:cursor-pointer"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <span>Sending OTP...</span>
            </span>
          ) : (
            <span>Send OTP</span>
          )}
        </button>
      </form>
    </div>
  );
}
