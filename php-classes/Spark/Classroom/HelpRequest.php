<?php

namespace Spark\Classroom;

class HelpRequest extends \ActiveRecord
{
    public static $tableName = 'help_requests';
    public static $singularNoun = 'help_request';
    public static $pluralNoun = 'help_requests';

    public static $fields = [
        'SectionID' => 'uint',
        'StudentID' => 'uint',
        'Type' => [
            'type' => 'enum',
            'values' => [
                'bathroom',
                'nurse',
                'question-general',
                'question-academic',
                'question-technology'
            ]
        ],
        'Closed' => [
            'type' => 'timestamp',
            'notnull' => false
        ],
        'ClosedBy' => [
            'type' => 'integer',
            'unsigned' => true,
            'notnull' => false
        ]
    ];

    public static $relationships = [
        'Student' => [
            'type' => 'one-one',
            'local' => 'StudentID',
            'class' => \Slate\People\Student::class
        ]
    ];

    public static $dynamicFields = [
        'Student'
    ];

    public function save ($deep = true)
    {
        if(!$this->StudentID) {
            $this->StudentID = $GLOBALS['Session']->PersonID;
        }

        parent::save($deep);
    }
}