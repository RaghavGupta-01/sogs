const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function requestOtp(email: string): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/api/otp/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data: ApiResponse = await response.json().catch(() => ({
    success: false,
    error: "Invalid response from server",
  }));

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to generate OTP");
  }

  return data;
}

export async function verifyOtp(email: string, otp: string): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/api/otp/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });

  const data: ApiResponse = await response.json().catch(() => ({
    success: false,
    error: "Invalid response from server",
  }));

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to verify OTP");
  }

  return data;
}