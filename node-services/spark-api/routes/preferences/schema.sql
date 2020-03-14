-- !!! CHANGE THIS TO THE CORRECT SCHOOL/SCHEMA !!!
SET search_path = 'sandbox-school';

-- Clean up all tables for a fresh start
DROP TABLE IF EXISTS preferences CASCADE;

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
