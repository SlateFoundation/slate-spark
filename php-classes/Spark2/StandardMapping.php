<?php

namespace Spark2;

class StandardMapping extends \ActiveRecord
{
    public static $tableName = 's2_standards_mappings';

    public static $singularNoun = 'standard-mapping';
    public static $pluralNoun = 'standard-mappings';

    public static $collectionRoute = '/spark2/standard-mappings';

    public static $fields = [
        'StandardID' => 'uint',
        'ContextClass',
        'ContextID' => 'uint'
    ];
}
