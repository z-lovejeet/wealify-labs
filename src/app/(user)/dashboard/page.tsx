"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PlayCircle, Award, Clock, Loader2, BookOpen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const COURSE_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [course, setCourse] = useState<any>(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [stats, setStats] = useState({
        totalLessons: 0,
        completedLessons: 0,
        progress: 0
    });

    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Parallel Fetch 1: Profile, Course, Enrollments
            const [profileResult, courseResult, enrollmentResult] = await Promise.all([
                supabase.from('profiles').select('*').eq('id', user.id).single(),
                supabase.from('courses').select('*').eq('id', COURSE_ID).single(),
                supabase.from('enrollments').select('*').eq('user_id', user.id).eq('course_id', COURSE_ID)
            ]);

            const profile = profileResult.data;
            const courseData = courseResult.data;
            const enrollments = enrollmentResult.data;

            setUser({ ...user, profile });
            setCourse(courseData);

            const userIsEnrolled = enrollments && enrollments.length > 0;
            setIsEnrolled(!!userIsEnrolled);

            let newStats = { totalLessons: 0, completedLessons: 0, progress: 0 };

            if (userIsEnrolled && courseData) {
                // Fetch Modules (to get lesson IDs) and Completed Lessons in parallel? 
                // We need lesson IDs first to query progress efficiently, OR we can query progress just by user_id and course_id not possible directly without join.
                // Let's get modules first.
                const { data: modules } = await supabase
                    .from('modules')
                    .select('id, lessons(id)')
                    .eq('course_id', COURSE_ID);

                let total = 0;
                let lessonIds: string[] = [];

                if (modules) {
                    modules.forEach((m: any) => {
                        if (m.lessons) {
                            total += m.lessons.length;
                            m.lessons.forEach((l: any) => lessonIds.push(l.id));
                        }
                    });
                }
                newStats.totalLessons = total;

                // Now fetch completed count
                if (lessonIds.length > 0) {
                    const { count } = await supabase
                        .from('lesson_progress')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', user.id)
                        .eq('is_completed', true)
                        .in('lesson_id', lessonIds);

                    newStats.completedLessons = count || 0;
                }

                newStats.progress = newStats.totalLessons > 0
                    ? Math.round((newStats.completedLessons / newStats.totalLessons) * 100)
                    : 0;
            }

            setStats(newStats);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    const firstName = user?.profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Member";

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, {firstName}!</h1>
                <p className="text-muted-foreground">You've made great progress. Keep learning!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-primary/10 to-card border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                        <Clock className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.progress}%</div>
                        <Progress value={stats.progress} className="mt-3 bg-primary/20" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Completed Lessons</CardTitle>
                        <PlayCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.completedLessons} / {stats.totalLessons}</div>
                        <p className="text-xs text-muted-foreground mt-1">Keep going!</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Certificates</CardTitle>
                        <Award className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground mt-1">Earn upon 100% completion</p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Your Course</h2>
                    <Link href="/my-courses"><Button variant="link">View Details</Button></Link>
                </div>

                {isEnrolled && course ? (
                    <div className="w-full gap-6">
                        <Card className="flex flex-col md:flex-row overflow-hidden hover:bg-card/50 transition-colors border-primary/20 group cursor-pointer">
                            <div className="w-full md:w-72 h-48 md:h-auto bg-muted shrink-0 relative overflow-hidden">
                                {course.thumbnail_url ? (
                                    <img src={course.thumbnail_url} alt={course.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-secondary/30">
                                        <PlayCircle className="w-12 h-12 text-muted-foreground/50" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <PlayCircle className="w-12 h-12 text-white" />
                                </div>
                            </div>
                            <div className="flex-1 p-6 flex flex-col">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-xl mb-1 group-hover:text-primary transition-colors">{course.title}</h3>
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                                            Active Course
                                        </span>
                                    </div>
                                </div>

                                <p className="text-sm text-muted-foreground mb-6 line-clamp-2 md:line-clamp-3 leading-relaxed">
                                    {course.description}
                                </p>

                                <div className="mt-auto space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-medium text-muted-foreground">
                                            <span>{stats.progress}% Complete</span>
                                            <span>{stats.completedLessons} / {stats.totalLessons} Lessons</span>
                                        </div>
                                        <Progress value={stats.progress} className="h-2" />
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <Link href={`/learn/${course.id}`}>
                                            <Button className="font-bold gap-2">
                                                Resume Learning <PlayCircle className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div className="text-center py-12 border rounded-xl bg-muted/20">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Not Enrolled</h3>
                        <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                            You are not enrolled in the course yet.
                        </p>
                        <Link href="/pricing">
                            <Button variant="outline">Buy Now</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
