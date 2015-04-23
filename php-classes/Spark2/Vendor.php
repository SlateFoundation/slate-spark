<?php

namespace Spark2;

class Vendor extends \ActiveRecord
{
    public static $tableName = 's2_vendors';

    public static $singularNoun = 'vendor';
    public static $pluralNoun = 'vendors';

    public static $collectionRoute = '/spark2/vendors';

    public static $fields = [
        'Name',
        'Description' => [
            'notnull' => false
        ],
        'LogoURL' => [
            'notnull' => false
        ]
    ];

    public static $relationships = [
        'Domains' => [
            'type' => 'one-many',
            'class' => VendorDomain::class,
            'foreign' => 'VendorID'
        ]
    ];

    public function getData() {
        $data = parent::getData();
        $data['Domains'] = $this->Domains;
        return $data;
    }
}
