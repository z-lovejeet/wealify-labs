import { createClient } from "@supabase/supabase-js";
import path from "path";

const fs = require('fs');

const envPath = path.resolve(process.cwd(), ".env.local");
console.log("Loading env from:", envPath);

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');

    if (!supabaseUrl) {
        const urlMatch = envConfig.match(/NEXT_PUBLIC_SUPABASE_URL=["']?([^"'\n]+)["']?/);
        if (urlMatch) supabaseUrl = urlMatch[1];
    }

    if (!supabaseServiceKey) {
        const keyMatch = envConfig.match(/SUPABASE_SERVICE_ROLE_KEY=["']?([^"'\n]+)["']?/);
        if (keyMatch) supabaseServiceKey = keyMatch[1];
    }
}

console.log("URL Found:", !!supabaseUrl);
console.log("Key Found:", !!supabaseServiceKey);

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    console.log("URL:", supabaseUrl);
    // Do not log the key for security
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function promoteToAdmin(email: string) {
    console.log(`Promoting ${email} to admin...`);

    // 1. Get user ID from auth.users (requires service role)
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();

    if (userError) {
        console.error("Error fetching users:", userError);
        return;
    }

    const user = users.find((u) => u.email === email);

    if (!user) {
        console.error(`User with email ${email} not found.`);
        return;
    }

    console.log(`Found user: ${user.id}`);

    // 2. Update profiles table
    const { error: updateError } = await supabase
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", user.id);

    if (updateError) {
        console.error("Error updating profile:", updateError);
    } else {
        console.log(`Successfully promoted ${email} to admin.`);
    }
}

promoteToAdmin("lovejeet1225@gmail.com");
