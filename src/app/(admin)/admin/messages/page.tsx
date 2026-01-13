import { createClient } from "@/lib/supabase/server";
import MessagesClient from "./MessagesClient";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw } from "lucide-react";
import Link from "next/link";

export default async function AdminMessagesPage() {
    const supabase = await createClient();

    try {
        const { data: messages, error } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return <MessagesClient initialMessages={messages || []} />;

    } catch (error: any) {
        console.error("Server-side fetch error:", error);
        return (
            <div className="flex flex-col items-center justify-center p-12 gap-4 text-center">
                <div className="bg-destructive/10 p-4 rounded-full text-destructive">
                    <Mail className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl">Failed to load messages</h3>
                <p className="text-destructive max-w-md">{error.message || "Unknown error occurred"}</p>
                <div className="text-sm text-muted-foreground bg-secondary/50 p-4 rounded-md font-mono text-left w-full max-w-lg overflow-auto">
                    {JSON.stringify(error, null, 2)}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                    Please ensure the <code>contact_messages</code> table exists in your Supabase database.
                </p>
                <Link href="/admin/messages">
                    <Button variant="outline" className="mt-4 gap-2">
                        <RefreshCw className="w-4 h-4" /> Try Again
                    </Button>
                </Link>
            </div>
        );
    }
}
