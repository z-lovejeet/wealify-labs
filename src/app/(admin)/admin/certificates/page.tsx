import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import AdminCertificatesClient from "./CertificatesClient";

export const dynamic = "force-dynamic";

export default async function AdminCertificatesPage() {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // Server Component setAll ignore
                    }
                },
            },
        }
    );

    let requests: any[] = [];
    try {
        const { data, error } = await supabase
            .from('certificate_requests')
            .select(`
                *,
                courses (title)
            `)
            .order('created_at', { ascending: false });

        if (!error && data) {
            requests = data;
        }
    } catch (e) {
        console.error("Certificates server fetch error:", e);
    }

    return <AdminCertificatesClient initialRequests={requests} />;
}
