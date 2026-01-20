-- Enable RLS on reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow users to select their own reviews
CREATE POLICY "Enable read access for users to their own reviews"
ON "public"."reviews"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to insert their own reviews
CREATE POLICY "Enable insert access for users to their own reviews"
ON "public"."reviews"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own reviews
CREATE POLICY "Enable update access for users to their own reviews"
ON "public"."reviews"
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Ensure Certificate Requests allow update by owner (if needed? usually only admin updates status)
-- But maybe user needs to read? (Already done). 
-- Let's double check Admin access for Reviews too.

-- Allow admins to read all reviews
CREATE POLICY "Enable read access for admins to all reviews"
ON "public"."reviews"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' OR
  auth.email() = 'lovejeet1225@gmail.com'
);
