-- !!! CHANGE THIS TO THE CORRECT SCHOOL/SCHEMA !!!
SET search_path = 'sandbox-school';

-- Clean up all tables for a fresh start
DROP TABLE IF EXISTS preferences CASCADE;
DROP TABLE IF EXISTS preferences_section CASCADE;
DROP TABLE IF EXISTS preferences_student CASCADE;

DROP TABLE IF EXISTS apply_preferences CASCADE;
DROP TABLE IF EXISTS apply_preferences_section CASCADE;
DROP TABLE IF EXISTS apply_preferences_student CASCADE;

DROP TABLE IF EXISTS assess_preferences CASCADE;
DROP TABLE IF EXISTS assess_preferences_section CASCADE;
DROP TABLE IF EXISTS assess_preferences_student CASCADE;

DROP TABLE IF EXISTS conference_preferences CASCADE;
DROP TABLE IF EXISTS conference_preferences_section CASCADE;
DROP TABLE IF EXISTS conference_preferences_student CASCADE;

-- This shallowly merges an array of objects starting from the end of the array
CREATE OR REPLACE FUNCTION json_object_reverse_array_merge(obj json) RETURNS json AS
$$
    var len = obj.length,
    merged = {};

    while (len--) {
       var item = obj[len];

       for (var key in item) {
          merged[key] = item[key];
       }
    }

    return merged;
$$
LANGUAGE plv8 IMMUTABLE STRICT;

CREATE TABLE IF NOT EXISTS preferences (
  section_id integer NOT NULL DEFAULT 0,
  sparkpoint_id char(8) NOT NULL DEFAULT 0, -- This is 7 digit hexidecimal number prefixed with an M, so there's some
  user_id integer NOT NULL DEFAULT 0,       -- hackery and casts to make this act like the other columns until we
  preferences jsonb,                        -- transition to a surrogate key
  sticky boolean NOT NULL DEFAULT FALSE,
  last_updated TIMESTAMP DEFAULT now(),

  -- We must enforce uniqueness on the scope of preferences to prevent conflicting rules with an identical scope
  -- within the jsonb blob
  PRIMARY KEY(section_id, sparkpoint_id, user_id, sticky)
);

-- This generates 2 million records for testing

-- Generate sample data
WITH students AS (
  SELECT * FROM generate_series(1,5000)
),
sections AS (
    SELECT * FROM generate_series(1,500)
), records AS (
  INSERT INTO preferences SELECT
             sections.generate_series::integer AS section_id,
             'M' || floor(random()*(5000-1)+1)::char(8) AS sparkpoint_id,
             students.generate_series::integer AS user_id,
             jsonb_build_object('learns_required', floor(random()*(3-1)+1)) AS preferences,
             (random()*(30-1)) < 95 AS sticky
  FROM students,
  sections
)

SELECT 1;

-- section-level specified
CREATE INDEX IF NOT EXISTS preferences_section_id_idx ON preferences (section_id) WHERE section_id != 0;
-- section-level wildcard
CREATE INDEX IF NOT EXISTS preferences_section_id_zero_idx ON preferences (section_id) WHERE section_id = 0;

-- sparkpoint specified
CREATE INDEX IF NOT EXISTS preferences_sparkpoint_id_idx ON preferences (sparkpoint_id) WHERE sparkpoint_id != '0';
-- sparkpoint wildcard
CREATE INDEX IF NOT EXISTS preferences_sparkpoint_id_zero_idx ON preferences (sparkpoint_id) WHERE sparkpoint_id = '0';
CREATE INDEX IF NOT EXISTS preferences_sparkpoint_id_zero_wildcard_idx ON preferences ((substr(sparkpoint_id, 1, 1) != 'M'));

-- user-id specified
CREATE INDEX IF NOT EXISTS preferences_user_id_idx ON preferences (user_id) WHERE user_id != 0;
-- user-id wildcard
CREATE INDEX IF NOT EXISTS preferences_user_id_zero_idx ON preferences (user_id) WHERE user_id = 0;

-- sticky set
CREATE INDEX IF NOT EXISTS preferences_sticky_set_idx ON preferences (sticky) WHERE sticky = true;
-- global wildcard (system-level settings)
CREATE INDEX IF NOT EXISTS preferences_global_idx ON preferences ((sparkpoint_id::INTEGER = section_id AND section_id = user_id)) WHERE (substr(sparkpoint_id, 1, 1) != 'M');

-----------------------
-- SPECIFICITY TESTS --
-----------------------
-- These tests sets a preference named "case#" to "passed" at a more specific scope than the "failed" preference
-- If you do not get any "failed" values in your resulting effective_permissions.json object (and all expected keys are
-- present all tests have passed.

-- Test case: section_id, sparkpoint_id > section_id, user_id
INSERT INTO preferences VALUES
(3,'M3001CD',0, '{"case1": "passed1"}'::JSONB), -- section_id, sparkpoint_id
(3,0,7, '{"case1": "failed"}'::JSONB)     -- section_id, user_id
ON CONFLICT (section_id, sparkpoint_id, user_id, sticky)
      DO UPDATE SET last_updated = now(), preferences = preferences.preferences || EXCLUDED.preferences RETURNING *;

-- Test case: section_id, user_id > section_id
INSERT INTO preferences VALUES
(3,0,7, '{"case2": "passed1"}'::JSONB),
(3,0,0, '{"case2": "failed"}'::JSONB)
ON CONFLICT (section_id, sparkpoint_id, user_id, sticky)
      DO UPDATE SET last_updated = now(), preferences = preferences.preferences || EXCLUDED.preferences RETURNING *;

-- Test case: sparkpoint_id > global
INSERT INTO preferences VALUES
(0,'M3001CD',0, '{"case3": "passed1"}'::JSONB),
(0,0,0, '{"case3": "failed"}'::JSONB)
ON CONFLICT (section_id, sparkpoint_id, user_id, sticky)
      DO UPDATE SET last_updated = now(), preferences = preferences.preferences || EXCLUDED.preferences RETURNING *;

-- Test case: sparkpoint_id, user_id > section-id, user_id
INSERT INTO preferences VALUES
(0,'M3001CD',7, '{"case4": "passed1"}'::JSONB), -- sparkpoint_id, user_id
(3,0,7, '{"case4": "failed"}'::JSONB)     -- section_id, user_id
ON CONFLICT (section_id, sparkpoint_id, user_id, sticky)
      DO UPDATE SET last_updated = now(), preferences = preferences.preferences || EXCLUDED.preferences RETURNING *;

-- Test case: STICKY global, user_id > global
INSERT INTO preferences VALUES
(0,0,0, '{"case5": "passed1"}'::JSONB, true),
(0,0,0, '{"case5": "failed"}'::JSONB, false)
ON CONFLICT (section_id, sparkpoint_id, user_id, sticky)
      DO UPDATE SET last_updated = now(), preferences = preferences.preferences || EXCLUDED.preferences RETURNING *;

-- Test case: section_id, sparkpoint_id > section_id, user_id
INSERT INTO preferences VALUES
(3,'M3001CD',0, '{"case6": "passed1"}'::JSONB, true), -- section_id, sparkpoint_id
(3,0,7, '{"case6": "failed"}'::JSONB, true)     -- section_id, user_id
ON CONFLICT (section_id, sparkpoint_id, user_id, sticky)
      DO UPDATE SET last_updated = now(), preferences = preferences.preferences || EXCLUDED.preferences RETURNING *;

-- Test case: section_id, user_id > section_id
INSERT INTO preferences VALUES
(3,0,7, '{"case7": "passed1"}'::JSONB, true),
(3,0,0, '{"case7": "failed"}'::JSONB, true)
ON CONFLICT (section_id, sparkpoint_id, user_id, sticky)
      DO UPDATE SET last_updated = now(), preferences = preferences.preferences || EXCLUDED.preferences RETURNING *;

-- Test case: sparkpoint_id > GLOBAL
INSERT INTO preferences VALUES
(0,'M3001CD',0, '{"case8": "passed1"}'::JSONB, true),
(0,0,0, '{"case8": "failed"}'::JSONB, true)
ON CONFLICT (section_id, sparkpoint_id, user_id, sticky)
      DO UPDATE SET last_updated = now(), preferences = preferences.preferences || EXCLUDED.preferences RETURNING *;

-- Test case: sparkpoint_id, user_id > section-id, user_id
INSERT INTO preferences VALUES
(0,'M3001CD',7, '{"case9": "passed1"}'::JSONB, true), -- sparkpoint_id, user_id
(3,0,7, '{"case9": "failed"}'::JSONB, true)     -- section_id, user_id
ON CONFLICT (section_id, sparkpoint_id, user_id, sticky)
      DO UPDATE SET last_updated = now(), preferences = preferences.preferences || EXCLUDED.preferences RETURNING *;

-- Test case: section_id(-3), sparkpoint_id > section_id(-3), user_id
INSERT INTO preferences VALUES
(-3,'M3001CD',0, '{"case3": "passed1"}'::JSONB),
(-3,0,7, '{"case3": "failed"}'::JSONB)
ON CONFLICT (section_id, sparkpoint_id, user_id, sticky)
      DO UPDATE SET last_updated = now(), preferences = preferences.preferences || EXCLUDED.preferences RETURNING *;

-- Test case: section_id(-3), user_id(-3) > section_id(-3)
INSERT INTO preferences VALUES
(-3,0,-3, '{"case11": "passed1"}'::JSONB),
(-3,0,0, '{"case11": "failed"}'::JSONB)
ON CONFLICT (section_id, sparkpoint_id, user_id, sticky)
      DO UPDATE SET last_updated = now(), preferences = preferences.preferences || EXCLUDED.preferences RETURNING *;

-- Test case: sparkpoint_id(-2) > sparkpoint_id
INSERT INTO preferences VALUES
(0,'-2',0, '{"case12": "true"}'::JSONB),
(0,'M3001CD',0, '{"case12": "failed"}'::JSONB)
ON CONFLICT (section_id, sparkpoint_id, user_id, sticky)
      DO UPDATE SET last_updated = now(), preferences = preferences.preferences || EXCLUDED.preferences RETURNING *;

-- Test case: sparkpoint_id(-3), user_id(-3) > sparkpoint_id(-9), user_id(-9)
INSERT INTO preferences VALUES
(0,'-3',-3, '{"case13": "passed1"}'::JSONB),
(-9,0,-9, '{"case13": "failed"}'::JSONB)
ON CONFLICT (section_id, sparkpoint_id, user_id, sticky)
      DO UPDATE SET last_updated = now(), preferences = preferences.preferences || EXCLUDED.preferences RETURNING *;

-- Test case: STICKY global > global
INSERT INTO preferences VALUES
(-1,-1,-1, '{"case14": "passed1"}'::JSONB, true),
(-1,-1,-1, '{"case14": "failed"}'::JSONB, false)
ON CONFLICT (section_id, sparkpoint_id, user_id, sticky)
      DO UPDATE SET last_updated = now(), preferences = preferences.preferences || EXCLUDED.preferences RETURNING *;

-- Test case: STICKY section_id, sparkpoint_id, user_id > STICKY global(-1)
INSERT INTO preferences VALUES
(3,'M3001CD',7, '{"case15": "passed1"}'::JSONB, true),
(-1,-1,-1, '{"case15": "failed"}'::JSONB, true)
ON CONFLICT (section_id, sparkpoint_id, user_id, sticky)
      DO UPDATE SET last_updated = now(), preferences = preferences.preferences || EXCLUDED.preferences RETURNING *;

-- Test case: STICKY section_id, sparkpoint_id, user_id > STICKY global(-1)
INSERT INTO preferences VALUES
(3,'M3001CD',7, '{"case16": "passed1"}'::JSONB, false),
(-1,-1,-1, '{"case16": "failed"}'::JSONB, true)
ON CONFLICT (section_id, sparkpoint_id, user_id, sticky)
      DO UPDATE SET last_updated = now(), preferences = preferences.preferences || EXCLUDED.preferences RETURNING *;

EXPLAIN ANALYZE WITH scoped_preferences AS (
    SELECT preferences.*,
      ((CASE WHEN sparkpoint_id = '0' THEN 0 WHEN substr(sparkpoint_id, 1, 1) = '-' THEN abs(sparkpoint_id::integer) ELSE 1.1 END) +
      (CASE WHEN section_id = 0 THEN 0 WHEN section_id < 0 THEN abs(section_id) ELSE 1 END) +
      (CASE WHEN user_id = 0 THEN 0 WHEN user_id < 0 THEN abs(user_id) ELSE 1 END)
    ) AS specificity
    FROM preferences
    WHERE (user_id = 7 OR user_id = 0 OR user_id < 0)
          AND (section_id = 3 OR section_id = 0 OR section_id < 0)
          AND (sparkpoint_id = 'M3001CD' OR (substr(sparkpoint_id, 1, 1) != 'M'))
    ORDER BY specificity DESC, sticky DESC
), json_preferences AS (
  SELECT json_agg(preferences) AS json FROM scoped_preferences
), effective_preferences AS (
  SELECT json_object_reverse_array_merge(COALESCE(json, '[]'::JSON)::JSON) AS json FROM json_preferences
)

SELECT json FROM effective_preferences;

SELECT '["case1","case2","case3","case4","case5","case6","case7","case8","case9","case3","case11","case12","case13","case14","case15","case16"]'::JSONB <@ json_object_keys(json)::JSONB FROM effective_preferences;
-- SELECT json FROM effective_preferences;
-- SELECT ['case1','case2','case3','case4','case5','case6','case7','case8','case9','case3','case11','case12','case13','case14','case15','case16'] ?| json_object_keys(json) FROM effective_preferences.json;
-- SELECT '{"case1": true, "case2": true, "case3": true, "case4": true, "case5": true, "case6": true, "case7": true, "case8": true, "case9": true, "case3": true, "case11": true, "case12": true, "case13": true, "case14": true, "case15": true, "case16": true}'::JSONB ?| effective_preferences.json::JSONB FROM effective_preferences;