-- Up Migration
INSERT INTO "employee_role" ("title")
VALUES ('workforce'),
       ('admin'),
       ('project_manager');

-- Down Migration
DELETE FROM "employee_role"
WHERE "title" IN ('workforce', 'admin', 'project_manager')
