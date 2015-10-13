<?php

namespace Spark2;

class SparkPointRecord extends \VersionedRecord
{
    public function getData()
    {
        $data = parent::getData();

        if ($data['RemoteAuthorName'] && $data['RemoteAuthorIdentifier']) {
            $data['CreatorFullName'] = $data['RemoteAuthorName'];
        } else {
            $data['CreatorFullName'] = $this->Creator->FullName;
        }

        return $data;
    }

    public static $relationships = [
        'Creator' => [
            'type' => 'one-one',
            'class' => 'Person',
            'local' => 'CreatorID'
        ]
    ];

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

    public static $searchConditions = [
        'GradeLevel' => [
            'qualifiers' => ['GradeLevel', 'gradelevel'],
            'sql' => 'GradeLevel = "%s"'
        ],
        'StandardIDs' => [
            'qualifiers' => ['StandardIDs', 'standardids'],
            'callback'   => 'getStandardIdsConditions'
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

    public static $sorters = array(
        // TODO: implement proper creator sorter on ActiveRecord` (please see Assessment model to make sure that fix is compatible or excludes that)
        'CreatorFullName' => [__CLASS__, 'sortCreatorFullName']
    );

    public static function sortCreatorFullName($dir, $name)
    {
        return '1 = 1';
    }
}
