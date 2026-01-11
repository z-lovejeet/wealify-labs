import { getPlatformSettings } from "@/app/actions/settings";
import SettingsClient from "@/components/admin/SettingsClient";

export default async function AdminSettingsPage() {
    const settings = await getPlatformSettings();

    return <SettingsClient initialSettings={settings} />;
}
