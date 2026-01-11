import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-card/50 border-t border-border/50 backdrop-blur-sm">
            <div className="container mx-auto px-6 py-16 md:py-24 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 xl:gap-16">
                    <div className="md:col-span-4 space-y-6">
                        <div className="flex items-center space-x-2">
                            <span className="font-black text-2xl tracking-tighter">Wealify Labs</span>
                        </div>
                        <p className="text-muted-foreground max-w-sm text-base leading-relaxed">
                            We provide the tools and knowledge necessary to build a sustainable digital income. Our mission is to empower professionals to achieve financial independence.
                        </p>
                        <div className="flex gap-4 pt-2">
                            {/* Social placeholders */}
                            <div className="w-10 h-10 bg-secondary/30 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer">
                                <span className="sr-only">Twitter</span>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                            </div>
                            <div className="w-10 h-10 bg-secondary/30 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer">
                                <span className="sr-only">LinkedIn</span>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                            </div>
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
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                                    Subscribe
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
                            <span>Coinbase</span>
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
