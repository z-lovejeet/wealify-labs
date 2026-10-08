"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Globe, Users, TrendingUp, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <div className="bg-background min-h-screen pt-24 pb-24 relative overflow-hidden">
            {/* Ambient Background Glows matching Pricing & Contact */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-10 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px]" />
                <div className="absolute bottom-10 left-1/4 w-[600px] h-[600px] bg-secondary/15 rounded-full blur-[140px]" />
            </div>

            <div className="container max-w-6xl mx-auto px-6">
                {/* Hero Header - Exactly Proportional to Pricing & Contact */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Badge variant="outline" className="mb-4 px-4 py-1.5 border-primary/30 text-primary bg-primary/5 uppercase tracking-widest text-xs font-semibold">
                            About Wealify Labs
                        </Badge>
                        <h1 className="text-4xl sm:text-6xl font-black mb-6 tracking-tight text-foreground leading-[1.1]">
                            Empowering Your Journey to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-primary to-amber-200">
                                Digital Wealth
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                            Actionable, blueprint-driven education for ambitious builders and professionals looking to construct sustainable digital income streams in 2026.
                        </p>
                    </motion.div>
                </div>

                {/* Main Content Grid */}
                <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
                    {/* Left: What We Do & Philosophy */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold text-primary uppercase tracking-widest">Founded Dec 2025</span>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground font-medium">Founder: Lovejeet Singh</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-4">Building The AI-Native Digital Venture Platform</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                            Wealify Labs was founded in <strong>December 2025</strong> by <strong>Lovejeet Singh</strong> with a singular mission: to replace obsolete, passive video courses with an <strong>AI-augmented execution platform</strong> designed for the 2026 digital economy.
                        </p>
                        <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                            Instead of leaving students stranded with theory, Wealify combines <strong>48 battle-tested masterclass blueprints</strong> with real-time <strong>Claude 5.5 Sonnet AI Copilots</strong>. Our platform audits your business ideas, stress-tests your pricing, drafts conversion copy, and provides chapter-by-chapter mentorship 24/7.
                        </p>

                        <div className="pt-4">
                            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                Three AI Platform Pillars
                            </h3>
                            <ul className="space-y-3.5">
                                <li className="flex items-start gap-3 p-3.5 rounded-xl bg-card/60 border border-border/50">
                                    <div className="mt-0.5 p-1 bg-primary/10 rounded-lg text-primary shrink-0"><CheckCircle2 className="w-4 h-4" /></div>
                                    <div className="text-xs sm:text-sm text-muted-foreground">
                                        <strong className="text-foreground">Agentic Curriculum Copilot:</strong> An interactive mentor inside the course player that contextualizes each chapter, diagnoses weaknesses, and produces custom 3-step action plans.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 p-3.5 rounded-xl bg-card/60 border border-border/50">
                                    <div className="mt-0.5 p-1 bg-primary/10 rounded-lg text-primary shrink-0"><CheckCircle2 className="w-4 h-4" /></div>
                                    <div className="text-xs sm:text-sm text-muted-foreground">
                                        <strong className="text-foreground">Venture Idea Auditor:</strong> Multi-step evaluation engine that evaluates student offers against market viability, unit economics, and 7-day zero-cost validation tests.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 p-3.5 rounded-xl bg-card/60 border border-border/50">
                                    <div className="mt-0.5 p-1 bg-primary/10 rounded-lg text-primary shrink-0"><CheckCircle2 className="w-4 h-4" /></div>
                                    <div className="text-xs sm:text-sm text-muted-foreground">
                                        <strong className="text-foreground">Direct-Response Copy Architect:</strong> Generates high-converting marketing hooks, value propositions, and risk-reversal guarantees tailored to each student&apos;s niche.
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* Right: Deliverables & Value Bento */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div>
                            <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2">Student Experience</span>
                            <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-4">What You Receive</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                            Unrestricted lifetime enrollment to our full educational workspace and learning environment.
                        </p>

                        <div className="grid gap-4">
                            <Card className="bg-card/70 border border-border/60 backdrop-blur-md rounded-2xl">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3.5 mb-2.5">
                                        <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-xl text-primary"><TrendingUp className="w-5 h-5" /></div>
                                        <h3 className="font-bold text-base text-foreground">The Modern Side Hustle Blueprint</h3>
                                    </div>
                                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                        47 concise chapters covering mindset, validation, high-converting offer creation, automated funnels, and scale.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-card/70 border border-border/60 backdrop-blur-md rounded-2xl">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3.5 mb-2.5">
                                        <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400"><Globe className="w-5 h-5" /></div>
                                        <h3 className="font-bold text-base text-foreground">Downloadable Toolkits & Assets</h3>
                                    </div>
                                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                        Direct access to validation scorecards, copy swipe files, financial trackers, and Notion execution databases.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-card/70 border border-border/60 backdrop-blur-md rounded-2xl">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3.5 mb-2.5">
                                        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400"><Users className="w-5 h-5" /></div>
                                        <h3 className="font-bold text-base text-foreground">Official Digital Certificate</h3>
                                    </div>
                                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                        An official verified completion credential issued upon finishing all curriculum chapters and milestones.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                </div>

                {/* Clean Bottom Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="p-8 sm:p-12 rounded-3xl border border-primary/30 bg-gradient-to-br from-card/90 via-card/50 to-primary/5 backdrop-blur-xl text-center shadow-xl relative overflow-hidden"
                >
                    <div className="max-w-xl mx-auto space-y-5">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                            <ShieldCheck className="w-4 h-4" /> Start Today
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
                            Ready to Build Your Digital Assets?
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Unlock immediate lifetime enrollment with cryptocurrency via NOWPayments.
                        </p>
                        <div className="pt-2">
                            <Link href="/pricing">
                                <Button size="lg" className="rounded-full px-8 h-12 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-105 group">
                                    <span>Enroll in the Blueprint</span>
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
