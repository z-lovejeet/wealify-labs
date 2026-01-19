import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import AdminReviewsClient from "./ReviewsClient";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
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

    let reviews: any[] = [];
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select(`
                *,
                courses (title)
            `)
            .order('created_at', { ascending: false });

        if (!error && data) {
            reviews = data;
        }
    } catch (e) {
        console.error("Reviews server fetch error:", e);
    }

    return <AdminReviewsClient initialReviews={reviews} />;
}
