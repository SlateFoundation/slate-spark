<?php

namespace Spark2;

class ApplyProjectsRequestHandler extends SparkPointRequestHandler
{
    public static $anonymousOrigins = [];

    public static $recordClass = ApplyProject::class;
    static public $accountLevelRead = 'User';

    public static function checkBrowseAccess($browseArguments)
    {
        return (
            in_array($_SERVER['HTTP_ORIGIN'], static::$anonymousOrigins) ||
            parent::checkBrowseAccess($browseArguments)
        );
    }

    public static function checkReadAccess(\ActiveRecord $Record, $suppressLogin = false)
    {
        return (
            in_array($_SERVER['HTTP_ORIGIN'], static::$anonymousOrigins) ||
            parent::checkReadAccess($Record, $suppressLogin)
        );
    }

    public static function handleCreatorsRequest()
    {
        $recordClass = static::$recordClass;

        $creators = \DB::allRecords(sprintf('
        SELECT DISTINCT RemoteAuthorName,
                   FROM %s
               ORDER BY RemoteAuthorName',
        $recordClass::$tableName);

        return static::respondJson('creators', array(
            'data' => $creators
        ));
    }
}