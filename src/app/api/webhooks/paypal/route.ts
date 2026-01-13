import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    // Basic Logging for PayPal Webhooks
    // Since we handle fulfillment synchronously in /capture-order, this is just for audit trails.
    try {
        const body = await req.json();
        console.log("PayPal Webhook Event:", body.event_type, body.summary);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
    }
}
