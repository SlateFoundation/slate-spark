<?php

namespace Spark2;

class LearnLink extends SparkPointRecord
{
    public static $historyTable = 's2_history_learn_links';

    public static $tableName = 's2_learn_links';

    public static $singularNoun = 'learn link';
    public static $pluralNoun = 'learn links';

    public static $collectionRoute = '/spark2/learn-links';

    public static $fields = [
        'Title',
        'URL',
        'VendorID' => [
            'type'    => 'uint',
            'notnull' => false
        ],
        'GradeLevel' => [
            'type'    => 'enum',
            'notnull' => false,
            'values'  => ['PK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        ],
        'DOK' => [
            'type'    => 'tinyint',
            'notnull' => false
        ],
        'StandardIDs' => [
            'type'    => 'json',
            'notnull' => false
        ],
        'Type' => [
            'type' => 'enum',
            'notnull' => false,
            'values' => [ 'Assessment', 'Video', 'Homework', 'Exercise', 'Game', 'Question' ]
        ],
        'Metadata' => [
            'type'    => 'json',
            'notnull' => false
        ]
    ];

    public static $relationships = [
        'Vendor' => [
            'type' => 'one-one',
            'class' => Vendor::class,
            'local' => 'VendorID'
        ]
    ];

    public static $searchConditions = [
        'DOK' => [
            'qualifiers' => ['dok'],
            'sql' => 'DOK = "%s"'
        ],

        'Title' => [
            'qualifiers' => ['title'],
            'sql' => 'Title LIKE "%%%s%%"'
        ],

        'VendorID' => [
            'qualifiers' => ['vendorid', 'vendor'],
            'sql' => 'VendorID = "%s"'
        ],

        'Type' => [
            'qualifiers' => ['type'],
            'sql' => 'Type = "%s"'
        ],

        'URL' => [
            'qualifiers' => ['url'],
            'sql' => 'URL LIKE "%%%s%%"'
        ]
    ];
}
