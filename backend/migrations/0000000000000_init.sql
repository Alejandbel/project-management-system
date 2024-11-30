-- Up Migration
BEGIN;

CREATE TABLE IF NOT EXISTS "user_activity_type"
(
    "id"        SERIAL PRIMARY KEY,
    "title"     VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS "department"
(
    "id"        SERIAL PRIMARY KEY,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title"     VARCHAR(255) NOT NULL
    );

CREATE TABLE IF NOT EXISTS "issue_type"
(
    "id"        SERIAL PRIMARY KEY,
    "title"     VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS "issue_status"
(
    "id"        SERIAL PRIMARY KEY NOT NULL,
    "title"     VARCHAR(255)       NOT NULL,
    "createdAt" TIMESTAMP(0)       NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS "employee_role"
(
    "id"           SERIAL PRIMARY KEY,
    "title"        VARCHAR(255) NOT NULL,
    "createdAt"    TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE OR REPLACE FUNCTION "get_workforce_role_id"()
    RETURNS BIGINT
    LANGUAGE "sql" AS
$$
SELECT "id"
FROM "employee_role"
WHERE "title" = 'workforce';
$$;


CREATE TABLE IF NOT EXISTS "user"
(
    "id"           SERIAL PRIMARY KEY,
    "name"         VARCHAR(255) NOT NULL,
    "email"        VARCHAR(255) NOT NULL,
    "roleId"       BIGINT       NOT NULL DEFAULT get_workforce_role_id(),
    "startWorksAt" TIMESTAMP(0),
    "endWorksAt"   TIMESTAMP(0),
    "password"     VARCHAR(255) NOT NULL,
    "createdAt"    TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("roleId") REFERENCES "employee_role" ("id")
    );
CREATE INDEX IF NOT EXISTS "user_roleid_index" ON "user" ("roleId");

CREATE TABLE IF NOT EXISTS "project"
(
    "id"           SERIAL PRIMARY KEY,
    "key"          VARCHAR(16)  NOT NULL,
    "name"         VARCHAR(255) NOT NULL,
    "leadId"       BIGINT,
    "departmentId" BIGINT       NOT NULL,
    "createdAt"    TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("leadId") REFERENCES "user" ("id"),
    FOREIGN KEY ("departmentId") REFERENCES "department" ("id")
    );
CREATE UNIQUE INDEX IF NOT EXISTS "project_key_unique" ON "project" ("key");

CREATE TABLE IF NOT EXISTS "version"
(
    "id"          SERIAL PRIMARY KEY,
    "title"       VARCHAR(255) NOT NULL,
    "isArchived"  BOOLEAN      NOT NULL DEFAULT FALSE,
    "isReleased"  BOOLEAN      NOT NULL DEFAULT FALSE,
    "projectId"   BIGINT       NOT NULL,
    "startDate"   TIMESTAMP(0) NOT NULL,
    "releaseDate" TIMESTAMP(0),
    "createdAt"   TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("projectId") REFERENCES "project" ("id")
    );
CREATE INDEX IF NOT EXISTS "version_projectid_index" ON "version" ("projectId");

CREATE TABLE IF NOT EXISTS "user_activity_type"
(
    "id"        SERIAL PRIMARY KEY,
    "title"     BIGINT       NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS "user_activity"
(
    "id"             SERIAL PRIMARY KEY,
    "userId"         BIGINT       NOT NULL,
    "activityTypeId" BIGINT       NOT NULL,
    "createdAt"      TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "user" ("id"),
    FOREIGN KEY ("activityTypeId") REFERENCES "user_activity_type" ("id")
    );
CREATE INDEX IF NOT EXISTS "user_activity_userid_index" ON "user_activity" ("userId");

CREATE TABLE IF NOT EXISTS "issue"
(
    "id"             SERIAL PRIMARY KEY,
    "typeId"         BIGINT           NOT NULL,
    "key"            VARCHAR(16)      NOT NULL,
    "summary"        VARCHAR(1024),
    "versionId"      BIGINT           NOT NULL,
    "hoursEstimated" DOUBLE PRECISION NOT NULL CHECK ("hoursEstimated" > 0),
    "assigneeId"     BIGINT,
    "dueDate"        TIMESTAMP(0),
    "description"    VARCHAR(1024),
    "statusId"       BIGINT           NOT NULL,
    "createdAt"      TIMESTAMP(0)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("typeId") REFERENCES "issue_type" ("id"),
    FOREIGN KEY ("versionId") REFERENCES "version" ("id"),
    FOREIGN KEY ("assigneeId") REFERENCES "user" ("id"),
    FOREIGN KEY ("statusId") REFERENCES "issue_status" ("id")
    );
CREATE INDEX IF NOT EXISTS "issue_typeid_index" ON "issue" ("typeId");
CREATE INDEX IF NOT EXISTS "issue_versionid_index" ON "issue" ("versionId");
CREATE INDEX IF NOT EXISTS "issue_statusid_index" ON "issue" ("statusId");

CREATE TABLE IF NOT EXISTS "worklog"
(
    "id"        SERIAL PRIMARY KEY,
    "authorId"  BIGINT       NOT NULL,
    "timeSpent" BIGINT       NOT NULL CHECK ("timeSpent" > 0),
    "issueId"   BIGINT       NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("authorId") REFERENCES "user" ("id"),
    FOREIGN KEY ("issueId") REFERENCES "issue" ("id")
    );
CREATE INDEX IF NOT EXISTS "worklog_authorid_index" ON "worklog" ("authorId");
CREATE INDEX IF NOT EXISTS "worklog_issueid_index" ON "worklog" ("issueId");

CREATE TABLE IF NOT EXISTS "user_salary"
(
    "id"        SERIAL PRIMARY KEY,
    "userId"    BIGINT       NOT NULL,
    "salary"    BIGINT       NOT NULL DEFAULT 0,
    "period"    TIMESTAMP(0) NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "user" ("id")
    );
CREATE INDEX IF NOT EXISTS "worklog_userid_index" ON "user_salary" ("userId");

COMMIT;
-- Down Migration
BEGIN;

ALTER TABLE "worklog" DROP CONSTRAINT IF EXISTS "worklog_authorid_index";
ALTER TABLE "worklog" DROP CONSTRAINT IF EXISTS "worklog_issueid_index";
ALTER TABLE "issue" DROP CONSTRAINT IF EXISTS "issue_typeid_index";
ALTER TABLE "issue" DROP CONSTRAINT IF EXISTS "issue_versionid_index";
ALTER TABLE "issue" DROP CONSTRAINT IF EXISTS "issue_statusid_index";
ALTER TABLE "user_activity" DROP CONSTRAINT IF EXISTS "user_activity_userid_index";
ALTER TABLE "user_activity" DROP CONSTRAINT IF EXISTS "user_activity_typeid_index";
ALTER TABLE "version" DROP CONSTRAINT IF EXISTS "version_projectid_index";
ALTER TABLE "employee_role" DROP CONSTRAINT IF EXISTS "employee_role_departmentid_index";
ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "user_roleid_index";

DROP INDEX IF EXISTS "worklog_authorid_index";
DROP INDEX IF EXISTS "worklog_issueid_index";
DROP INDEX IF EXISTS "issue_typeid_index";
DROP INDEX IF EXISTS "issue_versionid_index";
DROP INDEX IF EXISTS "issue_statusid_index";
DROP INDEX IF EXISTS "user_activity_userid_index";
DROP INDEX IF EXISTS "user_activity_typeid_index";
DROP INDEX IF EXISTS "version_projectid_index";
DROP INDEX IF EXISTS "user_roleid_index";

DROP TABLE IF EXISTS "user_salary";
DROP TABLE IF EXISTS "worklog";
DROP TABLE IF EXISTS "issue";
DROP TABLE IF EXISTS "user_activity";
DROP TABLE IF EXISTS "version";
DROP TABLE IF EXISTS "project";
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS "employee_role";
DROP TABLE IF EXISTS "issue_status";
DROP TABLE IF EXISTS "issue_type";
DROP TABLE IF EXISTS "department";
DROP TABLE IF EXISTS "user_activity_type";

DROP FUNCTION IF EXISTS "get_workforce_role_id";

COMMIT;
