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
                    <p className="text-xl text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="prose prose-invert prose-lg max-w-none space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-4">1. Introduction</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Welcome to Wealify Labs. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at privacy@wealifylabs.com.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mt-4">
                            When you visit our website and use our services, you trust us with your personal information. We take your privacy very seriously. In this privacy policy, we describe our privacy policy. We seek to explain to you in the clearest way possible what information we collect, how we use it, and what rights you have in relation to it.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-4">2. Information We Collect</h2>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">Personal Information You Disclose to Us</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                We collect personal information that you voluntarily provide to us when expressing an interest in obtaining information about us or our products and services, when participating in activities on the website or otherwise contacting us.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                The personal information that we collect depends on the context of your interactions with us and the website, the choices you make and the products and features you use. The personal information we collect can include the following:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>Name and Contact Data. We collect your first and last name, email address, postal address, and other similar contact data.</li>
                                <li>Credentials. We collect passwords, password hints, and similar security information used for authentication and account access.</li>
                                <li>Payment Data. We collect data necessary to process your payment if you make purchases, such as your payment instrument number (such as a credit card number), and the security code associated with your payment instrument.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-4">3. How We Use Your Information</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                            <li>To facilitate account creation and logon process.</li>
                            <li>To send administrative information to you.</li>
                            <li>To fulfill and manage your orders.</li>
                            <li>To post testimonials with your consent.</li>
                            <li>To protect our Services.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-4">4. Data Security</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our website is at your own risk. You should only access the services within a secure environment.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-4">5. Contact Us</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            If you have questions or comments about this policy, you may email us at privacy@wealifylabs.com or by post to:
                        </p>
                        <address className="not-italic text-muted-foreground mt-4 border-l-2 border-primary pl-4">
                            Wealify Labs Inc.<br />
                            123 Innovation Dr<br />
                            Tech City, TC 94043
                        </address>
                    </section>
                </div>
            </div>
        </div>
    );
}
