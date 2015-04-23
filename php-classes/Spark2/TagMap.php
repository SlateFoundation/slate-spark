<?php

namespace Spark2;

class TagMap extends \ActiveRecord
{
    public static $tableName = 's2_tag_map';

    public static $singularNoun = 'tag-map';
    public static $pluralNoun = 'tag-maps';

    public static $collectionRoute = '/spark2/tag-maps';

    public static $fields = [
        'TagID' => 'uint',
        'ContextClass',
        'ContextID' => 'uint'
    ];

    public static $relationships = [
        'Context' => [
            'type' => 'one-one',
            'class' => 'Spark2\Standard',
            'local' => 'StandardID'
        ]
    ];

    public static $indexes = [
        'TagMapIndex' => [
            'fields' => ['CreatorID', 'TagID', 'ContextClass', 'ContextID'],
            'unique' => true
        ],
        'TagMapContextIndex' => [
            'fields' => ['ContextClass', 'ContextID']
        ],
    ];
}
