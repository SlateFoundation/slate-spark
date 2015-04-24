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
        ]
    ];

    public function getData() {
        $data = parent::getData();
        $data['Creator'] = $this->Creator->FirstName . ' ' . $this->Creator->LastName;
        return $data;
    }

    public static $relationships = [
        'Creator' => [
            'type' => 'one-one',
            'class' => 'Person',
            'local' => 'CreatorID'
        ]
    ];

    public static $dynamicFields = [
        'Creator'
    ];
}
