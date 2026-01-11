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

            // Fetch profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            setUser({ ...user, profile });

            // Fetch Single Course Details
            const { data: courseData } = await supabase
                .from('courses')
                .select('*')
                .eq('id', COURSE_ID)
                .single();

            setCourse(courseData);

            // Check Enrollment
            const { data: enrollments } = await supabase
                .from('enrollments')
                .select('*')
                .eq('user_id', user.id)
                .eq('course_id', COURSE_ID);

            const userIsEnrolled = enrollments && enrollments.length > 0;
            setIsEnrolled(!!userIsEnrolled);

            if (userIsEnrolled && courseData) {
                // 1. Get Total Lessons count
                // We need to join modules -> lessons. 
                // Client-side join: fetch all modules for course, then count lessons?
                // Or robust query:
                const { data: modules } = await supabase
                    .from('modules')
                    .select('id, lessons(id)')
                    .eq('course_id', COURSE_ID);

                let totalLessons = 0;
                let lessonIds: string[] = [];

                if (modules) {
                    modules.forEach((m: any) => {
                        if (m.lessons) {
                            totalLessons += m.lessons.length;
                            m.lessons.forEach((l: any) => lessonIds.push(l.id));
                        }
                    });
                }

                // 2. Get Completed Lessons count
                let completedCount = 0;
                if (lessonIds.length > 0) {
                    const { count } = await supabase
                        .from('lesson_progress')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', user.id)
                        .eq('is_completed', true)
                        .in('lesson_id', lessonIds);

                    completedCount = count || 0;
                }

                const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

                setStats({
                    totalLessons,
                    completedLessons: completedCount,
                    progress
                });
            }

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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        <Card className="flex flex-col md:flex-row overflow-hidden hover:bg-card/50 transition-colors">
                            <div className="w-full md:w-48 h-32 md:h-auto bg-muted shrink-0 relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <PlayCircle className="w-10 h-10 text-white/50" />
                                </div>
                            </div>
                            <div className="flex-1 p-5 flex flex-col justify-center">
                                <h3 className="font-bold text-lg mb-1">{course.title}</h3>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-1">{course.description}</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span>Progress</span>
                                        <span>{stats.progress}%</span>
                                    </div>
                                    <Progress value={stats.progress} className="h-2" />
                                </div>
                            </div>
                            <div className="p-5 flex items-center border-l border-border/50">
                                <Link href={`/learn/${course.id}`}>
                                    <Button size="sm">Resume</Button>
                                </Link>
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
