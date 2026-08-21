import { Router } from "express";
import { generatePromptPayQR } from "../utils/promptpay";

const router = Router();

router.post("/qr", async (req, res) => {
    try {
        const { phone, amount } = req.body;

        if (!phone) {
            return res.status(400).json({
                message: "กรุณาระบุเบอร์ PromptPay"
            });
        }

        if (amount !== undefined && amount <= 0) {
            return res.status(400).json({
                message: "จำนวนเงินไม่ถูกต้อง"
            });
        }

        const qr = await generatePromptPayQR(
            phone,
            amount
        );

        res.json({
            success: true,
            qr
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "ไม่สามารถสร้าง QR ได้"
        });
    }
});

export default router;