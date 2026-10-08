import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | Wealify Labs",
    description: "The rules, regulations, and terms of use for our platform.",
};

export default function TermsPage() {
    return (
        <div className="bg-background min-h-screen py-12 md:py-24">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Terms of Service</h1>
                    <p className="text-xl text-muted-foreground">Last updated: 2026</p>
                </div>

                <div className="prose prose-invert prose-lg max-w-none space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-4">1. Agreement to Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            These Terms of Service constitute a legally binding agreement between you (&ldquo;User&rdquo; or &ldquo;You&rdquo;) and Wealify Labs (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), concerning your access to and use of our educational course platform.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mt-4">
                            By accessing or registering on the platform, you acknowledge that you have read, understood, and agreed to be bound by all of these Terms of Service. If you do not agree, you are prohibited from using the platform and must discontinue use immediately.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-4">2. Intellectual Property Rights</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            All course material, videos, curriculum frameworks, downloadable assets, software code, UI design, text, and trademarks are proprietary property of Wealify Labs or licensed to us.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mt-4">
                            Your purchase grants you a single-user, non-transferable, revocable license for personal education only. No content may be reproduced, redistributed, mirrored, sold, or shared without express prior written permission from Wealify Labs.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-4">3. User Representations & Conduct</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            By enrolling, you represent and warrant that:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                            <li>All registration and profile information you provide is true, accurate, and kept current.</li>
                            <li>You possess the legal capacity to enter into these terms in your jurisdiction.</li>
                            <li>You will not share your account credentials or allow third-party access to course videos and resources.</li>
                            <li>You will not use automated scripts, bots, or scraping tools to download platform assets.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-4">4. Purchases & Payment</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Payments are processed securely through our authorized payment gateway, NOWPayments, supporting major cryptocurrencies (including BTC, ETH, USDT, SOL, and others). All prices are displayed in USD equivalents. You agree that blockchain transaction fees (gas/network fees) are determined by your chosen blockchain network and are non-refundable. Access to course materials is automatically activated once the blockchain transaction reaches network confirmation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-4">5. Earnings & Results Disclaimer</h2>
                        <div className="p-6 bg-secondary/20 border border-secondary rounded-lg">
                            <p className="text-muted-foreground leading-relaxed font-medium">
                                Wealify Labs provides educational frameworks and technical guidance. We do not make any guarantees regarding individual financial results, income, or business outcomes.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                Individual success is entirely dependent upon each student&apos;s background, effort, commitment, and market execution. Any past performance figures or student testimonials reflect individual circumstances and are not guarantees of future performance.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-4">6. Limitation of Liability</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            In no event will Wealify Labs, its founders, or operators be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, or special damages arising from your use of the course platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-4">7. Contact Us</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            If you have questions regarding these Terms of Service or need support, please contact our team:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 text-muted-foreground mt-3">
                            <li>Primary Support: <a href="mailto:support@wealifylabs.site" className="text-primary hover:underline">support@wealifylabs.site</a></li>
                            <li>Secondary Support: <a href="mailto:wealifylabs@gmail.com" className="text-primary hover:underline">wealifylabs@gmail.com</a></li>
                        </ul>
                        <div className="mt-4">
                            <a href="/contact" className="text-primary hover:underline font-semibold">
                                Contact Support Page
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
