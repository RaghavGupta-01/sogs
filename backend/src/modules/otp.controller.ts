import type { Request, Response } from "express";
import * as otpService from "./otp.service.js";

export const generateOtp = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        await otpService.generateOtp(email);

        return res.status(200).json({
            success: true,
            message: "OTP generated successfully"
        });
    } catch (error) {
        console.error("Error generating OTP:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to generate OTP"
        });
    }
};

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;

        const isValid = await otpService.verifyOtp(email, otp);

        if (!isValid) {
            return res.status(400).json({
                success: false,
                error: "Invalid or expired OTP"
            });
        }

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to verify OTP"
        });
    }
};
