import express from "express";
import { generateOtp } from "./otp.controller.js";

const router = express.Router();

router.post("/request", generateOtp);

export default router;
