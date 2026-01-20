-- Add indexes to foreign keys to speed up filtering
CREATE INDEX IF NOT EXISTS idx_enrollments_user_course ON enrollments(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_completions_user_course ON lesson_completions(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_certificate_requests_user_course ON certificate_requests(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_course ON reviews(user_id, course_id);

-- Speed up module/lesson lookups
CREATE INDEX IF NOT EXISTS idx_modules_course_id ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON lessons(module_id);
