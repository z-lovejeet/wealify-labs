"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ReviewsClientProps {
    initialReviews: any[];
}

export default function AdminReviewsClient({ initialReviews }: ReviewsClientProps) {
    const [reviews, setReviews] = useState<any[]>(initialReviews);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const channel = supabase
            .channel('reviews_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'reviews'
                },
                () => {
                    // Refresh data from server
                    router.refresh();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [router, supabase]);


    useEffect(() => {
        setReviews(initialReviews);
    }, [initialReviews]);

    const togglePublicStatus = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('reviews')
                .update({ is_public: !currentStatus })
                .eq('id', id);

            if (error) throw error;
            // Optimistic update
            setReviews(prev => prev.map(r => r.id === id ? { ...r, is_public: !currentStatus } : r));
            router.refresh();
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const deleteReview = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;
        try {
            const { error } = await supabase
                .from('reviews')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setReviews(prev => prev.filter(r => r.id !== id));
            router.refresh();
        } catch (error) {
            console.error("Failed to delete review", error);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Course Reviews</h1>

            <div className="grid gap-4">
                {reviews.length === 0 ? (
                    <p className="text-muted-foreground">No reviews found.</p>
                ) : (
                    reviews.map((review) => (
                        <Card key={review.id}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-medium">{review.student_name} <span className="text-sm font-normal text-muted-foreground">from {review.student_country}</span></CardTitle>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className={review.is_public ? "text-green-600" : "text-muted-foreground"}
                                        onClick={() => togglePublicStatus(review.id, review.is_public)}
                                    >
                                        {review.is_public ? <Eye className="w-4 h-4 mr-1" /> : <EyeOff className="w-4 h-4 mr-1" />}
                                        {review.is_public ? "Public" : "Private"}
                                    </Button>
                                    <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => deleteReview(review.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm mb-4">"{review.feedback}"</p>
                                <div className="text-xs text-muted-foreground">
                                    Course: {review.courses?.title} • {new Date(review.created_at).toLocaleDateString()}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
