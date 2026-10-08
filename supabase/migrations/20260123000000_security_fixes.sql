-- =========================================================================
-- MIGRATION: 20260123000000_security_fixes.sql
-- Description: Platform Security Hardening, RLS Restructuring, and Table Fixes
-- =========================================================================

-- 1. DROP DANGEROUS HISTORICAL RPC FUNCTIONS (PREVENTS REMOTE SQL EXECUTION)
DROP FUNCTION IF EXISTS public.exec_sql(text);
DROP FUNCTION IF EXISTS public.exec_script(text);

-- 2. HARDEN PLATFORM SETTINGS RLS (PREVENT UNAUTHORIZED SETTINGS TAMPERING)
ALTER TABLE IF EXISTS public.platform_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated update" ON public.platform_settings;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.platform_settings;
DROP POLICY IF EXISTS "Allow public read access" ON public.platform_settings;
DROP POLICY IF EXISTS "Admins can update platform settings" ON public.platform_settings;
DROP POLICY IF EXISTS "Admins can insert platform settings" ON public.platform_settings;

-- Allow anyone to read platform settings (needed for site name, maintenance mode, etc.)
CREATE POLICY "Allow public read access"
ON public.platform_settings
FOR SELECT
TO public
USING (true);

-- Restrict INSERT and UPDATE to verified Admins only
CREATE POLICY "Admins can insert platform settings"
ON public.platform_settings
FOR INSERT
TO authenticated
WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admins can update platform settings"
ON public.platform_settings
FOR UPDATE
TO authenticated
USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 3. REMOVE HARDCODED ADMIN EMAILS & SECURE REVIEWS RLS
ALTER TABLE IF EXISTS public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin view all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Enable read access for admins to all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admin manage all reviews" ON public.reviews;

CREATE POLICY "Admin view all reviews"
ON public.reviews
FOR SELECT
TO authenticated
USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admin manage all reviews"
ON public.reviews
FOR ALL
TO authenticated
USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 4. REMOVE HARDCODED ADMIN EMAILS ON CERTIFICATE REQUESTS
ALTER TABLE IF EXISTS public.certificate_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for admins" ON public.certificate_requests;
DROP POLICY IF EXISTS "Enable update for users with admin role" ON public.certificate_requests;
DROP POLICY IF EXISTS "Admin manage certificate requests" ON public.certificate_requests;

CREATE POLICY "Admin manage certificate requests"
ON public.certificate_requests
FOR ALL
TO authenticated
USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 5. REMOVE HARDCODED ADMIN EMAILS ON CONTACT MESSAGES
ALTER TABLE IF EXISTS public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can delete messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin manage contact messages" ON public.contact_messages;

CREATE POLICY "Admin manage contact messages"
ON public.contact_messages
FOR ALL
TO authenticated
USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 6. ADD UNIQUE CONSTRAINT ON PAYMENTS EXTERNAL_ID FOR IDEMPOTENCY
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'payments_external_id_key'
    ) THEN
        -- Only add constraint if external_id column exists
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'payments' AND column_name = 'external_id'
        ) THEN
            ALTER TABLE public.payments ADD CONSTRAINT payments_external_id_key UNIQUE (external_id);
        END IF;
    END IF;
END $$;

-- 7. CREATE REAL NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers
FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view newsletter subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can view newsletter subscribers"
ON public.newsletter_subscribers
FOR SELECT
TO authenticated
USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
