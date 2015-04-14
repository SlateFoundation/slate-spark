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
        'Link',
        'Vendor' => [
            'notnull' => false
        ],
        'DOK' => [
            'type' => 'tinyint',
            'notnull' => false,
        ],
        'Category' => [
            'notnull' => false
        ],
        'Notes' => [
            'type' => 'clob',
            'notnull' => false
        ]
    ];
}
