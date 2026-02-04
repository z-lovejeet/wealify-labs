"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function AuthCodeErrorContent() {
    const searchParams = useSearchParams();
    const [hashError, setHashError] = useState<string | null>(null);

    // Derived state for search params (no effect needed)
    const searchError = searchParams.get("error_description") || searchParams.get("error");

    useEffect(() => {
        // Only check hash params on mount/client-side
        if (!searchError && typeof window !== "undefined" && window.location.hash) {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const errorMsg = hashParams.get("error_description") || hashParams.get("error");
            if (errorMsg) {
                setTimeout(() => setHashError(errorMsg), 0);
            }
        }
    }, [searchError]); // Depend on searchError to avoid overwriting if search exists

    const displayError = searchError || hashError || "An unknown authentication error occurred.";

    return (
        <Card className="w-full max-w-md border-destructive/50 shadow-lg">
            <CardHeader className="text-center">
                <div className="mx-auto bg-destructive/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-6 h-6 text-destructive" />
                </div>
                <CardTitle className="text-2xl font-bold text-destructive">Authentication Error</CardTitle>
                <CardDescription>
                    We encountered an issue verifying your login.
                </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <div className="p-4 bg-secondary/50 rounded-lg text-sm text-foreground/80 font-mono break-words">
                    {displayError}
                </div>
                <p className="text-sm text-muted-foreground">
                    This link may have expired or has already been used. Please try requesting a new one.
                </p>
            </CardContent>
            <CardFooter className="justify-center">
                <Link href="/login">
                    <Button variant="default" className="font-bold">
                        Return to Login
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}

export default function AuthCodeErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Suspense fallback={<div className="text-center">Loading error details...</div>}>
                <AuthCodeErrorContent />
            </Suspense>
        </div>
    );
}
