'use server';

import { createClient } from "@/lib/supabase/server";

export async function subscribeNewsletter(email: string) {
    if (!email || typeof email !== 'string') {
        return { success: false, error: "Please provide a valid email address." };
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
        return { success: false, error: "Please provide a valid email address." };
    }

    try {
        const supabase = await createClient();
        const { error } = await supabase
            .from('newsletter_subscribers')
            .insert({ email: trimmedEmail });

        if (error) {
            // PostgreSQL unique violation error code 23505
            if (error.code === '23505') {
                return { success: true, message: "You are already subscribed to our newsletter!" };
            }
            console.error("Newsletter subscription error:", error);
            return { success: false, error: "Failed to subscribe. Please try again later." };
        }

        return { success: true, message: "Successfully subscribed to our newsletter!" };
    } catch (err: any) {
        console.error("Unexpected newsletter error:", err);
        return { success: false, error: "An unexpected error occurred. Please try again." };
    }
}
