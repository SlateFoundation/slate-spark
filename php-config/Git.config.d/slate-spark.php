<?php

Git::$repositories['slate-spark'] = [
    'remote' => 'git@github.com:JarvusInnovations/slate-spark.git',
    'originBranch' => 'master',
    'workingBranch' => 'master',
    'trees' => [
        'site-root/sass',
        'site-root/img',
        'site-root/spark',
        'php-config/Git.config.d',
        'php-config/Slate/DashboardRequestHandler.config.d',
        'php-config/Slate/UI/Navigation.config.php',
        'php-config/Slate/UI/Omnibar.config.d',
        'php-config/Slate/UI/Adapters/Courses.config.d/matchbook.php',
        'html-templates/app/spark-ext.tpl',
        'html-templates/app/SparkClassroomTeacher',
        'html-templates/app/SparkClassroomStudent',
        'html-templates/sections/courseSection.tpl'
    ]
];