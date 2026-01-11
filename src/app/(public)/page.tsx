"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, TrendingUp, Users, Lock, ArrowRight, Laptop, Banknote, Target, CheckCircle2, Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { singleCourse } from "@/lib/mock-data";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function HomePage() {
    const testimonials = [
        {
            name: "James Wilson",
            role: "USA",
            image: "https://randomuser.me/api/portraits/men/32.jpg",
            content: "I was skeptical at first, but this blueprint completely changed my perspective on wealth creation. The strategies are practical and immediately applicable. I made my first $1,000 within weeks."
        },
        {
            name: "Sarah Jenkins",
            role: "UK",
            image: "", // Fallback to initials
            content: "Finally, a course that doesn't just sell fluff. The focus on 'Financial Sovereignty' resonated with me deeply. The step-by-step roadmap took all the guesswork out of starting my side business."
        },
        {
            name: "Liam O'Connor",
            role: "Australia",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam&backgroundColor=b6e3f4", // Modern/Anime-ish style
            content: "The community alone is worth the price of admission. Being surrounded by other driven individuals kept me accountable. The content is top-notch, but the network is priceless."
        },
        {
            name: "Emma Thompson",
            role: "USA",
            image: "https://randomuser.me/api/portraits/women/68.jpg",
            content: "I've bought dozens of courses, but this is the only one I've actually finished. The lessons are engaging (no boring slideshows!) and the action items ensure you're actually building, not just learning."
        },
        {
            name: "Oliver Smith",
            role: "Canada",
            image: "", // Fallback to initials
            content: "This isn't a 'get rich quick' scheme; it's a 'build wealth consistently' system.  The section on automated sales funnels blew my mind. Highly recommended for anyone serious about their future."
        },
        {
            name: "Jessica Taylor",
            role: "Germany",
            image: "https://api.dicebear.com/7.x/notionists/svg?seed=Jessica&backgroundColor=ffdfbf", // Artistic/Modern style
            content: "This blueprint gave me the freedom to travel the world while my business runs on autopilot. The 'Remote Flexibility' module is a game-changer. Best investment I've made in myself."
        },
        {
            name: "Robert Anderson",
            role: "USA",
            image: "https://randomuser.me/api/portraits/men/11.jpg",
            content: "Clear, concise, and incredibly effective. If you're stuck in the 9-5 grind and don't know where to start, this is your map out. 10/10."
        },
        {
            name: "Sophie Clark",
            role: "Australia",
            image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sophie&backgroundColor=c0aede", // Anime/Cartoon style
            content: "The value for money is insane. I've paid 10x more for courses with half the content. The 'High-Value Skillstack' module alone paid for the course within a week."
        }
    ];

    const [user, setUser] = useState<any>(null);
    const [hasAccess, setHasAccess] = useState(false);
    const [course, setCourse] = useState<any>(singleCourse); // Default to mock, override with DB
    const supabase = createClient();

    useEffect(() => {
        const checkAccess = async () => {
            // Fetch Course Details
            const { data: courseData } = await supabase
                .from('courses')
                .select('*')
                .eq('id', "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")
                .single();

            if (courseData) {
                setCourse(courseData);
            }

            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user && courseData) {
                const { data: enrollments } = await supabase
                    .from('enrollments')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('course_id', courseData.id);

                if (enrollments && enrollments.length > 0) {
                    setHasAccess(true);
                }
            }
        };
        checkAccess();
    }, []);

    return (
        <div className="bg-background flex flex-col items-center">

            {/* Hero Section - Professional & Trustworthy */}
            <section className="w-full relative overflow-hidden min-h-[90vh] flex items-center justify-center pt-24 pb-24 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
                <div className="absolute inset-0 bg-[radial-gradient(#4f4f4f2e_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
                <div className="container relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <Badge variant="outline" className="px-6 py-2 text-sm gap-2 border-primary/30 bg-primary/5 text-primary rounded-full uppercase tracking-widest font-semibold">
                            <TrendingUp className="w-4 h-4" /> The Masterclass for 2026
                        </Badge>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-foreground mb-8 leading-[1.1]"
                    >
                        Master The Art of <br className="hidden md:block" />
                        <span className="text-primary">
                            Digital Wealth
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-12 leading-relaxed"
                    >
                        {course.description || "A comprehensive, proven system to building sustainable income streams. Stop trading time for money and start building real assets."}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-6 w-full justify-center items-center"
                    >
                        {hasAccess ? (
                            <Link href={`/learn/${course.id}`} className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto text-xl h-16 px-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full transition-all">
                                    <CheckCircle2 className="w-6 h-6 mr-2" /> Owned - Go to Course
                                </Button>
                            </Link>
                        ) : (
                            <Link href={user ? "/checkout" : "/pricing"} className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto text-xl h-16 px-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full transition-all">
                                    Get Instant Access - ${course.price}
                                </Button>
                            </Link>
                        )}

                        <Link href="#reviews" className="w-full sm:w-auto">
                            <Button variant="ghost" size="lg" className="w-full sm:w-auto text-lg h-16 px-8 hover:bg-secondary/10">
                                Read Members Results
                            </Button>
                        </Link>
                    </motion.div>

                    <div className="mt-16 flex flex-wrap justify-center gap-x-12 gap-y-4 text-sm font-medium text-muted-foreground uppercase tracking-widest">
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> <span>Verified Strategies</span></div>
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> <span>Secure Platform</span></div>
                    </div>
                </div>
            </section>

            {/* Benefits Section - Detailed & Professional */}
            <section id="benefits" className="py-32 w-full bg-card/20 border-y border-border/40">
                <div className="container max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Unlock Your Potential</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            We focus on tangible outcomes. This isn't just theory; it's a practical framework for building a business that serves your life.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {/* Benefit 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-xl group-hover:bg-primary/10 transition-all opacity-0 group-hover:opacity-100" />
                            <div className="relative bg-background border border-border/50 p-8 rounded-3xl h-full hover:border-primary/20 transition-all">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                                    <Banknote className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Scalable Income</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Learn specific mechanisms to decouple your income from your hours. We teach you to build systems that work 24/7, so you don't have to.
                                </p>
                            </div>
                        </motion.div>

                        {/* Benefit 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-xl group-hover:bg-primary/10 transition-all opacity-0 group-hover:opacity-100" />
                            <div className="relative bg-background border border-border/50 p-8 rounded-3xl h-full hover:border-primary/20 transition-all">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                                    <Target className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">High-Value Skillstack</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Acquire the modern skills that the market actually values: Offer creation, digital psychology, automation, and funnel architecture.
                                </p>
                            </div>
                        </motion.div>

                        {/* Benefit 3 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-xl group-hover:bg-primary/10 transition-all opacity-0 group-hover:opacity-100" />
                            <div className="relative bg-background border border-border/50 p-8 rounded-3xl h-full hover:border-primary/20 transition-all">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                                    <Laptop className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Location Independence</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Design a business that fits in your backpack. Our protocols are strictly digital-first, giving you the ultimate freedom of movement.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Review Section - Infinite Slider */}
            <section id="reviews" className="py-32 w-full overflow-hidden">
                <div className="text-center mb-16 container mx-auto px-6">
                    <Badge variant="secondary" className="mb-6 px-4 py-1">Success Stories</Badge>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Trusted by Ambitious Professionals</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Join thousands of professionals who have already transformed their careers.
                    </p>
                </div>

                {/* Marquee Container */}
                <div className="relative w-full before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-[100px] before:bg-gradient-to-r before:from-background before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-[100px] after:bg-gradient-to-l after:from-background after:to-transparent">
                    <motion.div
                        className="flex gap-6 w-max"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 40 // Adjust speed here
                        }}
                    >
                        {[...testimonials, ...testimonials].map((review, i) => ( // Duplicate for infinite loop
                            <Card key={i} className="w-[350px] md:w-[400px] flex-shrink-0 bg-secondary/5 border-border/50">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-1 mb-4">
                                        {[1, 2, 3, 4, 5].map((_, starIndex) => (
                                            <Star key={starIndex} className="w-4 h-4 fill-primary text-primary" />
                                        ))}
                                    </div>
                                    <p className="text-muted-foreground italic leading-relaxed text-sm">
                                        "{review.content}"
                                    </p>
                                </CardHeader>
                                <CardContent className="pt-0 flex items-center gap-4 mt-auto">
                                    <Avatar className="h-10 w-10 border border-primary/20">
                                        <AvatarImage src={review.image} alt={review.name} />
                                        <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="font-bold text-sm">{review.name}</h4>
                                        <p className="text-xs text-muted-foreground">{review.role}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </motion.div>
                </div>
            </section>
            {/* Outcomes Section - Re-imagined without specific metrics */}
            <section className="py-32 w-full bg-gradient-to-b from-background to-secondary/5">
                <div className="container max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="relative h-[600px] rounded-3xl overflow-hidden bg-card border border-border/50 flex flex-col items-center justify-center p-8 text-center shadow-2xl"
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-60"></div>

                            <h3 className="text-3xl font-bold mb-4 relative z-10">What You Get</h3>
                            <p className="text-muted-foreground max-w-md relative z-10 mb-12">Total access to our flagship training system.</p>

                            <div className="grid grid-cols-1 gap-4 w-full max-w-sm relative z-10">
                                <div className="p-6 bg-background rounded-xl border border-white/5 flex items-center gap-4 text-left hover:border-primary/20 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500"><Laptop className="w-5 h-5" /></div>
                                    <div>
                                        <div className="font-bold">Comprehensive Video Library</div>
                                        <div className="text-xs text-muted-foreground">HD Lessons on every topic</div>
                                    </div>
                                </div>
                                <div className="p-6 bg-background rounded-xl border border-white/5 flex items-center gap-4 text-left hover:border-primary/20 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500"><Shield className="w-5 h-5" /></div>
                                    <div>
                                        <div className="font-bold">Battle-Tested Templates</div>
                                        <div className="text-xs text-muted-foreground">Copy & Paste resources</div>
                                    </div>
                                </div>
                                <div className="p-6 bg-background rounded-xl border border-white/5 flex items-center gap-4 text-left hover:border-primary/20 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Users className="w-5 h-5" /></div>
                                    <div>
                                        <div className="font-bold">Private Community</div>
                                        <div className="text-xs text-muted-foreground">Network with winners</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <Badge variant="secondary" className="mb-6 px-4 py-1">The Transformation</Badge>
                            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                                From Aspiring To <br /> <span className="text-primary">Accomplished</span>
                            </h2>
                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="mt-1">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">Confidence & Clarity</h4>
                                        <p className="text-muted-foreground">Eliminate the noise. Follow a direct, linear path to your first digital asset.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="mt-1">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">Automated Revenue</h4>
                                        <p className="text-muted-foreground">Build once, sell forever. Create leverage that works for you while you sleep.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="mt-1">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">Professional Freedom</h4>
                                        <p className="text-muted-foreground">Regain control of your time. Transition from mandatory work to optional work.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>


        </div>
    );
}
