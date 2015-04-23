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
            'type' => 'one-one',
            'class' => 'Spark2\Standard',
            'local' => 'StandardCodeA',
            'remote' => 'Code'
        ],
        'StandardB' => [
            'type' => 'one-one',
            'class' => 'Spark2\Standard',
            'local' => 'StandardCodeB',
            'remote' => 'Code'
        ]
    ];
}
