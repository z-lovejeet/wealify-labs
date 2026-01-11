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
                    <p className="text-xl text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="prose prose-invert prose-lg max-w-none space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-4">1. Agreement to Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Wealify Labs ("we," "us" or "our"), concerning your access to and use of the Wealify Labs website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
                        </p>
                        <p className="text-muted-foreground leading-relaxed mt-4">
                            You agree that by accessing the Site, you have read, understood, and agree to be bound by all of these Terms of Service. If you do not agree with all of these Terms of Service, then you are expressly prohibited from using the Site and you must discontinue use immediately.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-4">2. Intellectual Property Rights</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mt-4">
                            The Content and the Marks are provided on the Site "AS IS" for your information and personal use only. Except as expressly provided in these Terms of Service, no part of the Site and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-4">3. User Representations</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            By using the Site, you represent and warrant that:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                            <li>All registration information you submit will be true, accurate, current, and complete.</li>
                            <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                            <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                            <li>You are not a minor in the jurisdiction in which you reside.</li>
                            <li>You will not access the Site through automated or non-human means, whether through a bot, script or otherwise.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-4">4. Purchases and Payment</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We accept the following forms of payment: Visa, Mastercard, American Express, Discover, and PayPal. You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Site. You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed. Sales tax will be added to the price of purchases as deemed required by us. We may change prices at any time. All payments shall be in U.S. dollars.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-4">6. Limit of Liability</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site, even if we have been advised of the possibility of such damages.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-4">7. Earnings Disclaimer</h2>
                        <div className="p-6 bg-secondary/20 border border-secondary rounded-lg">
                            <p className="text-muted-foreground leading-relaxed font-medium">
                                Wealify Labs does not guarantee any specific financial results, income, or outcomes. All results are dependent on your individual effort, mindset, dedication, and hard work.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                Any examples, testimonials, or success stories shown are exceptional results and do not represent the average user experience. Your success depends on your background, dedication, desire, and motivation. As with any business endeavor, there is an inherent risk of loss of capital and there is no guarantee that you will earn any money.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-4">6. Contact Us</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
                        </p>
                        <div className="mt-4">
                            <a href="/contact" className="text-primary hover:underline font-semibold">Contact Support Page</a>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
