import { Zap, BookOpen, FileText, TrendingUp, ShieldCheck, Award, HelpCircle, Bot, Sparkles } from "lucide-react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { singleCourse } from "@/lib/mock-data";
import PricingClient from "./PricingClient";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default async function PricingPage() {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const hasAuthCookie = allCookies.some(c => c.name.includes('-auth-token') || c.name.startsWith('sb-'));

    let course = singleCourse;
    let user = null;
    let hasAccess = false;

    // Fast and safe data fetching
    try {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll() {
                        // ignore
                    },
                },
            }
        );

        // Fetch course
        const { data: dbCourse } = await supabase
            .from('courses')
            .select('*')
            .eq('id', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')
            .maybeSingle();

        if (dbCourse) {
            course = dbCourse;
        }

        // Only query auth when cookies are present
        if (hasAuthCookie) {
            const { data: authData } = await supabase.auth.getUser();
            user = authData?.user || null;

            if (user && course) {
                const { data: enrollments } = await supabase
                    .from('enrollments')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('course_id', course.id);

                if (enrollments && enrollments.length > 0) {
                    hasAccess = true;
                }
            }
        }
    } catch {
        // Fallback gracefully to singleCourse
    }

    const faqs = [
        {
            q: "How soon do I get access after enrolling?",
            a: "Access is granted immediately! With our automated NOWPayments system, once the blockchain confirmation is detected (usually 1-3 minutes depending on the network), your account is upgraded automatically and you can start learning right away."
        },
        {
            q: "What AI features are included in the $14.99 enrollment?",
            a: "Every enrollment includes full unrestricted access to our 3 AI Venture Studio tools: (1) 24/7 AI Masterclass Mentor for instant curriculum guidance and coding queries, (2) Venture Viability Auditor for stress-testing business concepts, and (3) Direct-Response Pitch & Copy Architect for generating high-converting sales assets."
        },
        {
            q: "Which cryptocurrencies are supported?",
            a: "We support over 300 cryptocurrencies via NOWPayments, including Bitcoin (BTC), Ethereum (ETH), USDT (TRC20, ERC20, Polygon), Solana (SOL), Litecoin (LTC), and many more."
        },
        {
            q: "Is this course suitable for beginners?",
            a: "Absolutely. The blueprint begins with core fundamental principles before progressively advancing into funnel engineering, sales copy, and automated systems. Every single chapter is designed to be actionable."
        },
        {
            q: "Do I get lifetime access to all future updates?",
            a: "Yes. You make a single one-time investment of $14.99. All future chapters, updated templates, and AI platform enhancements are provided at zero additional cost."
        },
        {
            q: "Will I receive an official Certificate of Completion?",
            a: "Yes! Once you complete all 47 chapters and mark them as finished in the Course Cinema, an official verified digital certificate is generated and awarded to your student profile."
        }
    ];

    return (
        <div className="bg-background min-h-screen pt-24 pb-28 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-10 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px]" />
                <div className="absolute bottom-10 left-1/4 w-[600px] h-[600px] bg-secondary/15 rounded-full blur-[140px]" />
            </div>

            <div className="container max-w-6xl mx-auto px-6">
                {/* Hero Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <Badge variant="outline" className="mb-4 px-4 py-1.5 border-primary/30 text-primary bg-primary/5 uppercase tracking-widest text-xs font-semibold">
                        Transparent Pricing &bull; No Subscriptions
                    </Badge>
                    <h1 className="text-4xl sm:text-6xl font-black mb-6 tracking-tight text-foreground leading-[1.1]">
                        Invest in Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-r from-amber-400 via-primary to-amber-200">
                            Digital Sovereignty
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        One deliberate decision separates active labor from automated digital assets. Acquire the complete blueprint and AI Venture Studio with zero hidden fees.
                    </p>
                </div>

                {/* Main 2-Column Section */}
                <div className="grid lg:grid-cols-12 gap-12 items-start mb-24">
                    {/* Left Column: What's Included */}
                    <div className="lg:col-span-7 space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Zap className="w-5 h-5 text-primary" />
                                <span className="text-xs font-bold uppercase tracking-wider text-primary">Everything You Need To Build</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-4">
                                Complete Ecosystem Included
                            </h2>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                You receive immediate, unrestricted access to the complete digital wealth curriculum and AI-powered execution suite.
                            </p>
                        </div>

                        {/* Curriculum & AI Features Grid */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="p-5 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md hover:border-primary/30 transition-all shadow-md">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-base mb-1 text-foreground">47 In-Depth Chapters</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Step-by-step master lessons covering psychology, funnel architecture, and automated distribution.
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md hover:border-primary/30 transition-all shadow-md">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-base mb-1 text-foreground">24/7 AI Masterclass Mentor</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Intelligent assistant with 120B reasoning architecture trained on curriculum frameworks to answer student queries 24/7.
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md hover:border-primary/30 transition-all shadow-md">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-base mb-1 text-foreground">Venture Viability Auditor</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Stress-test niche viability, customer acquisition unit economics, and competitive moats before deploying capital.
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md hover:border-primary/30 transition-all shadow-md">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-base mb-1 text-foreground">Offer & Pitch Architect</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Produce conversion-focused sales hooks, email sequences, and high-ticket landing page copy in seconds.
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md hover:border-primary/30 transition-all shadow-md">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-base mb-1 text-foreground">7 Business Models</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Granular playbooks for digital products, micro-SaaS, paid media, and consulting.
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md hover:border-primary/30 transition-all shadow-md">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                                    <Award className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-base mb-1 text-foreground">Verified Credential</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    An official digital certificate verifying your completion of the masterclass.
                                </p>
                            </div>
                        </div>

                        {/* Guarantee Seal Box */}
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-card/80 to-secondary/10 border border-border/60 flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-base text-foreground mb-1">Authentic Knowledge &bull; Verified Security</h4>
                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                    We do not lock chapters behind arbitrary drip schedules or hidden paywalls. Every lesson, guide, and AI tool is available immediately upon enrollment.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Pricing Card (Client Component) */}
                    <div className="lg:col-span-5">
                        <PricingClient user={user} hasAccess={hasAccess} course={course} />
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto pt-12 border-t border-border/40">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-secondary/30 border border-border/50 text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                            <HelpCircle className="w-3.5 h-3.5 text-primary" /> Questions & Answers
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
                    </div>

                    <Accordion type="single" collapsible className="space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="border border-border/50 bg-card/40 backdrop-blur-md rounded-2xl px-6 py-1 data-[state=open]:border-primary/40 transition-colors"
                            >
                                <AccordionTrigger className="text-left font-semibold text-foreground text-sm sm:text-base hover:no-underline hover:text-primary">
                                    {faq.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                                    {faq.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </div>
    );
}
