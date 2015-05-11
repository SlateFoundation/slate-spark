<?php

namespace Spark2;

class GuidingQuestion extends \ActiveRecord
{
    public static $tableName = 's2_guiding_questions';

    public static $singularNoun = 'guiding question';
    public static $pluralNoun = 'guiding questions';

    public static $collectionRoute = '/spark2/guiding-questions';

    public static $fields = [
        'Question' => [
            'type' => 'clob'
        ],
        'GradeLevel' => [
            'type'    => 'enum',
            'notnull' => false,
            'values'  => ['PK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        ],
        'Standards' => [
            'type'    => 'json',
            'notnull' => false
        ]
    ];

    public function getData() {
        $data = parent::getData();
        $data['CreatorFullName'] = $this->Creator->FullName;
        return $data;
    }

    public static $relationships = [
        'Creator' => [
            'type' => 'one-one',
            'class' => 'Person',
            'local' => 'CreatorID'
        ]
    ];
}
