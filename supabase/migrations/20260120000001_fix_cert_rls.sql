-- Create a policy to allow admins to update certificate requests
-- First, ensure the function to check for admin exists (or we can just check email/metadata)

-- Policy for updating certificate requests
create policy "Enable update for users with admin role"
on certificate_requests
for update
using (
  auth.jwt() ->> 'email' = 'lovejeet1225@gmail.com' -- Hardcoded super admin for safety/ease
  OR
  (select role from profiles where id = auth.uid()) = 'admin'
)
with check (
  auth.jwt() ->> 'email' = 'lovejeet1225@gmail.com'
  OR
  (select role from profiles where id = auth.uid()) = 'admin'
);

-- Also ensure they can read all of them (probably already exists, but good to be safe)
create policy "Enable read access for admins"
on certificate_requests
for select
using (
  auth.jwt() ->> 'email' = 'lovejeet1225@gmail.com'
  OR
  (select role from profiles where id = auth.uid()) = 'admin'
);
