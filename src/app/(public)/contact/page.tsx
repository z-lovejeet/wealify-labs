"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
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
                                <form className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="first-name">First name</Label>
                                            <Input id="first-name" placeholder="John" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="last-name">Last name</Label>
                                            <Input id="last-name" placeholder="Doe" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" placeholder="john@example.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea id="message" placeholder="How can we help you?" className="min-h-[150px]" />
                                    </div>
                                    <Button className="w-full h-12 text-lg">Send Message</Button>
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
