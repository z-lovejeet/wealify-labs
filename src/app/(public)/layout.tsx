import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Parallel Fetching
    const [profileResult, settingsResult] = await Promise.all([
        user ? supabase.from('profiles').select('*').eq('id', user.id).single() : Promise.resolve({ data: null }),
        supabase.from('platform_settings').select('*').eq('key', 'site_name').single()
    ]);

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
