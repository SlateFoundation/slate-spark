<?php

namespace Spark3;

class ContentArea extends \Emergence\ActiveRecord\AbstractSqlRecord
{
    public static $defaultConnection = \Emergence\Database\Postgres::class;
    public static $tableName = 'content_areas';

    public static $singularNoun = 'content area';
    public static $pluralNoun = 'content areas';

    public static $collectionRoute = '/spark2/content-areas2';

    public static $fields = [
        'abbreviation',
        'code',
        'student_title',
        'teacher_title',
        'parent_id' => 'uint',
        'subject',
        'path'
    ];

    public static $searchConditions = [
        'student_title' => [
            'qualifiers' => ['any', 'title'],
            'sql' => 'student_title LIKE "%%%s%%"'
        ],
        'teacher_title' => [
            'qualifiers' => ['any', 'title'],
            'sql' => 'teacher_title LIKE "%%%s%%"'
        ]
    ];
}
