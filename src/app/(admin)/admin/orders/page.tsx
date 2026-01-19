import { createClient } from "@/lib/supabase/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default async function AdminOrdersPage() {
    const supabase = await createClient();

    const { data: orders, error } = await supabase
        .from('payments')
        .select(`
            *,
            profiles:user_id (full_name, email),
            courses:course_id (title)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching orders:", error);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Orders</h1>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!orders || orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order: any) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium font-mono text-xs text-muted-foreground">
                                        {order.id.slice(0, 8)}...
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{order.profiles?.full_name || "Unknown"}</span>
                                            <span className="text-xs text-muted-foreground">{order.profiles?.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate">
                                        {order.courses?.title || "Unknown Course"}
                                    </TableCell>
                                    <TableCell>
                                        {order.created_at ? format(new Date(order.created_at), "MMM d, yyyy") : "-"}
                                    </TableCell>
                                    <TableCell>
                                        ${order.amount?.toFixed(2)} <span className="text-xs text-muted-foreground uppercase">{order.currency}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={order.status === "paid" || order.status === "completed" ? "default" : order.status === "refunded" ? "destructive" : "secondary"}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
