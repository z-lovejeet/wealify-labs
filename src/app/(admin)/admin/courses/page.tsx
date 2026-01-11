import { createClient } from "@/lib/supabase/server";
import { CourseManager } from "@/components/admin/CourseManager";
import { AlertCircle } from "lucide-react";

export default async function AdminCoursesPage() {
    const supabase = await createClient(); // Await the promise

    // Fetch the single course (we'll just take the first one found or specific ID if we knew it guaranteed)
    // Using the ID from our previous knowledge: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
    const { data: course, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")
        .single();

    if (!course || courseError) {
        return (
            <div className="p-6">
                <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-md">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <h3 className="font-medium text-red-800">Error</h3>
                    </div>
                    <div className="mt-2 text-sm text-red-700">
                        Could not find the main course. Please ensure the database is seeded.
                        {courseError && <div className="mt-2 font-mono text-xs">{JSON.stringify(courseError)}</div>}
                    </div>
                </div>
            </div>
        );
    }

    // Fetch modules and nested lessons
    // Supabase join syntax: modules(*, lessons(*))
    const { data: modules, error: modulesError } = await supabase
        .from("modules")
        .select(`
            *,
            lessons (*)
        `)
        .eq("course_id", course.id)
        .order("order_index", { ascending: true });

    // Sort lessons manually if needed, but we can rely on client sort or refine the query
    // The query above doesn't guarantee deep sort order easily in one line without modifiers on the relation
    // We'll handle sort in the client component.

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Course Manager</h1>
                    <p className="text-muted-foreground">Manage modules and materials for your course.</p>
                </div>
            </div>

            <div className="border rounded-md p-6 bg-background">
                <CourseManager course={course} modules={modules || []} />
            </div>
        </div>
    );
}

