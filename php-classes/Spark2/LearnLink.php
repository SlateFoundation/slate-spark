<?php

namespace Spark2;

class LearnLink extends \VersionedRecord
{
    public static $historyTable = 's2_history_learn_links';

    public static $tableName = 's2_learn_links';

    public static $singularNoun = 'learn link';
    public static $pluralNoun = 'learn links';

    public static $collectionRoute = '/spark2/learn-links';

    public static $fields = [
        'Title',
        'URL',
        'VendorID' => [
            'type'    => 'uint',
            'notnull' => false
        ],
        'GradeLevel' => [
            'type'    => 'enum',
            'notnull' => false,
            'values'  => ['PK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        ],
        'DOK' => [
            'type'    => 'tinyint',
            'notnull' => false
        ],
        'Standards' => [
            'type'    => 'json',
            'notnull' => false
        ],
        'Metadata' => [
            'type'    => 'json',
            'notnull' => false
        ]
    ];

    public function getData()
    {
        $data = parent::getData();
        $data['CreatorFullName'] = $this->Creator->FullName;
        return $data;
    }

    public static function getStandardsConditions($handle, $matchedCondition)
    {
        $standards = explode(',', $handle);
        $sql = [];

        foreach ($standards as $standard) {
            // TODO: @themightychris how do we like to escape sql?
            $sql[] = 'INSTR(Standards, "' . $standard . '")';
        }

        return implode($sql, ' OR ');
    }

    public static $relationships = [
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

    public static $searchConditions = [
        'GradeLevel' => [
            'qualifiers' => ['grade', 'gradelevel', 'GradeLevel'],
            'sql' => 'GradeLevel = "%s"'
        ],

        'DOK' => [
            'qualifiers' => ['DOK', 'dok'],
            'sql' => 'DOK = "%s"'
        ],

        'Title' => [
            'qualifiers' => ['title'],
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

        'Standards' => [
            'qualifiers' => ['Standards', 'standards'],
            'callback'   => 'getStandardsConditions'
        ],

        'CreatorID' => [
            'qualifiers' => ['CreatorFullName', 'creatorfullname'],
            'sql' => 'CreatorID = "%s"'
        ]
    ];
}
