"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const orders = [
    { id: "ORD-001", customer: "John Doe", course: "Full-Stack SaaS", amount: 199.00, status: "completed", date: "2024-01-10" },
    { id: "ORD-002", customer: "Sarah Smith", course: "Digital Marketing", amount: 149.00, status: "completed", date: "2024-01-09" },
    { id: "ORD-003", customer: "Mike Johnson", course: "UI/UX Design", amount: 179.00, status: "refunded", date: "2024-01-08" },
    { id: "ORD-004", customer: "Emily Davis", course: "Full-Stack SaaS", amount: 199.00, status: "completed", date: "2024-01-08" },
    { id: "ORD-005", customer: "Alex Wilson", course: "Business mastery", amount: 120.00, status: "pending", date: "2024-01-07" },
];

export default function AdminOrdersPage() {
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
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.id}</TableCell>
                                <TableCell>{order.customer}</TableCell>
                                <TableCell>{order.course}</TableCell>
                                <TableCell>{order.date}</TableCell>
                                <TableCell>${order.amount.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Badge variant={order.status === "completed" ? "default" : order.status === "refunded" ? "destructive" : "secondary"}>
                                        {order.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
