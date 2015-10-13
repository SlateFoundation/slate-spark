<?php

namespace Spark2;

class GuidingQuestion extends SparkPointRecord
{
    public static $tableName = 's2_guiding_questions';
    public static $historyTable = 's2_history_guiding_questions';

    public static $singularNoun = 'guiding question';
    public static $pluralNoun = 'guiding questions';

    public static $collectionRoute = '/spark2/guiding-questions';

    public static $fields = [
        'Question' => [
            'type' => 'clob'
        ],
        'GradeLevel' => [
            'type'    => 'enum',
            'notnull' => false,
            'values'  => ['PK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        ],
        'StandardIDs' => [
            'type'    => 'json',
            'notnull' => false
        ]
    ];

    public static $searchConditions = [
        'Question' => [
            'qualifiers' => ['question'],
            'sql' => 'Question LIKE "%%%s%%"'
        ]
    ];
}
