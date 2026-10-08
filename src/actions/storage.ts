'use server';

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getSignedUrl(courseId: string, filePath: string): Promise<string> {
    if (!courseId || typeof courseId !== 'string') {
        throw new Error("Invalid course ID provided.");
    }

    if (!filePath || typeof filePath !== 'string') {
        throw new Error("Invalid file path provided.");
    }

    // Sanitize file path against traversal and leading slashes
    const cleanPath = filePath.replace(/^\/+/, '').trim();
    if (cleanPath.includes('..') || cleanPath.length === 0) {
        throw new Error("Invalid or prohibited file path.");
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error("You must be logged in to download course files.");
    }

    // Verify admin role or active enrollment for this specific course
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const isAdmin = profile?.role === 'admin';

    if (!isAdmin) {
        const { data: enrollment, error: enrollmentError } = await supabase
            .from('enrollments')
            .select('id')
            .eq('user_id', user.id)
            .eq('course_id', courseId)
            .maybeSingle();

        if (enrollmentError || !enrollment) {
            throw new Error("You must be enrolled in this course to access downloadable materials.");
        }
    }

    const adminClient = createAdminClient();
    const { data, error } = await adminClient.storage
        .from('course-content')
        .createSignedUrl(cleanPath, 3600); // 1 hour expiration

    if (error || !data?.signedUrl) {
        console.error("Storage signed URL error:", error);
        throw new Error("Unable to generate secure download link. Please try again later.");
    }

    return data.signedUrl;
}
