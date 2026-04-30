import crypto from "crypto";

export const getDokuConfig = () => ({
    clientId: (process.env.DOKU_CLIENT_ID || "").trim(),
    secretKey: (process.env.DOKU_SECRET_KEY || "").trim(),
    isProduction: process.env.DOKU_IS_PRODUCTION === "true",
    baseUrl: process.env.DOKU_IS_PRODUCTION === "true" 
        ? "https://api.doku.com" 
        : "https://api-sandbox.doku.com"
});

export function generateDokuSignature(payload: any, requestId: string, timestamp: string) {
    const config = getDokuConfig();
    const targetPath = "/checkout/v1/payment"; // Example for checkout
    const digest = crypto
        .createHash("sha256")
        .update(JSON.stringify(payload))
        .digest("base64");

    const signatureComponents = [
        `Client-Id:${config.clientId}`,
        `Request-Id:${requestId}`,
        `Request-Timestamp:${timestamp}`,
        `Request-Target:${targetPath}`,
        `Digest:${digest}`
    ];

    const signatureString = signatureComponents.join("\n");
    
    return crypto
        .createHmac("sha256", config.secretKey)
        .update(signatureString)
        .digest("base64");
}

export async function createDokuCheckout(params: {
    orderId: string;
    amount: number;
    customer: {
        name: string;
        email: string;
        phone: string;
    };
    items: any[];
}) {
    const requestId = crypto.randomUUID();
    const timestamp = new Date().toISOString().slice(0, 19) + "Z";
    
    const sanitizeStr = (str: string) => str ? str.replace(/[^a-zA-Z0-9 .\-\/\+,=_:'@%]/g, "").trim() : "";

    const payload = {
        order: {
            amount: params.amount,
            invoice_number: params.orderId,
            currency: "IDR",
            callback_url: `${process.env.NEXTAUTH_URL}/pesanan`,
            line_items: params.items.map(item => ({
                name: sanitizeStr(item.name),
                price: item.price,
                quantity: item.quantity
            }))
        },
        payment: {
            payment_due_date: 60 // 60 minutes
        },
        customer: {
            id: sanitizeStr(params.customer.email),
            name: sanitizeStr(params.customer.name),
            email: sanitizeStr(params.customer.email),
            phone: sanitizeStr(params.customer.phone)
        }
    };

    const config = getDokuConfig();
    const signature = generateDokuSignature(payload, requestId, timestamp);

    console.log("=== DOKU DEBUG ===");
    console.log("Client ID:", config.clientId);
    console.log("Base URL:", config.baseUrl);
    console.log("==================");

    const response = await fetch(`${config.baseUrl}/checkout/v1/payment`, {
        method: "POST",
        headers: {
            "Client-Id": config.clientId,
            "Request-Id": requestId,
            "Request-Timestamp": timestamp,
            "Signature": `HMACSHA256=${signature}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (!response.ok) {
        console.error("DOKU API Error Details:", JSON.stringify(data, null, 2));
        throw new Error(data.error?.message || "DOKU API Error");
    }

    return {
        payment_url: data.response.payment.url,
        orderId: params.orderId
    };
}
