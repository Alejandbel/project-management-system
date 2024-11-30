-- Up Migration
INSERT INTO "user_activity_type"("title")
VALUES ('Worklog updated'),
       ('Worklog created'),
       ('Worklog deleted')
-- Down Migration
