"use client";

import Link from "next/link";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Shield,
    CheckCircle2,
    Star,
    BookOpen,
    ArrowRight,
    FileText,
    Layers,
    Award,
    Check,
    Compass,
    BarChart3,
    Sparkles,
    Zap
} from "lucide-react";
import { motion } from "framer-motion";

interface HomeClientProps {
    user: any;
    hasAccess: boolean;
    course: any;
}

export default function HomeClient({ user, hasAccess, course }: HomeClientProps) {
    const modules = [
        {
            num: "01",
            title: "The Mindset Shift & Leverage",
            desc: "Decouple your earnings from billable hours. Learn how digital leverage turns single effort into compounding returns.",
            lessons: "4 chapters • Worksheets included"
        },
        {
            num: "02",
            title: "Niche Selection & $0 Validation",
            desc: "Discover high-intent audiences and validate profitable digital offers before spending a single dollar on development.",
            lessons: "6 chapters • Validation matrix"
        },
        {
            num: "03",
            title: "High-Converting Offer Architecture",
            desc: "Structure irresistible offers with value ladders, risk reversals, and conversion psychology that command premium pricing.",
            lessons: "8 chapters • Swipe files & copy templates"
        },
        {
            num: "04",
            title: "Audience & Organic Distribution",
            desc: "Build authority and funnel qualified buyers using organic content loops and authority micro-assets without ad spend.",
            lessons: "7 chapters • Content frameworks"
        },
        {
            num: "05",
            title: "Automated Funnels & Sales Systems",
            desc: "Set up frictionless checkout flows, email nurture sequences, and automated digital delivery that runs 24/7.",
            lessons: "8 chapters • Setup blueprints"
        },
        {
            num: "06",
            title: "7 Validated Business Model Playbooks",
            desc: "End-to-end breakdowns for digital products, micro-consulting, newsletters, cohort communities, and specialized services.",
            lessons: "7 chapters • Action checklists"
        },
        {
            num: "07",
            title: "Scaling & Long-Term Asset Growth",
            desc: "Transition from side income to predictable, scalable digital business with operational SOPs and automated tools.",
            lessons: "7 chapters • Scale roadmap"
        }
    ];

    const testimonials = [
        {
            name: "James Wilson",
            role: "Software Engineer • USA",
            image: "/review-1.jpg",
            content: "The validation framework alone was worth ten times the price. I stopped wasting time on random ideas and launched my first digital toolkit in under 3 weeks. Made my first $1,200 while working full-time."
        },
        {
            name: "Sarah Jenkins",
            role: "Product Designer • UK",
            image: "/review-2.jpg",
            content: "Zero fluff, zero empty hype. Every single chapter is structured like a precise operational handbook with actionable checklists and templates. By far the highest signal-to-noise course I have taken."
        },
        {
            name: "Aarav Patel",
            role: "Consultant • India",
            image: "/review-3.jpg",
            content: "The offer architecture and pricing psychology chapters completely transformed how I present my services. I was able to transition from hourly billing to productized packages within a month."
        },
        {
            name: "Emma Thompson",
            role: "Marketing Manager • USA",
            image: "https://randomuser.me/api/portraits/women/68.jpg",
            content: "Most courses give you vague theory and abandon you. This blueprint gives you the exact funnels, copy templates, and automation setups. Truly clean, professional, and directly applicable."
        }
    ];

    return (
        <div className="bg-[#030712] text-foreground flex flex-col items-center overflow-x-hidden selection:bg-primary/20 selection:text-primary">

            {/* 1. HERO SECTION - Minimal, Elegant, Cinematic */}
            <section className="w-full relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
                {/* Subtle Radial Glow & Delicate Mesh */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/[0.07] rounded-full blur-[140px] pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_35%,#000_70%,transparent_100%)] pointer-events-none" />

                <div className="container relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
                    {/* Eyebrow Pill */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mb-8"
                    >
                        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md text-xs font-medium text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="text-white/60">2026 Edition</span>
                            <span className="text-white/20">•</span>
                            <span className="text-primary font-semibold">The Modern Side Hustle Blueprint</span>
                        </div>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.12] max-w-4xl"
                    >
                        Build and scale your <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-primary to-amber-400">
                            digital income stream.
                        </span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed font-normal"
                    >
                        {course.description || "A practical, linear curriculum engineered for ambitious professionals. Validate high-demand ideas, architect profitable offers, and deploy automated systems without quitting your day job."}
                    </motion.p>

                    {/* CTA Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-14"
                    >
                        {hasAccess ? (
                            <Link href={`/learn/${course.id}`} className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-sm font-semibold rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.01] active:scale-[0.99]">
                                    <CheckCircle2 className="w-4 h-4 mr-2" /> Resume Masterclass
                                </Button>
                            </Link>
                        ) : (
                            <Link href={user ? "/checkout" : "/pricing"} className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-sm font-bold rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] group">
                                    <span>Get Instant Access — ${course.price}</span>
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        )}

                        <Link href="#curriculum" className="w-full sm:w-auto">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-7 text-sm font-medium rounded-full border-white/10 bg-white/[0.02] text-slate-300 hover:text-white hover:bg-white/[0.06] hover:border-white/20 transition-all">
                                View Curriculum
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Trust Pills Strip */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-slate-400"
                    >
                        <div className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-primary" />
                            <span>47 In-Depth Chapters</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-primary" />
                            <span>Downloadable Worksheets & Templates</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-primary" />
                            <span>Lifetime Unrestricted Access</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-primary" />
                            <span>NOWPayments Crypto Accepted</span>
                        </div>
                    </motion.div>

                    {/* 2. Interactive Product Workspace Mockup */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.45 }}
                        className="w-full mt-16 max-w-4xl relative"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-b from-primary/20 via-transparent to-transparent rounded-3xl blur-2xl opacity-50 pointer-events-none" />

                        {/* Outer Frame */}
                        <div className="relative rounded-2xl border border-white/10 bg-slate-950/70 p-2 sm:p-3 backdrop-blur-xl shadow-2xl overflow-hidden">
                            {/* Window Header */}
                            <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 mb-3 text-xs text-slate-400">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
                                </div>
                                <div className="text-[11px] font-mono text-slate-500">
                                    wealifylabs.com/learn/course-player
                                </div>
                                <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    <span>Interactive Mode</span>
                                </div>
                            </div>

                            {/* Inner Workspace Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-left rounded-xl bg-[#030712] border border-white/5 p-4 sm:p-6">
                                {/* Left Mock Sidebar */}
                                <div className="md:col-span-4 border-r border-white/5 pr-4 space-y-3 hidden md:block">
                                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Course Modules</div>
                                    <div className="space-y-1.5 text-xs">
                                        <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary font-medium flex items-center justify-between">
                                            <span>01. The Mindset Shift</span>
                                            <span className="text-[10px] bg-primary/20 px-1.5 py-0.5 rounded">Active</span>
                                        </div>
                                        <div className="p-2.5 rounded-lg bg-white/[0.02] text-slate-400 flex items-center justify-between">
                                            <span>02. Idea Validation</span>
                                            <span className="text-[10px] text-slate-500">6 lessons</span>
                                        </div>
                                        <div className="p-2.5 rounded-lg bg-white/[0.02] text-slate-400 flex items-center justify-between">
                                            <span>03. Offer Architecture</span>
                                            <span className="text-[10px] text-slate-500">8 lessons</span>
                                        </div>
                                        <div className="p-2.5 rounded-lg bg-white/[0.02] text-slate-400 flex items-center justify-between">
                                            <span>04. Organic Distribution</span>
                                            <span className="text-[10px] text-slate-500">7 lessons</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Mock Content Workspace */}
                                <div className="md:col-span-8 md:pl-3 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">Lesson 1.2</span>
                                            <h3 className="text-base sm:text-lg font-bold text-white">Decoupling Time From Income</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-400 font-mono">10 min read</span>
                                        </div>
                                    </div>

                                    {/* Mock Document Canvas */}
                                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2.5 text-xs text-slate-400 leading-relaxed">
                                        <p className="text-slate-300 font-medium">
                                            &ldquo;The employee model trades finite hours for fixed compensation. The digital asset model constructs automated systems that reproduce value with zero marginal cost of replication.&rdquo;
                                        </p>
                                        <div className="grid grid-cols-2 gap-2 pt-2">
                                            <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 flex items-center gap-2">
                                                <FileText className="w-3.5 h-3.5 text-primary" />
                                                <span className="text-[11px] text-slate-300">Worksheet 1.2.pdf</span>
                                            </div>
                                            <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 flex items-center gap-2">
                                                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                                                <span className="text-[11px] text-slate-300">Notion Checklist</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Footnote */}
                                    <div className="flex items-center justify-between pt-1 text-xs">
                                        <span className="text-slate-500">Completed 4 of 47 Chapters (8%)</span>
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-medium text-xs border border-emerald-500/20">
                                            <Check className="w-3 h-3" /> Mark Lesson Complete
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 3. METRICS / STATS RIBBON - Seamless Minimalist Row */}
            <section className="w-full border-y border-white/[0.06] bg-white/[0.01]">
                <div className="container max-w-6xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="space-y-1">
                            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">47</div>
                            <div className="text-xs text-slate-400 font-medium">In-Depth Chapters</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">7</div>
                            <div className="text-xs text-slate-400 font-medium">Business Model Playbooks</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">100%</div>
                            <div className="text-xs text-slate-400 font-medium">Actionable & Linear</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Lifetime</div>
                            <div className="text-xs text-slate-400 font-medium">Unrestricted Access</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI-Native Learning Platform Showcase */}
            <section className="w-full py-20 bg-gradient-to-b from-card/30 via-background to-background relative overflow-hidden border-b border-white/[0.06]">
                <div className="container max-w-6xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>AI-Native EdTech Platform</span>
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
                            Learn With 24/7 AI Mentors <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-primary to-amber-200">
                                Powered by Claude 5.5 Sonnet
                            </span>
                        </h2>
                        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                            No more passive reading. Wealify Labs embeds advanced agentic intelligence directly into your study workflow&mdash;auditing your business ideas, stress-testing your pricing, and generating custom conversion copy.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* AI Pillar 1 */}
                        <div className="p-7 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md hover:border-amber-500/30 transition-all space-y-4">
                            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-semibold">In-Player Copilot</span>
                                <h3 className="text-xl font-bold text-white">24/7 Chapter Mentor</h3>
                            </div>
                            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                                Get instant, context-aware coaching inside any lesson. Claude analyzes your active chapter to generate 3-step tactical checklists and clarify complex concepts.
                            </p>
                        </div>

                        {/* AI Pillar 2 */}
                        <div className="p-7 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md hover:border-emerald-500/30 transition-all space-y-4">
                            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">Venture Studio</span>
                                <h3 className="text-xl font-bold text-white">Idea & Viability Auditor</h3>
                            </div>
                            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                                Test your digital product concept before writing code. Receive a 4-pillar audit scoring market intent, unit economics, churn risks, and a 7-day validation test.
                            </p>
                        </div>

                        {/* AI Pillar 3 */}
                        <div className="p-7 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md hover:border-primary/30 transition-all space-y-4">
                            <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[11px] font-mono text-primary uppercase tracking-wider font-semibold">Conversion Engine</span>
                                <h3 className="text-xl font-bold text-white">Offer Copy Architect</h3>
                            </div>
                            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                                Generate viral organic hooks, high-converting value proposition formulas, and ironclad risk-reversal guarantees calibrated for digital asset distribution.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. THE 3 PHASES OF EXECUTION - Clean Minimalist Bento */}
            <section id="framework" className="w-full py-24 sm:py-32 relative">
                <div className="container max-w-6xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-semibold text-primary uppercase tracking-widest block mb-3">
                            The Methodology
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
                            How The Blueprint Works
                        </h2>
                        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                            A structured, three-phase framework engineered to take you from initial idea to automated revenue.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Phase 1 */}
                        <div className="p-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm hover:border-white/15 transition-all space-y-4">
                            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-primary">
                                <Compass className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[11px] font-mono text-primary uppercase tracking-wider font-semibold">Phase 01</span>
                                <h3 className="text-xl font-bold text-white">Validation & Market Fit</h3>
                            </div>
                            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                                Identify high-margin niches and test demand without spending capital. Learn how to pre-sell and validate before building.
                            </p>
                            <ul className="pt-2 space-y-2 text-xs text-slate-400 border-t border-white/5">
                                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary" /> $0 Validation Protocols</li>
                                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary" /> Buyer Persona Identification</li>
                            </ul>
                        </div>

                        {/* Phase 2 */}
                        <div className="p-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm hover:border-white/15 transition-all space-y-4">
                            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-primary">
                                <Layers className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[11px] font-mono text-primary uppercase tracking-wider font-semibold">Phase 02</span>
                                <h3 className="text-xl font-bold text-white">Offer Architecture</h3>
                            </div>
                            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                                Transform raw knowledge into a high-value product or productized service that eliminates price resistance.
                            </p>
                            <ul className="pt-2 space-y-2 text-xs text-slate-400 border-t border-white/5">
                                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary" /> Value Ladder Structuring</li>
                                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary" /> High-Converting Copy Blueprints</li>
                            </ul>
                        </div>

                        {/* Phase 3 */}
                        <div className="p-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm hover:border-white/15 transition-all space-y-4">
                            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-primary">
                                <BarChart3 className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[11px] font-mono text-primary uppercase tracking-wider font-semibold">Phase 03</span>
                                <h3 className="text-xl font-bold text-white">Funnels & Automation</h3>
                            </div>
                            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                                Deploy automated sales funnels, email sequences, and digital fulfillment channels that operate 24 hours a day.
                            </p>
                            <ul className="pt-2 space-y-2 text-xs text-slate-400 border-t border-white/5">
                                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary" /> 24/7 Automated Checkout</li>
                                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary" /> Frictionless Customer Onboarding</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. FULL CURRICULUM SYLLABUS - Clean Minimal List */}
            <section id="curriculum" className="w-full py-24 border-t border-white/[0.06] bg-white/[0.01]">
                <div className="container max-w-5xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-semibold text-primary uppercase tracking-widest block mb-3">
                            Course Content
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
                            Curriculum Breakdown
                        </h2>
                        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                            7 modules. 47 concise, actionable lessons. Zero fluff or theoretical filler.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {modules.map((m, idx) => (
                            <div
                                key={idx}
                                className="p-5 sm:p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/15 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                                <div className="flex items-start sm:items-center gap-4">
                                    <div className="text-xs font-mono font-bold text-primary px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                                        {m.num}
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-white mb-1">{m.title}</h3>
                                        <p className="text-xs text-slate-400 max-w-xl leading-relaxed">{m.desc}</p>
                                    </div>
                                </div>
                                <div className="text-[11px] font-medium text-slate-500 sm:text-right shrink-0">
                                    {m.lessons}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 text-center">
                        <Link href={user ? "/checkout" : "/pricing"}>
                            <Button className="rounded-full px-8 h-11 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                                Enroll to Unlock All 47 Chapters
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 6. WHAT YOU GET / DELIVERABLES */}
            <section className="w-full py-24 border-t border-white/[0.06]">
                <div className="container max-w-6xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-semibold text-primary uppercase tracking-widest block mb-3">
                            Deliverables
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
                            Everything Included
                        </h2>
                        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                            Instant access to the complete system immediately after enrollment.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-primary">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <h3 className="text-base font-bold text-white">47 Detailed Chapters</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Step-by-step master lessons covering psychology, funnels, copy, and execution.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-primary">
                                <FileText className="w-5 h-5" />
                            </div>
                            <h3 className="text-base font-bold text-white">Worksheets & Templates</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Downloadable Notion operating systems, validation scorecards, and email scripts.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-primary">
                                <Award className="w-5 h-5" />
                            </div>
                            <h3 className="text-base font-bold text-white">Verified Certificate</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                An official digital credential issued upon completing all course chapters.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-primary">
                                <Shield className="w-5 h-5" />
                            </div>
                            <h3 className="text-base font-bold text-white">Lifetime Access</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Pay once with cryptocurrency, own forever. All future additions included at no cost.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. MEMBER REVIEWS - Clean, Calm, Credible */}
            <section id="reviews" className="w-full py-24 border-t border-white/[0.06] bg-white/[0.01]">
                <div className="container max-w-6xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-semibold text-primary uppercase tracking-widest block mb-3">
                            Student Feedback
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
                            Trusted by Working Builders
                        </h2>
                        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                            Real experiences from professionals who deployed the blueprint.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {testimonials.map((t, idx) => (
                            <div
                                key={idx}
                                className="p-6 sm:p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] flex flex-col justify-between space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((_, starIdx) => (
                                            <Star key={starIdx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                                        &ldquo;{t.content}&rdquo;
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                                    <Avatar className="h-9 w-9 border border-white/10">
                                        {t.image ? (
                                            <NextImage src={t.image} alt={t.name} fill sizes="36px" className="object-cover" />
                                        ) : (
                                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                                {t.name.charAt(0)}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <div>
                                        <div className="text-xs font-bold text-white">{t.name}</div>
                                        <div className="text-[11px] text-slate-400">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 8. FINAL CALL TO ACTION - Minimal, Confident, Understated */}
            <section className="w-full py-24 sm:py-32 border-t border-white/[0.06] relative">
                <div className="container max-w-4xl mx-auto px-6 text-center">
                    <div className="p-10 sm:p-16 rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-2xl relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary/[0.08] rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="relative z-10 max-w-xl mx-auto space-y-6">
                            <span className="text-xs font-semibold text-primary uppercase tracking-widest block">
                                Direct Enrollment
                            </span>
                            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                                Begin building your digital business today.
                            </h2>
                            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                                Get instant, lifetime access to all 47 chapters, downloadable templates, and the interactive course cinema.
                            </p>

                            <div className="pt-2">
                                {hasAccess ? (
                                    <Link href={`/learn/${course.id}`}>
                                        <Button size="lg" className="h-12 px-8 text-sm font-semibold rounded-full bg-emerald-600 hover:bg-emerald-500 text-white">
                                            Open Course Player
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href={user ? "/checkout" : "/pricing"}>
                                        <Button size="lg" className="h-12 px-8 text-sm font-bold rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.01]">
                                            Enroll Now — ${course.price}
                                        </Button>
                                    </Link>
                                )}
                            </div>

                            <div className="pt-4 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
                                <span>Immediate Access</span>
                                <span>•</span>
                                <span>NOWPayments Crypto Gateway</span>
                                <span>•</span>
                                <span>Official Certificate</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
