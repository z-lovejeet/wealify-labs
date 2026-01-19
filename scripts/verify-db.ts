import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing keys.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
    console.log("Verifying Database Content...\n");

    const targetId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    const { data: courses } = await supabase.from('courses').select('*').eq('id', targetId).single();
    const course = courses;

    if (!course) {
        console.log("No course found!");
        return;
    }

    console.log(`COURSE: ${course.title} (ID: ${course.id})`);
    console.log("--------------------------------------------------");

    const { data: modules } = await supabase
        .from('modules')
        .select('*')
        .eq('course_id', course.id)
        .order('order_index');

    if (!modules) return;

    for (const mod of modules) {
        console.log(`\n[MODULE] ${mod.title}`);

        const { data: lessons } = await supabase
            .from('lessons')
            .select('title, order_index')
            .eq('module_id', mod.id)
            .order('order_index');

        if (lessons && lessons.length > 0) {
            lessons.forEach(l => console.log(`   - [Lesson] ${l.title}`));
        } else {
            console.log("   (No lessons)");
        }
    }
}

verify();
