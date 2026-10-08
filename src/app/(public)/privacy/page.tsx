import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Wealify Labs",
    description: "Our commitment to protecting your privacy and personal data.",
};

export default function PrivacyPage() {
    return (
        <div className="bg-background min-h-screen py-12 md:py-24">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Privacy Policy</h1>
                    <p className="text-xl text-muted-foreground">Last updated: 2026</p>
                </div>

                <div className="prose prose-invert prose-lg max-w-none space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-4">1. Introduction</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Welcome to Wealify Labs. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at <a href="mailto:support@wealifylabs.site" className="text-primary hover:underline">support@wealifylabs.site</a> (or secondary: <a href="mailto:wealifylabs@gmail.com" className="text-primary hover:underline">wealifylabs@gmail.com</a>).
                        </p>
                        <p className="text-muted-foreground leading-relaxed mt-4">
                            When you visit our website and use our educational services, you trust us with your personal information. We take your privacy very seriously. In this privacy policy, we explain clearly what information we collect, how we use it, and what rights you have in relation to it.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-4">2. Information We Collect</h2>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">Personal Information You Disclose to Us</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                We collect personal information that you voluntarily provide to us when registering for our courses, expressing an interest in our products, or communicating with us directly.
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>
                                    <strong>Contact Data:</strong> We collect your full name and email address for account access and course progress notifications.
                                </li>
                                <li>
                                    <strong>Credentials:</strong> Passwords and authentication identifiers used for secure login via our identity provider.
                                </li>
                                <li>
                                    <strong>Payment Information:</strong> All payments are processed through third-party payment processors (such as NOWPayments for cryptocurrency transactions). Wealify Labs does not collect, process, or store sensitive payment instruments (such as credit card numbers, CVVs, or wallet private keys).
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-4">3. How We Use Your Information</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We use personal information collected via our website for authentic business purposes described below:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                            <li>To facilitate account creation, login, and secure course player access.</li>
                            <li>To fulfill orders and provision course access, lessons, and certificates.</li>
                            <li>To send service updates, security alerts, and administrative notices.</li>
                            <li>To display verified student reviews and testimonials with your consent.</li>
                            <li>To maintain platform security, prevent fraud, and enforce our terms.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-4">4. Data Security & Retention</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We have implemented robust technical and organizational security measures, including HTTPS encryption, role-based database access policies, and encrypted session handling. However, no internet transmission is guaranteed to be 100% immune from compromise. We advise accessing the services within a secure environment.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-4">5. Contact Us</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            If you have questions or comments regarding this policy, reach out to our privacy and support team:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 text-muted-foreground mt-3">
                            <li>Primary Support: <a href="mailto:support@wealifylabs.site" className="text-primary hover:underline">support@wealifylabs.site</a></li>
                            <li>Secondary Support: <a href="mailto:wealifylabs@gmail.com" className="text-primary hover:underline">wealifylabs@gmail.com</a></li>
                        </ul>
                        <div className="mt-6">
                            <a
                                href="/contact"
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-5 py-2"
                            >
                                Contact Support Page
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
