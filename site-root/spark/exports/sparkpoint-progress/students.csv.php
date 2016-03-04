<?php

$GLOBALS['Session']->requireAccountLevel('Administrator');


// comment this out when you're done debugging on the live site
#\Site::$debug = true;


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


$timeFields = [
    'learn_start_time',
    'learn_finish_time',
    'conference_start_time',
    'conference_join_time',
    'conference_finish_time',
    'apply_start_time',
    'apply_ready_time',
    'apply_finish_time',
    'assess_ready_time',
    'assess_start_time',
    'assess_finish_time'
];

if (!empty($_GET['time_min'])) {
    if (!$time = strtotime($_GET['time_min'])) {
        return RequestHandler::throwInvalidRequestError('Unable to parse timestamp from time_min');
    }

    $where[] = implode(' OR ', array_map(function($timeField) use ($time) {
        return sprintf('assess_finish_time >= to_timestamp(%u)', $time);
    }, $timeFields));
}

if (!empty($_GET['time_max'])) {
    if (!$time = strtotime($_GET['time_max'])) {
        return RequestHandler::throwInvalidRequestError('Unable to parse timestamp from time_max');
    }

    $where[] = implode(' OR ', array_map(function($timeField) use ($time) {
        return sprintf('assess_finish_time <= to_timestamp(%u)', $time);
    }, $timeFields));
}


// init spreadsheet writer
$spreadsheet = new SpreadsheetWriter([
    'filename' => 'sparkpoint-progress-students',
    'autoHeader' => true
]);

if ($_GET['dates'] == "all") {
    $spreadsheet = new SpreadsheetWriter([
        'filename' => 'sparkpoint-progress-students-all-activity',
        'autoHeader' => true
    ]);
}


// retrieve results
$students = \Emergence\Database\Postgres::selectAll([
    'with' => [
        'section_teachers' => [
            'columns' => [
                'id' => 'course_sections."ID"',
                'teachers' => 'string_agg(concat(teacher."FirstName", \' \', teacher."LastName"), \',\')'
            ],
            'from' => 'course_sections',
            'join' => [
                'JOIN course_section_participants AS participant ON participant."CourseSectionID" = course_sections."ID" AND participant."Role" = \'Teacher\'',
                'JOIN people AS teacher ON teacher."ID" = participant."PersonID"'
            ],
            'group' => [
                'course_sections."ID"'
            ]
        ],

        'student_sparkpoint_sections' => [
            'columns' => [
                'student_sparkpoint.*',
                'array_agg(section_id) AS section_ids'
            ],
            'from' => 'student_sparkpoint',
            'join' => [
                'JOIN section_student_active_sparkpoint USING (student_id, sparkpoint_id)'
            ],
            'where' => $where,
            'group' => [
                'student_id',
                'sparkpoint_id'
            ],
            'order' => [
                'student_id',
                'sparkpoint_id',
                'assess_finish_time'
            ]
        ]
    ],

    'columns' => [
        'Student Name' => 'concat(student."FirstName", \' \', student."LastName")',
        'Student Number' => 'student."StudentNumber"',

        'Section ID(s)' => 'array_to_string(section_ids, E\'\\n\')',
        'Section Title(s)' => '(
           SELECT string_agg(section."Title", E\'\\n\')
             FROM unnest(section_ids) AS section_id
             JOIN course_sections AS section ON section."ID" = section_id
        )',
        'Teacher(s)' => '(
           SELECT string_agg(section_teachers.teachers, E\'\\n\')
             FROM unnest(section_ids) AS section_id
             JOIN section_teachers ON section_teachers.id = section_id
        )',

        'Sparkpoint' => 'sparkpoint.code',

        'Standard Start Time' => 'learn_start_time',
        'Standard Finish Time' => 'assess_finish_time',
        'Total Time on Standard' => 'assess_finish_time - learn_finish_time',

        'Learn Start Time' => 'learn_start_time',
        'Learn Finish Time' => 'learn_finish_time',
        'Learn Total Time' => 'learn_finish_time - learn_start_time',

        'Conference Start Time' => 'conference_start_time',
        'Conference Finish Time' => 'conference_finish_time',
        'Conference Total Time' => 'conference_finish_time - conference_start_time',

        'Conference Working Time Total' => 'conference_join_time - conference_start_time',
        'Conference Waiting Time Start' => 'conference_start_time',
        'Conference Waiting Time Total' => 'conference_join_time - conference_start_time',

        'In Conference Time Start' => 'conference_join_time',
        'In Conference End Time' => 'conference_finish_time',
        'In Conference Total' => 'conference_finish_time - conference_join_time',

        'Apply Start Time' => 'apply_start_time',
        'Apply End Time' => 'apply_finish_time',
        'Apply Total Time' => 'apply_finish_time - apply_start_time',

        'Apply Working Start Time' => 'apply_start_time',
        'Apply Working Total Time' => 'apply_ready_time - apply_start_time',
        'Apply Ready for Grading Time' => 'apply_ready_time',
        'Apply Ready for Grading Total Time' => 'apply_finish_time - apply_ready_time',

        'Assess Start Time' => 'assess_start_time',
        'Assess End Time' => 'assess_finish_time',
        'Assess Total Time' => 'assess_finish_time - assess_start_time',

        'Assess Working Total Time' => 'assess_ready_time - assess_start_time',
        'Assess Ready for Grading Time' => 'assess_ready_time',
        'Assess Ready for Grading Total Time' => 'assess_finish_time - assess_ready_time'
    ],

    'from' => 'student_sparkpoint_sections',

    'join' => [
        'JOIN people AS student ON student."ID" = student_sparkpoint_sections.student_id',
        'JOIN sparkpoints AS sparkpoint ON sparkpoint.id = sparkpoint_id'
    ]
]);


// uncomment to debug
#\Debug::dumpVar($where);
#\Debug::dumpVar(iterator_to_array($students));


// output results
foreach ($students AS $student) {
    $spreadsheet->writeRow($student);
}


// finish output
$spreadsheet->close();