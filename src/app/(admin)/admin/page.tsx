import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, BookOpen, GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function AdminDashboardPage() {
    const supabase = await createClient();
    const now = new Date();
    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // 1. Fetch Profiles (for Total Users & Growth)
    const { data: profiles } = await supabase
        .from('profiles')
        .select('created_at');
    const totalUsers = profiles?.length || 0;

    // User Growth Calc
    const newUsersLastMonth = profiles?.filter(p => {
        const d = new Date(p.created_at);
        return d >= firstDayLastMonth && d <= lastDayLastMonth;
    }).length || 0;
    const newUsersThisMonth = profiles?.filter(p => {
        const d = new Date(p.created_at);
        return d >= firstDayCurrentMonth;
    }).length || 0;

    const userGrowth = newUsersLastMonth > 0
        ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100
        : newUsersThisMonth > 0 ? 100 : 0;

    // 2. Fetch Modules
    const { count: totalModules } = await supabase
        .from('modules')
        .select('*', { count: 'exact', head: true });

    // 3. Fetch Payments (for Revenue, Growth, Recent Sales)
    const { data: payments } = await supabase
        .from('payments')
        .select(`
            amount, 
            created_at, 
            profiles (full_name, email, avatar_url)
        `)
        .eq('status', 'paid')
        .order('created_at', { ascending: false });

    // Revenue Calc
    const totalRevenue = payments?.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0;

    const revenueLastMonth = payments?.filter(p => {
        const d = new Date(p.created_at);
        return d >= firstDayLastMonth && d <= lastDayLastMonth;
    }).reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0;

    const revenueThisMonth = payments?.filter(p => {
        const d = new Date(p.created_at);
        return d >= firstDayCurrentMonth;
    }).reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0;

    const revenueGrowth = revenueLastMonth > 0
        ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100
        : revenueThisMonth > 0 ? 100 : 0;

    // 4. Fetch Enrollments (New Metric instead of Active Now)
    const { count: totalEnrollments } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true });

    // Chart Data
    const chartDataMap = new Map<string, number>();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonthIndex = new Date().getMonth();

    for (let i = 0; i <= currentMonthIndex; i++) {
        chartDataMap.set(months[i], 0);
    }
    payments?.forEach(p => {
        const date = new Date(p.created_at);
        if (date.getFullYear() === now.getFullYear()) {
            const month = months[date.getMonth()];
            chartDataMap.set(month, (chartDataMap.get(month) || 0) + Number(p.amount));
        }
    });
    const chartData = Array.from(chartDataMap).map(([name, total]) => ({ name, total }));

    // Recent Sales
    const recentSales = payments?.slice(0, 5) || [];

    // Date Range String
    const dateRange = `${months[now.getMonth()]} 1, ${now.getFullYear()} - ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <div className="hidden md:flex items-center bg-background border rounded-md px-3 py-2 text-sm text-muted-foreground mr-2">
                        <span>{dateRange}</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <DollarSign className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            {revenueGrowth > 0 ? "+" : ""}{revenueGrowth.toFixed(1)}% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Users className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            {userGrowth > 0 ? "+" : ""}{userGrowth.toFixed(1)}% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Content Modules</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <BookOpen className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalModules}</div>
                        <p className="text-xs text-muted-foreground">Platform content</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                            <GraduationCap className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalEnrollments}</div>
                        <p className="text-xs text-muted-foreground">Active learning</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <RevenueChart data={chartData} />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                        <div className="text-sm text-muted-foreground">
                            You made {recentSales.length} sales this month.
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {recentSales.map((sale: any, i: number) => {
                                const profile = sale.profiles; // joined data
                                const initials = profile?.full_name
                                    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
                                    : "??";

                                return (
                                    <div key={i} className="flex items-center group cursor-default">
                                        <Avatar className="h-9 w-9 transition-transform group-hover:scale-110">
                                            <AvatarImage src={profile?.avatar_url} alt="Avatar" />
                                            <AvatarFallback className="bg-primary/5 text-primary text-xs">{initials}</AvatarFallback>
                                        </Avatar>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">{profile?.full_name || "Unknown User"}</p>
                                            <p className="text-xs text-muted-foreground">{profile?.email}</p>
                                        </div>
                                        <div className="ml-auto font-medium text-emerald-500">+${sale.amount}</div>
                                    </div>
                                );
                            })}
                            {recentSales.length === 0 && (
                                <div className="flex flex-col items-center justify-center text-center py-10 text-muted-foreground">
                                    <DollarSign className="h-10 w-10 mb-3 opacity-20" />
                                    <p className="text-sm">No sales yet.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
