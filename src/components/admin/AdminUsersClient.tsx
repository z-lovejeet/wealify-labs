"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Shield, User, MoreHorizontal, CheckCircle, XCircle } from "lucide-react";
import { toggleEnrollment } from "@/app/actions/admin";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface AdminUsersClientProps {
    initialUsers: any[];
    currentPage: number;
    totalPages: number;
    courseId: string;
}

export default function AdminUsersClient({ initialUsers, currentPage, totalPages, courseId }: AdminUsersClientProps) {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleToggleEnrollment = async (userId: string, isEnrolled: boolean) => {
        try {
            setLoadingId(userId);
            await toggleEnrollment(userId, courseId, !isEnrolled);
            toast.success(isEnrolled ? "User unenrolled" : "User enrolled");
            router.refresh();
        } catch {
            toast.error("Failed to update enrollment");
        } finally {
            setLoadingId(null);
        }
    };

    const handlePageChange = (newPage: number) => {
        router.push(`/admin/users?page=${newPage}&courseId=${courseId}`);
    };

    return (
        <div className="space-y-4">
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialUsers.map((user) => {
                            const isEnrolled = user.enrollments && user.enrollments.some((e: any) => e.course_id === courseId);

                            return (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-xs uppercase">
                                            {(user.full_name || user.email || "U").charAt(0)}
                                        </div>
                                        {user.full_name || "No Name"}
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
                                            {user.role === "admin" ? <Shield className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                                            {user.role || "student"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {isEnrolled ? (
                                            <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
                                                <CheckCircle className="w-3 h-3 mr-1" /> Enrolled
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-muted-foreground">
                                                <XCircle className="w-3 h-3 mr-1" /> Not Enrolled
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={loadingId === user.id}>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleToggleEnrollment(user.id, isEnrolled)}>
                                                    {isEnrolled ? "Revoke Access" : "Grant Access"}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    Previous
                </Button>
                <div className="text-sm font-medium">
                    Page {currentPage} of {totalPages}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
