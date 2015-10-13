<?php

namespace Spark2;

class SparkPointRecord extends \VersionedRecord
{
    public static $dynamicFields = [
        'CreatorFullName' => [
            'getter' => 'getCreatorFullName'
        ]
    ];

    public static $searchConditions = [
        'GradeLevel' => [
            'qualifiers' => ['gradelevel'],
            'sql' => 'GradeLevel = "%s"'
        ],
        'StandardIDs' => [
            'qualifiers' => ['standardids'],
            'callback'   => 'getStandardIdsConditions'
        ],

        'CreatorID' => [
            'qualifiers' => ['creatorfullname'],
            'sql' => 'CreatorID = "%s"'
        ],

        'Created' => [
            'qualifiers' => ['created'],
            'callback'   => 'getCreatedConditions'
        ]
    ];

    public function getCreatorFullName()
    {
        return $this->Creator->FullName;
    }

    public static function getCreators()
    {
        return \DB::allRecords('
            SELECT DISTINCT r.CreatorID AS ID,
                            CONCAT(p.FirstName, " ", p.LastName) AS FullName
                       FROM %s r
                       JOIN people p ON p.ID = r.CreatorID
                   ORDER BY p.LastName, p.FirstName
        ', static::$tableName);
    }

    public static function getStandardIdsConditions($handle)
    {
        $standard_ids = explode(',', $handle);
        $sql = [];

        foreach ($standard_ids as $standard_id) {
            // TODO: @themightychris how do we like to escape sql?
            $sql[] = 'INSTR(StandardIDs, "' . $standard_id . '")';
        }

        return implode($sql, ' OR ');
    }

    public static function getCreatedConditions($handle)
    {
        list($month, $day, $year) = explode('-', $handle);

        return "DATE(Created) = '$year-$month-$day'";
    }
}
