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

    public function getRatings() {
        // TODO: Implement getRatings()
        return [
            'Student' => [
                'avg'     => rand(0, 10),
                'ratings' => rand(0, 1000)
            ],
            'Teacher' => [
                'avg'     => rand(0, 10),
                'ratings' => rand(0, 1000)
            ],
            'Vendor' => [
                'avg'     => rand(0, 10),
                'ratings' => rand(0, 1000)
            ]
        ];
    }

    public static function getRatingsByContext($context) {
        // TODO: Implement getRatingsByContext()
        return [
            'Student' => [
                'avg'     => rand(0, 10),
                'ratings' => rand(0, 1000)
            ],
            'Teacher' => [
                'avg'     => rand(0, 10),
                'ratings' => rand(0, 1000)
            ],
            'Vendor' => [
                'avg'     => rand(0, 10),
                'ratings' => rand(0, 1000)
            ]
        ];
    }

    public static function getRatingsFromRecord($record) {
        // TODO: Implement getRatingsFromRecord()
        return static::getRatingByContext();
    }
}
