import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const COURSE_DIR = path.join(process.cwd(), "Course");
const BUCKET_NAME = "course-content";
const COURSE_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

async function uploadPDFs() {
    console.log("Starting PDF Upload Process...");

    // 1. Get Course and Modules from DB
    const { data: course, error: courseError } = await supabase
        .from('courses')
        .select(`
            id, 
            modules (
                id, 
                title, 
                order_index,
                lessons (id, title, order_index)
            )
        `)
        .eq('id', COURSE_ID)
        .single();

    if (courseError || !course) {
        console.error("Course not found:", courseError);
        return;
    }

    // 2. Iterate through local Module folders
    const moduleFolders = fs.readdirSync(COURSE_DIR).filter(f => f.startsWith("Module"));

    for (const folderName of moduleFolders) {
        console.log(`\nProcessing ${folderName}...`);

        // Match folder "Module 1" to DB Module "Module 1: ..."
        // We can match by checking if DB title starts with the folder name
        const dbModule = course.modules.find(m => m.title.startsWith(folderName));

        if (!dbModule) {
            console.warn(`  [WARN] No matching DB module found for folder: ${folderName}`);
            continue;
        }

        const folderPath = path.join(COURSE_DIR, folderName);
        const files = fs.readdirSync(folderPath).filter(f => f.endsWith(".pdf"));

        for (const fileName of files) {
            // Expected format: "Module X - Chapter Y.pdf"
            // Extract "Chapter Y"
            const match = fileName.match(/Chapter (\d+)/);
            if (!match) {
                console.warn(`  [WARN] Skipping file with unexpected name: ${fileName}`);
                continue;
            }

            const chapterNum = parseInt(match[1]);

            // Find DB Lesson
            // Strategy: Look for "Chapter Y:" in title OR match order_index (assuming order 0 = Chap 1)
            // Let's try title match first as it's explicit
            const dbLesson = dbModule.lessons.find(l =>
                l.title.startsWith(`Chapter ${chapterNum}:`) ||
                l.order_index === (chapterNum - 1)
            );

            if (!dbLesson) {
                console.warn(`  [WARN] No DB lesson found for ${fileName} (Chapter ${chapterNum})`);
                continue;
            }

            console.log(`  Uploading ${fileName} -> ${dbLesson.title}...`);

            // 3. Upload to Supabase Storage
            const fileBuffer = fs.readFileSync(path.join(folderPath, fileName));
            const storagePath = `${folderName}/${fileName}`; // e.g. "Module 1/Module 1 - Chapter 1.pdf"

            const { error: uploadError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(storagePath, fileBuffer, {
                    contentType: 'application/pdf',
                    upsert: true
                });

            if (uploadError) {
                console.error(`  [ERROR] Upload failed: ${uploadError.message}`);
                continue;
            }

            // 4. Get Public URL
            const { data: publicUrlData } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(storagePath);

            const publicUrl = publicUrlData.publicUrl;

            // 5. Update Lesson in DB
            const { error: updateError } = await supabase
                .from('lessons')
                .update({
                    content: storagePath,
                    lesson_type: 'text'
                })
                .eq('id', dbLesson.id);

            if (updateError) {
                console.error(`  [ERROR] DB Update failed: ${updateError.message}`);
            } else {
                console.log(`  [SUCCESS] Linked to lesson!`);
            }
        }
    }
    console.log("\nUpload Complete!");
}

uploadPDFs();
