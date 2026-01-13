"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Message {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    message: string;
    created_at: string;
}

export default function MessagesClient({ initialMessages }: { initialMessages: Message[] }) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const supabase = createClient();
    const router = useRouter();

    const handleDelete = async (id: number) => {
        const { error } = await supabase.from('contact_messages').delete().eq('id', id);
        if (error) {
            toast.error("Failed to delete message");
        } else {
            toast.success("Message deleted");
            setMessages(prev => prev.filter(m => m.id !== id));
            router.refresh();
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Messages</h1>
                <p className="text-muted-foreground">View and manage support messages from users.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Inbox</CardTitle>
                    <CardDescription>You have {messages.length} messages.</CardDescription>
                </CardHeader>
                <CardContent>
                    {messages.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            No messages found.
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Message</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {messages.map((msg) => (
                                        <TableRow key={msg.id}>
                                            <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                                                {msg.created_at ? format(new Date(msg.created_at), "MMM d, yyyy") : "-"}
                                            </TableCell>
                                            <TableCell className="font-medium">{msg.first_name} {msg.last_name}</TableCell>
                                            <TableCell>{msg.email}</TableCell>
                                            <TableCell className="max-w-md truncate" title={msg.message}>
                                                {msg.message}
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(msg.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
