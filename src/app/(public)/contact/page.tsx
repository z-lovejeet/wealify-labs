"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        message: ""
    });

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create a timeout promise to prevent infinite hanging
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Request timed out - Server did not respond")), 15000)
            );

            // Race the insert against the timeout
            const { error } = await Promise.race([
                supabase
                    .from('contact_messages')
                    .insert([formData]),
                timeoutPromise
            ]) as any;

            if (error) throw error;

            toast.success("Message sent successfully! We'll get back to you soon.");
            setFormData({ first_name: "", last_name: "", email: "", message: "" });
        } catch (error: any) {
            console.error("Submission error:", error);
            // Check for likely missing table error to give better feedback (conditionally)
            const isMissingTable = error.message?.includes("relation") || error.message?.includes("exist");

            toast.error(
                isMissingTable
                    ? "System Error: Message service unavailable. Please contact admin."
                    : "Failed to send message: " + (error.message || "Unknown error")
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="bg-background min-h-screen py-24">
            <div className="container px-6 mx-auto max-w-6xl">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
                        <p className="text-xl text-muted-foreground">Have questions? We're here to help you start your journey.</p>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card className="border-border/50 shadow-lg">
                            <CardHeader>
                                <CardTitle>Send us a message</CardTitle>
                                <CardDescription>Fill out the form below and we'll get back to you within 24 hours.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="first_name">First name</Label>
                                            <Input
                                                id="first_name"
                                                value={formData.first_name}
                                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                                placeholder="John"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="last_name">Last name</Label>
                                            <Input
                                                id="last_name"
                                                value={formData.last_name}
                                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                                placeholder="Doe"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="john@example.com"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea
                                            id="message"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder="How can we help you?"
                                            className="min-h-[150px]"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                    <Button className="w-full h-12 text-lg" disabled={loading}>
                                        {loading ? "Sending..." : "Send Message"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        className="space-y-8 lg:pt-8"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold">Contact Information</h2>
                            <p className="text-muted-foreground">
                                Prefer direct contact? Reach out to us through any of these channels.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <Card className="bg-secondary/5 border-none hover:bg-secondary/10 transition-colors">
                                <CardContent className="flex items-center gap-4 p-6">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="font-semibold">Email</div>
                                        <div className="text-muted-foreground text-sm">support@wealifylabs.site</div>
                                    </div>
                                </CardContent>
                            </Card>




                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
