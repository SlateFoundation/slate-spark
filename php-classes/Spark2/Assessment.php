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
            'qualifiers' => ['title'],
            'sql' => 'Title LIKE "%%%s%%"'
        ],

        'VendorID' => [
            'qualifiers' => ['vendorid', 'vendor'],
            'sql' => 'VendorID = "%s"'
        ],

        'URL' => [
            'qualifiers' => ['url'],
            'sql' => 'URL LIKE "%%%s%%"'
        ],

        'AssessmentTypeID' => [
            'qualifiers' => ['assessmenttypeid'],
            'sql' => 'AssessmentTypeID = "%s"'
        ],

        'CreatorFullName' => [
            'qualifiers' => ['creatorfullname'],
            'callback' => 'getCreatorIdConditions'
        ]
    ];

    public function getCreatorFullName()
    {
        if ($this->RemoteAuthorName && $this->RemoteAuthorIdentifier) {
            return $this->RemoteAuthorName;
        }

        return $this->Creator->FullName;
    }

    public static function getCreatorIdConditions($id, $matchedCondition)
    {
        if (is_numeric($id)) {
            return sprintf('CreatorID = %u', $id);
        } else {
            return sprintf('RemoteAuthorIdentifier = "%s"', \DB::escape($id));
        }
    }

    public static function getCreators()
    {
        return \DB::allRecords('
            SELECT DISTINCT r.CreatorID AS ID,
                   CONCAT(p.FirstName, " ", p.LastName) AS FullName
              FROM %1$s r
              JOIN people p ON p.ID = r.CreatorID

            UNION

            SELECT DISTINCT RemoteAuthorIdentifier AS ID,
                            RemoteAuthorName AS FullName
                       FROM %1$s
            ORDER BY FullName
        ', static::$tableName);
    }
}
