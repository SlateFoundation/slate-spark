<?php

namespace Spark3;

class ApplyProject extends \Emergence\ActiveRecord\LegacyActiveRecord
{
    public static $defaultConnection = \Emergence\Database\Postgres::class;
    public static $tableName = 's2_apply_projects';

    public static $singularNoun = 'apply project';
    public static $pluralNoun = 'apply projects';

    public static $collectionRoute = '/spark2/apply-projects';

    public static $fields = [
        'Title',
        'Instructions' => 'clob',
        'GradeLevel' => [
            'type'    => 'enum',
            'notnull' => false,
            'values'  => ['PK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        ],
        'DOK' => [
            'type'    => 'tinyint',
            'notnull' => false
        ],
        'Standards' => [
            'type'    => 'json',
            'notnull' => false
        ],
        'StandardIDs' => [
            'type'    => 'json',
            'notnull' => false
        ],
        'Todos' => [
            'type'    => 'json',
            'notnull' => false
        ],
        'Links' => [
            'type'    => 'json',
            'notnull' => false
        ],
        'TimeEstimate' => [
            'type'    => 'smallint',
            'notnull' => false
        ],
        'Metadata' => [
            'type'    => 'json',
            'notnull' => false
        ]
    ];

    public static $searchConditions = [
        'DOK' => [
            'qualifiers' => ['DOK', 'dok'],
            'sql' => 'DOK = "%s"'
        ],

        'Title' => [
            'qualifiers' => ['title'],
            'sql' => 'Title LIKE "%%%s%%"'
        ]
    ];
}
