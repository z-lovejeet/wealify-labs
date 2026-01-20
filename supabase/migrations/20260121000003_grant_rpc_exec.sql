-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_dashboard_data(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_dashboard_data(UUID) TO service_role;
