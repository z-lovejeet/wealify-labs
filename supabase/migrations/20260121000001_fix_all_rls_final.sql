
-- -------------------------------------------------------------------------
-- FINAL RLS FIX FOR CERTIFICATES AND REVIEWS
-- -------------------------------------------------------------------------

-- 1. CERTIFICATE REQUESTS
ALTER TABLE certificate_requests ENABLE ROW LEVEL SECURITY;

-- Allow users to SEE their own certificate requests (This was missing!)
DROP POLICY IF EXISTS "User view own cert requests" ON certificate_requests;
CREATE POLICY "User view own cert requests"
ON certificate_requests
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to CREATE requests
DROP POLICY IF EXISTS "User create own cert requests" ON certificate_requests;
CREATE POLICY "User create own cert requests"
ON certificate_requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- (Admin policies should already exist from previous steps, so we leave them)

-- 2. REVIEWS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow users to SEE their own reviews (Re-applying to be safe)
DROP POLICY IF EXISTS "User view own reviews" ON reviews;
CREATE POLICY "User view own reviews"
ON reviews
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to CREATE reviews
DROP POLICY IF EXISTS "User create own reviews" ON reviews;
CREATE POLICY "User create own reviews"
ON reviews
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to UPDATE reviews (e.g. if we add edit functionality)
DROP POLICY IF EXISTS "User update own reviews" ON reviews;
CREATE POLICY "User update own reviews"
ON reviews
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow Admins to View All (Re-applying)
DROP POLICY IF EXISTS "Admin view all reviews" ON reviews;
CREATE POLICY "Admin view all reviews"
ON reviews
FOR SELECT
TO authenticated
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' OR
  auth.email() = 'lovejeet1225@gmail.com'
);
