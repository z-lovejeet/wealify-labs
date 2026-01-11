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

    const { data: { user } } = await supabase.auth.getUser()

    // --- Maintenance Mode Logic ---
    const { data: settings } = await supabase
        .from('platform_settings')
        .select('value')
        .eq('key', 'maintenance_mode')
        .single();

    const isMaintenanceMode = settings?.value === 'true';
    const isMaintenancePage = request.nextUrl.pathname === '/maintenance';
    const isLoginPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/auth');
    const isAdmin = user?.user_metadata?.role === 'admin'; // Note: also check profile if role not in metadata, but metadata is faster middleware access often

    // If Maintenance is ON
    if (isMaintenanceMode) {
        // Allow Admins to bypass
        if (isAdmin) {
            return supabaseResponse;
        }

        // Redirect everyone else to maintenance page (unless already there or logging in)
        if (!isMaintenancePage && !isLoginPage) {
            return NextResponse.redirect(new URL('/maintenance', request.url));
        }
    } else {
        // If Maintenance is OFF and user is stuck on /maintenance, send home
        if (isMaintenancePage) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }
    // ------------------------------

    // --- Route Protection ---
    const path = request.nextUrl.pathname;

    // 1. Admin Routes Protection
    if (path.startsWith('/admin')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        if (user.user_metadata?.role !== 'admin') {
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
