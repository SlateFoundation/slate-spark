<?php

namespace Spark3;

class ApplyProjectsRequestHandler extends \Emergence\ActiveRecord\RequestHandler
{
    public static $anonymousOrigins = [];

    public static $recordClass = ApplyProject::class;
    public static $accountLevelRead = 'User';

    public static function checkBrowseAccess($browseArguments)
    {
        return (
            in_array($_SERVER['HTTP_ORIGIN'], static::$anonymousOrigins) ||
            parent::checkBrowseAccess($browseArguments)
        );
    }

    public static function checkReadAccess(\Emergence\ActiveRecord\ActiveRecordInterface $Record, $suppressLogin = false)
    {
        return (
            in_array($_SERVER['HTTP_ORIGIN'], static::$anonymousOrigins) ||
            parent::checkReadAccess($Record, $suppressLogin)
        );
    }
}
