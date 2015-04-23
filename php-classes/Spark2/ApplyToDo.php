<?php

namespace Spark2;

class ApplyToDo extends \VersionedRecord
{
    public static $historyTable = 's2_history_apply_todos';

    public static $tableName = 's2_apply_todos';

    public static $singularNoun = 'apply todo';
    public static $pluralNoun = 'apply todos';

    public static $collectionRoute = '/spark2/apply-todos';

    public static $fields = [
        'ApplyProjectID' => 'uint',
        'Order' => 'tinyint',
        'Text' => 'clob'
    ];

    public static $relationships = [
        'Project' => [
            'type' => 'one-one',
            'class' => 'Spark2\ApplyProject',
            'local' => 'ApplyProjectID'
        ]
    ];
}
