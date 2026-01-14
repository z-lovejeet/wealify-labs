"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Globe, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <div className="bg-background min-h-screen">
            {/* Hero Section */}
            <section className="relative py-32 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-70" />
                <div className="container relative z-10 px-6 mx-auto text-center max-w-5xl">
                    <Badge variant="outline" className="mb-8 px-6 py-2 border-primary/20 text-primary bg-primary/5 text-sm uppercase tracking-widest font-semibold">About Wealify Labs</Badge>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight"
                    >
                        Building the Future of <span className="text-primary block md:inline">Digital Innovation</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto"
                    >
                        Wealify Labs provides premium, project-based learning resources for developers and creators who demand excellence. We bridge the gap between theory and production.
                    </motion.p>
                </div>
            </section>

            {/* Story/Values Section */}
            <section className="py-20 bg-secondary/5 border-y border-border/50">
                <div className="container px-6 mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-16 items-start">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl font-bold">What We Do</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                At Wealify Labs, we specialize in high-quality, project-based education. We don't just teach syntax; we teach <strong>architecture, best practices, and production readiness</strong>.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                Our mission is to empower developers to build complex, scalable applications by providing them with the "Cheat Codes" to modern development—starter kits, comprehensive courses, and reusable components.
                            </p>

                            <h3 className="text-xl font-bold pt-4">Our Core Values</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 p-1 bg-primary/10 rounded-full text-primary"><CheckCircle2 className="w-4 h-4" /></div>
                                    <span className="text-muted-foreground"><strong>Practical Focus:</strong> No fluff. We focus on tools you will actually use in the industry.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 p-1 bg-primary/10 rounded-full text-primary"><CheckCircle2 className="w-4 h-4" /></div>
                                    <span className="text-muted-foreground"><strong>Modern Standards:</strong> We teach the latest versions of Next.js, React, and TypeScript.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 p-1 bg-primary/10 rounded-full text-primary"><CheckCircle2 className="w-4 h-4" /></div>
                                    <span className="text-muted-foreground"><strong>Transparency:</strong> What you see is what you get. No hidden fees or fake promises.</span>
                                </li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl font-bold">What We Sell</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We offer a curated selection of premium courses and digital assets designed to accelerate your career.
                            </p>

                            <div className="grid gap-6">
                                <Card className="bg-background border-border/50">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="p-2 bg-primary/10 rounded-lg text-primary"><Globe className="w-5 h-5" /></div>
                                            <h3 className="font-bold text-lg">Full-Stack Courses</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Comprehensive guides on building SaaS platforms, E-commerce sites, and interactive dashboards from scratch.</p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-background border-border/50">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="p-2 bg-primary/10 rounded-lg text-primary"><Users className="w-5 h-5" /></div>
                                            <h3 className="font-bold text-lg">Mentorship & Community</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Access to a private community of builders where you can ask questions, share progress, and find collaborators.</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center text-center space-y-8"
                >
                    <h2 className="text-3xl md:text-5xl font-bold max-w-2xl mx-auto">Start Your Learning Journey</h2>
                    <Link href="/courses">
                        <Button size="lg" className="rounded-full px-10 h-14 text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">Explore Courses</Button>
                    </Link>
                </motion.div>
            </section>
        </div>
    );
}
