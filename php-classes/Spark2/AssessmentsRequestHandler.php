<?php

namespace Spark2;

class AssessmentsRequestHandler extends SparkPointRequestHandler
{
    public static $recordClass = Assessment::class;

    public static function handleCreatorsRequest()
    {
        $recordClass = static::$recordClass;

        $creators = \DB::allRecords(sprintf('
        SELECT DISTINCT r.CreatorID,
               CONCAT(p.FirstName, " ", p.LastName) as CreatorFullName
          FROM %1$s r
          JOIN people p ON p.ID = r.CreatorID

        UNION

        SELECT DISTINCT RemoteAuthorIdentifier AS CreatorID,
                        RemoteAuthorName AS CreatorFullName
                   FROM %1$s
        ORDER BY CreatorFullName', $recordClass::$tableName));

        return static::respondJson('creators', array(
            'data' => $creators
        ));
    }
}
