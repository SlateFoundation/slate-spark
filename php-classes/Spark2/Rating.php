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
        'Rating'    => 'tinyint',
        'RatingType' => [
            'type'   => 'enum',
            'values' => [
                'Student',
                'Teacher',
                'Vendor'
            ]
        ],
        'VendorID' => [
            'type' => 'uint',
            'notnull' => false
        ],
        'Ratings' => [
            'type'    => 'uint',
            'default' => 1
        ]
    ];

    public static $relationships = [
        'Context' => [
            'type' => 'context-parent'
        ]
    ];

    public static $indexes = [
        'RaterIndex' => [
            'fields' => ['CreatorID', 'ContextClass', 'ContextID', 'RatingType'],
            'unique' => true
        ],
        'RatingIndex' => [
            'fields' => ['ContextClass', 'ContextID', 'VendorID'],
            'unique' => true
        ],
        'RatingTypeIndex' => [
            'fields' => ['RatingType']
        ]
    ];

    public function validate($deep = true)
    {
        // call parent
        parent::validate($deep);

        if (empty($this->Rater) && !empty($_SESSION) && !empty($_SESSION['User'])) {

            if (!$this->VendorID) {
                $this->RatingType = $_SESSION['User']->hasAccountLevel('Teacher') ? 'Teacher' : 'Student';
            } else {
                $this->RatingType = 'Vendor';
            }
        }

        // TODO: if Rater === Vendor, check for VendorID

        // save results
        return $this->finishValidation();
    }
}
