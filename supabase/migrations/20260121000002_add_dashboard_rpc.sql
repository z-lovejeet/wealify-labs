-- Function to fetch dashboard data securely, bypassing table RLS for specific user data
CREATE OR REPLACE FUNCTION get_user_dashboard_data(target_course_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
  current_user_id UUID;
BEGIN
  -- Get the current user ID
  current_user_id := auth.uid();
  
  -- If no user, return null
  IF current_user_id IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT json_build_object(
    'cert_requests', COALESCE((
      SELECT json_agg(cr ORDER BY cr.created_at DESC)
      FROM certificate_requests cr
      WHERE cr.user_id = current_user_id AND cr.course_id = target_course_id
    ), '[]'::json),
    'review', (
      SELECT row_to_json(r)
      FROM reviews r
      WHERE r.user_id = current_user_id AND r.course_id = target_course_id
      LIMIT 1
    )
  ) INTO result;
  
  RETURN result;
END;
$$;
