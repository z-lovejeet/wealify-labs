import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function listCourses() {
    const { data: courses, error } = await supabase.from('courses').select('id, title');
    if (error) {
        console.error(error);
        return;
    }
    console.log("Available Courses:");
    courses.forEach(c => console.log(`- ${c.title} [${c.id}]`));
}

listCourses();
