import { NextResponse } from 'next/server';
import { generateAccessToken, PAYPAL_API } from '@/lib/paypal';
import { headers } from 'next/headers';

export async function POST(req: Request) {
    try {
        // 1. Get Headers
        const headerPayload = await headers();
        const transmissionId = headerPayload.get("paypal-transmission-id");
        const transmissionTime = headerPayload.get("paypal-transmission-time");
        const certUrl = headerPayload.get("paypal-cert-url");
        const authAlgo = headerPayload.get("paypal-auth-algo");
        const transmissionSig = headerPayload.get("paypal-transmission-sig");
        const webhookId = process.env.PAYPAL_WEBHOOK_ID;

        // 2. Get Raw Body
        const rawBody = await req.text(); // Read as text for verification
        let body;
        try {
            body = JSON.parse(rawBody);
        } catch (e) {
            return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
        }

        console.log("PayPal Webhook Event:", body.event_type, body.summary);

        // 3. Verify Signature
        if (transmissionId && transmissionSig && webhookId) {
            const accessToken = await generateAccessToken();

            const verificationResponse = await fetch(`${PAYPAL_API}/v1/notifications/verify-webhook-signature`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    auth_algo: authAlgo,
                    cert_url: certUrl,
                    transmission_id: transmissionId,
                    transmission_sig: transmissionSig,
                    transmission_time: transmissionTime,
                    webhook_id: webhookId,
                    webhook_event: body
                })
            });

            const verification = await verificationResponse.json();

            if (verification.verification_status !== "SUCCESS") {
                console.error("❌ PayPal Webhook Signature Verification Failed:", verification);
                return NextResponse.json({ error: "Invalid Signature" }, { status: 401 });
            }
            console.log("✅ PayPal Webhook Verified");
        } else {
            console.warn("⚠️ PayPal Webhook Missing Headers or Webhook ID - Skipping Verification (Dev Mode?)");
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
    }
}
