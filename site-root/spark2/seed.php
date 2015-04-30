<?php

namespace Spark2;

function populateVendors() {
    $vendors = [
        [
            'Name'        => 'YouTube',
            'LogoURL'     => 'https://www.youtube.com/favicon.ico',
            'Description' => 'Hosts user-generated videos. Includes network and professional content.'
        ],
        [
            'Name'        => 'Khan Academy',
            'LogoURL'     => 'https://www.khanacademy.org/favicon.ico',
            'Description' => 'Offers over 2400 free videos from arithmetic to physics, and finance.'
        ],
        [
            'Name'        => 'LearnZillion',
            'LogoURL'     => 'https://www.learnzillion.com/favicon.ico',
            'Description' => 'See visual, conceptual explanations of the Common Core State Standards. 4000+ videos tailored for grades 2-12.'
        ],
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
        ],
        'Khan Academy' => [
            [
                'Domain' => 'khanacademy.org',
                'ContextClass' => LearnLink::class
            ]
        ],
        'LearnZillion' => [
            [
                'Domain' => 'learnzillion.com',
                'ContextClass' => LearnLink::class
            ]
        ]
    ];

    print 'Populating vendors<br>';

    foreach ($vendors as $vendor) {
        if(!Vendor::getByField('Name', $vendor['Name'])) {
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
}

populateVendors();
