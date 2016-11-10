<?php

Git::$repositories['spark-classroom'] = [
    'remote' => 'git@github.com:JarvusInnovations/spark-classroom.git',
    'originBranch' => 'releases/v2',
    'workingBranch' => 'releases/v2',
    'trees' => [
        'sencha-workspace/packages/spark-classroom',
        'sencha-workspace/SparkClassroomStudent',
        'sencha-workspace/SparkClassroomTeacher',
        'sencha-workspace/SparkDashboardStudent',
        'sencha-workspace/SparkDashboardTeacher'
    ]
];