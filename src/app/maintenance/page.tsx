import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MaintenancePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
            <div className="bg-mute/50 p-8 rounded-full bg-secondary/20 mb-6 animate-pulse">
                <Construction className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                Under Maintenance
            </h1>
            <p className="text-xl text-muted-foreground max-w-md mb-8">
                We are currently performing scheduled maintenance to improve your experience. We&apos;ll be back shortly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
                <a href="mailto:support@wealifylabs.site">
                    <Button variant="default">Contact Support (Primary)</Button>
                </a>
                <a href="mailto:wealifylabs@gmail.com">
                    <Button variant="outline">Secondary Email</Button>
                </a>
            </div>
        </div>
    );
}
