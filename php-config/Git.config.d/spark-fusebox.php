<?php

Git::$repositories['spark-fusebox'] = [
    'remote' => 'git@github.com:JarvusInnovations/spark-fusebox.git',
    'originBranch' => 'develop',
    'workingBranch' => 'develop',
    'localOnly' => true,
    'trees' => [
        'html-templates/app/SparkRepositoryManager',
        'php-classes/Spark3',
        'php-classes/Spark2',
        'php-classes/JSON.class.php', // TODO: merge upstream
        'php-classes/PostgresPDO.php', // TODO: move into a namespace and merge upstream
        'php-config/Git.config.d/spark-fusebox.php',
        'sencha-workspace/SparkRepositoryManager',
        'sencha-workspace/packages/spark-manager-theme',
        'site-root/spark2',
        'site-root/spark-repo',
        'site-root/postgrest.php',
        'site-root/sass',
        'site-root/fonts'
    ]
];