import express from "express";
import { generateOtp, verifyOtp } from "./otp.controller.js";

const router = express.Router();

router.post("/request", generateOtp);

router.post("/verify", verifyOtp);

export default router;
