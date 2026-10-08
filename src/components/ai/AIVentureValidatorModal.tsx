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
    ShieldCheck,
    Copy,
    Check,
    RotateCcw
} from "lucide-react";
import { toast } from "sonner";

interface AIVentureValidatorModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AIVentureValidatorModal({
    isOpen,
    onOpenChange
}: AIVentureValidatorModalProps) {
    const [productIdea, setProductIdea] = useState("");
    const [targetAudience, setTargetAudience] = useState("");
    const [pricePoint, setPricePoint] = useState("");
    const [salesChannel, setSalesChannel] = useState("");
    const [auditResult, setAuditResult] = useState<string | null>(null);
    const [isAuditing, setIsAuditing] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleRunAudit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!productIdea.trim()) {
            toast.error("Please enter a product idea to audit.");
            return;
        }

        setIsAuditing(true);
        setAuditResult(null);

        try {
            const prompt = `Audit this digital product venture:
Product Idea: ${productIdea}
Target Audience: ${targetAudience || "Digital creators / professionals"}
Proposed Price: ${pricePoint || "$29 - $49"}
Distribution Channel: ${salesChannel || "Social Media & Gumroad"}`;

            const res = await fetch("/api/ai/mentor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "validator",
                    messages: [{ role: "user", content: prompt }],
                    context: {
                        productIdea,
                        targetAudience,
                        pricePoint,
                        salesChannel
                    }
                })
            });

            const data = await res.json();
            if (data.reply) {
                setAuditResult(data.reply);
                toast.success("Venture audit completed!");
            } else {
                throw new Error(data.error || "Failed to generate audit.");
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to complete audit.");
        } finally {
            setIsAuditing(false);
        }
    };

    const handleCopy = () => {
        if (!auditResult) return;
        navigator.clipboard.writeText(auditResult);
        setCopied(true);
        toast.success("Audit report copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleReset = () => {
        setProductIdea("");
        setTargetAudience("");
        setPricePoint("");
        setSalesChannel("");
        setAuditResult(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl bg-[#070b14] border border-white/10 text-slate-100 p-6 md:p-8 max-h-[90vh] overflow-y-auto rounded-3xl">
                <DialogHeader className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <DialogTitle className="text-xl font-black text-white">
                            Venture Idea Validator & Auditor
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Powered by Claude 5.5 Sonnet reasoning. Evaluate your proposed digital product against market viability, pricing friction, and 7-day validation benchmarks.
                    </DialogDescription>
                </DialogHeader>

                {!auditResult ? (
                    <form onSubmit={handleRunAudit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="productIdea" className="text-xs font-semibold text-slate-200">
                                Digital Product Concept *
                            </Label>
                            <Input
                                id="productIdea"
                                placeholder="e.g. Automated bookkeeping template for Shopify sellers, Notion agency OS..."
                                value={productIdea}
                                onChange={(e) => setProductIdea(e.target.value)}
                                required
                                className="bg-white/[0.04] border-white/10 text-xs text-white placeholder:text-muted-foreground h-11 rounded-xl focus:border-amber-400/50"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="targetAudience" className="text-xs font-semibold text-slate-200">
                                    Target Audience / Niche
                                </Label>
                                <Input
                                    id="targetAudience"
                                    placeholder="e.g. Solopreneurs, e-commerce stores, freelancers"
                                    value={targetAudience}
                                    onChange={(e) => setTargetAudience(e.target.value)}
                                    className="bg-white/[0.04] border-white/10 text-xs text-white placeholder:text-muted-foreground h-11 rounded-xl focus:border-amber-400/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pricePoint" className="text-xs font-semibold text-slate-200">
                                    Proposed Price Point
                                </Label>
                                <Input
                                    id="pricePoint"
                                    placeholder="e.g. $29 one-time, $49 bundle"
                                    value={pricePoint}
                                    onChange={(e) => setPricePoint(e.target.value)}
                                    className="bg-white/[0.04] border-white/10 text-xs text-white placeholder:text-muted-foreground h-11 rounded-xl focus:border-amber-400/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="salesChannel" className="text-xs font-semibold text-slate-200">
                                Primary Distribution Channel
                            </Label>
                            <Input
                                id="salesChannel"
                                placeholder="e.g. X (Twitter), LinkedIn, YouTube, cold email, Gumroad SEO"
                                value={salesChannel}
                                onChange={(e) => setSalesChannel(e.target.value)}
                                className="bg-white/[0.04] border-white/10 text-xs text-white placeholder:text-muted-foreground h-11 rounded-xl focus:border-amber-400/50"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isAuditing || !productIdea.trim()}
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 gap-2 mt-4"
                        >
                            {isAuditing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Simulating Market Viability Audit...</span>
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Run 4-Pillar Venture Audit</span>
                                </>
                            )}
                        </Button>
                    </form>
                ) : (
                    <div className="space-y-5 pt-4">
                        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-xs leading-relaxed whitespace-pre-wrap text-slate-200 font-sans shadow-inner max-h-[55vh] overflow-y-auto">
                            {auditResult}
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleReset}
                                className="rounded-xl border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-slate-300 gap-1.5"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Audit Another Idea</span>
                            </Button>

                            <Button
                                size="sm"
                                onClick={handleCopy}
                                className="rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs gap-1.5"
                            >
                                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copied ? "Copied" : "Copy Audit Report"}</span>
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
