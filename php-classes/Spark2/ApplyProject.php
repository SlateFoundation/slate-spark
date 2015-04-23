<?php

namespace Spark2;

class ApplyProject extends \VersionedRecord
{
    public static $historyTable = 's2_history_apply_projects';

    public static $tableName = 's2_apply_projects';

    public static $singularNoun = 'apply project';
    public static $pluralNoun = 'apply projects';

    public static $collectionRoute = '/spark2/apply-projects';

    public static $fields = [
        'Title',
        'Instructions' => 'clob',
        'DOK' => [
            'type'    => 'tinyint',
            'notnull' => false
        ],
        'Order' => 'tinyint',
        'Text' => 'clob'
    ];

    public static $relationships = [
        'Todos' => [
            'type'    => 'one-many',
            'class'   => 'Spark2\ApplyTodo',
            'local'   => 'ID',
            'foreign' => 'ApplyProjectID'
        ],
        'Link' => [
            'type'    => 'one-one',
            'class'   => 'Spark2\ApplyLink',
            'local'   => 'ID',
            'foreign' => 'ApplyProjectID'
        ]
    ];
}
