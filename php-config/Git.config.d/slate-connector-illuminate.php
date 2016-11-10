<?php

Git::$repositories['slate-connector-illuminate'] = [
    'remote' => 'git@github.com:SlateFoundation/slate-connector-illuminate.git',
    'originBranch' => 'master',
    'workingBranch' => 'master',
    'trees' => [
        'html-templates/connectors/illuminate/connector.tpl',
        'php-classes/Slate/Connectors/Illuminate/Connector.php',
        'php-config/Slate/Connectors/Illuminate/Connector.config.php',
        'site-root/connectors/illuminate.php'
    ]
];