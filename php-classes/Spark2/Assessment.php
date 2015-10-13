<?php

namespace Spark2;

class Assessment extends SparkPointRecord
{
    public static $tableName = 's2_assessments';
    public static $historyTable = 's2_history_assessments';

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
        'StandardIDs' => [
            'type'    => 'json',
            'notnull' => false
        ],
        'RemoteAuthorName',
        'RemoteAuthorIdentifier',
        'Metadata' => [
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

        'Vendor' => [
            'type' => 'one-one',
            'class' => Vendor::class,
            'local' => 'VendorID'
        ]
    ];

    public static $searchConditions = [
        'Title' => [
            'qualifiers' => ['Title', 'title'],
            'sql' => 'Title LIKE "%%%s%%"'
        ],

        'VendorID' => [
            'qualifiers' => ['vendorid', 'vendor'],
            'sql' => 'VendorID = "%s"'
        ],

        'URL' => [
            'qualifiers' => ['URL', 'url'],
            'sql' => 'URL LIKE "%%%s%%"'
        ],

        'AssessmentTypeID' => [
            'qualifiers' => ['AssessmentTypeID', 'assessmenttypeid'],
            'sql' => 'AssessmentTypeID = "%s"'
        ],

        'CreatorFullName' => [
            'qualifiers' => ['CreatorFullName', 'creatorfullname'],
            'callback' => 'getCreatorIdConditions'
        ]
    ];

    public static function getCreatorIdConditions($id, $matchedCondition)
    {
        if (is_numeric($id)) {
            // poor mans sql escaping
            return 'CreatorID = ' . (integer) $id;
        } else {
            // poor mans sql escaping
            $id = str_replace(' ', '', $id);
            return "RemoteAuthorIdentifier = \"$id\"";
        }
    }

}
