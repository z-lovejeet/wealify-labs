import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen } from "lucide-react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const COURSE_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

export const dynamic = "force-dynamic";

export default async function MyCoursesPage() {
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

    // 1. Parallel Fetch: Course details, Modules (for total lesson count), and User Session
    const [courseResult, modulesResult, userResult] = await Promise.all([
        supabase.from('courses').select('*').eq('id', COURSE_ID).single(),
        supabase.from('modules').select('id, lessons(id)').eq('course_id', COURSE_ID),
        supabase.auth.getUser()
    ]);

    const course = courseResult.data;
    const user = userResult.data.user;

    let isEnrolled = false;
    let progressPercentage = 0;

    // 2. Parallel Fetch: User-specific data (if logged in)
    if (user && course) {
        const [enrollmentResult, completionsResult] = await Promise.all([
            supabase.from('enrollments').select('id').eq('user_id', user.id).eq('course_id', COURSE_ID),
            supabase.from('lesson_completions').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('course_id', COURSE_ID)
        ]);

        const enrollments = enrollmentResult.data;
        if (enrollments && enrollments.length > 0) {
            isEnrolled = true;
        }

        // Calculate Progress
        let totalLessons = 0;
        if (modulesResult.data) {
            modulesResult.data.forEach((m: any) => {
                if (m.lessons) {
                    totalLessons += m.lessons.length;
                }
            });
        }

        const completedCount = completionsResult.count || 0;

        if (totalLessons > 0) {
            progressPercentage = Math.round((completedCount / totalLessons) * 100);
        }
    }

    if (!course) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="p-4 bg-red-50 text-red-500 rounded-full mb-4">
                    <BookOpen className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold">Course Not Found</h2>
                <p className="text-muted-foreground">Unable to load course details. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold">My Course</h1>

            {!isEnrolled ? (
                // Unenrolled State - Sales Focus
                <Card className="hover:border-primary/50 transition-colors border-dashed border-2 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        <div className="relative w-full aspect-auto md:h-full bg-muted min-h-[200px]">
                            {course.thumbnail_url ? (
                                <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                                    <BookOpen className="w-16 h-16 text-muted-foreground/50" />
                                </div>
                            )}
                            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 text-sm rounded-full font-bold shadow-lg">
                                ${course.price}
                            </div>
                        </div>

                        <div className="flex flex-col p-6 md:p-8">
                            <CardHeader className="p-0 mb-4">
                                <CardTitle className="text-2xl md:text-3xl font-bold">{course.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 flex-grow flex flex-col justify-between">
                                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                                    {course.description || "A comprehensive guide to starting your side business in 2026."}
                                </p>
                                <Link href="/pricing" className="block mt-auto">
                                    <Button size="lg" className="w-full text-lg h-12 font-bold" variant="default">
                                        Buy Now
                                    </Button>
                                </Link>
                            </CardContent>
                        </div>
                    </div>
                </Card>
            ) : (
                // Enrolled State - Learning Focus
                <Card className="hover:border-primary/50 transition-colors overflow-hidden border border-border/50 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
                        <div className="md:col-span-2 relative w-full aspect-auto md:h-full bg-muted min-h-[200px]">
                            {course.thumbnail_url ? (
                                <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <BookOpen className="w-16 h-16 text-white/80" />
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-3 flex flex-col p-6 md:p-8">
                            <CardHeader className="p-0 mb-4">
                                <div className="flex justify-between items-start gap-4">
                                    <CardTitle className="text-2xl font-bold">{course.title}</CardTitle>
                                    <div className="shrink-0 bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded-full font-medium border border-green-500/20">
                                        Active
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 flex-grow flex flex-col justify-between">
                                <div className="space-y-6">
                                    <p className="text-muted-foreground line-clamp-2">
                                        {course.description}
                                    </p>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm font-medium">
                                            <span>Your Progress</span>
                                            <span className="text-primary">{progressPercentage}%</span>
                                        </div>
                                        <Progress value={progressPercentage} className="h-3" />
                                    </div>
                                </div>

                                <Link href={`/learn/${course.id}`} className="block mt-8">
                                    <Button size="lg" className="w-full text-lg h-12 font-bold shadow-md shadow-primary/20">
                                        Continue Learning <BookOpen className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
