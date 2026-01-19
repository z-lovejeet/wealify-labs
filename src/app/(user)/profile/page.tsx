import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
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

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch profile data
    let profile = null;
    try {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        profile = data;
    } catch (e) {
        // ignore
    }

    // Check for enrollment and fetch course details
    let hasAccess = false;
    let enrolledCourse = null;

    try {
        const { data: enrollments } = await supabase
            .from('enrollments')
            .select('id, courses(title)')
            .eq('user_id', user.id);

        if (enrollments && enrollments.length > 0) {
            hasAccess = true;
            // @ts-ignore
            if (enrollments[0]?.courses?.title) {
                // @ts-ignore
                enrolledCourse = enrollments[0].courses.title;
            }
        }
    } catch (e) {
        // ignore
    }

    // Combine user with profile for the client
    const fullUser = { ...user, profile };

    return <ProfileClient user={fullUser} hasAccess={hasAccess} enrolledCourse={enrolledCourse} />;
}
