import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { singleCourse } from "@/lib/mock-data";
import HomeClient from "./HomeClient";

export default async function HomePage() {
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

    // Parallel Fetching: Start both critical fetches immediately
    const coursePromise = supabase
        .from('courses')
        .select('*')
        .eq('id', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')
        .maybeSingle();

    const userPromise = supabase.auth.getUser();

    const [courseResult, userResult] = await Promise.all([coursePromise, userPromise]);

    // Handle Course Data
    let course = singleCourse;
    if (courseResult.data) {
        course = courseResult.data;
    }

    // Handle User & Access
    const user = userResult.data.user;
    let hasAccess = false;

    if (user) {
        try {
            const { data: enrollments } = await supabase
                .from('enrollments')
                .select('id')
                .eq('user_id', user.id)
                .eq('course_id', course.id);

            if (enrollments && enrollments.length > 0) {
                hasAccess = true;
            }
        } catch (e) {
            // ignore
        }
    }

    return <HomeClient user={user} hasAccess={hasAccess} course={course} />;
}
