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
    const { data: settings } = await supabase.from('platform_settings').select('*').eq('key', 'site_name').single();
    if (settings) {
        siteName = settings.value;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar initialUser={userWithProfile} siteName={siteName} />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
