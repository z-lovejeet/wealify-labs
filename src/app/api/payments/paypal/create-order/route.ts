import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const PAYPAL_API = "https://api-m.paypal.com"; // Live Endpoint

// Helper to generate PayPal Access Token
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
        const { courseId } = body;

        // Fetch Course Price
        const { data: course } = await supabase
            .from('courses')
            .select('price, title')
            .eq('id', courseId)
            .single();

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        const accessToken = await generateAccessToken();

        const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        description: course.title,
                        amount: {
                            currency_code: "USD",
                            value: course.price.toString(),
                        },
                        reference_id: courseId, // Track course ID
                        custom_id: user.id,     // Track user ID
                    },
                ],
            }),
        });

        const order = await response.json();

        if (!response.ok || (order.name === "AUTHENTICATION_FAILURE") || (order.error)) {
            console.error("PayPal API Error:", order);
            return NextResponse.json({ error: "PayPal API Error", details: order }, { status: response.status });
        }

        return NextResponse.json(order);
    } catch (error: any) {
        console.error("PayPal Create Order Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
