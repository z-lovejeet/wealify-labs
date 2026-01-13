"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { updatePlatformSettings } from "@/app/actions/settings";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface SettingsClientProps {
    initialSettings: Record<string, string>;
}

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
    const [settings, setSettings] = useState(initialSettings);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updatePlatformSettings(settings);
            toast.success("Settings saved successfully");
        } catch (error) {
            toast.error("Failed to save settings");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
                    <p className="text-muted-foreground mt-2">Manage your site configuration, features, and payments.</p>
                </div>
                <Button onClick={handleSave} disabled={isSaving} size="lg">
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Global Configuration</CardTitle>
                        <CardDescription>Control system-wide settings and availability.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Site Name</Label>
                                <Input
                                    value={settings.site_name || ""}
                                    onChange={(e) => handleChange('site_name', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Support Email</Label>
                                <Input
                                    value={settings.support_email || ""}
                                    onChange={(e) => handleChange('support_email', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/20">
                            <div className="space-y-0.5">
                                <Label className="text-base">Maintenance Mode</Label>
                                <p className="text-sm text-muted-foreground">
                                    Restrict access to admins only. Useful for updates.
                                </p>
                            </div>
                            <Switch
                                checked={settings.maintenance_mode === 'true'}
                                onCheckedChange={(checked) => handleChange('maintenance_mode', String(checked))}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Gateways</CardTitle>
                        <CardDescription>Enable or disable specific payment methods for checkout.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">PayPal</Label>
                                <p className="text-sm text-muted-foreground">
                                    Accept payments via PayPal Balance and Cards.
                                </p>
                            </div>
                            <Switch
                                checked={settings.enable_paypal === 'true'}
                                onCheckedChange={(checked) => handleChange('enable_paypal', String(checked))}
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">NOWPayments</Label>
                                <p className="text-sm text-muted-foreground">
                                    Accept Crypto (BTC, ETH, USDC, etc.) anonymously.
                                </p>
                            </div>
                            <Switch
                                checked={settings.enable_nowpayments === 'true'}
                                onCheckedChange={(checked) => handleChange('enable_nowpayments', String(checked))}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Marketing Banner</CardTitle>
                        <CardDescription>Announce sales or news at the top of the site.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between rounded-lg border p-4 mb-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">Banner Active</Label>
                                <p className="text-sm text-muted-foreground">
                                    Show the banner on all public pages.
                                </p>
                            </div>
                            <Switch
                                checked={settings.banner_active === 'true'}
                                onCheckedChange={(checked) => handleChange('banner_active', String(checked))}
                            />
                        </div>

                        {settings.banner_active === 'true' && (
                            <div className="grid gap-4 md:grid-cols-2 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="space-y-2">
                                    <Label>Banner Text</Label>
                                    <Input
                                        value={settings.banner_text || ""}
                                        onChange={(e) => handleChange('banner_text', e.target.value)}
                                        placeholder="e.g. 50% Off Launch Sale!"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Link URL (Optional)</Label>
                                    <Input
                                        value={settings.banner_link || ""}
                                        onChange={(e) => handleChange('banner_link', e.target.value)}
                                        placeholder="e.g. /pricing"
                                    />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
