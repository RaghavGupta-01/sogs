import type { Request, Response } from "express";
import * as otpService from "./otp.service.js";

export const generateOtp = async (req: Request, res: Response) => {
    const email = req.body.email;

    const getOtp = await otpService.generateOtp(email);

    res.status(200).json({
        success: true,
        active: true
    });
};

export const verifyOtp = async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    const isValid = await otpService.verifyOtp(email, otp);

    return res.status(200).json({
        success: true,
        message: "OTP verified successfully"
    })
}



