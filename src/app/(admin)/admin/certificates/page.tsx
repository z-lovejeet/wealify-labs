"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, Loader2, Mail } from "lucide-react";

export default function AdminCertificatesPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        let mounted = true;

        const fetchRequests = async () => {
            try {
                // Timeout helper
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Certificates fetch timed out")), 15000)
                );

                await Promise.race([
                    (async () => {
                        const { data, error } = await supabase
                            .from('certificate_requests')
                            .select(`
                                *,
                                courses (title)
                            `)
                            .order('created_at', { ascending: false });

                        if (error) {
                            console.error("Supabase Error:", error);
                            // Don't throw, just handle it
                        }

                        if (mounted) {
                            setRequests(data || []);
                        }
                    })(),
                    timeoutPromise
                ]);

                if (mounted) setLoading(false);
            } catch (error) {
                console.error("Fetch Error:", error);
                if (mounted) setLoading(false);
            }
        };

        fetchRequests();

        const channel = supabase
            .channel('certificate_requests_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'certificate_requests'
                },
                (payload) => {
                    fetchRequests();
                }
            )
            .subscribe();

        return () => {
            mounted = false;
            supabase.removeChannel(channel);
        };
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('certificate_requests')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            // Optimistic update
            setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Certificate Requests</h1>

            <div className="grid gap-4">
                {requests.length === 0 ? (
                    <p className="text-muted-foreground">No certificate requests found.</p>
                ) : (
                    requests.map((req) => (
                        <Card key={req.id}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-medium">{req.full_name}</CardTitle>
                                <div className={`px-2 py-1 rounded-full text-xs font-bold border ${req.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' :
                                    req.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                                        'bg-yellow-100 text-yellow-700 border-yellow-200'
                                    }`}>
                                    {req.status.toUpperCase()}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        <p><span className="font-semibold text-foreground">Email:</span> {req.email}</p>
                                        <p><span className="font-semibold text-foreground">Course:</span> {req.courses?.title}</p>
                                        <p><span className="font-semibold text-foreground">Date:</span> {new Date(req.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center justify-end gap-2">
                                        {req.status === 'pending' && (
                                            <>
                                                <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleStatusUpdate(req.id, 'approved')}>
                                                    <CheckCircle className="w-4 h-4 mr-1" /> Approve
                                                </Button>
                                                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleStatusUpdate(req.id, 'rejected')}>
                                                    <XCircle className="w-4 h-4 mr-1" /> Reject
                                                </Button>
                                            </>
                                        )}
                                        {req.status === 'approved' && (
                                            <Button size="sm" variant="secondary">
                                                <Mail className="w-4 h-4 mr-1" /> Send Email
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
