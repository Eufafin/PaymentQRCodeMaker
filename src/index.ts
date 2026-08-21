import express from "express";
import { generatePromptPayQR } from "./utils/promptpay";

const app = express();

app.get("/promptpay", async (req, res) => {
    try {
        const phone = req.query.phone as string;
        const amount = req.query.amount
            ? Number(req.query.amount)
            : undefined;

        if (!phone) {
            return res.status(400).json({
                message: "กรุณาระบุเบอร์โทรศัพท์"
            });
        }

        const qr = await generatePromptPayQR(phone, amount);

        res.json({
            phone,
            amount,
            qr
        });

    } catch (error) {
        res.status(500).json({
            message: "สร้าง QR ไม่สำเร็จ"
        });
    }
});

app.get("/promptpay/qr", async (req, res) => {
    try {
        const phone = req.query.phone as string;
        const amount = req.query.amount
            ? Number(req.query.amount)
            : undefined;

        if (!phone) {
            return res.status(400).send("กรุณาระบุ phone");
        }

        const qr = await generatePromptPayQR(phone, amount);

        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>PromptPay QR</title>
            </head>
            <body style="text-align:center;">
                <h2>PromptPay QR</h2>

                <img src="${qr}" width="300">

                <p>เบอร์: ${phone}</p>
                <p>จำนวนเงิน: ${amount ?? "ไม่ระบุ"}</p>
            </body>
            </html>`
        );

    } catch (error) {
        console.error(error);
        res.status(500).send("สร้าง QR ไม่สำเร็จ");
    }
});

app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});