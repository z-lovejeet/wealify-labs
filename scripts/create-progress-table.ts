import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const createTableSQL = `
-- Create lesson_completions table
CREATE TABLE IF NOT EXISTS public.lesson_completions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, lesson_id)
);

-- Enable RLS
ALTER TABLE public.lesson_completions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own completions
CREATE POLICY "Users can view own completions"
ON public.lesson_completions
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert/update their own completions
CREATE POLICY "Users can manage own completions"
ON public.lesson_completions
FOR ALL
USING (auth.uid() = user_id);
`;

async function createTable() {
    console.log("Creating lesson_completions table...");
    // Supabase JS client doesn't run raw SQL easily without RPC.
    // But since I have the service key, I can try to use the Postgres connection or just use the dashboard?
    // Wait, the agent has restrictions.
    // I can't run raw SQL via the JS client unless I have a `rpc` function setup for it (likely not).
    // OR I can use the `pg` library if installed? No.
    // BUT... I can probably simulate it or ask the user.
    // Actually, I can use the Supabase Managment API if I had the token, but I just have service role key.

    // Alternative: Is there any "rpc" function exposed?
    // I'll check if I can just use the query interface? No.

    // I will try to use a "migration" approach if possible, but without direct SQL access, this is hard.
    // However, I CANNOT create tables via the Data API.
    // I must ask the USER to run this SQL in their dashboard SQL Editor.

    console.log("\n!!! ACTION REQUIRED !!!");
    console.log("Please run the following SQL in your Supabase Dashboard SQL Editor to enable progress tracking:");
    console.log("\n--------------------------------------------------------------");
    console.log(createTableSQL);
    console.log("--------------------------------------------------------------\n");
}

createTable();
