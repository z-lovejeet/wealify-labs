"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Enforces authentication and admin role verification for all admin server actions.
 */
async function assertAdmin() {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        throw new Error("Unauthorized: You must be logged in to perform this action.");
    }

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profileError || profile?.role !== "admin") {
        throw new Error("Forbidden: Admin privileges required.");
    }

    return { supabase, user };
}

export async function createModule(courseId: string, title: string, orderIndex: number) {
    const { supabase } = await assertAdmin();

    const { data, error } = await supabase
        .from("modules")
        .insert({
            course_id: courseId,
            title,
            order_index: orderIndex,
            is_locked: false,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating module:", error);
        throw new Error("Failed to create module");
    }

    revalidatePath("/admin/courses");
    return data;
}

export async function createLesson(moduleId: string, title: string, type: "text" | "pdf", content: string, orderIndex: number) {
    const { supabase } = await assertAdmin();

    const { data, error } = await supabase
        .from("lessons")
        .insert({
            module_id: moduleId,
            title,
            lesson_type: type,
            content, // URL or storage path for PDF
            order_index: orderIndex,
            is_locked: false,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating lesson:", error);
        throw new Error("Failed to create lesson");
    }

    revalidatePath("/admin/courses");
    return data;
}

export async function deleteModule(moduleId: string) {
    const { supabase } = await assertAdmin();
    const { error } = await supabase.from("modules").delete().eq("id", moduleId);
    if (error) throw error;
    revalidatePath("/admin/courses");
}

export async function deleteLesson(lessonId: string) {
    const { supabase } = await assertAdmin();
    const { error } = await supabase.from("lessons").delete().eq("id", lessonId);
    if (error) throw error;
    revalidatePath("/admin/courses");
}

export async function updateCourse(courseId: string, updates: { price?: number; title?: string; description?: string }) {
    const { supabase } = await assertAdmin();
    const { data, error } = await supabase
        .from("courses")
        .update(updates)
        .eq("id", courseId)
        .select()
        .single();

    if (error) {
        console.error("Error updating course:", error);
        throw new Error("Failed to update course");
    }

    revalidatePath("/admin/courses");
    revalidatePath("/my-courses");
    revalidatePath("/dashboard");
    return data;
}

export async function toggleEnrollment(userId: string, courseId: string, shouldEnroll: boolean) {
    const { supabase } = await assertAdmin();

    if (shouldEnroll) {
        const { error } = await supabase
            .from('enrollments')
            .upsert({ user_id: userId, course_id: courseId, status: 'active' }, { onConflict: 'user_id, course_id' });
        if (error) throw error;
    } else {
        const { error } = await supabase
            .from('enrollments')
            .delete()
            .match({ user_id: userId, course_id: courseId });
        if (error) throw error;
    }

    revalidatePath('/admin/users');
}

export async function updateModule(moduleId: string, title: string) {
    const { supabase } = await assertAdmin();
    const { error } = await supabase
        .from('modules')
        .update({ title })
        .eq('id', moduleId);

    if (error) throw error;
    revalidatePath('/admin/courses');
}

export async function updateLesson(lessonId: string, updates: { title?: string; lesson_type?: "text" | "pdf"; content?: string }) {
    const { supabase } = await assertAdmin();
    const { error } = await supabase
        .from('lessons')
        .update(updates)
        .eq('id', lessonId);

    if (error) throw error;
    revalidatePath('/admin/courses');
}
