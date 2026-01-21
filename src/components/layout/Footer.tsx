"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function Footer() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        if (!email) {
            toast.error("Please enter your email address.");
            return;
        }
        if (!email.includes("@")) {
            toast.error("Please enter a valid email address.");
            return;
        }

        setLoading(true);
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast.success("Successfully subscribed to newsletter!");
        setEmail("");
        setLoading(false);
    };

    return (
        <footer className="bg-card/50 border-t border-border/50 backdrop-blur-sm">
            <div className="container mx-auto px-6 py-16 md:py-24 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 xl:gap-16">
                    <div className="md:col-span-4 space-y-6">
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
                            <span className="font-black text-2xl tracking-tighter">Wealify Labs</span>
                        </div>
                        <p className="text-muted-foreground max-w-sm text-base leading-relaxed">
                            We provide the tools and knowledge necessary to build a sustainable digital income. Our mission is to empower professionals to achieve financial independence.
                        </p>
                        <div className="flex gap-4 pt-2">
                            {/* Social placeholders */}
                            <a href="https://www.instagram.com/wealifylabs/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-secondary/30 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer">
                                <span className="sr-only">Instagram</span>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.416 2.071C6.052 1.824 6.779 1.656 7.843 1.607 8.867 1.56 9.221 1.548 11.649 1.548h.666zM7.843 3.376c-1.013.046-1.57.245-1.92.38a2.916 2.916 0 00-1.065.69 2.916 2.916 0 00-.69 1.065c-.135.35-.334.907-.38 1.92-.047 1.05-.059 1.363-.059 4.569v.12c0 3.206.012 3.518.058 4.569.047 1.013.245 1.57.38 1.92a2.916 2.916 0 00.69 1.065 2.916 2.916 0 001.065.69c.35.135.907.334 1.92.38 1.05.047 1.363.059 4.569.059H12c3.206 0 3.518-.012 4.569-.059 1.013-.047 1.57-.245 1.92-.38a2.916 2.916 0 001.065-.69 2.916 2.916 0 00.69-1.065c.135-.35.334-.907.38-1.92.046-1.05.059-1.363.059-4.569v-.12c0-3.206-.012-3.518-.059-4.569-.046-1.013-.245-1.57-.38-1.92a2.916 2.916 0 00-.69-1.065 2.916 2.916 0 00-1.065-.69c-.35-.135-.907-.334-1.92-.38-1.05-.047-1.363-.059-4.569-.059H11.65c-3.206 0-3.518.012-4.569.059zM12 7a5 5 0 100 10 5 5 0 000-10zm0 1.81a3.19 3.19 0 110 6.38 3.19 3.19 0 010-6.38zm5.32-2.321a1.063 1.063 0 100 2.126 1.063 1.063 0 000-2.126z" clipRule="evenodd" /></svg>
                            </a>

                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-4">
                        <h3 className="font-bold text-lg">Product</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary transition-colors block w-max">About Us</Link></li>
                            <li><Link href="/#reviews" className="hover:text-primary transition-colors block w-max">Success Stories</Link></li>
                            <li><Link href="/pricing" className="hover:text-primary transition-colors block w-max">Pricing</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-2 space-y-4">
                        <h3 className="font-bold text-lg">Legal</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/privacy" className="hover:text-primary transition-colors block w-max">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors block w-max">Terms of Service</Link></li>
                            <li><Link href="/terms#earnings" className="hover:text-primary transition-colors block w-max">Earnings Disclaimer</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors block w-max">Contact Support</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-4 space-y-4">
                        <h3 className="font-bold text-lg">Stay Updated</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Join our newsletter to receive the latest tips on building wealth and scaling your business.
                        </p>
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <button
                                    onClick={handleSubscribe}
                                    disabled={loading}
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
                                </button>
                            </div>
                            <p className="text-xs text-muted-foreground/60">We respect your privacy. Unsubscribe at any time.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/50">
                    <p>&copy; {new Date().getFullYear()} Wealify Labs. All rights reserved.</p>
                    <div className="flex gap-4 md:gap-6 items-center">
                        <div className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/40">
                            <span>PayPal</span>
                            <span>NOWPayments</span>
                        </div>
                        <span className="hidden md:inline h-3 w-px bg-border/50"></span>
                        <div className="flex gap-4">
                            <span>Secure Payments</span>
                            <span>•</span>
                            <span>Encrypted Data</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
