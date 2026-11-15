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
