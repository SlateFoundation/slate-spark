<?php

namespace Spark2;

class ApplyProjectsRequestHandler extends SparkPointRequestHandler
{
    public static $anonymousOrigins = [];

    public static $recordClass = ApplyProject::class;

    public static function checkBrowseAccess($browseArguments)
    {
        return (
            in_array($_SERVER['HTTP_ORIGIN'], static::$anonymousOrigins) ||
            parent::checkBrowseAccess($browseArguments)
        );
    }
}