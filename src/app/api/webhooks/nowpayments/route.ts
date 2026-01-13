import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const bodyText = await req.text();
        const signature = req.headers.get('x-nowpayments-sig');

        if (!signature) {
            return NextResponse.json({ error: 'No signature' }, { status: 400 });
        }

        const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;
        if (!ipnSecret) {
            console.error("NOWPAYMENTS_IPN_SECRET is missing");
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // Verify Signature
        const hmac = crypto.createHmac('sha512', ipnSecret);
        hmac.update(bodyText);
        const signatureHash = hmac.digest('hex');

        if (signatureHash !== signature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
        }

        // Parse Body
        let data;
        try {
            data = JSON.parse(bodyText);
        } catch (e) {
            console.error("Webhook JSON Parse Error:", e);
            return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
        }

        /*
          Data Example:
          {
            "payment_status": "finished",
            "payment_id": 59723123,
            "order_description": "Purchase: Course Title",
            "order_id": "userId:courseId", 
            "price_amount": 100
          }
        */

        if (data.payment_status === 'finished' || data.payment_status === 'confirmed') {
            const supabaseAdmin = createAdminClient();

            // Extract User ID and Course ID from order_id (Format: "userId:courseId")
            const [userId, courseId] = (data.order_id || "").split(':');

            if (userId && courseId) {
                // 1. Enroll User
                const { error: enrollError } = await supabaseAdmin.from('enrollments').upsert({
                    user_id: userId,
                    course_id: courseId,
                    status: 'active'
                }, { onConflict: 'user_id, course_id' });

                if (enrollError) {
                    console.error("Enrollment Error:", enrollError);
                }

                // 2. Log Payment
                await supabaseAdmin.from('payments').insert({
                    user_id: userId,
                    course_id: courseId,
                    amount: data.price_amount,
                    currency: data.price_currency,
                    provider: 'nowpayments',
                    status: 'paid',
                    external_id: data.payment_id.toString(),
                    metadata: data
                });

                console.log(`Successfully enrolled user ${userId} in course ${courseId}`);
            } else {
                console.error("NOWPayments Webhook: Invalid order_id format", data.order_id);
            }
        } else {
            console.log("NOWPayments Webhook: Payment status not confirmed yet:", data.payment_status);
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("NOWPayments Webhook Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
