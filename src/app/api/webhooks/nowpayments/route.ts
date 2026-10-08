import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Sorts object keys recursively to produce canonical JSON for HMAC verification if needed
 */
function sortObject(obj: any): any {
    if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
        return obj;
    }
    return Object.keys(obj)
        .sort()
        .reduce((result: Record<string, any>, key: string) => {
            result[key] = sortObject(obj[key]);
            return result;
        }, {});
}

export async function POST(req: Request) {
    try {
        const bodyText = await req.text();
        const signature = req.headers.get('x-nowpayments-sig');

        if (!signature) {
            return NextResponse.json({ error: 'Missing signature header' }, { status: 400 });
        }

        const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;
        if (!ipnSecret) {
            console.error("NOWPAYMENTS_IPN_SECRET is missing from environment variables");
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // 1. Verify Signature (Raw body comparison first)
        const hmac = crypto.createHmac('sha512', ipnSecret);
        hmac.update(bodyText);
        const rawSignatureHash = hmac.digest('hex');

        let isValid = false;
        const receivedBuffer = Buffer.from(signature, 'utf8');
        const rawBuffer = Buffer.from(rawSignatureHash, 'utf8');

        if (receivedBuffer.length === rawBuffer.length && crypto.timingSafeEqual(receivedBuffer, rawBuffer)) {
            isValid = true;
        } else {
            // Fallback: Test sorted JSON stringification (standard NOWPayments IPN verification format)
            try {
                const parsedBody = JSON.parse(bodyText);
                const sortedBodyString = JSON.stringify(sortObject(parsedBody));
                const sortedHmac = crypto.createHmac('sha512', ipnSecret);
                sortedHmac.update(sortedBodyString);
                const sortedSignatureHash = sortedHmac.digest('hex');
                const sortedBuffer = Buffer.from(sortedSignatureHash, 'utf8');

                if (receivedBuffer.length === sortedBuffer.length && crypto.timingSafeEqual(receivedBuffer, sortedBuffer)) {
                    isValid = true;
                }
            } catch {
                // Keep isValid as false
            }
        }

        if (!isValid) {
            console.error("NOWPayments Webhook: Invalid signature detected");
            return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
        }

        // 2. Parse Body
        let data;
        try {
            data = JSON.parse(bodyText);
        } catch (e) {
            console.error("NOWPayments Webhook: JSON Parse Error:", e);
            return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
        }

        console.log("NOWPayments Webhook Verified. Event Status:", data.payment_status, "Payment ID:", data.payment_id);

        // 3. Process Confirmed/Finished Payments
        if (data.payment_status === 'finished' || data.payment_status === 'confirmed') {
            const supabaseAdmin = createAdminClient();

            // Extract User ID and Course ID from order_id (Format: "userId:courseId")
            const [userId, courseId] = (data.order_id || "").split(':');

            if (userId && courseId) {
                // 1. Enroll User (Idempotent)
                const { error: enrollError } = await supabaseAdmin.from('enrollments').upsert({
                    user_id: userId,
                    course_id: courseId,
                    status: 'active'
                }, { onConflict: 'user_id, course_id' });

                if (enrollError) {
                    console.error("NOWPayments Webhook: Enrollment Error:", enrollError);
                }

                // 2. Record Payment (Idempotent: upsert on external_id to prevent duplicates)
                const paymentIdStr = (data.payment_id || "").toString();
                const { error: paymentError } = await supabaseAdmin.from('payments').upsert({
                    user_id: userId,
                    course_id: courseId,
                    amount: data.price_amount,
                    currency: (data.price_currency || 'USD').toUpperCase(),
                    provider: 'nowpayments',
                    status: 'paid',
                    external_id: paymentIdStr,
                    metadata: data
                }, { onConflict: 'external_id' });

                if (paymentError) {
                    console.error("NOWPayments Webhook: Payment Record Error:", paymentError);
                }

                console.log(`Successfully enrolled user ${userId} in course ${courseId} via NOWPayments ID ${paymentIdStr}`);
            } else {
                console.error("NOWPayments Webhook: Invalid order_id format:", data.order_id);
            }
        } else {
            console.log("NOWPayments Webhook: Non-completion status received:", data.payment_status);
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("NOWPayments Webhook Error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
