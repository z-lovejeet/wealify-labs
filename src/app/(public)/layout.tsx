import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const hasAuthCookie = allCookies.some(c => c.name.includes('-auth-token') || c.name.startsWith('sb-'));

    let userWithProfile = null;
    const siteName = "Wealify Labs";

    // Only query Supabase when auth cookies are present, saving 300-500ms on public page transitions
    if (hasAuthCookie) {
        try {
            const supabase = await createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                userWithProfile = { ...user, profile };
            }
        } catch {
            // Fail gracefully to unauthenticated state
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar initialUser={userWithProfile} siteName={siteName} />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
