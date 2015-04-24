<?php

namespace Spark2;

function populateVendors() {
    if (Vendor::getByField('Name', 'YouTube')) {
        $skip = true;
    }

    $vendors = [
        [
            'Name'        => 'YouTube',
            'LogoURL'     => 'https://www.youtube.com/favicon.ico',
            'Description' => 'Hosts user-generated videos. Includes network and professional content.'
        ]
    ];

    $vendorDomains = [
        'YouTube' => [
            [
                'Domain' => 'youtu.be',
                'ContextClass' => LearnLink::class
            ],
            [
                'Domain' => 'youtube.com',
                'ContextClass' => LearnLink::class
            ],
        ]
    ];

    print ($skip ? '[SKIPPED] ' : '') . 'Populating vendors<br>';

    if ($skip) {
        return;
    }

    foreach ($vendors as $vendor) {
        $Vendor = new Vendor();
        $Vendor->setFields($vendor);
        $Vendor->save();

        if (is_array($vendorDomains[$Vendor->Name])) {
            foreach ($vendorDomains[$Vendor->Name] as $vendorDomain) {
                $VendorDomain = new VendorDomain();
                $VendorDomain->setFields($vendorDomain);
                $VendorDomain->VendorID = $Vendor->ID;
                $VendorDomain->save();
            }
        }
    }
}

populateVendors();
