<?php

namespace Spark2;

class VendorDomain extends \ActiveRecord
{
    public static $tableName = 's2_vendor_domains';

    public static $singularNoun = 'vendor-domain';
    public static $pluralNoun = 'vendor-domains';

    public static $collectionRoute = '/spark2/vendor-domains';

    public static $fields = [
        'VendorID' => 'uint',
        'Domain',
        'ContextClass'
    ];

    public static $relationships = [
        'Vendor' => [
            'type' => 'one-to-one',
            'class' => 'Vendor',
            'local' => 'VendorID'
        ]
    ];
}
