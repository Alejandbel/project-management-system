-- Up Migration
BEGIN;

INSERT INTO "issue_type"("title")
VALUES ('bug'),
       ('task'),
       ('improvement');

INSERT INTO "issue_status"("title")
VALUES ('backlog'),
       ('todo'),
       ('in progress'),
       ('in testing'),
       ('done');

COMMIT;
-- Down Migration
BEGIN;

DELETE FROM "issue_type"
WHERE "title" IN ('bug', 'task', 'improvement');

DELETE FROM "issue_status"
WHERE "title" IN ('backlog', 'todo', 'in progress', 'in testing', 'done');

COMMIT;
