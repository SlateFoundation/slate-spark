<?php

namespace Spark2;

class Link extends \ActiveRecord
{
    public static $tableName = 's2_links';

    public static $singularNoun = 'link';
    public static $pluralNoun = 'links';

    public static $collectionRoute = '/spark2/links';

    public static $fields = [
        'Title',
        'URL',
        'VendorID' => [
            'type' => 'uint',
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
