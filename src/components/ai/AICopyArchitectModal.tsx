"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Sparkles,
    Loader2,
    Copy,
    Check,
    RotateCcw,
    Zap
} from "lucide-react";
import { toast } from "sonner";

interface AICopyArchitectModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AICopyArchitectModal({
    isOpen,
    onOpenChange
}: AICopyArchitectModalProps) {
    const [productName, setProductName] = useState("");
    const [coreOutcome, setCoreOutcome] = useState("");
    const [targetAudience, setTargetAudience] = useState("");
    const [copyResult, setCopyResult] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleGenerateCopy = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!productName.trim() || !coreOutcome.trim()) {
            toast.error("Please fill in the product name and desired outcome.");
            return;
        }

        setIsGenerating(true);
        setCopyResult(null);

        try {
            const prompt = `Generate high-converting direct-response sales copy for this offer:
Product Name: ${productName}
Desired Outcome: ${coreOutcome}
Target Audience: ${targetAudience || "Ambitious solopreneurs"}`;

            const res = await fetch("/api/ai/mentor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "copywriter",
                    messages: [{ role: "user", content: prompt }],
                    context: {
                        productIdea: productName,
                        targetAudience
                    }
                })
            });

            const data = await res.json();
            if (data.reply) {
                setCopyResult(data.reply);
                toast.success("Offer copy assets generated!");
            } else {
                throw new Error(data.error || "Failed to generate copy.");
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to generate copy assets.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = () => {
        if (!copyResult) return;
        navigator.clipboard.writeText(copyResult);
        setCopied(true);
        toast.success("Copy suite copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleReset = () => {
        setProductName("");
        setCoreOutcome("");
        setTargetAudience("");
        setCopyResult(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl bg-[#070b14] border border-white/10 text-slate-100 p-6 md:p-8 max-h-[90vh] overflow-y-auto rounded-3xl">
                <DialogHeader className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                            <Zap className="w-4 h-4" />
                        </div>
                        <DialogTitle className="text-xl font-black text-white">
                            Offer Copy & Hook Architect
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Synthesizes high-converting hooks, value proposition statements, and irresistible risk reversals engineered for digital products.
                    </DialogDescription>
                </DialogHeader>

                {!copyResult ? (
                    <form onSubmit={handleGenerateCopy} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="productName" className="text-xs font-semibold text-slate-200">
                                Product or Offer Title *
                            </Label>
                            <Input
                                id="productName"
                                placeholder="e.g. 10x Content Engine, Freelance Sales OS, Digital Blueprint..."
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                required
                                className="bg-white/[0.04] border-white/10 text-xs text-white placeholder:text-muted-foreground h-11 rounded-xl focus:border-amber-400/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="coreOutcome" className="text-xs font-semibold text-slate-200">
                                Main Outcome or Result Delivered *
                            </Label>
                            <Input
                                id="coreOutcome"
                                placeholder="e.g. Get 5 high-ticket client meetings per week, automate email onboarding..."
                                value={coreOutcome}
                                onChange={(e) => setCoreOutcome(e.target.value)}
                                required
                                className="bg-white/[0.04] border-white/10 text-xs text-white placeholder:text-muted-foreground h-11 rounded-xl focus:border-amber-400/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="targetAudience" className="text-xs font-semibold text-slate-200">
                                Ideal Target Customer
                            </Label>
                            <Input
                                id="targetAudience"
                                placeholder="e.g. B2B consultants, agency owners, digital creators"
                                value={targetAudience}
                                onChange={(e) => setTargetAudience(e.target.value)}
                                className="bg-white/[0.04] border-white/10 text-xs text-white placeholder:text-muted-foreground h-11 rounded-xl focus:border-amber-400/50"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isGenerating || !productName.trim() || !coreOutcome.trim()}
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 gap-2 mt-4"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Drafting Direct-Response Copy Suite...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    <span>Generate Conversion Copy Suite</span>
                                </>
                            )}
                        </Button>
                    </form>
                ) : (
                    <div className="space-y-5 pt-4">
                        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-xs leading-relaxed whitespace-pre-wrap text-slate-200 font-sans shadow-inner max-h-[55vh] overflow-y-auto">
                            {copyResult}
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleReset}
                                className="rounded-xl border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-slate-300 gap-1.5"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Draft Another Offer</span>
                            </Button>

                            <Button
                                size="sm"
                                onClick={handleCopy}
                                className="rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs gap-1.5"
                            >
                                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copied ? "Copied" : "Copy All Assets"}</span>
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
