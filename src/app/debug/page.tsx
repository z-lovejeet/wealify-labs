"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DebugPage() {
    const [results, setResults] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const checkConnection = async () => {
        setLoading(true);
        const report: any = {
            timestamp: new Date().toISOString(),
            env: {
                hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
                hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                urlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 8) + "...",
            },
            auth: { status: "pending" },
            db: { status: "pending" }
        };

        try {
            const supabase = createClient();

            // 1. Test Auth (Get Session)
            const startAuth = performance.now();
            try {
                // Timeout promise for auth
                const authTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Auth Check Timed Out after 5s")), 5000));

                const { data, error } = await Promise.race([
                    supabase.auth.getSession(),
                    authTimeout
                ]) as any;

                if (error) throw error;
                report.auth = {
                    status: "success",
                    time: Math.round(performance.now() - startAuth) + "ms",
                    session: !!data.session
                };
            } catch (err: any) {
                report.auth = {
                    status: "error",
                    message: err.message || "Unknown Auth Error"
                };
            }

            // 2. Test DB (Simple Select)
            const startDb = performance.now();
            try {
                // Timeout promise for db
                const dbTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error("DB Check Timed Out after 5s")), 5000));

                const { data, error, count } = await Promise.race([
                    supabase.from("courses").select("id", { count: "exact", head: true }),
                    dbTimeout
                ]) as any;

                if (error) throw error;
                report.db = {
                    status: "success",
                    time: Math.round(performance.now() - startDb) + "ms",
                    count: count
                };
            } catch (err: any) {
                report.db = {
                    status: "error",
                    message: err.message || "Unknown DB Error",
                    details: err
                };
            }

        } catch (err: any) {
            report.initError = err.message;
        }

        setResults(report);
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">System Connectivity Debug</h1>

            <Button onClick={checkConnection} disabled={loading}>
                {loading ? "Running Diagnostics..." : "Run Connection Test"}
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>Results</CardTitle>
                </CardHeader>
                <CardContent>
                    <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs font-mono whitespace-pre-wrap">
                        {JSON.stringify(results, null, 2)}
                    </pre>
                </CardContent>
            </Card>

            <div className="text-sm text-muted-foreground">
                <p><strong>Note:</strong> If "env" shows false for hasUrl or hasKey, you are missing Environment Variables in Vercel.</p>
                <p><strong>Note:</strong> If "auth" or "db" times out, likely a firewall or network issue.</p>
            </div>
        </div>
    );
}
