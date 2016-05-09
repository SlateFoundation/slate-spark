WITH mta AS (
  SELECT (SELECT count(1)
           FROM "mta-live".learn_assignments
         ) AS "Learns",

         (SELECT count(1)
            FROM "mta-live".apply_assignments
         ) AS "Applies",

         (SELECT count(1)
            FROM "mta-live".guiding_question_assignments
         ) AS "Guiding Questions",

         (SELECT count(1)
            FROM "mta-live".conference_resource_assignments
         ) AS "Conference Resources"
), merit AS (
  SELECT (SELECT count(1)
           FROM "merit-live".learn_assignments
         ) AS "Learns",

         (SELECT count(1)
            FROM "merit-live".apply_assignments
         ) AS "Applies",

         (SELECT count(1)
            FROM "merit-live".guiding_question_assignments
         ) AS "Guiding Questions",

         (SELECT count(1)
            FROM "merit-live".conference_resource_assignments
         ) AS "Conference Resources"
), by_type AS (
  select json_build_object(
      'Learns',
      sum("Learns"),
      'Applies',
      sum("Applies"),
      'Guiding Questions',
      sum("Guiding Questions"),
      'Conference Resources',
      sum("Conference Resources")
  ) AS json
  FROM (
        SELECT *
          FROM mta
     UNION ALL
        SELECT *
          FROM merit
  ) t
), by_school AS (
  SELECT json_build_object(
      'MTA',
      (SELECT "Learns" + "Applies" + "Guiding Questions" + "Conference Resources"
         FROM mta
      ),
      'Merit',
      (SELECT "Learns" + "Applies" + "Guiding Questions" + "Conference Resources"
         FROM merit
      )
  ) AS json
), by_teacher AS (
  SELECT json_build_object(
      'MTA',
      (SELECT json_strip_nulls(json_build_object(
          'Learns',
          (SELECT json_object_agg(
                    (concat_ws(' ', "FirstName", "LastName")),
                    mta_learns.count
                  )
             FROM (SELECT DISTINCT teacher_id,
                          count(1) AS count
                     FROM "mta-live".learn_assignments
                 GROUP BY teacher_id
                 ORDER BY count DESC
                    LIMIT 10
             ) mta_learns
             JOIN "mta-live".people mta_people
               ON mta_people."ID" = mta_learns.teacher_id
          ),

          'Guiding Questions',
          (SELECT json_object_agg(
                      (concat_ws(' ', "FirstName", "LastName")),
                      mta_gq.count
                  )
             FROM (SELECT DISTINCT teacher_id,
                          count(1) AS count
                     FROM "mta-live".guiding_question_assignments
                 GROUP BY teacher_id
                 ORDER BY count DESC
                    LIMIT 10
             ) mta_gq
             JOIN "mta-live".people mta_people
               ON mta_people."ID" = mta_gq.teacher_id
          ),

          'Conference Resources',
          (SELECT json_object_agg(
                     (concat_ws(' ', "FirstName", "LastName")),
                     mta_cr.count
                  )
             FROM (SELECT DISTINCT teacher_id,
                          count(1) AS count
                     FROM "mta-live".conference_resource_assignments
                 GROUP BY teacher_id
                 ORDER BY count DESC
                    LIMIT 10
             ) mta_cr
             JOIN "mta-live".people mta_people
               ON mta_people."ID" = mta_cr.teacher_id
          ),

          'Applies',
          (SELECT json_object_agg(
                     (concat_ws(' ', "FirstName", "LastName")),
                     mta_applies.count
                  )
             FROM (SELECT DISTINCT teacher_id,
                          count(1) AS count
                     FROM "mta-live".apply_assignments
                 GROUP BY teacher_id
                 ORDER BY count DESC
                    LIMIT 10
             ) mta_applies
             JOIN "mta-live".people mta_people
               ON mta_people."ID" = mta_applies.teacher_id)
      ))),

      'Merit',
      (SELECT json_strip_nulls(json_build_object(
          'Learns',
          (SELECT json_object_agg(
                    (concat_ws(' ', "FirstName", "LastName")),
                    merit_learns.count
                  )
             FROM (SELECT DISTINCT teacher_id,
                          count(1) AS count
                     FROM "merit-live".learn_assignments
                 GROUP BY teacher_id
                 ORDER BY count DESC
                    LIMIT 10
             ) merit_learns
             JOIN "merit-live".people merit_people
               ON merit_people."ID" = merit_learns.teacher_id
          ),

          'Guiding Questions',
          (SELECT json_object_agg(
                      (concat_ws(' ', "FirstName", "LastName")),
                      merit_gq.count
                  )
             FROM (SELECT DISTINCT teacher_id,
                          count(1) AS count
                     FROM "merit-live".guiding_question_assignments
                 GROUP BY teacher_id
                 ORDER BY count DESC
                    LIMIT 10
             ) merit_gq
             JOIN "merit-live".people merit_people
               ON merit_people."ID" = merit_gq.teacher_id
          ),

          'Conference Resources',
          (SELECT json_object_agg(
                     (concat_ws(' ', "FirstName", "LastName")),
                     merit_cr.count
                  )
             FROM (SELECT DISTINCT teacher_id,
                          count(1) AS count
                     FROM "merit-live".conference_resource_assignments
                 GROUP BY teacher_id
                 ORDER BY count DESC
                    LIMIT 10
             ) merit_cr
             JOIN "merit-live".people merit_people
               ON merit_people."ID" = merit_cr.teacher_id
          ),

          'Applies',
          (SELECT json_object_agg(
                     (concat_ws(' ', "FirstName", "LastName")),
                     merit_applies.count
                  )
             FROM (SELECT DISTINCT teacher_id,
                          count(1) AS count
                     FROM "merit-live".apply_assignments
                 GROUP BY teacher_id
                 ORDER BY count DESC
                    LIMIT 10
             ) merit_applies
             JOIN "merit-live".people merit_people
               ON merit_people."ID" = merit_applies.teacher_id)
      )))
  ) AS json), by_section AS (
    SELECT json_build_object(
    'MTA',
    (SELECT json_strip_nulls(json_build_object(
         'Learns',
         (SELECT json_object_agg(
             "Title" || ' (' || "Code" || ')',
             mta_learns.count
         )
          FROM (SELECT DISTINCT
                  section_id,
                  count(1) AS count
                FROM "mta-live".learn_assignments
                GROUP BY section_id
                ORDER BY count DESC
                LIMIT 10) mta_learns
            JOIN "mta-live".course_sections mta_course_sections ON mta_course_sections."ID" = mta_learns.section_id),
         'Guiding Questions',
         (SELECT json_object_agg(
             "Title" || ' (' || "Code" || ')',
             mta_gq.count
         )
          FROM (SELECT DISTINCT
                  section_id,
                  count(1) AS count
                FROM "mta-live".guiding_question_assignments
                GROUP BY section_id
                ORDER BY count DESC
                LIMIT 10) mta_gq
            JOIN "mta-live".course_sections mta_course_sections ON mta_course_sections."ID" = mta_gq.section_id),
         'Conference Resources',
         (SELECT json_object_agg(
             "Title" || ' (' || "Code" || ')',
             mta_cr.count
         )
          FROM (SELECT DISTINCT
                  section_id,
                  count(1) AS count
                FROM "mta-live".conference_resource_assignments
                GROUP BY section_id
                ORDER BY count DESC
                LIMIT 10) mta_cr
            JOIN "mta-live".course_sections mta_course_sections ON mta_course_sections."ID" = mta_cr.section_id),
         'Applies',
         (SELECT json_object_agg(
             "Title" || ' (' || "Code" || ')',
             mta_applies.count
         )
          FROM (SELECT DISTINCT
                  section_id,
                  count(1) AS count
                FROM "mta-live".apply_assignments
                GROUP BY section_id
                ORDER BY count DESC
                LIMIT 10) mta_applies
            JOIN "mta-live".course_sections mta_course_sections ON mta_course_sections."ID" = mta_applies.section_id)
     ))),
    'Merit',
    (SELECT json_strip_nulls(json_build_object(
         'Learns',
         (SELECT json_object_agg(
             "Title" || ' (' || "Code" || ')',
             merit_learns.count
         )
          FROM (SELECT DISTINCT
                  section_id,
                  count(1) AS count
                FROM "merit-live".learn_assignments
                GROUP BY section_id
                ORDER BY count DESC
                LIMIT 10) merit_learns
            JOIN "merit-live".course_sections merit_course_sections
              ON merit_course_sections."ID" = merit_learns.section_id),
         'Guiding Questions',
         (SELECT json_object_agg(
             "Title" || ' (' || "Code" || ')',
             merit_gq.count
         )
          FROM (SELECT DISTINCT
                  section_id,
                  count(1) AS count
                FROM "merit-live".guiding_question_assignments
                GROUP BY section_id
                ORDER BY count DESC
                LIMIT 10) merit_gq
            JOIN "merit-live".course_sections merit_course_sections ON merit_course_sections."ID" = merit_gq.section_id),
         'Conference Resources',
         (SELECT json_object_agg(
             "Title" || ' (' || "Code" || ')',
             merit_cr.count
         )
          FROM (SELECT DISTINCT
                  section_id,
                  count(1) AS count
                FROM "merit-live".conference_resource_assignments
                GROUP BY section_id
                ORDER BY count DESC
                LIMIT 10) merit_cr
            JOIN "merit-live".course_sections merit_course_sections ON merit_course_sections."ID" = merit_cr.section_id),
         'Applies',
         (SELECT json_object_agg(
             "Title" || ' (' || "Code" || ')',
             merit_applies.count
         )
          FROM (SELECT DISTINCT
                  teacher_id,
                  count(1) AS count
                FROM "merit-live".apply_assignments
                GROUP BY teacher_id
                ORDER BY count DESC
                LIMIT 10) merit_applies
            JOIN "merit-live".course_sections merit_course_sections
              ON merit_course_sections."ID" = merit_applies.teacher_id)
     )))
  ) AS json)

SELECT json_build_object(
  'Assignments by School',
  (SELECT json FROM by_school),
  'Assignments by Resource Type',
  (SELECT json FROM by_type),
  'Assignments by Teacher',
  (SELECT json FROM by_teacher),
  'Assignments by Section',
  (SELECT json FROM by_section)
) AS json