CREATE TABLE IF NOT EXISTS learn_discussions (
  id serial PRIMARY KEY,
  section_id int,
  sparkpoint_id char(8) REFERENCES public.sparkpoints (id),
  author_id integer NOT NULL,
  resource_id integer REFERENCES public.learn_resources (id) NOT NULL,
  body TEXT NOT NULL,
  ts timestamptz DEFAULT current_timestamp NOT NULL
);

CREATE INDEX IF NOT EXISTS learn_discussions_resource_id_idx ON learn_discussions (resource_id);
