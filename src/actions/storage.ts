'use server';

import { createClient } from "@/lib/supabase/server";

export async function getSignedUrl(filePath: string) {
    const supabase = await createClient(); // Authenticated client
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    // Verify enrollment
    const { data: enrollment, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .single();

    if (enrollmentError || !enrollment) {
        // Double check if they are admin/owner?
        // For now, strict enrollment or admin.
        if (user.email !== 'lovejeet1225@gmail.com') { // Hardcoded admin fallback for safety if needed, or better just rely on enrollment
            throw new Error("You must be enrolled to access this file.");
        }
    }

    // Since RLS on storage is tricky to configure for "enrolled only",
    // we can use the Service Role here IF we verify enrollment.
    // However, createClient() returns the user-scoped client.
    // Generally, for private buckets, we need either:
    // 1. RLS policies on bucket (User has select).
    // 2. Or, sign the URL using the Admin (Service Role) client.

    // Let's use the Admin client to guarantee access, assuming this action is only 
    // called by authorized components (which we should verify enrollment here ideally).
    // For now, we will assume the caller page guarded access.

    // We need to construct a robust admin client here or use the environment variables directly
    // just for this storage operation.

    const adminClient = require('@supabase/supabase-js').createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await adminClient.storage
        .from('course-content')
        .createSignedUrl(filePath, 3600); // 1 hour

    if (error) {
        console.error("Storage Error:", error);
        throw new Error(error.message);
    }

    return data.signedUrl;
}
