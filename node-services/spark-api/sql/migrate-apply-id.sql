SET search_path = 'sandbox-school';

BEGIN;

DROP TABLE IF EXISTS applies___upgrade;

CREATE TABLE applies___upgrade
(
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    resource_id INTEGER NOT NULL,
    sparkpoint_id CHAR(8) NOT NULL,
    reflection TEXT,
    submissions JSONB DEFAULT '[]'::jsonb NOT NULL,
    selected BOOLEAN DEFAULT false NOT NULL,
    grade SMALLINT,
    graded_by INTEGER
);

INSERT INTO applies___upgrade SELECT id,
         student_id,
         fb_apply_id AS resource_id,
         sparkpoint_id,
         reflection,
         submissions,
         selected,
         grade,
         graded_by
    FROM applies;

DROP TABLE applies CASCADE;
ALTER TABLE applies___upgrade RENAME TO applies;

CREATE UNIQUE INDEX applies_student_id_resource_id_sparkpoint_id_key ON applies (student_id, resource_id, sparkpoint_id);
CREATE INDEX applies_student_id_idx ON applies (student_id);
CREATE INDEX applies_resource_id_idx ON applies (resource_id);
CREATE INDEX applies_sparkpoint_id_idx ON applies (sparkpoint_id);

ALTER TABLE student_sparkpoint RENAME COLUMN selected_fb_apply_id TO selected_apply_resource_id;

COMMIT;

