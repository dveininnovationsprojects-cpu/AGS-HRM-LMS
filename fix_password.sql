UPDATE users SET password_hash='$2a$12$gzXWc5fjDKCDVu.y5T.xputVOMqMxaCudHasoxywiRTkdIZGZq6pm' WHERE email='admin@agshealth.com';
UPDATE users SET password_hash='$2a$12$gzXWc5fjDKCDVu.y5T.xputVOMqMxaCudHasoxywiRTkdIZGZq6pm' WHERE email='hr@agshealth.com';
UPDATE users SET password_hash='$2a$12$gzXWc5fjDKCDVu.y5T.xputVOMqMxaCudHasoxywiRTkdIZGZq6pm' WHERE email='employee@agshealth.com';
SELECT id, email, is_active, org_id FROM users;
