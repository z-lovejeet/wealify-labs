import { createClient } from "@/lib/supabase/server";
import AdminUsersClient from "@/components/admin/AdminUsersClient";

export default async function AdminUsersPage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | undefined };
}) {
    const supabase = await createClient();

    const page = searchParams?.page ? parseInt(searchParams.page) : 1;
    const limit = 20;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    // Fetch total count first
    const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

    // Fetch profiles with pagination
    const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .range(start, end);

    // Fetch all enrollments for the single course (still need all to map correct status)
    // Optimization: could be improved to only fetch enrollments for displayed user IDs
    const { data: enrollments } = await supabase
        .from('enrollments')
        .select('*')
        .eq('course_id', "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");

    // Merge data: Attach enrollments to profiles
    const usersWithEnrollments = profiles?.map(profile => ({
        ...profile,
        enrollments: enrollments?.filter(e => e.user_id === profile.id) || []
    })) || [];

    const totalPages = count ? Math.ceil(count / limit) : 1;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Users</h1>
                    <p className="text-muted-foreground">Manage students and instructors.</p>
                </div>
                {/* Invite User feature can be added later */}
            </div>

            <AdminUsersClient
                initialUsers={usersWithEnrollments}
                currentPage={page}
                totalPages={totalPages}
            />
        </div>
    );
}
