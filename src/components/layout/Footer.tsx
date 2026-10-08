"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, ArrowRight, ShieldCheck, Bitcoin } from "lucide-react";
import { subscribeNewsletter } from "@/actions/newsletter";

export function Footer() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email address.");
            return;
        }
        if (!email.includes("@")) {
            toast.error("Please enter a valid email address.");
            return;
        }

        setLoading(true);
        try {
            const res = await subscribeNewsletter(email);
            if (res.success) {
                toast.success(res.message || "Successfully subscribed to the Wealify newsletter!");
                setEmail("");
            } else {
                toast.error(res.error || "Subscription failed. Please try again.");
            }
        } catch {
            toast.error("Could not subscribe right now. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className="bg-card/40 border-t border-border/50 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <div className="container mx-auto px-6 py-16 md:py-20 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
                    {/* Brand Info */}
                    <div className="md:col-span-5 space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="relative w-10 h-10">
                                <Image
                                    src="/brand-icon.png"
                                    alt="Wealify Labs"
                                    fill
                                    className="object-contain"
                                    sizes="40px"
                                />
                            </div>
                            <span className="font-black text-2xl tracking-tight text-foreground">Wealify Labs</span>
                        </div>
                        <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
                            Practical, high-leverage frameworks for digital builders and creators. Empowering modern professionals to construct scalable digital assets and achieve sovereign independence.
                        </p>

                        <div className="space-y-1.5 text-xs text-muted-foreground">
                            <div>
                                <span className="font-semibold text-foreground">Founder: </span>
                                <a href="mailto:lovejeet@wealifylabs.site" className="text-primary hover:underline font-medium">
                                    lovejeet@wealifylabs.site
                                </a>
                            </div>
                            <div>
                                <span className="font-semibold text-foreground">Support: </span>
                                <a href="mailto:support@wealifylabs.site" className="text-primary hover:underline font-medium">
                                    support@wealifylabs.site
                                </a>
                            </div>
                            <div>
                                <span className="text-[11px] text-muted-foreground/80">Secondary: </span>
                                <a href="mailto:wealifylabs@gmail.com" className="hover:underline text-muted-foreground hover:text-foreground">
                                    wealifylabs@gmail.com
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                            <a
                                href="https://www.instagram.com/wealifylabs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-secondary/30 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all"
                                aria-label="Instagram"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.416 2.071C6.052 1.824 6.779 1.656 7.843 1.607 8.867 1.56 9.221 1.548 11.649 1.548h.666zM7.843 3.376c-1.013.046-1.57.245-1.92.38a2.916 2.916 0 00-1.065.69 2.916 2.916 0 00-.69 1.065c-.135.35-.334.907-.38 1.92-.047 1.05-.059 1.363-.059 4.569v.12c0 3.206.012 3.518.058 4.569.047 1.013.245 1.57.38 1.92a2.916 2.916 0 00.69 1.065 2.916 2.916 0 001.065.69c.35.135.907.334 1.92.38 1.05.047 1.363.059 4.569.059H12c3.206 0 3.518-.012 4.569-.059 1.013-.047 1.57-.245 1.92-.38a2.916 2.916 0 001.065-.69 2.916 2.916 0 00.69-1.065c.135-.35.334-.907.38-1.92.046-1.05.059-1.363.059-4.569v-.12c0-3.206-.012-3.518-.059-4.569-.046-1.013-.245-1.57-.38-1.92a2.916 2.916 0 00-.69-1.065 2.916 2.916 0 00-1.065-.69c-.35-.135-.907-.334-1.92-.38-1.05-.047-1.363-.059-4.569-.059H11.65c-3.206 0-3.518.012-4.569.059zM12 7a5 5 0 100 10 5 5 0 000-10zm0 1.81a3.19 3.19 0 110 6.38 3.19 3.19 0 010-6.38zm5.32-2.321a1.063 1.063 0 100 2.126 1.063 1.063 0 000-2.126z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="md:col-span-2 space-y-4">
                        <h4 className="font-bold text-sm uppercase tracking-wider text-foreground">Explore</h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
                            <li><Link href="/" className="hover:text-primary transition-colors block">Home</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition-colors block">About Us</Link></li>
                            <li><Link href="/pricing" className="hover:text-primary transition-colors block">Pricing</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors block">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-2 space-y-4">
                        <h4 className="font-bold text-sm uppercase tracking-wider text-foreground">Legal</h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
                            <li><Link href="/privacy" className="hover:text-primary transition-colors block">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors block">Terms of Service</Link></li>
                            <li><Link href="/terms#earnings" className="hover:text-primary transition-colors block">Earnings Disclaimer</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter Subscription */}
                    <div className="md:col-span-3 space-y-4">
                        <h4 className="font-bold text-sm uppercase tracking-wider text-foreground">Stay Ahead</h4>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                            Subscribe to receive strategic insights on asset construction, funnel mechanics, and market shifts.
                        </p>
                        <form onSubmit={handleSubscribe} className="space-y-2">
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    className="w-full h-10 rounded-xl border border-border/80 bg-background/80 px-3.5 pr-10 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all disabled:opacity-50"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="absolute right-1 top-1 h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
                                    aria-label="Subscribe"
                                >
                                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                            <p className="text-[11px] text-muted-foreground/60">No spam. One-click unsubscribe anytime.</p>
                        </form>
                    </div>
                </div>

                {/* Subfooter */}
                <div className="mt-14 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/60">
                    <p>&copy; 2025&ndash;{new Date().getFullYear()} Wealify Labs. Founded by Lovejeet Singh (lovejeet@wealifylabs.site). All rights reserved.</p>
                    
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80 font-mono">
                            <Bitcoin className="w-3.5 h-3.5 text-primary" />
                            <span>NOWPayments Crypto Gateway</span>
                        </div>
                        <span className="hidden sm:inline h-3 w-px bg-border/60" />
                        <div className="flex items-center gap-1 text-xs">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>256-Bit SSL Encrypted</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
