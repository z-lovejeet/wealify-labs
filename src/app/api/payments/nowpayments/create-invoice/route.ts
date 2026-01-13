import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const NOWPAYMENTS_API = "https://api.nowpayments.io/v1";

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { courseId } = body;

        // Fetch Course Data
        const { data: course } = await supabase
            .from('courses')
            .select('price, title')
            .eq('id', courseId)
            .single();

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        const payload = {
            price_amount: course.price,
            price_currency: "usd",
            order_id: `${user.id}:${courseId}`, // Composite ID to track user and course
            order_description: `Purchase: ${course.title}`,
            ipn_callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://your-site.com'}/api/webhooks/nowpayments`,
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://your-site.com'}/learn/${courseId}?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://your-site.com'}/checkout?cancel=true`,
        };

        console.log("Creating Invoice for:", user.email, "Course:", course.title);

        const response = await fetch(`${NOWPAYMENTS_API}/invoice`, {
            method: 'POST',
            headers: {
                'x-api-key': process.env.NOWPAYMENTS_API_KEY!,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const responseText = await response.text();
        console.log("NOWPayments Response Status:", response.status);
        console.log("NOWPayments Response Body:", responseText);

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error("Failed to parse JSON:", e);
            return NextResponse.json({ error: 'Invalid response from payment provider', details: responseText }, { status: 500 });
        }

        if (data.id) {
            return NextResponse.json(data);
        } else {
            console.error("NOWPayments Creation Failed:", data);
            return NextResponse.json({ error: 'Failed to create invoice', details: data }, { status: 400 });
        }

    } catch (error: any) {
        console.error("NOWPayments Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
