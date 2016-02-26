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

    $whereQuery = sprintf('assess_finish_time >= to_timestamp(%u)', $time);
    
    if ($_GET['dates'] == "all") {
        $whereQuery .= sprintf(' OR learn_start_time >= to_timestamp(%u)', $time);
        $whereQuery .= sprintf(' OR learn_finish_time >= to_timestamp(%u)', $time);
        $whereQuery .= sprintf(' OR conference_start_time >= to_timestamp(%u)', $time);
        $whereQuery .= sprintf(' OR conference_join_time >= to_timestamp(%u)', $time);
        $whereQuery .= sprintf(' OR conference_finish_time >= to_timestamp(%u)', $time);
        $whereQuery .= sprintf(' OR apply_start_time >= to_timestamp(%u)', $time);
        $whereQuery .= sprintf(' OR apply_ready_time >= to_timestamp(%u)', $time);
        $whereQuery .= sprintf(' OR apply_finish_time >= to_timestamp(%u)', $time);
        $whereQuery .= sprintf(' OR assess_ready_time >= to_timestamp(%u)', $time);
        $whereQuery .= sprintf(' OR assess_start_time >= to_timestamp(%u)', $time);
    }
    
    $where[] = $whereQuery;
}

if (!empty($_GET['finish_time_max'])) {
    if (!$time = strtotime($_GET['finish_time_max'])) {
        return RequestHandler::throwInvalidRequestError('Unable to parse timestamp from finish_time_max');
    }

    $whereQuery = sprintf('assess_finish_time <= to_timestamp(%u)', $time);
    
    if ($_GET['dates'] == "all") {
        $whereQuery .= sprintf(' OR learn_start_time <= to_timestamp(%u)', $time);
        $whereQuery .= sprintf(' OR learn_finish_time <= to_timestamp(%u)', $time);
        $whereQuery .= sprintf(' OR conference_start_time <= to_timestamp(%u)', $time);
        $whereQuery .= sprintf(' OR conference_join_time <= to_timestamp(%u)', $time);
        $whereQuery .= sprintf(' OR conference_finish_time <= to_timestamp(%u)', $time);
        $whereQuery .= sprintf(' OR apply_start_time <= to_timestamp(%u)', $time);
        $whereQuery .= sprintf(' OR apply_ready_time <= to_timestamp(%u)', $time);
        $whereQuery .= sprintf(' OR apply_finish_time <= to_timestamp(%u)', $time);
        $whereQuery .= sprintf(' OR assess_ready_time <= to_timestamp(%u)', $time);
        $whereQuery .= sprintf(' OR assess_start_time <= to_timestamp(%u)', $time);
    }
    
    $where[] = $whereQuery;
}


// init spreadsheet writer
$spreadsheet = new SpreadsheetWriter([
    'filename' => 'sparkpoint-progress-sections',
    'autoHeader' => true
]);

if ($_GET['dates'] == "all") {
    $spreadsheet = new SpreadsheetWriter([
        'filename' => 'sparkpoint-progress-sections-all-activity',
        'autoHeader' => true
    ]);
}


// retrieve results
$sections = \Emergence\Database\Postgres::selectAll([
    'with' => [
        'section_teachers' => [
            'columns' => [
                'id' => '"CourseSectionID"',
                'teachers' => 'string_agg(concat("FirstName", \' \', "LastName"), \',\')'
            ],
            'from' => 'course_section_participants',
            'join' => 'JOIN people ON people."ID" = "PersonID"',
            'where' => [
                'Role' => 'Teacher'
            ],
            'group' => '"CourseSectionID"'
        ],

        'section_students' => [
            'columns' => [
                'id' => '"CourseSectionID"',
                'students' => 'COUNT(*)'
            ],
            'from' => 'course_section_participants',
            'where' => [
                'Role' => 'Student'
            ],
            'group' => '"CourseSectionID"'
        ],

        'section_sparkpoints' => [
            'columns' => [
                'id' => 'section_id',
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
            'join' => 'JOIN student_sparkpoint USING (student_id, sparkpoint_id)',
            'where' => $where,
            'group' => 'section_id'
        ]
    ],

    'columns' => [
        'Section ID' => '"Code"',
        'Section Name' => '"Title"',
        'Teacher(s)' => 'teachers',
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

    'from' => 'course_sections',

    'join' => [
        'JOIN section_teachers ON section_teachers.id = "ID"',
        'JOIN section_students ON section_students.id = "ID"',
        'LEFT JOIN section_sparkpoints ON section_sparkpoints.id = "ID"'
    ]
]);


// uncomment to debug
#\Debug::dumpVar($where);
#\Debug::dumpVar(iterator_to_array($sections));


// output results
foreach ($sections AS $section) {
    $spreadsheet->writeRow($section);
}


// finish output
$spreadsheet->close();