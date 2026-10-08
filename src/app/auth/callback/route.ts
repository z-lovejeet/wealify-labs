import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Sanitizes the 'next' parameter to prevent Open Redirect attacks.
 * Only allows relative internal paths on the same origin (e.g. '/dashboard').
 */
function sanitizeRedirectPath(nextParam: string | null): string {
    if (!nextParam) return '/dashboard';

    // Disallow external URLs, protocol-relative URLs (//attacker.com), backslashes, and schemes
    if (
        !nextParam.startsWith('/') ||
        nextParam.startsWith('//') ||
        nextParam.includes('://') ||
        nextParam.includes('\\')
    ) {
        return '/dashboard';
    }

    return nextParam;
}

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const safeNext = sanitizeRedirectPath(requestUrl.searchParams.get('next'));

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            const redirectUrl = new URL(safeNext, requestUrl.origin);
            return NextResponse.redirect(redirectUrl);
        } else {
            const errorUrl = new URL('/auth/auth-code-error', requestUrl.origin);
            errorUrl.searchParams.set('error', error.message);
            return NextResponse.redirect(errorUrl);
        }
    }

    // Check if there are existing errors in the params (e.g. from Supabase OAuth provider directly)
    const errorParam = requestUrl.searchParams.get('error');
    const errorDesc = requestUrl.searchParams.get('error_description');
    if (errorParam) {
        const errorUrl = new URL('/auth/auth-code-error', requestUrl.origin);
        errorUrl.searchParams.set('error', errorParam);
        if (errorDesc) {
            errorUrl.searchParams.set('error_description', errorDesc);
        }
        return NextResponse.redirect(errorUrl);
    }

    // No code and no error provided
    const fallbackUrl = new URL('/auth/auth-code-error', requestUrl.origin);
    fallbackUrl.searchParams.set('error', 'No code provided');
    return NextResponse.redirect(fallbackUrl);
}
