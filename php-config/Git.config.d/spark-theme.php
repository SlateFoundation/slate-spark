<?php

Git::$repositories['spark-theme'] = [
    'remote' => 'git@github.com:JarvusInnovations/spark-theme.git',
    'originBranch' => 'develop',
    'workingBranch' => 'develop',
    'trees' => [
        'sencha-workspace/packages/spark-theme' => '.'
    ]
];