<?php

namespace Emergence\ActiveRecord;

abstract class AbstractActiveRecord implements ActiveRecordInterface
{
    // static configuration
    public static $singularNoun = 'record';
    public static $pluralNoun = 'records';
    public static $collectionRoute = null;


    // static configuration getters
    public static function getSingularNoun()
    {
        return static::$singularNoun;
    }

    public static function getPluralNoun()
    {
        return static::$pluralNoun;
    }
    
    public static function getNoun($count)
    {
        return $count == 1 ? static::getSingularNoun() : static::getPluralNoun();
    }
    
    public static function getCollectionRoute()
    {
        return $collectionRoute;
    }


    // static instance getters
    public static function getById($id)
    {
        return static::getByField('id', $id);
    }

    public static function getByHandle($handle)
    {
        return static::getByField('handle', $handle);
    }


    // static collection getterts
}