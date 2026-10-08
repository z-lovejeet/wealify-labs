import { createClient } from "@/lib/supabase/server";
import AdminUsersClient from "@/components/admin/AdminUsersClient";

export default async function AdminUsersPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const { page: pageParam, courseId: courseIdParam } = await searchParams;
    const supabase = await createClient();

    const page = pageParam ? parseInt(pageParam) : 1;
    const limit = 20;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    // Fetch primary or selected course
    let targetCourseId: string = courseIdParam || "";
    if (!targetCourseId) {
        const { data: defaultCourse } = await supabase
            .from('courses')
            .select('id, title')
            .limit(1)
            .maybeSingle();

        targetCourseId = defaultCourse?.id || "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
    }

    // Fetch total count
    const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

    // Fetch profiles with pagination
    const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .range(start, end);

    // Fetch enrollments for the selected course
    const { data: enrollments } = await supabase
        .from('enrollments')
        .select('*')
        .eq('course_id', targetCourseId);

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
                    <p className="text-muted-foreground">Manage students, roles, and course enrollment status.</p>
                </div>
            </div>

            <AdminUsersClient
                initialUsers={usersWithEnrollments}
                currentPage={page}
                totalPages={totalPages}
                courseId={targetCourseId}
            />
        </div>
    );
}
