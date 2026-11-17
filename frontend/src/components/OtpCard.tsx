import { useState } from "react";

interface OtpCardProps {
  email: string;
  onSuccess?: () => void;
  onBack?: () => void;
}

export default function OtpCard({ email, onSuccess, onBack }: OtpCardProps) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));

  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-400 bg-white p-8 shadow-xl shadow-black-950/5">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-xl font-semibold text-black-900">
          Enter verification code
        </h1>
      </div>

      <form className="mt-6 space-y-5">
        <div className="flex justify-between gap-2">
          {digits.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              className={`h-12 w-11 rounded-lg border bg-white text-center text-xl font-semibold text-black-900 outline-none transition disabled:opacity-60 border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`}
            />
          ))}
        </div>

        <button
          type="submit"
          className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>Verify OTP</span>
        </button>
      </form>
    </div>
  );
}
