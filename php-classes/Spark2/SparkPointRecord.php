<?php

namespace Spark2;

class SparkPointRecord extends \VersionedRecord
{
    public function getData()
    {
        $data = parent::getData();
        $data['CreatorFullName'] = $this->Creator->FullName;
        return $data;
    }

    public static $relationships = [
        'Creator' => [
            'type' => 'one-one',
            'class' => 'Person',
            'local' => 'CreatorID'
        ]
    ];

    public static function getStandardsConditions($handle)
    {
        $standards = explode(',', $handle);
        $sql = [];

        foreach ($standards as $standard) {
            // TODO: @themightychris how do we like to escape sql?
            $sql[] = 'INSTR(Standards, "' . $standard . '")';
        }

        return implode($sql, ' OR ');
    }

    public static function getCreatedConditions($handle)
    {
        list($month, $day, $year) = explode('-', $handle);

        return "DATE(Created) = '$year-$month-$day'";
    }

    public static $searchConditions = [
        'GradeLevel' => [
            'qualifiers' => ['GradeLevel', 'gradelevel'],
            'sql' => 'GradeLevel = "%s"'
        ],

        'Standards' => [
            'qualifiers' => ['Standards', 'standards'],
            'callback'   => 'getStandardsConditions'
        ],

        'CreatorID' => [
            'qualifiers' => ['CreatorFullName', 'creatorfullname'],
            'sql' => 'CreatorID = "%s"'
        ],

        'Created' => [
            'qualifiers' => ['Created', 'created'],
            'callback'   => 'getCreatedConditions'
        ]
    ];
}
