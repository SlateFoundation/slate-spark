<?php

namespace Spark2;

class Assessment extends \ActiveRecord
{
    public static $tableName = 's2_assessments';

    public static $singularNoun = 'assessment';
    public static $pluralNoun = 'assessments';

    public static $collectionRoute = '/spark2/assessments';

    public static $fields = [
        'AssessmentTypeID' => 'uint',
        'LinkID' => 'uint'
    ];

    public static $relationships = [
        'Link' => [
            'type' => 'one-one',
            'class' => Link::class,
            'local' => 'LinkID'
        ],

        'Type' => [
            'type' => 'one-one',
            'class' => AssessmentType::class,
            'local' => 'AssessmentTypeID'
        ]
    ];
}
