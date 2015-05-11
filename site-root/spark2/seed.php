<?php

namespace Spark2;

function populateAssessmentTypes() {
    $assessmentTypes = [
        'Digital' => '0101110101010101010101010101',
        'Teacher Directed' => 'COMING THIS FALL. DIRECTED BY A TEACHER. STARRING ROB SNYDER.',
        'Dance off' => 'Show us your moves!'
    ];

    print 'Populating assessment types<br>';

    foreach ($assessmentTypes as $assessmentType => $description) {
        if(!AssessmentType::getByField('Name', $assessmentType)) {
            $AssessmentType = new AssessmentType();
            $AssessmentType->setField('Name', $assessmentType);
            $AssessmentType->setField('Description', $description);
            $AssessmentType->save();
        }
    }
}

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
        [
            'Name'        => 'Illuminate Education',
            'LogoURL'     => 'https://www.illuminateed.com/favicon.ico',
            'Description' => 'We provide one groundbreaking system for all your K-12 data needs.'
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
        ],
        'Illuminate Education' => [
            [
                'Domain' => 'illuminateed.com',
                'ContextClass' => Assessment::class
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

function populateLearnZillionLearns($tsvUrl = 'https://gist.githubusercontent.com/jmealo/511295bc5ec54cff4634/raw/0d0307e5892c0d068e40774a8e3b45331abc563f/04.13.2015-learnzillion-lesson-urls.tsv') {
    print 'Populating LearnZillion Learns<br>';

    $tsvFile = file($tsvUrl);
    $tsvHeaders = str_getcsv(array_shift($tsvFile), "\t");
    $learns = [];
    $learnZillion = Vendor::getByField('Name', 'LearnZillion');
    $learnZillionVendorID = $learnZillion->ID;

    foreach ($tsvFile as $line) {
        $learn = array_combine($tsvHeaders,  str_getcsv($line, "\t"));
        $learns[] = $learn;
    }

    print LearnLink::getCount(['VendorID' => $learnZillionVendorID]) . ' LearnZillion learns in system<br>';

    if (count($learns) > LearnLink::getCount(['VendorID' => $learnZillionVendorID])) {

        foreach ($learns as $learn) {
            $gradeLevel = [];

            $learnLink = new LearnLink();
            if (preg_match("/CCSS.Math.Content.(\\d+).*.*.*/u", $learn['Standard code'], $gradeLevel)) {
                $learnLink->setField('GradeLevel', $gradeLevel[1]);
            } else if (preg_match("/CCSS.ELA-Literacy.\\w+.(\\d+)/u", $learn['Standard code'], $gradeLevel)) {
                $learnLink->setField('GradeLevel', $gradeLevel[1]);
            }

            $learnLink->setField('Standards',  [['standardCode' => $learn['Standard code']]]);
            $learnLink->setField('Title',      $learn['Lesson title']);
            $learnLink->setField('URL',        $learn['Student page URL']);
            $learnLink->setField('VendorID', $learnZillionVendorID);
            $learnLink->save();
        }

        print count($learns) . ' learns populated<br>';
    } else {
        print 'Skipped... learns already loaded<br>';
    }


}

populateVendors();
populateAssessmentTypes();
populateLearnZillionLearns();
