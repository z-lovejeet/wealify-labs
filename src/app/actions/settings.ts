"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getPlatformSettings() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('platform_settings')
        .select('*');

    if (error) {
        console.error("Error fetching settings:", error);
        return {};
    }

    // Convert array of {key, value} to object
    const settings: Record<string, string> = {};
    data.forEach((item: any) => {
        settings[item.key] = item.value;
    });

    return settings;
}

export async function updatePlatformSettings(updates: Record<string, string>) {
    const supabase = await createClient();

    // Process updates in parallel or sequence
    const promises = Object.entries(updates).map(([key, value]) =>
        supabase
            .from('platform_settings')
            .upsert({ key, value })
    );

    await Promise.all(promises);

    revalidatePath('/', 'layout'); // Revalidate everything as these are global settings
    return { success: true };
}
