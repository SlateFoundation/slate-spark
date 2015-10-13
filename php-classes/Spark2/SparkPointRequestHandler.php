<?php

namespace Spark2;

class SparkPointRequestHandler extends \RecordsRequestHandler
{
    public static function handleRecordsRequest($action = false)
    {
        switch ($action ? $action : $action = static::shiftPath()) {
            case '*creators':
                return static::handleCreatorsRequest();
            default:
                return parent::handleRecordsRequest($action);
        }
    }

    public static function handleCreatorsRequest()
    {
        $recordClass = static::$recordClass;

        return static::respond('creators', $recordClass::getCreators());
    }
}
