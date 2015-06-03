<?php

namespace Spark2;

class TeacherResource extends SparkPointRecord
{
    public static $tableName = 's2_teacher_resources';
    public static $historyTable = 's2_history_teacher_resources';

    public static $singularNoun = 'teacher resource';
    public static $pluralNoun = 'teacher resources';

    public static $collectionRoute = '/spark2/teacher-resources';

    public static $fields = [
        'Title',
        'URL',
        'GradeLevel' => [
            'type'    => 'enum',
            'notnull' => false,
            'values'  => ['PK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        ],
        'Standards' => [
            'type'    => 'json',
            'notnull' => false
        ]
    ];

    public static $relationships = [
        'Creator' => [
            'type' => 'one-one',
            'class' => 'Person',
            'local' => 'CreatorID'
        ]
    ];

    public static $searchConditions = [
        'Title' => [
            'qualifiers' => ['title'],
            'sql' => 'Title LIKE "%%%s%%"'
        ],

        'URL' => [
            'qualifiers' => ['URL', 'url'],
            'sql' => 'URL LIKE "%%%s%%"'
        ]
    ];
}
