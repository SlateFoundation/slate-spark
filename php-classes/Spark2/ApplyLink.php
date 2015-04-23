<?php

namespace Spark2;

class ApplyLink extends \VersionedRecord
{
    public static $historyTable = 's2_history_apply_links';

    public static $tableName = 's2_apply_links';

    public static $singularNoun = 'apply link';
    public static $pluralNoun = 'apply links';

    public static $collectionRoute = '/spark2/apply-links';

    public static $fields = [
        'Title',
        'URL',
        'VendorID' => [
            'type'    => 'uint',
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
            'class' => 'Spark2\Vendor',
            'local' => 'VendorID'
        ]
    ];
}
