import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function testInsert() {
    console.log("Testing Insert...");

    const userId = "f71c8110-cd7d-4060-9752-3ddaf71a6085"; // Lovejeet
    const courseId = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

    // 1. Get a lesson via module
    const { data: modules } = await supabase.from('modules').select('id, lessons(id)').eq('course_id', courseId).limit(1);
    if (!modules || modules.length === 0 || !modules[0].lessons || modules[0].lessons.length === 0) {
        console.error("No lessons found via modules!");
        return;
    }
    const lessonId = modules[0].lessons[0].id;
    console.log(`Testing with Lesson ID: ${lessonId}`);

    // 2. Try Insert/Upsert
    const { data, error } = await supabase.from('lesson_completions').upsert({
        user_id: userId,
        lesson_id: lessonId,
        course_id: courseId,
        completed_at: new Date().toISOString()
    }, {
        onConflict: 'user_id, lesson_id'
    }).select();

    if (error) {
        console.error("INSERT FAILED:", error);
    } else {
        console.log("INSERT SUCCESS:", data);

        // Cleanup
        // await supabase.from('lesson_completions').delete().eq('id', data[0].id);
    }
}

testInsert();
