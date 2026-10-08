import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const NOWPAYMENTS_API = "https://api.nowpayments.io/v1";

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized: Please log in to complete checkout' }, { status: 401 });
        }

        // 1. Backend Gateway Toggle Verification (Never trust client-side state)
        const { data: gatewaySetting } = await supabase
            .from('platform_settings')
            .select('value')
            .eq('key', 'enable_nowpayments')
            .single();

        if (gatewaySetting && gatewaySetting.value === 'false') {
            return NextResponse.json(
                { error: 'Crypto payments are currently paused by the administrator.' },
                { status: 403 }
            );
        }

        const body = await req.json();
        const { courseId } = body;

        if (!courseId) {
            return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
        }

        // 2. Fetch Authoritative Course Data from DB
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .select('id, price, title')
            .eq('id', courseId)
            .single();

        if (courseError || !course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        const appUrl = (process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin).replace(/\/$/, "");

        const payload = {
            price_amount: Number(course.price),
            price_currency: "usd",
            order_id: `${user.id}:${course.id}`, // Composite identifier: userId:courseId
            order_description: `Course Access: ${course.title}`,
            ipn_callback_url: `${appUrl}/api/webhooks/nowpayments`,
            success_url: `${appUrl}/learn/${course.id}?success=true`,
            cancel_url: `${appUrl}/checkout?cancel=true`,
        };

        const apiKey = process.env.NOWPAYMENTS_API_KEY;
        if (!apiKey) {
            console.error("NOWPAYMENTS_API_KEY is not configured in server environment");
            return NextResponse.json({ error: 'Payment gateway configuration error' }, { status: 500 });
        }

        const response = await fetch(`${NOWPAYMENTS_API}/invoice`, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const responseText = await response.text();
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error("NOWPayments invoice parse error:", e, responseText);
            return NextResponse.json({ error: 'Invalid response from payment gateway' }, { status: 502 });
        }

        if (response.ok && data?.invoice_url) {
            return NextResponse.json(data);
        } else {
            console.error("NOWPayments invoice generation failed:", data);
            const errorMsg = data?.message || data?.error || 'Failed to create payment invoice';
            return NextResponse.json({ error: errorMsg, details: data }, { status: response.status || 400 });
        }

    } catch (error: any) {
        console.error("NOWPayments Create Invoice Error:", error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
