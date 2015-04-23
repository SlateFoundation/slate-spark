<?php

namespace Spark2;

class LearnLink extends \VersionedRecord
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
        'DOK' => [
            'type'    => 'tinyint',
            'notnull' => false
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
}
