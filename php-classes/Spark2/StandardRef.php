<?php

namespace Spark2;

class StandardRef extends \ActiveRecord
{
    public static $tableName = 's2_standards_refs';

    public static $singularNoun = 'standard ref';
    public static $pluralNoun = 'standard refs';

    public static $collectionRoute = '/spark2/standard-refs';

    public static $fields = [
        'StandardCodeA' => [
            'index' => true
        ],
        'StandardCodeB' => [
            'index' => true
        ]
    ];

    public static $relationships = [
        'StandardA' => [
            'type' => 'one-to-one',
            'class' => 'Standard',
            'local' => 'StandardCodeA',
            'remote' => 'Code'
        ],
        'StandardB' => [
            'type' => 'one-to-one',
            'class' => 'Standard',
            'local' => 'StandardCodeB',
            'remote' => 'Code'
        ]
    ];
}
