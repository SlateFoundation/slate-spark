<?php

namespace Spark2;

class Assessment extends \ActiveRecord
{
    public static $tableName = 's2_assessments';

    public static $singularNoun = 'assessment';
    public static $pluralNoun = 'assessments';

    public static $collectionRoute = '/spark2/assessments';

    public static $fields = [
        'Title',
        'URL',
        'VendorID' => [
            'type'    => 'uint',
            'notnull' => false
        ],
        'AssessmentTypeID' => 'uint',
        'GradeLevel' => [
            'type'    => 'enum',
            'notnull' => false,
            'values'  => ['PK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        ],
        'Standards' => [
            'type'    => 'json',
            'notnull' => false
        ]
    ];

    public static $relationships = [
        'Type' => [
            'type' => 'one-one',
            'class' => AssessmentType::class,
            'local' => 'AssessmentTypeID'
        ],

        'Creator' => [
            'type' => 'one-one',
            'class' => 'Person',
            'local' => 'CreatorID'
        ],

        'Vendor' => [
            'type' => 'one-one',
            'class' => Vendor::class,
            'local' => 'VendorID'
        ]
    ];

    public function getData() {
        $data = parent::getData();
        $data['CreatorFullName'] = $this->Creator->FullName;
        return $data;
    }
}
