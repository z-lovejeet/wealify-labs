import { Navbar } from "@/components/layout/Navbar";
import { UserSidebar } from "@/components/layout/UserSidebar";
import { UserMobileHeader } from "@/components/layout/UserMobileHeader";
import { createClient } from "@/lib/supabase/server";

export default async function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const [
        { data: { user } },
        { data: settingsData }
    ] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from('platform_settings').select('*').eq('key', 'site_name').single()
    ]);

    let userWithProfile = null;
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        userWithProfile = { ...user, profile };
    }

    let siteName = "Wealify Labs";
    if (settingsData) {
        siteName = settingsData.value;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar initialUser={userWithProfile} siteName={siteName} /> {/* Navbar will adapt to show User elements */}
            <UserMobileHeader user={userWithProfile} />
            <div className="flex flex-1 container max-w-screen-2xl">
                <UserSidebar />
                <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
