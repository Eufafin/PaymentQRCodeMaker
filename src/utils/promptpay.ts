import QRCode from "qrcode";

function crc16(data: string): string {
    let crc = 0xFFFF;

    for (let i = 0; i < data.length; i++) {
        crc ^= data.charCodeAt(i) << 8;

        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) !== 0) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc <<= 1;
            }

            crc &= 0xFFFF;
        }
    }

    return crc.toString(16).toUpperCase().padStart(4, "0");
}

function field(id: string, value: string): string {
    return `${id}${value.length.toString().padStart(2, "0")}${value}`;
}

export function generatePromptPayPayload(
    phone: string,
    amount?: number
): string {

    // 0812345678 → 0066812345678
    const mobile = "0066" + phone.substring(1);

    const merchantAccount =
        field(
            "29",
            field("00", "A000000677010111") +
            field("01", mobile)
        );

    let payload =
        field("00", "01") +
        field("01", "12") +
        merchantAccount +
        field("53", "764");

    if (amount !== undefined) {
        payload += field("54", amount.toFixed(2));
    }

    payload += field("58", "TH");

    payload += "6304";

    const crc = crc16(payload);

    return payload + crc;
}

export async function generatePromptPayQR(
    phone: string,
    amount?: number
): Promise<string> {

    const payload = generatePromptPayPayload(phone, amount);

    return await QRCode.toDataURL(payload);
}