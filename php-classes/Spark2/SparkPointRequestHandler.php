<?php

namespace Spark2;

class SparkPointRequestHandler extends \RecordsRequestHandler
{
    public static function handleRecordsRequest($action = false)
    {
        switch ($action ? $action : $action = static::shiftPath()) {
            case 'creators':
                return static::handleCreatorsRequest();
            default:
                return parent::handleRecordsRequest($action);
        }
    }

    public static function handleCreatorsRequest()
    {
        $recordClass = static::$recordClass;

        $creators = \DB::allRecords(sprintf('
        SELECT DISTINCT r.CreatorID,
                        CONCAT(p.FirstName, " ", p.LastName) as CreatorFullName
                   FROM %s r
                   JOIN people p ON p.ID = r.CreatorID
               ORDER BY p.LastName', $recordClass::$tableName));

        return static::respondJson('creators', array(
            'data' => $creators
        ));
    }
}
