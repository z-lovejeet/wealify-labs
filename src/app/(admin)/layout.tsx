import { Navbar } from "@/components/layout/Navbar";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminMobileHeader } from "@/components/layout/AdminMobileHeader";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
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

    // Double-Protection: Layout Guard
    // Middleware handles this too, but this ensures no partial render happens if middleware fails/is bypassed locally
    if (!userWithProfile || userWithProfile.profile?.role !== 'admin') {
        const { redirect } = await import('next/navigation');
        redirect('/');
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar initialUser={userWithProfile} siteName={siteName} />
            <AdminMobileHeader />
            <div className="flex flex-1 container max-w-screen-2xl">
                <AdminSidebar />
                <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
