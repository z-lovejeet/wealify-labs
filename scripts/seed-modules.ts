import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase URL or Key in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const modules = [
    "Foundations & Reality (Intro)",
    "Dropshipping (2026 Version)",
    "Digital Product Selling (Core Hustle ⭐)",
    "Print-on-Demand (POD)",
    "Affiliate Marketing (Modern)",
    "Social Media Page Management",
    "Faceless Content Machine + Monetization (Reels/Shorts)",
    "AI Website Outreach Hustle (Restaurants Without Websites)",
];

async function seedModules() {
    console.log("Starting seed process...");

    // Target specific course: The Modern Side Hustle Blueprint
    const courseId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    console.log(`Targeting Course ID: ${courseId}`);

    console.log("Deleting existing modules to enforce structure...");
    const { error: deleteError } = await supabase.from('modules').delete().eq('course_id', courseId);
    if (deleteError) {
        console.error("Error deleting modules:", deleteError);
        return;
    }

    // Insert Modules
    const modulePayload = modules.map((name, i) => ({
        course_id: courseId,
        title: `Module ${i + 1}: ${name}`,
        order_index: i,
    }));

    // Add Thank You Section
    modulePayload.push({
        course_id: courseId,
        title: "Bonus: Thank You & Next Steps",
        order_index: 8
    });

    console.log("Inserting modules...", modulePayload);

    const { data: insertedModules, error: insertError } = await supabase
        .from('modules')
        .insert(modulePayload)
        .select();

    if (insertError) {
        console.error("Error inserting modules:", insertError);
    } else {
        console.log("Successfully inserted modules:", insertedModules?.length);
    }
}

seedModules();
