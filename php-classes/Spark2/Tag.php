<?php

namespace Spark2;

class Tag extends \ActiveRecord
{
    public static $tableName = 's2_tags';

    public static $singularNoun = 'tag';
    public static $pluralNoun = 'tags';

    public static $collectionRoute = '/spark2/tags';

    public static $fields = [
        'Tag',
        'Class' => [
            'index' => true
        ]
    ];
}
