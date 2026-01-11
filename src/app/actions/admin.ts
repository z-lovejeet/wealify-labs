"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createModule(courseId: string, title: string, orderIndex: number) {
    const supabase = await createClient(); // Await the promise

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

export async function createLesson(moduleId: string, title: string, type: "video" | "pdf", content: string, orderIndex: number) {
    const supabase = await createClient(); // Await the promise

    const { data, error } = await supabase
        .from("lessons")
        .insert({
            module_id: moduleId,
            title,
            lesson_type: type,
            content, // URL for video or PDF
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
    const supabase = await createClient();
    const { error } = await supabase.from("modules").delete().eq("id", moduleId);
    if (error) throw error;
    revalidatePath("/admin/courses");
}

export async function deleteLesson(lessonId: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("lessons").delete().eq("id", lessonId);
    if (error) throw error;
    revalidatePath("/admin/courses");
}

export async function updateCourse(courseId: string, updates: { price?: number; title?: string; description?: string }) {
    const supabase = await createClient();
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
    const supabase = await createClient();

    if (shouldEnroll) {
        const { error } = await supabase
            .from('enrollments')
            .insert({ user_id: userId, course_id: courseId })
            .single();
        if (error && error.code !== '23505') throw error; // Ignore unique violation if already enrolled
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
    const supabase = await createClient();
    const { error } = await supabase
        .from('modules')
        .update({ title })
        .eq('id', moduleId);

    if (error) throw error;
    revalidatePath('/admin/courses');
}

export async function updateLesson(lessonId: string, updates: { title?: string; lesson_type?: "video" | "pdf"; content?: string }) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('lessons')
        .update(updates)
        .eq('id', lessonId);

    if (error) throw error;
    revalidatePath('/admin/courses');
}
