"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Publicly readable settings for branding, toggles, maintenance.
 */
export async function getPlatformSettings(): Promise<Record<string, string>> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('platform_settings')
        .select('key, value');

    if (error) {
        console.error("Error fetching platform settings:", error);
        return {};
    }

    const settings: Record<string, string> = {};
    if (data) {
        data.forEach((item: { key: string; value: string }) => {
            settings[item.key] = item.value;
        });
    }

    return settings;
}

/**
 * Admin-only action to modify platform configuration.
 */
export async function updatePlatformSettings(updates: Record<string, string>) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error("Unauthorized: Authentication required.");
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profileError || profile?.role !== 'admin') {
        throw new Error("Forbidden: Admin privileges required to update platform settings.");
    }

    // Process updates in sequence or parallel
    const promises = Object.entries(updates).map(([key, value]) =>
        supabase
            .from('platform_settings')
            .upsert({ key, value, updated_at: new Date().toISOString() })
    );

    await Promise.all(promises);

    revalidatePath('/', 'layout');
    return { success: true };
}
