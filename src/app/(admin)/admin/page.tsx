import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, BookOpen, Activity } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function AdminDashboardPage() {
    const supabase = await createClient();

    // 1. Fetch Total Users
    const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

    // 2. Fetch Total Modules (Better metric for single-course site)
    const { count: totalModules } = await supabase
        .from('modules')
        .select('*', { count: 'exact', head: true });

    // 3. Fetch Payments (for Revenue and Recent Sales)
    // We fetch all paid payments for now to sum client-side (efficient enough for small scale)
    // For large scale, use RPC 'get_total_revenue'
    const { data: payments } = await supabase
        .from('payments')
        .select(`
            amount, 
            created_at, 
            profiles (full_name, email, avatar_url)
        `)
        .eq('status', 'paid')
        .order('created_at', { ascending: false });

    // Calculate Total Revenue
    const totalRevenue = payments?.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0;

    // Process Chart Data (Monthly Revenue)
    const chartDataMap = new Map<string, number>();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Initialize current year months
    const currentMonthIndex = new Date().getMonth();
    for (let i = 0; i <= currentMonthIndex; i++) {
        chartDataMap.set(months[i], 0);
    }

    payments?.forEach(p => {
        const date = new Date(p.created_at);
        if (date.getFullYear() === new Date().getFullYear()) {
            const month = months[date.getMonth()];
            chartDataMap.set(month, (chartDataMap.get(month) || 0) + Number(p.amount));
        }
    });

    const chartData = Array.from(chartDataMap).map(([name, total]) => ({ name, total }));

    // Recent Sales
    const recentSales = payments?.slice(0, 5) || [];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Lifetime earnings</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers?.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Registered members</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalModules}</div>
                        <p className="text-xs text-muted-foreground">Content modules</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${payments && payments.length > 0 ? (totalRevenue / payments.length).toFixed(2) : "0.00"}
                        </div>
                        <p className="text-xs text-muted-foreground">Based on {payments?.length || 0} sales</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Revenue (This Year)</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <RevenueChart data={chartData} />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {recentSales.map((sale: any, i: number) => {
                                const profile = sale.profiles; // joined data
                                const initials = profile?.full_name
                                    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
                                    : "??";

                                return (
                                    <div key={i} className="flex items-center">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={profile?.avatar_url} alt="Avatar" />
                                            <AvatarFallback>{initials}</AvatarFallback>
                                        </Avatar>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">{profile?.full_name || "Unknown User"}</p>
                                            <p className="text-xs text-muted-foreground">{profile?.email}</p>
                                        </div>
                                        <div className="ml-auto font-medium">+${sale.amount}</div>
                                    </div>
                                );
                            })}
                            {recentSales.length === 0 && (
                                <p className="text-sm text-center text-muted-foreground py-4">No recent sales found.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
