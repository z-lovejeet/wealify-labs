"use server";

import { createClient } from "@/lib/supabase/server";

interface ContactFormData {
    first_name: string;
    last_name?: string;
    email: string;
    message: string;
}

interface ActionResponse {
    success: boolean;
    error?: string;
}

export async function submitContactForm(formData: ContactFormData): Promise<ActionResponse> {
    try {
        const { first_name, last_name = "", email, message } = formData;

        // Input validation
        if (!first_name || typeof first_name !== 'string' || first_name.trim().length === 0) {
            return { success: false, error: "First name is required." };
        }
        if (first_name.trim().length > 100) {
            return { success: false, error: "First name is too long." };
        }

        if (last_name && typeof last_name === 'string' && last_name.trim().length > 100) {
            return { success: false, error: "Last name is too long." };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
            return { success: false, error: "Please provide a valid email address." };
        }

        if (!message || typeof message !== 'string' || message.trim().length < 10) {
            return { success: false, error: "Message must be at least 10 characters long." };
        }
        if (message.trim().length > 5000) {
            return { success: false, error: "Message exceeds maximum allowed length (5000 characters)." };
        }

        const supabase = await createClient();

        const { error } = await supabase
            .from('contact_messages')
            .insert([{
                first_name: first_name.trim(),
                last_name: last_name ? last_name.trim() : "",
                email: email.trim().toLowerCase(),
                message: message.trim(),
            }]);

        if (error) {
            console.error("Supabase Contact Insertion Error:", error);
            return {
                success: false,
                error: "Unable to submit your message at this time. Please try again shortly."
            };
        }

        return { success: true };
    } catch (error) {
        console.error("Server Action Contact Error:", error);
        return {
            success: false,
            error: "An unexpected error occurred. Please try again later."
        };
    }
}
