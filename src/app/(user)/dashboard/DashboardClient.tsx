"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PlayCircle, Award, Clock, BookOpen, Star, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface DashboardClientProps {
    user: any;
    course: any;
    isEnrolled: boolean;
    stats: {
        totalLessons: number;
        completedLessons: number;
        progress: number;
    };
}

export default function DashboardClient({ user, course, isEnrolled, stats }: DashboardClientProps) {
    const supabase = createClient();

    // Certificate Request State (Synced)
    const [certRequests, setCertRequests] = useState<any[]>([]);
    const [userReview, setUserReview] = useState<any>(null);
    const [isLoadingCert, setIsLoadingCert] = useState(true);

    // State for modals
    const [isCertModalOpen, setIsCertModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    // Certificate Form State
    const [certName, setCertName] = useState("");
    const [certEmail, setCertEmail] = useState("");
    const [certStatus, setCertStatus] = useState<"idle" | "submitting" | "success">("idle");

    // Review Form State
    const [reviewName, setReviewName] = useState("");
    const [reviewCountry, setReviewCountry] = useState("");
    const [reviewFeedback, setReviewFeedback] = useState("");
    const [reviewStatus, setReviewStatus] = useState<"idle" | "submitting" | "success">("idle");

    // Fetch Requests & Subscribe
    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            const { data, error } = await supabase
                .rpc('get_user_dashboard_data', {
                    target_course_id: course.id
                });

            if (data) {
                // The RPC returns { cert_requests: [...], review: ... }
                // We need to type cast or just use it since it's JSON
                const result = data as any;
                if (result.cert_requests) setCertRequests(result.cert_requests);
                if (result.review) setUserReview(result.review);
            } else if (error) {
                console.error("Dashboard RPC Fetch Error:", error);
            }

            setIsLoadingCert(false);
        };

        fetchData();

        const channel = supabase
            .channel('dashboard_updates')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'certificate_requests',
                filter: `user_id=eq.${user.id}`
            }, () => {
                fetchData();
            })
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'reviews',
                filter: `user_id=eq.${user.id}`
            }, () => {
                fetchData();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, course.id, supabase]);

    const handleRequestCertificate = async () => {
        setCertStatus("submitting");
        try {
            const { data, error } = await supabase.from('certificate_requests').insert({
                user_id: user.id,
                course_id: course.id,
                full_name: certName,
                email: certEmail,
                status: 'pending'
            }).select().single();

            if (error) throw error;

            // Instant UI Update
            setCertRequests(prev => [data, ...prev]);

            setCertStatus("success");
        } catch (error) {
            console.error(error);
            setCertStatus("idle");
            alert("Failed to submit request.");
        }
    };

    const handleSubmitReview = async () => {
        setReviewStatus("submitting");
        try {
            const { data, error } = await supabase.from('reviews').insert({
                user_id: user.id,
                course_id: course.id,
                student_name: reviewName,
                student_country: reviewCountry,
                feedback: reviewFeedback
            }).select().single();

            if (error) throw error;

            // Instant UI Update
            setUserReview(data);

            setReviewStatus("success");
        } catch (error) {
            console.error(error);
            setReviewStatus("idle");
            alert("Failed to submit review.");
        }
    };

    const firstName = user?.profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Member";
    const isCompleted = stats.progress === 100;

    // Derived State for Certificate Button
    const rejectedCount = certRequests.filter(r => r.status === 'rejected').length;
    const latestRequest = certRequests[0];
    const isBlocked = rejectedCount >= 3;
    const isPending = latestRequest?.status === 'pending';
    const isApproved = latestRequest?.status === 'approved';

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">
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
                        <div className="text-2xl font-bold">{isApproved ? 1 : 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Earn upon 100% completion</p>
                    </CardContent>
                </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
                {(() => {
                    if (isApproved) {
                        return (
                            <Button className="gap-2 bg-green-600/10 text-green-600 hover:bg-green-600/20 border-green-600/20 border cursor-default" variant="outline">
                                <CheckCircle className="w-4 h-4" /> Certificate Approved - Will be emailed within 24hrs
                            </Button>
                        )
                    }
                    if (isPending) {
                        return (
                            <Button className="gap-2" variant="secondary" disabled>
                                <Clock className="w-4 h-4" /> Request Pending
                            </Button>
                        )
                    }
                    if (isBlocked) {
                        return (
                            <Button className="gap-2" variant="destructive" disabled>
                                <Award className="w-4 h-4" /> Request Limit Reached
                            </Button>
                        )
                    }

                    return (
                        <Button
                            className="gap-2"
                            variant={isCompleted ? "default" : "outline"}
                            disabled={!isCompleted || isLoadingCert}
                            onClick={() => setIsCertModalOpen(true)}
                        >
                            <Award className="w-4 h-4" />
                            {rejectedCount > 0 ? `Retry Request (${3 - rejectedCount} left)` : "Request Certificate"}
                            {!isCompleted && " (Locked)"}
                        </Button>
                    );
                })()}

                {userReview ? (
                    <Button
                        className="gap-2"
                        variant="secondary"
                        disabled
                    >
                        <Star className="w-4 h-4" /> Review Submitted
                    </Button>
                ) : (
                    <Button
                        className="gap-2"
                        variant={isCompleted ? "secondary" : "outline"}
                        disabled={!isCompleted}
                        onClick={() => setIsReviewModalOpen(true)}
                    >
                        <Star className="w-4 h-4" /> Write Review {(!isCompleted) && "(Locked)"}
                    </Button>
                )}
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
                                        <BookOpen className="w-12 h-12 text-muted-foreground/50" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <BookOpen className="w-12 h-12 text-white" />
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
                                                Resume Learning <BookOpen className="w-4 h-4" />
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

            {/* Certificate Modal */}
            {isCertModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                    <Card className="w-full max-w-md relative">
                        <div className="absolute top-4 right-4 cursor-pointer p-2" onClick={() => setIsCertModalOpen(false)}>
                            X
                        </div>
                        <CardHeader>
                            <CardTitle>Request Certificate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {certStatus === "success" ? (
                                <div className="text-center py-8">
                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold mb-2">Request Sent!</h3>
                                    <p className="text-muted-foreground">We will review your progress and email your certificate shortly.</p>
                                    <Button onClick={() => setIsCertModalOpen(false)} className="mt-6">Close</Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground">Please confirm your details for the certificate.</p>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Full Name (for Certificate)</label>
                                        <input
                                            className="w-full p-2 border rounded-md bg-background"
                                            value={certName}
                                            onChange={(e) => setCertName(e.target.value)}
                                            placeholder="e.g. John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email Address</label>
                                        <input
                                            className="w-full p-2 border rounded-md bg-background"
                                            value={certEmail}
                                            onChange={(e) => setCertEmail(e.target.value)}
                                            placeholder="e.g. john@example.com"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2 pt-4">
                                        <Button variant="outline" onClick={() => setIsCertModalOpen(false)}>Cancel</Button>
                                        <Button onClick={handleRequestCertificate} disabled={certStatus === "submitting" || !certName || !certEmail}>
                                            {certStatus === "submitting" ? "Sending..." : "Request Certificate"}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Review Modal */}
            {isReviewModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                    <Card className="w-full max-w-md relative">
                        <div className="absolute top-4 right-4 cursor-pointer p-2" onClick={() => setIsReviewModalOpen(false)}>
                            X
                        </div>
                        <CardHeader>
                            <CardTitle>Write a Review</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {reviewStatus === "success" ? (
                                <div className="text-center py-8">
                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                                    <p className="text-muted-foreground">Your feedback helps us improve.</p>
                                    <Button onClick={() => setIsReviewModalOpen(false)} className="mt-6">Close</Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Your Name</label>
                                        <input
                                            className="w-full p-2 border rounded-md bg-background"
                                            value={reviewName}
                                            onChange={(e) => setReviewName(e.target.value)}
                                            placeholder="Your Name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Country</label>
                                        <input
                                            className="w-full p-2 border rounded-md bg-background"
                                            value={reviewCountry}
                                            onChange={(e) => setReviewCountry(e.target.value)}
                                            placeholder="e.g. USA"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Feedback</label>
                                        <textarea
                                            className="w-full p-2 border rounded-md bg-background min-h-[100px]"
                                            value={reviewFeedback}
                                            onChange={(e) => setReviewFeedback(e.target.value)}
                                            placeholder="What did you think of the course?"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2 pt-4">
                                        <Button variant="outline" onClick={() => setIsReviewModalOpen(false)}>Cancel</Button>
                                        <Button onClick={handleSubmitReview} disabled={reviewStatus === "submitting" || !reviewName || !reviewFeedback}>
                                            {reviewStatus === "submitting" ? "Submitting..." : "Submit Review"}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
