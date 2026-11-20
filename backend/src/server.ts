import express, { type Request, type Response } from "express";
import cors from "cors";
import otpRoutes from "./modules/otp.routes.js";
import "./infrastructure/queue/email.worker.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/otp", otpRoutes);

app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({
        status: "ok",
    });
});

app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
        message: "SOGS Backend API",
        status: "ok",
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
