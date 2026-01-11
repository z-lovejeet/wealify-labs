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
                    <Badge variant="outline" className="mb-8 px-6 py-2 border-primary/20 text-primary bg-primary/5 text-sm uppercase tracking-widest font-semibold">Our Mission</Badge>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight"
                    >
                        We Empower The Next Generation of <span className="text-primary block md:inline">Digital Entrepreneurs</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto"
                    >
                        We believe that financial freedom shouldn't be a mystery. It's a skill that can be learned, mastered, and scaled. We provide the blueprint to escape the rat race.
                    </motion.p>
                </div>
            </section>

            {/* Story/Values Section */}
            <section className="py-20 bg-secondary/5 border-y border-border/50">
                <div className="container px-6 mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl font-bold">Our Story</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Started by a group of former corporate professionals who realized that the traditional "safe" path was anything but. After years of trial and error, we cracked the code to building sustainable online income streams.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                We didn't just want to create another course. We wanted to build a movement. A community of action-takers who refuse to settle for mediocrity. Today, helps thousands of students worldwide build their own empires.
                            </p>
                        </motion.div>
                        <div className="grid grid-cols-2 gap-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                <Card className="bg-background border-border/50 h-full">
                                    <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                                        <div className="p-3 bg-primary/10 rounded-full text-primary"><Users className="w-6 h-6" /></div>
                                        <div>
                                            <div className="font-bold text-2xl">2,500+</div>
                                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Students</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <Card className="bg-background border-border/50 h-full">
                                    <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                                        <div className="p-3 bg-primary/10 rounded-full text-primary"><Globe className="w-6 h-6" /></div>
                                        <div>
                                            <div className="font-bold text-2xl">15+</div>
                                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Countries</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <Card className="bg-background border-border/50 h-full">
                                    <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                                        <div className="p-3 bg-primary/10 rounded-full text-primary"><CheckCircle2 className="w-6 h-6" /></div>
                                        <div>
                                            <div className="font-bold text-2xl">98%</div>
                                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Success Rate</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <Card className="bg-background border-border/50 h-full">
                                    <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                                        <div className="p-3 bg-primary/10 rounded-full text-primary"><TrendingUp className="w-6 h-6" /></div>
                                        <div>
                                            <div className="font-bold text-2xl">$1M+</div>
                                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Student Revenue</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
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
                    <h2 className="text-3xl md:text-5xl font-bold max-w-2xl mx-auto">Ready to write your own success story?</h2>
                    <Link href="/pricing">
                        <Button size="lg" className="rounded-full px-10 h-14 text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">Join The Blueprint Today</Button>
                    </Link>
                </motion.div>
            </section>
        </div>
    );
}
