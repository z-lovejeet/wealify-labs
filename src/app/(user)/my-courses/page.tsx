import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Sparkles, CheckCircle2, ArrowRight, PlayCircle } from "lucide-react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { singleCourse } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

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

    const { data: { user } } = await supabase.auth.getUser();

    // 1. Fetch User Enrollments with Course Details
    let enrolledCourses: any[] = [];
    if (user) {
        const { data: enrollments } = await supabase
            .from('enrollments')
            .select('id, course_id, courses(*)')
            .eq('user_id', user.id);

        if (enrollments && enrollments.length > 0) {
            const resolved = await Promise.all(
                enrollments.map(async (e: any) => {
                    const rawCourse = Array.isArray(e.courses) ? e.courses[0] : e.courses;
                    if (!rawCourse) return null;

                    const [modulesRes, completionsRes] = await Promise.all([
                        supabase.from('modules').select('id, lessons(id)').eq('course_id', rawCourse.id),
                        supabase.from('lesson_completions').select('*', { count: 'exact', head: true })
                            .eq('user_id', user.id)
                            .eq('course_id', rawCourse.id)
                    ]);

                    let totalLessons = 0;
                    if (modulesRes.data) {
                        modulesRes.data.forEach((m: any) => {
                            if (m.lessons) totalLessons += m.lessons.length;
                        });
                    }
                    const completedCount = completionsRes.count || 0;
                    const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

                    return {
                        ...rawCourse,
                        progress,
                        totalLessons,
                        completedCount,
                    };
                })
            );
            enrolledCourses = resolved.filter(Boolean);
        }
    }

    // 2. If not enrolled in any course, fetch primary course for sales card
    let featuredCourse: any = singleCourse;
    if (enrolledCourses.length === 0) {
        const { data: dbCourse } = await supabase
            .from('courses')
            .select('*')
            .limit(1)
            .maybeSingle();

        if (dbCourse) {
            featuredCourse = dbCourse;
        }
    }

    const featuredThumbnail = featuredCourse.thumbnail_url || featuredCourse.image;

    return (
        <div className="space-y-8 max-w-5xl mx-auto py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">My Curriculum</h1>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                        Access your enrolled masterclasses, study notes, and track your graduation milestones.
                    </p>
                </div>
                {enrolledCourses.length > 0 && (
                    <Badge variant="outline" className="w-fit px-3 py-1 bg-primary/5 text-primary border-primary/30 text-xs font-semibold">
                        {enrolledCourses.length} Active Masterclass{enrolledCourses.length > 1 ? "es" : ""}
                    </Badge>
                )}
            </div>

            {enrolledCourses.length > 0 ? (
                <div className="grid gap-6">
                    {enrolledCourses.map((course: any) => (
                        <Card key={course.id} className="overflow-hidden border border-border/60 bg-card/70 backdrop-blur-xl shadow-xl rounded-3xl hover:border-primary/40 transition-all duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                                <div className="md:col-span-5 relative w-full aspect-video md:aspect-auto md:h-full bg-muted min-h-[240px] overflow-hidden">
                                    {course.thumbnail_url ? (
                                        <Image
                                            src={course.thumbnail_url}
                                            alt={course.title}
                                            fill
                                            className="object-cover transition-transform duration-500 hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 40vw"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-card/80">
                                            <BookOpen className="w-16 h-16 text-primary/40" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-foreground border border-border/50">
                                        Flagship Blueprint
                                    </div>
                                </div>

                                <div className="md:col-span-7 flex flex-col p-6 sm:p-8 justify-between">
                                    <div>
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <h2 className="text-2xl font-bold text-foreground leading-tight">{course.title}</h2>
                                            <span className="shrink-0 inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full font-bold border border-emerald-500/20">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                Active Access
                                            </span>
                                        </div>

                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-6 leading-relaxed">
                                            {course.description}
                                        </p>

                                        {/* Progress Bar & Counter */}
                                        <div className="space-y-2 bg-background/50 p-4 rounded-2xl border border-border/40">
                                            <div className="flex justify-between items-center text-xs font-semibold">
                                                <span className="text-muted-foreground uppercase tracking-wider">Overall Progress</span>
                                                <span className="text-primary font-bold">{course.progress}%</span>
                                            </div>
                                            <Progress value={course.progress} className="h-2 bg-secondary/30" />
                                            <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
                                                <span>{course.completedCount} of {course.totalLessons} lessons finished</span>
                                                {course.progress === 100 ? (
                                                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Course Complete
                                                    </span>
                                                ) : (
                                                    <span>{course.totalLessons - course.completedCount} remaining</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 mt-6 border-t border-border/40 flex items-center justify-between gap-4">
                                        <Link href={`/learn/${course.id}`} className="w-full">
                                            <Button size="lg" className="w-full h-12 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] group">
                                                <PlayCircle className="w-4 h-4 mr-2" />
                                                Resume Course Player
                                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                /* Unenrolled State */
                <Card className="overflow-hidden border border-border/60 bg-card/60 backdrop-blur-xl shadow-2xl rounded-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                        <div className="md:col-span-5 relative w-full aspect-video md:aspect-auto md:h-full bg-muted min-h-[260px]">
                            {featuredThumbnail ? (
                                <Image
                                    src={featuredThumbnail}
                                    alt={featuredCourse.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 40vw"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-card">
                                    <BookOpen className="w-16 h-16 text-primary/30" />
                                </div>
                            )}
                            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 text-xs rounded-full font-black shadow-lg">
                                ${featuredCourse.price} One-Time
                            </div>
                        </div>

                        <div className="md:col-span-7 flex flex-col p-6 sm:p-8 justify-between">
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-3">
                                    <Sparkles className="w-3.5 h-3.5" /> Recommended Masterclass
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-3">{featuredCourse.title}</h2>
                                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                                    {featuredCourse.description || "The end-to-end framework to build sustainable digital income streams with battle-tested funnels and automated systems."}
                                </p>

                                <div className="grid grid-cols-2 gap-3 text-xs text-foreground/90 mb-6">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        <span>47 In-Depth Chapters</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        <span>7 Business Models</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        <span>Templates & Guides</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        <span>Official Certificate</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-border/40">
                                <Link href="/pricing" className="block w-full">
                                    <Button size="lg" className="w-full h-12 text-sm font-black bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/20">
                                        Unlock Lifetime Enrollment &bull; ${featuredCourse.price}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* AI Venture Studio Included Hub */}
            <div className="pt-6 border-t border-border/40 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Included With Your Platform Access</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground">AI Venture Studio Tools</h2>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Accelerate your execution with our 120B reasoning model AI assistants built into your student portal.
                        </p>
                    </div>
                    <Link href="/dashboard">
                        <Button variant="outline" size="sm" className="hidden sm:inline-flex text-xs font-semibold">
                            Open Dashboard Studio
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/dashboard" className="group">
                        <Card className="p-5 h-full rounded-2xl bg-card/60 border border-border/60 hover:border-primary/40 transition-all duration-300 backdrop-blur-md group-hover:scale-[1.01]">
                            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                                24/7 AI Masterclass Mentor
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                                Ask curriculum-specific questions, request code reviews, or get chapter summaries instantly.
                            </p>
                        </Card>
                    </Link>

                    <Link href="/dashboard" className="group">
                        <Card className="p-5 h-full rounded-2xl bg-card/60 border border-border/60 hover:border-amber-400/40 transition-all duration-300 backdrop-blur-md group-hover:scale-[1.01]">
                            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <h3 className="font-bold text-sm text-foreground group-hover:text-amber-400 transition-colors">
                                Venture Viability Auditor
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                                Stress-test digital product ideas, audience economics, and distribution channels.
                            </p>
                        </Card>
                    </Link>

                    <Link href="/dashboard" className="group">
                        <Card className="p-5 h-full rounded-2xl bg-card/60 border border-border/60 hover:border-cyan-400/40 transition-all duration-300 backdrop-blur-md group-hover:scale-[1.01]">
                            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
                                <BookOpen className="w-4 h-4" />
                            </div>
                            <h3 className="font-bold text-sm text-foreground group-hover:text-cyan-400 transition-colors">
                                Offer & Copy Architect
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                                Draft high-converting landing page headlines, video sales hooks, and email sequences.
                            </p>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    );
}
