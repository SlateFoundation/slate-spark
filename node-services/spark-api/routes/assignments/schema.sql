-- !!! CHANGE THIS TO THE CORRECT SCHOOL/SCHEMA !!!
SET search_path = 'merit-staging';

BEGIN;

-- Clean up all tables for a fresh start
DROP TABLE IF EXISTS learn_assignments CASCADE;
DROP TABLE IF EXISTS learn_assignments_section CASCADE;
DROP TABLE IF EXISTS learn_assignments_student CASCADE;
DROP TRIGGER IF EXISTS delete_redundant_student_learn_assignments_trigger ON learn_assignments;
DROP TRIGGER IF EXISTS ignore_redundant_student_learn_assignments_trigger ON learn_assignments;
DROP TRIGGER IF EXISTS prune_redundant_student_learn_assignments_trigger ON learn_assignments;
DROP FUNCTION IF EXISTS delete_redundant_student_learn_assignments();
DROP FUNCTION IF EXISTS ignore_redundant_student_learn_assignments();
DROP FUNCTION IF EXISTS prune_stale_student_learn_assignments();
DROP TABLE IF EXISTS learn_assignments_logging;

DROP TABLE IF EXISTS learns_required CASCADE;
DROP TABLE IF EXISTS learns_required_section CASCADE;
DROP TABLE IF EXISTS learns_required_student CASCADE;
DROP TRIGGER IF EXISTS delete_redundant_student_learns_required_trigger ON learns_required;
DROP TRIGGER IF EXISTS ignore_redundant_student_learns_required_trigger ON learns_required;
DROP TRIGGER IF EXISTS prune_redundant_student_learns_required_trigger ON learns_required;
DROP FUNCTION IF EXISTS delete_redundant_student_learns_required();
DROP FUNCTION IF EXISTS ignore_redundant_student_learns_required();
DROP FUNCTION IF EXISTS prune_stale_student_learns_required();
DROP TABLE IF EXISTS learns_required_logging;

DROP TABLE IF EXISTS apply_assignments CASCADE;
DROP TABLE IF EXISTS apply_assignments_section CASCADE;
DROP TABLE IF EXISTS apply_assignments_student CASCADE;
DROP TRIGGER IF EXISTS delete_redundant_student_apply_assignments_trigger ON apply_assignments;
DROP TRIGGER IF EXISTS ignore_redundant_student_apply_assignments_trigger ON apply_assignments;
DROP TRIGGER IF EXISTS prune_redundant_student_apply_assignments_trigger ON apply_assignments;
DROP FUNCTION IF EXISTS delete_redundant_student_apply_assignments();
DROP FUNCTION IF EXISTS ignore_redundant_student_apply_assignments();
DROP FUNCTION IF EXISTS prune_stale_student_apply_assignments();
DROP TABLE IF EXISTS apply_assignments_logging;

DROP TABLE IF EXISTS assessment_assignments CASCADE;
DROP TABLE IF EXISTS assessment_assignments_section CASCADE;
DROP TABLE IF EXISTS assessment_assignments_student CASCADE;
DROP TRIGGER IF EXISTS delete_redundant_student_assessment_assignments_trigger ON assessment_assignments;
DROP TRIGGER IF EXISTS ignore_redundant_student_assessment_assignments_trigger ON assessment_assignments;
DROP TRIGGER IF EXISTS prune_redundant_student_assessment_assignments_trigger ON assessment_assignments;
DROP FUNCTION IF EXISTS delete_redundant_student_assessment_assignments();
DROP FUNCTION IF EXISTS ignore_redundant_student_assessment_assignments();
DROP FUNCTION IF EXISTS prune_stale_student_assessment_assignments();
DROP TABLE IF EXISTS assessment_assignments_logging;

DROP TABLE IF EXISTS guiding_question_assignments CASCADE;
DROP TABLE IF EXISTS guiding_question_assignments_section CASCADE;
DROP TABLE IF EXISTS guiding_question_assignments_student CASCADE;
DROP TRIGGER IF EXISTS delete_redundant_student_guiding_question_assignments_trigger ON guiding_question_assignments;
DROP TRIGGER IF EXISTS ignore_redundant_student_guiding_question_assignments_trigger ON guiding_question_assignments;
DROP TRIGGER IF EXISTS prune_redundant_student_guiding_question_assignments_trigger ON guiding_question_assignments;
DROP FUNCTION IF EXISTS delete_redundant_student_guiding_question_assignments();
DROP FUNCTION IF EXISTS ignore_redundant_student_guiding_question_assignments();
DROP FUNCTION IF EXISTS prune_stale_student_guiding_question_assignments();
DROP TABLE IF EXISTS guiding_question_assignments_logging;

DROP TABLE IF EXISTS conference_resource_assignments CASCADE;
DROP TABLE IF EXISTS conference_resource_assignments_section CASCADE;
DROP TABLE IF EXISTS conference_resource_assignments_student CASCADE;
DROP TRIGGER IF EXISTS delete_redundant_student_conference_resource_assignments_trigger ON conference_resource_assignments;
DROP TRIGGER IF EXISTS ignore_redundant_student_conference_resource_assignments_trigger ON conference_resource_assignments;
DROP TRIGGER IF EXISTS prune_redundant_student_conference_resource_assignments_trigger ON conference_resource_assignments;
DROP FUNCTION IF EXISTS delete_redundant_student_conference_resource_assignments();
DROP FUNCTION IF EXISTS ignore_redundant_student_conference_resource_assignments();
DROP FUNCTION IF EXISTS prune_stale_student_conference_resource_assignments();
DROP TABLE IF EXISTS conference_resource_assignments_logging;

DROP TYPE IF EXISTS "merit-staging".assignment_type;
DROP TYPE IF EXISTS "merit-staging".learn_assignment_type;
DROP TYPE IF EXISTS "merit-staging".apply_assignment_type;
DROP TYPE IF EXISTS "merit-staging".assessment_assignment_type;
DROP TYPE IF EXISTS "merit-staging".conference_resource_assignment_type;
DROP TYPE IF EXISTS "merit-staging".guiding_question_assignment_type;

-- Create resource_assignment type if it does not
DO $$
BEGIN
  IF NOT EXISTS (SELECT  1
                   FROM pg_catalog.pg_namespace n
                   JOIN pg_type t
                     ON t.typnamespace = n.oid
                  WHERE n.nspname = 'merit-staging'
                    AND t.typname = 'resource_assignment'
                ) THEN
      CREATE TYPE "merit-staging".resource_assignment AS ENUM (
        'required-first',
        'required',
        'recommended',
        'exempt',
        'hidden'
      );
  END IF;
END;
$$ LANGUAGE plpgsql;

/*
   __
  / /  ___  __ _ _ __ _ __  ___
 / /  / _ \/ _` | '__| '_ \/ __|
/ /__|  __/ (_| | |  | | | \__ \
\____/\___|\__,_|_|  |_| |_|___/

 */
--  Create assignment_type if it does not exist


-- Teachers can assign "learns" to either a class section or individual students
CREATE TABLE IF NOT EXISTS learn_assignments (
  section_id integer NOT NULL,
  sparkpoint_id char(8) NOT NULL,
  student_id integer DEFAULT NULL,
  teacher_id integer NOT NULL,
  resource_id integer NOT NULL,
  assignment resource_assignment NOT NULL,
  assignment_date timestamp NOT NULL DEFAULT current_timestamp
);

-- This partition contains learn assignments for individual students
CREATE TABLE IF NOT EXISTS learn_assignments_student (
  CHECK (student_id IS NOT NULL),
  PRIMARY KEY (section_id, sparkpoint_id, student_id, resource_id)
) INHERITS (learn_assignments);

-- This partition contains learn assignments for class sections
CREATE TABLE IF NOT EXISTS learn_assignments_section (
  CHECK (student_id IS NULL),
  PRIMARY KEY (section_id, sparkpoint_id, resource_id)
) INHERITS (learn_assignments);

CREATE OR REPLACE FUNCTION learn_assignments_insert_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.student_id IS NULL) THEN
        INSERT INTO learn_assignments_section VALUES (NEW.*) ON CONFLICT (section_id, sparkpoint_id, resource_id)
        DO UPDATE SET assignment_date = current_timestamp, assignment = NEW.assignment, teacher_id = NEW.teacher_id;
    ELSE
      INSERT INTO learn_assignments_student VALUES (NEW.*) ON CONFLICT (section_id, sparkpoint_id, student_id, resource_id)
      DO UPDATE SET assignment_date = current_timestamp,  assignment = NEW.assignment, teacher_id = NEW.teacher_id;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER learn_assignments_insert_trigger
    BEFORE INSERT ON learn_assignments
    FOR EACH ROW EXECUTE PROCEDURE learn_assignments_insert_trigger();

/*
 _                                                  _              _
| | ___  __ _ _ __ _ __  ___   _ __ ___  __ _ _   _(_)_ __ ___  __| |
| |/ _ \/ _` | '__| '_ \/ __| | '__/ _ \/ _` | | | | | '__/ _ \/ _` |
| |  __/ (_| | |  | | | \__ \ | | |  __/ (_| | |_| | | | |  __/ (_| |
|_|\___|\__,_|_|  |_| |_|___/ |_|  \___|\__, |\__,_|_|_|  \___|\__,_|
                                           |_|
 */

-- Teachers can set a required number of learns" to either a class section or individual students
CREATE TABLE IF NOT EXISTS "merit-staging".learns_required (
  section_id integer NOT NULL,
  sparkpoint_id char(8) NOT NULL,
  student_id integer DEFAULT NULL,
  teacher_id integer NOT NULL,
  required smallint NOT NULL,
  requirement_date timestamp NOT NULL DEFAULT current_timestamp
);

-- This partition contains learn requirements for individual students
CREATE TABLE IF NOT EXISTS "merit-staging".learns_required_student (
  CHECK (student_id IS NOT NULL),
  PRIMARY KEY (section_id, sparkpoint_id, student_id)
) INHERITS ("merit-staging".learns_required);

-- This partition contains learn requirements for class sections
CREATE TABLE IF NOT EXISTS "merit-staging".learns_required_section (
  CHECK (student_id IS NULL),
  PRIMARY KEY (section_id, sparkpoint_id)
) INHERITS ("merit-staging".learns_required);

CREATE OR REPLACE FUNCTION "merit-staging".learns_required_insert_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.student_id IS NULL) THEN
        INSERT INTO "merit-staging".learns_required_section VALUES (NEW.*) ON CONFLICT (section_id, sparkpoint_id)
        DO UPDATE SET requirement_date = current_timestamp, required = NEW.required, teacher_id = NEW.teacher_id;
    ELSE
      INSERT INTO "merit-staging".learns_required_student VALUES (NEW.*) ON CONFLICT (section_id, sparkpoint_id, student_id)
      DO UPDATE SET requirement_date = current_timestamp, required = NEW.required, teacher_id = NEW.teacher_id;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER learns_required_insert_trigger
    BEFORE INSERT ON "merit-staging".learns_required
    FOR EACH ROW EXECUTE PROCEDURE "merit-staging".learns_required_insert_trigger();SET search_path = 'merit-staging';

/*                   _
  __ _ _ __  _ __ | (_) ___  ___
 / _` | '_ \| '_ \| | |/ _ \/ __|
| (_| | |_) | |_) | | |  __/\__ \
 \__,_| .__/| .__/|_|_|\___||___/
      |_|   |_|
*/

-- Teachers can assign "applies" to either a class section or individual students
CREATE TABLE IF NOT EXISTS apply_assignments (
  section_id integer NOT NULL,
  sparkpoint_id char(8) NOT NULL,
  student_id integer DEFAULT NULL,
  teacher_id integer NOT NULL,
  resource_id integer NOT NULL,
  assignment resource_assignment NOT NULL,
  assignment_date timestamp NOT NULL DEFAULT current_timestamp
);

-- This partition contains apply assignments for individual students
CREATE TABLE IF NOT EXISTS apply_assignments_student (
  CHECK (student_id IS NOT NULL),
  PRIMARY KEY (section_id, sparkpoint_id, student_id, resource_id)
) INHERITS (apply_assignments);

-- This partition contains apply assignments for class sections
CREATE TABLE IF NOT EXISTS apply_assignments_section (
  CHECK (student_id IS NULL),
  PRIMARY KEY (section_id, sparkpoint_id, resource_id)
) INHERITS (apply_assignments);

CREATE OR REPLACE FUNCTION apply_assignments_insert_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.student_id IS NULL) THEN
        INSERT INTO apply_assignments_section VALUES (NEW.*) ON CONFLICT (section_id, sparkpoint_id, resource_id)
        DO UPDATE SET assignment_date = current_timestamp, assignment = NEW.assignment, teacher_id = NEW.teacher_id;
    ELSE
      INSERT INTO apply_assignments_student VALUES (NEW.*) ON CONFLICT (section_id, sparkpoint_id, student_id, resource_id)
      DO UPDATE SET assignment_date = current_timestamp,  assignment = NEW.assignment, teacher_id = NEW.teacher_id;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER apply_assignments_insert_trigger
    BEFORE INSERT ON apply_assignments
    FOR EACH ROW EXECUTE PROCEDURE apply_assignments_insert_trigger();

/*
                                                          _
  __ _  ___  ___   ___  ___  ___  _ __ ___    ___  _ __  | |_  ___
 / _` |/ __|/ __| / _ \/ __|/ __|| '_ ` _ \  / _ \| '_ \ | __|/ __|
| (_| |\__ \\__ \|  __/\__ \\__ \| | | | | ||  __/| | | || |_ \__ \
 \__,_||___/|___/ \___||___/|___/|_| |_| |_| \___||_| |_| \__||___/

*/

-- Teachers can assign "assessments" to either a class section or individual students
CREATE TABLE IF NOT EXISTS assessment_assignments (
  section_id integer NOT NULL,
  sparkpoint_id char(8) NOT NULL,
  student_id integer DEFAULT NULL,
  teacher_id integer NOT NULL,
  resource_id integer NOT NULL,
  assignment resource_assignment NOT NULL,
  assignment_date timestamp NOT NULL DEFAULT current_timestamp
);

-- This partition contains assessment assignments for individual students
CREATE TABLE IF NOT EXISTS assessment_assignments_student (
  CHECK (student_id IS NOT NULL),
  PRIMARY KEY (section_id, sparkpoint_id, student_id, resource_id)
) INHERITS (assessment_assignments);

-- This partition contains assessment assignments for class sections
CREATE TABLE IF NOT EXISTS assessment_assignments_section (
  CHECK (student_id IS NULL),
  PRIMARY KEY (section_id, sparkpoint_id, resource_id)
) INHERITS (assessment_assignments);

CREATE OR REPLACE FUNCTION assessment_assignments_insert_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.student_id IS NULL) THEN
        INSERT INTO assessment_assignments_section VALUES (NEW.*) ON CONFLICT (section_id, sparkpoint_id, resource_id)
        DO UPDATE SET assignment_date = current_timestamp, assignment = NEW.assignment, teacher_id = NEW.teacher_id;
    ELSE
      INSERT INTO assessment_assignments_student VALUES (NEW.*) ON CONFLICT (section_id, sparkpoint_id, student_id, resource_id)
      DO UPDATE SET assignment_date = current_timestamp,  assignment = NEW.assignment, teacher_id = NEW.teacher_id;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER assessment_assignments_insert_trigger
    BEFORE INSERT ON assessment_assignments
    FOR EACH ROW EXECUTE PROCEDURE assessment_assignments_insert_trigger();

/*
                      __
  ___   ___   _ __   / _|  ___  _ __   ___  _ __    ___   ___         _ __   ___  ___   ___   _   _  _ __   ___   ___  ___
 / __| / _ \ | '_ \ | |_  / _ \| '__| / _ \| '_ \  / __| / _ \       | '__| / _ \/ __| / _ \ | | | || '__| / __| / _ \/ __|
| (__ | (_) || | | ||  _||  __/| |   |  __/| | | || (__ |  __/       | |   |  __/\__ \| (_) || |_| || |   | (__ |  __/\__ \
 \___| \___/ |_| |_||_|   \___||_|    \___||_| |_| \___| \___| _____ |_|    \___||___/ \___/  \__,_||_|    \___| \___||___/
                                                              |_____|
 */

-- Teachers can assign "conference_resources" to either a class section or individual students
CREATE TABLE IF NOT EXISTS conference_resource_assignments (
  section_id integer NOT NULL,
  sparkpoint_id char(8) NOT NULL,
  student_id integer DEFAULT NULL,
  teacher_id integer NOT NULL,
  resource_id integer NOT NULL,
  assignment resource_assignment NOT NULL,
  assignment_date timestamp NOT NULL DEFAULT current_timestamp
);

-- This partition contains conference_resource assignments for individual students
CREATE TABLE IF NOT EXISTS conference_resource_assignments_student (
  CHECK (student_id IS NOT NULL),
  PRIMARY KEY (section_id, sparkpoint_id, student_id, resource_id)
) INHERITS (conference_resource_assignments);

-- This partition contains conference_resource assignments for class sections
CREATE TABLE IF NOT EXISTS conference_resource_assignments_section (
  CHECK (student_id IS NULL),
  PRIMARY KEY (section_id, sparkpoint_id, resource_id)
) INHERITS (conference_resource_assignments);

CREATE OR REPLACE FUNCTION conference_resource_assignments_insert_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.student_id IS NULL) THEN
        INSERT INTO conference_resource_assignments_section VALUES (NEW.*) ON CONFLICT (section_id, sparkpoint_id, resource_id)
        DO UPDATE SET assignment_date = current_timestamp, assignment = NEW.assignment, teacher_id = NEW.teacher_id;
    ELSE
      INSERT INTO conference_resource_assignments_student VALUES (NEW.*) ON CONFLICT (section_id, sparkpoint_id, student_id, resource_id)
      DO UPDATE SET assignment_date = current_timestamp,  assignment = NEW.assignment, teacher_id = NEW.teacher_id;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER conference_resource_assignments_insert_trigger
    BEFORE INSERT ON conference_resource_assignments
    FOR EACH ROW EXECUTE PROCEDURE conference_resource_assignments_insert_trigger();

/*             _      _  _                                                _    _
  __ _  _   _ (_)  __| |(_) _ __    __ _          __ _  _   _   ___  ___ | |_ (_)  ___   _ __   ___
 / _` || | | || | / _` || || '_ \  / _` |        / _` || | | | / _ \/ __|| __|| | / _ \ | '_ \ / __|
| (_| || |_| || || (_| || || | | || (_| |       | (_| || |_| ||  __/\__ \| |_ | || (_) || | | |\__ \
 \__, | \__,_||_| \__,_||_||_| |_| \__, | _____  \__, | \__,_| \___||___/ \__||_| \___/ |_| |_||___/
 |___/                             |___/ |_____|    |_|
*/

-- Teachers can assign "guiding_questions" to either a class section or individual students
CREATE TABLE IF NOT EXISTS guiding_question_assignments (
  section_id integer NOT NULL,
  sparkpoint_id char(8) NOT NULL,
  student_id integer DEFAULT NULL,
  teacher_id integer NOT NULL,
  resource_id integer NOT NULL,
  assignment resource_assignment NOT NULL,
  assignment_date timestamp NOT NULL DEFAULT current_timestamp
);

-- This partition contains guiding_question assignments for individual students
CREATE TABLE IF NOT EXISTS guiding_question_assignments_student (
  CHECK (student_id IS NOT NULL),
  PRIMARY KEY (section_id, sparkpoint_id, student_id, resource_id)
) INHERITS (guiding_question_assignments);

-- This partition contains guiding_question assignments for class sections
CREATE TABLE IF NOT EXISTS guiding_question_assignments_section (
  CHECK (student_id IS NULL),
  PRIMARY KEY (section_id, sparkpoint_id, resource_id)
) INHERITS (guiding_question_assignments);

CREATE OR REPLACE FUNCTION guiding_question_assignments_insert_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.student_id IS NULL) THEN
        INSERT INTO guiding_question_assignments_section VALUES (NEW.*) ON CONFLICT (section_id, sparkpoint_id, resource_id)
        DO UPDATE SET assignment_date = current_timestamp, assignment = NEW.assignment, teacher_id = NEW.teacher_id;
    ELSE
      INSERT INTO guiding_question_assignments_student VALUES (NEW.*) ON CONFLICT (section_id, sparkpoint_id, student_id, resource_id)
      DO UPDATE SET assignment_date = current_timestamp,  assignment = NEW.assignment, teacher_id = NEW.teacher_id;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER guiding_question_assignments_insert_trigger
    BEFORE INSERT ON guiding_question_assignments
    FOR EACH ROW EXECUTE PROCEDURE guiding_question_assignments_insert_trigger();

COMMIT;
