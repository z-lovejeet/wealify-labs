import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function updateDescription() {
    const courseId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    const newDescription = "A comprehensive, step-by-step framework for launching and scaling a profitable digital business. Master proven strategies across 8 modern business models to build sustainable income streams.";

    console.log(`Updating description for Course ID: ${courseId}`);

    const { data, error } = await supabase
        .from('courses')
        .update({ description: newDescription })
        .eq('id', courseId)
        .select();

    if (error) {
        console.error("Error updating description:", error);
    } else {
        console.log("Success! New Description:", data[0].description);
    }
}

updateDescription();
