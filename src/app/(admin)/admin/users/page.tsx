import { createClient } from "@/lib/supabase/server";
import AdminUsersClient from "@/components/admin/AdminUsersClient";

export default async function AdminUsersPage() {
    const supabase = await createClient();

    // Fetch all profiles
    const { data: profiles } = await supabase
        .from('profiles')
        .select('*');

    // Fetch all enrollments for the single course
    // Ideally we join, but simplified approach: fetch all enrollments matching course
    const { data: enrollments } = await supabase
        .from('enrollments')
        .select('*')
        .eq('course_id', "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");

    // Merge data: Attach enrollments to profiles
    const usersWithEnrollments = profiles?.map(profile => ({
        ...profile,
        enrollments: enrollments?.filter(e => e.user_id === profile.id) || []
    })) || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Users</h1>
                    <p className="text-muted-foreground">Manage students and instructors.</p>
                </div>
                {/* Invite User feature can be added later */}
            </div>

            <AdminUsersClient initialUsers={usersWithEnrollments} />
        </div>
    );
}
