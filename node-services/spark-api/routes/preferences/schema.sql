SET SEARCH_PATH = 'sandbox-school';

DROP TABLE IF EXISTS learns_required CASCADE;
DROP TABLE IF EXISTS learns_required_section CASCADE;
DROP TABLE IF EXISTS learns_required_student CASCADE;
DROP TRIGGER IF EXISTS learns_required_insert_trigger ON learns_required;

/*
 _                                                  _              _
| | ___  __ _ _ __ _ __  ___   _ __ ___  __ _ _   _(_)_ __ ___  __| |
| |/ _ \/ _` | '__| '_ \/ __| | '__/ _ \/ _` | | | | | '__/ _ \/ _` |
| |  __/ (_| | |  | | | \__ \ | | |  __/ (_| | |_| | | | |  __/ (_| |
|_|\___|\__,_|_|  |_| |_|___/ |_|  \___|\__, |\__,_|_|_|  \___|\__,_|
                                           |_|
 */

-- Teachers can set a required number of learns" to either a class section or individual students
CREATE TABLE IF NOT EXISTS "sandbox-school".learns_required (
  section_id integer NOT NULL,
  sparkpoint_id char(8) NOT NULL,
  student_id integer DEFAULT NULL,
  teacher_id integer NOT NULL,
  required smallint NOT NULL,
  requirement_date timestamp NOT NULL DEFAULT current_timestamp
);

-- This partition contains learn requirements for individual students
CREATE TABLE IF NOT EXISTS "sandbox-school".learns_required_student (
  CHECK (student_id IS NOT NULL),
  PRIMARY KEY (section_id, sparkpoint_id, student_id)
) INHERITS ("sandbox-school".learns_required);

-- This partition contains learn requirements for class sections
CREATE TABLE IF NOT EXISTS "sandbox-school".learns_required_section (
  CHECK (student_id IS NULL),
  PRIMARY KEY (section_id, sparkpoint_id)
) INHERITS ("sandbox-school".learns_required);

CREATE OR REPLACE FUNCTION "sandbox-school".learns_required_insert_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.student_id IS NULL) THEN
        INSERT INTO "sandbox-school".learns_required_section VALUES (NEW.*) ON CONFLICT (section_id, sparkpoint_id)
        DO UPDATE SET requirement_date = current_timestamp, required = NEW.required, teacher_id = NEW.teacher_id;
    ELSE
      INSERT INTO "sandbox-school".learns_required_student VALUES (NEW.*) ON CONFLICT (section_id, sparkpoint_id, student_id)
      DO UPDATE SET requirement_date = current_timestamp, required = NEW.required, teacher_id = NEW.teacher_id;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER learns_required_insert_trigger
    BEFORE INSERT ON "sandbox-school".learns_required
    FOR EACH ROW EXECUTE PROCEDURE "sandbox-school".learns_required_insert_trigger();