<?php

namespace Spark2;

class ConferenceResource extends SparkPointRecord
{
    public static $tableName = 's2_conference_resources';
    public static $historyTable = 's2_history_conference_resources';

    public static $singularNoun = 'Conference Resource';
    public static $pluralNoun = 'Conference Resources';

    public static $collectionRoute = '/spark2/conference-resources';

    public static $fields = [
        'Title',
        'URL',
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
        'Title' => [
            'qualifiers' => ['title'],
            'sql' => 'Title LIKE "%%%s%%"'
        ],

        'URL' => [
            'qualifiers' => ['url'],
            'sql' => 'URL LIKE "%%%s%%"'
        ]
    ];
}
