<?php

namespace Spark2;

class Rating extends \ActiveRecord
{
    // ActiveRecord configuration
    public static $updateOnDuplicateKey = true;
    public static $tableName = 's2_ratings';
    public static $singularNoun = 'rating';
    public static $pluralNoun = 'ratings';
    public static $collectionRoute = '/ratings';

    public static $fields = [
        'ContextClass',
        'ContextID' => 'uint',
        'Rating' => 'tinyint',
        'RaterContextClass'
    ];

    public static $relationships = [
        'Context' => [
            'type' => 'context-parent'
        ]
    ];

    public static $indexes = [
        'RatingIndex' => [
            'fields' => ['CreatorID', 'ContextClass', 'ContextID'],
            'unique' => true
        ]
    ];

    public function validate($deep = true)
    {
        // call parent
        parent::validate($deep);

        if (empty($this->RaterContextClass) && !empty($_SESSION) && !empty($_SESSION['User'])) {
            $this->RaterContextClass = $_SESSION['User']->Class;
        }

        // save results
        return $this->finishValidation();
    }
}
