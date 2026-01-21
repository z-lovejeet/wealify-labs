import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const PAYPAL_API = "https://api-m.paypal.com"; // Live Endpoint

async function generateAccessToken() {
    const auth = Buffer.from(
        `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    const data = await response.json();
    return data.access_token;
}

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { orderID } = body;

        const accessToken = await generateAccessToken();

        const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const data = await response.json();

        if (data.status === "COMPLETED") {
            const purchaseUnit = data.purchase_units[0];
            const courseId = purchaseUnit.reference_id; // Retrieved from what we set in create-order

            // 1. Record Payment
            await supabase.from('payments').insert({
                user_id: user.id,
                course_id: courseId,
                amount: purchaseUnit.payments.captures[0].amount.value,
                currency: 'USD',
                provider: 'paypal',
                status: 'paid',
                external_id: orderID,
                metadata: data
            });

            // 2. Enroll User
            await supabase.from('enrollments').insert({
                user_id: user.id,
                course_id: courseId,
                status: 'active'
            }).select(); // Select to ensure it executed

            return NextResponse.json({ success: true, data });
        }

        return NextResponse.json({ error: 'Payment not completed', details: data }, { status: 400 });

    } catch (error: any) {
        console.error("PayPal Capture Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
