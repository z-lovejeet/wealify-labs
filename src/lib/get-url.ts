export const getURL = () => {
    let url =
        process.env.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
        process.env.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
        'http://localhost:3000/';

    // Include `https://` when not localhost.
    url = url.includes('http') ? url : `https://${url}`;

    // Include a trailing `/`.
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;

    // If running on client side, prefer window.location.origin
    if (typeof window !== 'undefined' && window.location.origin) {
        // url = window.location.origin;
        // Ensure we don't return null/undefined, and append slash if needed
        return window.location.origin.endsWith('/') ? window.location.origin : `${window.location.origin}/`;
    }

    return url;
};
