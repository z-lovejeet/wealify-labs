import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    // Parallel Fetching: Start settings fetch immediately
    const settingsPromise = supabase.from('platform_settings').select('*').eq('key', 'site_name').single();
    const userPromise = supabase.auth.getUser();

    const [settingsResult, userResult] = await Promise.all([settingsPromise, userPromise]);
    const user = userResult.data.user;

    // Fetch profile only if user exists
    let profileResult = { data: null };
    if (user) {
        profileResult = await supabase.from('profiles').select('*').eq('id', user.id).single();
    }

    let userWithProfile = null;
    if (user) {
        userWithProfile = { ...user, profile: profileResult.data };
    }

    let siteName = "Wealify Labs";
    if (settingsResult.data) {
        siteName = settingsResult.data.value;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar initialUser={userWithProfile} siteName={siteName} />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
