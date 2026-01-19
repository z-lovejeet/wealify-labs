"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Mail, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface CertificatesClientProps {
    initialRequests: any[];
}

export default function AdminCertificatesClient({ initialRequests }: CertificatesClientProps) {
    const [requests, setRequests] = useState<any[]>(initialRequests);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const channel = supabase
            .channel('certificate_requests_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'certificate_requests'
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

    // Keep requests in sync with props when SSR refresh happens
    useEffect(() => {
        setRequests(initialRequests);
    }, [initialRequests]);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        // Optimistic update
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));

        try {
            const { error } = await supabase
                .from('certificate_requests')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            router.refresh();
        } catch (error) {
            console.error("Failed to update status", error);
            // Revert on error - triggered by refresh or next reload
        }
    };

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
