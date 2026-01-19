import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase URL or Key (Service Role) in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Data Structure
const curriculum = [
    {
        moduleIndex: 1, // 1-based index to match title "Module 1:..."
        chapters: [
            "How Side Hustles Really Work",
            "Myths, Scams & Red Flags Checklist",
            "Time, Money & Skill Expectations (Realistic)",
            "Hustle Picker Scorecard + Choose 1 Hustle",
            "Your 7-Day Starter Plan (Works for Any Hustle)"
        ]
    },
    {
        moduleIndex: 2,
        chapters: [
            "Dropshipping in 2026 (Reality, Not Hype)",
            "Niche + Product Research System",
            "Store Setup Basics (Must-Have Pages)",
            "Marketing Options (Organic vs Paid)",
            "Costs, Profit, Returns & Failure Reasons",
            "Your 14-Day Dropshipping Launch Checklist"
        ]
    },
    {
        moduleIndex: 3,
        chapters: [
            "Types of Digital Products That Sell",
            "Find Profitable Ideas (Beginner Method)",
            "Validation Before Creation (No Wasting Time)",
            "Create the Product Using AI (Ethical)",
            "Pricing + Platforms",
            "Traffic Basics (Content + Funnel)",
            "Launch Kit"
        ]
    },
    {
        moduleIndex: 4,
        chapters: [
            "POD Basics + Platform Choices",
            "Niche & Design Strategy",
            "AI Design Workflow (Safe + Quality)",
            "Listing, Pricing & SEO Basics",
            "Scaling & Mistakes"
        ]
    },
    {
        moduleIndex: 5,
        chapters: [
            "Modern Affiliate Models (2026)",
            "Picking the Right Products/Programs",
            "Content Strategy That Converts",
            "Traffic Sources (IG/TikTok/YouTube/SEO)",
            "Long-Term Income Reality + Tracking"
        ]
    },
    {
        moduleIndex: 6,
        chapters: [
            "What Is Page Management (Roles + Deliverables)",
            "Niche Selection + Branding Kit",
            "Content System (Batching + Workflow)",
            "Posting Strategy + Growth Basics",
            "Monetization Paths",
            "Client Service Setup"
        ]
    },
    {
        moduleIndex: 7,
        chapters: [
            "Faceless Content Models (What Works Now)",
            "100 Niches + Positioning Guide",
            "Script + Hook Templates",
            "Editing & Retention Rules",
            "30-Day Publishing System",
            "Monetization Blueprint"
        ]
    },
    {
        moduleIndex: 8,
        chapters: [
            "Finding Leads on Google Maps (Quality Filter)",
            "The Offer",
            "Build the Demo Website Using AI (Fast + Clean)",
            "Deploy / Publish the Demo Website (Beginner Safe Setup)",
            "Outreach Scripts + Contact Methods",
            "Outreach Emails + Follow-ups + Objections + Delivery",
            "Final Wrap-Up + Execution Plan"
        ]
    }
];

async function seedLessons() {
    console.log("Starting lesson seed process...");

    // 1. Target specific course
    const courseId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    console.log(`Targeting Course ID: ${courseId}`);

    // 2. Refresh/Get Modules
    const { data: modules, error: modulesError } = await supabase
        .from('modules')
        .select('id, title, order_index')
        .eq('course_id', courseId)
        .order('order_index');

    if (modulesError || !modules) {
        console.error("Error fetching modules:", modulesError);
        return;
    }

    // 3. Delete existing lessons (Optional but safer to avoid duplicates if re-running)
    console.log("Clearing existing lessons...");
    // We can't easily delete all lessons without a direct link, but lessons allow delete via module cascade usually.
    // Let's just iterate modules and delete lessons for them? Or just rely on upsert?
    // User requested specific structure. Only way to be clean is to delete lessons for these modules.
    const moduleIds = modules.map(m => m.id);
    await supabase.from('lessons').delete().in('module_id', moduleIds);


    // 4. Insert Lessons
    console.log("Inserting chapters...");
    const lessonsPayload: any[] = [];

    // Process standard modules 1-8
    for (const item of curriculum) {
        // Find the module that corresponds to this index.
        // My previous script named them "Module 1: ...", so we look for matching order_index or title.
        // order_index in DB is 0-based.
        // item.moduleIndex is 1-based.
        // So we look for module with order_index === item.moduleIndex - 1
        const targetModule = modules.find(m => m.order_index === item.moduleIndex - 1);

        if (targetModule) {
            item.chapters.forEach((chapterTitle, chapIdx) => {
                lessonsPayload.push({
                    module_id: targetModule.id,
                    title: `Chapter ${chapIdx + 1}: ${chapterTitle}`, // "Chapter 1 - ..."
                    order_index: chapIdx,
                    lesson_type: "text", // or "pdf" if supported, safe default
                    content: "PDF content will be uploaded here.", // Placeholder
                    is_locked: false // Unlock for now or true? Default false usually for seed.
                });
            });
        } else {
            console.warn(`Module for index ${item.moduleIndex} not found!`);
        }
    }

    // Process Thank You Module
    // order_index 8 was "Bonus: Thank You..."
    const thankYouModule = modules.find(m => m.order_index === 8);
    if (thankYouModule) {
        lessonsPayload.push({
            module_id: thankYouModule.id,
            title: "Thank You Message",
            order_index: 0,
            lesson_type: "text",
            content: "Thank you for joining! Here are your next steps...",
            is_locked: false
        });
    }

    if (lessonsPayload.length > 0) {
        const { error: insertError } = await supabase.from('lessons').insert(lessonsPayload);
        if (insertError) {
            console.error("Error inserting lessons:", insertError);
        } else {
            console.log(`Successfully inserted ${lessonsPayload.length} chapters.`);
        }
    } else {
        console.log("No lessons to insert.");
    }
}

seedLessons();
