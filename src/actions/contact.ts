"use server";

import { createClient } from "@/lib/supabase/server";

interface ContactFormData {
    first_name: string;
    last_name: string;
    email: string;
    message: string;
}

interface ActionResponse {
    success: boolean;
    error?: string;
}

export async function submitContactForm(formData: ContactFormData): Promise<ActionResponse> {
    try {
        const supabase = await createClient();

        const { error } = await supabase
            .from('contact_messages')
            .insert([formData]);

        if (error) {
            console.error("Supabase Insertion Error:", error);
            throw new Error(error.message);
        }

        return { success: true };
    } catch (error: any) {
        console.error("Server Action Error:", error);
        return {
            success: false,
            error: error.message || "Failed to send message"
        };
    }
}
