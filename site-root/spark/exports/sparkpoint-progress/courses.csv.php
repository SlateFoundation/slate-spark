<?php

$GLOBALS['Session']->requireAccountLevel('Administrator');


// comment this out when you're done debugging on the live site
\Site::$debug = true;


// read inputted filters
$where = [];

if (!empty($_GET['finish_time_min'])) {
    if (!$time = strtotime($_GET['finish_time_min'])) {
        return RequestHandler::throwInvalidRequestError('Unable to parse timestamp from finish_time_min');
    }

    $where[] = sprintf('assess_finish_time >= to_timestamp(%u)', $time);
}

if (!empty($_GET['finish_time_max'])) {
    if (!$time = strtotime($_GET['finish_time_max'])) {
        return RequestHandler::throwInvalidRequestError('Unable to parse timestamp from finish_time_max');
    }

    $where[] = sprintf('assess_finish_time <= to_timestamp(%u)', $time);
}


// init spreadsheet writer
$spreadsheet = new SpreadsheetWriter([
    'filename' => 'sparkpoint-progress-sections.csv',
    'autoHeader' => true
]);


// retrieve results
$courses = \Emergence\Database\Postgres::selectAll([
    'with' => [
        'course_students' => [
            'columns' => [
                'id' => '"CourseID"',
                'students' => 'COUNT(*)'
            ],
            'from' => 'course_section_participants',
            'join' => 'JOIN course_sections ON course_sections."ID" = "CourseSectionID"',
            'where' => [
                'Role' => 'Student'
            ],
            'group' => '"CourseID"'
        ],

        'course_sparkpoints' => [
            'columns' => [
                'id' => '"CourseID"',
                'sparkpoints_completed' => 'COUNT(*)',
                'students_with_completed' => 'COUNT(DISTINCT student_id)',
                'sparkpoint_time' => 'AVG(assess_finish_time - learn_start_time)',

                'learn_time' => 'AVG(learn_finish_time - learn_start_time)',

                'conference_time' => 'AVG(conference_finish_time - learn_finish_time)',
                'conference_working_time' => 'AVG(conference_start_time - learn_finish_time)',
                'conference_waiting_time' => 'AVG(conference_join_time - conference_start_time)',
                'conference_group_time' => 'AVG(conference_finish_time - conference_join_time)',

                'apply_time' => 'AVG(apply_finish_time - apply_start_time)',
                'apply_waiting_time' => 'AVG(apply_finish_time - apply_ready_time)',

                'assess_time' => 'AVG(assess_finish_time - assess_start_time)',
                'assess_working_time' => 'AVG(assess_ready_time - assess_start_time)',
                'assess_waiting_time' => 'AVG(assess_finish_time - assess_ready_time)'
            ],
            'from' => 'section_student_active_sparkpoint',
            'join' => [
                'JOIN student_sparkpoint USING (student_id, sparkpoint_id)',
                'JOIN course_sections ON "Code" = section_id'
            ],
            'where' => $where,
            'group' => '"CourseID"'
        ]
    ],

    'columns' => [
        'Course ID' => '"Code"',
        'Course Name' => '"Title"',
        'Enrolled Students' => 'students',

        'Total Sparkpoints Completed' => 'sparkpoints_completed',
        'Average # Sparkpoints Completed Per Student' => 'sparkpoints_completed / students ::float',
        '# Students that Completed 1+ Standard' => 'students_with_completed',
        '# Students that Completed 0 Standards' => 'students - students_with_completed',
        'Average Time Per Sparkpoint' => 'sparkpoint_time',

        'Average Time in Learn' => 'learn_time',

        'Average Time in Conference' => 'conference_time',
        'Average Time in Conference Working' => 'conference_working_time',
        'Average Time in Conference Waiting' => 'conference_waiting_time',
        'Average Time in Conference Group' => 'conference_group_time',

        'Average Time in Apply' => 'apply_time',
        'Average Time in Apply Waiting' => 'apply_waiting_time',

        'Average Time in Assess' => 'assess_time',
        'Average Time in Assess Working' => 'assess_working_time',
        'Average Time in Assess Waiting' => 'assess_waiting_time'
    ],

    'from' => 'courses',

    'join' => [
        'JOIN course_students ON course_students.id = "ID"',
        'LEFT JOIN course_sparkpoints ON course_sparkpoints.id = "ID"'
    ]
]);


// uncomment to debug
#\Debug::dumpVar($where);
#\Debug::dumpVar(iterator_to_array($courses));


// output results
foreach ($courses AS $course) {
    $spreadsheet->writeRow($course);
}


// finish output
$spreadsheet->close();