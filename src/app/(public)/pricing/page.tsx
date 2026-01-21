import Link from "next/link";
import { Zap, BookOpen, FileText, Users, TrendingUp } from "lucide-react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { singleCourse } from "@/lib/mock-data";
import PricingClient from "./PricingClient";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
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
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );

    // Default values
    let course = singleCourse;
    let user = null;
    let hasAccess = false;

    // 1. Fetch Course
    try {
        const { data: routeCourse } = await supabase
            .from('courses')
            .select('*')
            .eq('id', "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")
            .single();

        if (routeCourse) {
            course = routeCourse;
            course.price = 2.0; // TEST MODE
        }
    } catch (e) {
        console.error("Error fetching course:", e);
    }

    // 2. Fetch User & Access
    try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        user = authUser;

        if (user && course) {
            const { data: enrollments } = await supabase
                .from('enrollments')
                .select('id')
                .eq('user_id', user.id)
                .eq('course_id', course.id);

            if (enrollments && enrollments.length > 0) {
                hasAccess = true;
            }
        }
    } catch (e) {
        console.error("Error fetching user/access:", e);
    }

    return (
        <div className="bg-background min-h-screen pt-24 pb-24">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px]" />
            </div>

            <div className="container max-w-6xl mx-auto px-6">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                        Start Your Journey <span className="text-primary">Today</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Stop dreaming about financial freedom and start building it. You are one decision away from a completely different life.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left Column: Value Proposition */}
                    <div className="space-y-10">
                        <div>
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Zap className="w-6 h-6 text-primary" />
                                What's Included In The Blueprint?
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-card border border-border/50 rounded-xl flex gap-4">
                                    <div className="mt-1 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">8 Core Learning Modules</h4>
                                        <p className="text-sm text-muted-foreground">Step-by-step training covering mentality, strategy, and execution.</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-card border border-border/50 rounded-xl flex gap-4">
                                    <div className="mt-1 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Templates & Resources</h4>
                                        <p className="text-sm text-muted-foreground">Downloadable worksheets, scripts, and planners to speed up your progress.</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-card border border-border/50 rounded-xl flex gap-4">
                                    <div className="mt-1 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Private Community Access</h4>
                                        <p className="text-sm text-muted-foreground">Network with like-minded individuals and get answers to your questions.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-card border border-border/50 rounded-xl flex gap-4">
                            <div className="mt-1 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">7 Profitable Business Models</h4>
                                <p className="text-sm text-muted-foreground">Detailed breakdowns of 7 distinct side hustles you can start immediately.</p>
                            </div>
                        </div>
                    </div>


                    {/* Right Column: Pricing Card (Client Component) */}
                    <PricingClient user={user} hasAccess={hasAccess} course={course} />
                </div>
            </div >
        </div >
    );
}

