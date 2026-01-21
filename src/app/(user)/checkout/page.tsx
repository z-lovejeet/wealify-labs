import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { singleCourse } from "@/lib/mock-data";
import CheckoutClient from "./CheckoutClient";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
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

    // 1. Fetch User
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login?next=/checkout");
    }

    // 2. Fetch Course
    // We try to fetch the real course, fallback to mock if DB empty for now
    let course = singleCourse;
    try {
        const { data: routeCourse } = await supabase
            .from('courses')
            .select('*')
            .eq('id', "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")
            .single();

        if (routeCourse) {
            course = routeCourse;
            course.price = 0.1; // TEST MODE
        }
    } catch (e) {
        // Ignore error
    }

    // 3. Check Enrollment (Redirect if already enrolled)
    try {
        const { data: enrollments } = await supabase
            .from('enrollments')
            .select('id')
            .eq('user_id', user.id)
            .eq('course_id', course.id);

        if (enrollments && enrollments.length > 0) {
            redirect(`/learn/${course.id}`);
        }
    } catch (e) {
        // Ignore
    }

    return <CheckoutClient user={user} course={course} />;
}

