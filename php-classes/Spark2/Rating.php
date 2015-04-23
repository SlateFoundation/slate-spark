<?php

namespace Spark2;

class Rating extends \ActiveRecord
{
    // ActiveRecord configuration
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

    public function save ($deep = true)
    {
        // HACK: Improvised upsert
        // TODO: If/when ORM supports upserts, we should use those
        try {
            parent::save($deep, true);
        } catch(\DuplicateKeyException $e) {
            $ogRating = Rating::getAllRecordsByWhere([
                'ContextID'    => $this->ContextID,
                'ContextClass' => $this->ContextClass,
                'CreatorID'    => $this->CreatorID
            ])[0];

            $this->ID = $ogRating->ID;

            // In the ORM, _isPhantom = true generates an INSERT statement, false generates an UPDATE statement
            $this->_isPhantom = false;

            parent::save($deep, true);
        }
    }
}
