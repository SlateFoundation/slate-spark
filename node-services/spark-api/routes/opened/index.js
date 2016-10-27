'use strict';

var suggestionCache = {};
var opened = require('../../lib/opened');

function* csvGetHandler() {
    var csvSheets,
        sql,
        minGrade = this.query.min_grade || 0,
        maxGrade = this.query.max_grade || 12;

    sql = /*language=SQL*/ `
        WITH courses AS (
            SELECT *
              FROM (
                   SELECT cs."ID" AS "CourseSectionID",
                          12 - ((SELECT "GraduationYear" :: INTEGER
                                   FROM people
                                  WHERE "ID" = ANY (
                                    SELECT "PersonID"
                                      FROM course_section_participants csp2
                                     WHERE "CourseSectionID" = cs."ID"
                                       AND csp2."Role" = 'Student')
                                       AND "GraduationYear" IS NOT NULL
                                     LIMIT 1) - EXTRACT(YEAR FROM t."EndDate")
                          ) AS "Grade",
                          cs."Title",
                          cs."Code",
                          (
                            SELECT "PersonID"
                              FROM course_section_participants csp3
                             WHERE csp3."Role" = 'Teacher'
                               AND csp3."CourseSectionID" = cs."ID"
                             LIMIT 1
                          ) AS "TeacherID",
                          (
                            SELECT array_agg("PersonID")
                              FROM course_section_participants csp4
                             WHERE csp4."Role" = 'Student'
                               AND csp4."CourseSectionID" = cs."ID"
                          ) AS "StudentIDs"
                     FROM course_sections cs
                     JOIN terms t ON t."ID" = cs."TermID"
                      AND t."Status" = 'Live'
                    WHERE cs."Status" = 'Live'
                  ) t
             WHERE "Grade" IS NOT NULL
               AND "TeacherID" IS NOT NULL
        ),

        teachers AS (
            SELECT "FirstName",
                   "LastName",
                   "Username",
                   p."ID",
                   cp."Data" AS "Email",
                   (
                     SELECT array_agg("CourseSectionID")
                       FROM courses c
                      WHERE "TeacherID" = p."ID"
                   ) AS "CourseIDs",
                   (
                     SELECT "Grade"
                       FROM courses c
                      WHERE "TeacherID" = p."ID"
                      LIMIT 1
                   ) AS "Grade"
              FROM people p
              JOIN contact_points cp ON p."ID" = cp."PersonID"
               AND cp."Label" = 'Imported Email'
             WHERE p."ID" = ANY(SELECT DISTINCT "TeacherID" FROM courses)
        ),

        students AS (
              SELECT p."FirstName",
                     p."LastName",
                     p."Username",
                     p."ID",
                     cp."Data" AS "Email",
                     12 - (p."GraduationYear"::INTEGER - (
                       SELECT EXTRACT(YEAR FROM "EndDate")
                         FROM terms t
                        WHERE t."ID" = (
                          SELECT cs."TermID"
                            FROM course_sections cs
                           WHERE cs."ID" = (
                             SELECT "CourseSectionID"
                               FROM course_section_participants csp
                              WHERE csp."PersonID" = p."ID"
                              LIMIT 1
                           )
                        )
                     )) AS "Grade",
                     (
                       SELECT array_agg("CourseSectionID")
                         FROM courses
                        WHERE "CourseSectionID" = ANY(
                          SELECT "CourseSectionID"
                            FROM course_section_participants csp
                           WHERE csp."PersonID" = p."ID"
                        )
                     ) AS "CourseIDs"
                FROM people p
                JOIN contact_points cp ON p."ID" = cp."PersonID"
                 AND cp."Label" = 'Imported Email'
               WHERE p."ID" = ANY(
                 SELECT "PersonID"
                   FROM course_section_participants csp
                  WHERE "CourseSectionID" = ANY(SELECT "CourseSectionID" FROM courses)
                    AND csp."Role" = 'Student'
               )
        )

        SELECT json_build_object(
            'students',
            (SELECT json_agg(row_to_json(students)) FROM students),
            'teachers',
            (SELECT  json_agg(row_to_json(teachers)) FROM teachers),
            'courses',
            (SELECT  json_agg(row_to_json(courses)) FROM courses)
        );`;

    csvSheets = yield this.pgp.one(sql, [this.request.headers['x-nginx-mysql-schema']]);

    this.body = csvSheets;

}

module.exports = {
    get: function*() {
        var ctx = this,
            ids = yield ctx.pgp.one(`SELECT json_agg(vendor_identifier) AS ids FROM public.vendor_standards_crosswalk WHERE vendor_id = 1`);

        ids = ids.ids;

        for (var x = 0, len = ids.length; x < len; x++) {
            var id = ids[x];
            yield opened.getResources({
                standard_ids: id,
                limit: 50,
                license: 'all',
                resource_type: opened.validResourceTypes
            }, [], ctx);
            console.log('OPENED_PROGRESS:', x, len);
        }
    }
};