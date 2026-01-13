import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
    // creating a new Response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    // 4. Finally:
    //    return myNewResponse
    // If this is not done, you may be causing the browser and server to go out
    // of sync and terminate the user's session prematurely!

    const path = request.nextUrl.pathname;

    // OPTIMIZATION: Only fetch user, skip maintenance check for performance
    const { data: { user } } = await supabase.auth.getUser();

    /* 
       REMOVED MAINTENANCE CHECK FOR PERFORMANCE
       To re-enable, uncomment the platform_settings fetch and logic below.
       Currently, this was adding ~200-500ms overhead to every request.
    */


    // --- Route Protection ---
    // 1. Admin Routes Protection
    // OPTIMIZATION: Only fetch authoritative profile role if attempting to access Admin area
    if (path.startsWith('/admin')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        let userRole = user?.user_metadata?.role;
        // Fetch accurate role from DB only for admin routes
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role) {
            userRole = profile.role;
        }

        if (userRole !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // 2. User Protected Routes
    const protectedPaths = ['/dashboard', '/settings', '/profile', '/my-courses', '/learn', '/checkout'];
    if (protectedPaths.some(p => path.startsWith(p))) {
        if (!user) {
            return NextResponse.redirect(new URL(`/login?next=${path}`, request.url));
        }
    }

    // 3. Auth Routes (redirect if already logged in)
    if (path.startsWith('/login') || path.startsWith('/register')) {
        if (user) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }
    // ------------------------------

    return supabaseResponse
}
