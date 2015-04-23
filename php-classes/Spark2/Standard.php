<?php

namespace Spark2;

class Standard extends \ActiveRecord
{
    public static $tableName = 's2_standards';

    public static $singularNoun = 'standard';
    public static $pluralNoun = 'standards';

    public static $collectionRoute = '/spark2/standards';

    public static $fields = [
        'Code' => [
            'unique' => true
        ],
        'AltCode' => [
            'index' => true,
        ],
        'IntCode' => [
            'unique' => true
        ],
        'Title',
        'Description' => [
            'type' => 'clob',
            'notnull' => false
        ],
        'Subject' => [
            'type' => 'enum',
            'values' => ['Math', 'English', 'Science', 'Social Studies'],
            'index' => true,
        ],
        'StandardsBody',
        'Source',
        'ASN',
        'ParentStandard' => [
            'notnull' => false,
            'index' => true
        ]
    ];

    public static $relationships = [
        'ParentStandard' => [
            'type'  => 'one-one',
            'class' => 'Spark2\Standard',
            'local' => 'ParentStandardID'
        ],
        'GradeLevel'=> [
            'type'         => 'context-children',
            'class'        => 'Spark2\GradeLevel',
            'contextClass' => 'Spark2\Standard'
        ]
    ];
}
