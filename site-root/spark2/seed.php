<?php

namespace Spark2;

function populateAssessmentTypes() {
    $assessmentTypes = [
        'Digital' => '0101110101010101010101010101'
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
        ],
        [
            'Name'        => 'Google Drive',
            'LogoURL'     => 'https://ssl.gstatic.com/docs/doclist/images/infinite_arrow_favicon_4.ico',
            'Description' => 'All your files ready where you are'
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
        ],
        'Google Drive' => [
            [
                'Domain' => 'docs.google.com',
                'ContextClass' => LearnLink::class
            ],
            [
                'Domain' => 'drive.google.com',
                'ContextClass' => LearnLink::class
            ],
            [
                'Domain' => 'docs.google.com',
                'ContextClass' => Assessment::class
            ],
            [
                'Domain' => 'drive.google.com',
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

function populateKhanAcademyLearns($tsvUrl = 'https://gist.githubusercontent.com/jmealo/d0925dc27a077fe07392/raw/711d508611c1021641f5d5aa41c5ce982b6c7f33/khan-academy-math-content.tsv') {
    print 'Populating Khan Academy Learns<br>';


    $tsvFile = file($tsvUrl);
    $tsvHeaders = str_getcsv(array_shift($tsvFile), "\t");
    $learns = [];
    $khanAcademy = Vendor::getByField('Name', 'Khan Academy');
    $khanAcademyID = $khanAcademy->ID;
    $count = LearnLink::getCount(['VendorID' => $khanAcademyID]);

    foreach ($tsvFile as $line) {
        $learn = array_combine($tsvHeaders,  str_getcsv($line, "\t"));
        $learns[] = $learn;
    }

    print "$count Khan Academy learns in system<br>";

    if (count($learns) > $count) {

        foreach ($learns as $learn) {
            $gradeLevel = [];
            $standards = [];

            $learnLink = new LearnLink();

            if (preg_match("/CCSS.Math.Content.(\\d+\\-\\d+|\\d+|).*.*.*/u", $learn['Code'], $gradeLevel)) {
                $gradeLevel = $gradeLevel[1];
            }

            $gradeLevels = preg_replace_callback('/(\d+)-(\d+)/', function($m) {
                return implode(',', range($m[1], $m[2]));
            }, $gradeLevel);

            if (!is_array($gradeLevels)) {
                if (strpos($gradeLevels, ',')) {
                    $gradeLevels = explode(',', $gradeLevels);
                } else {
                    $gradeLevels = [$gradeLevels];
                }
            }

            if (count($gradeLevels) > 1) {
                foreach($gradeLevels as $grade) {
                    $standards[] = ['standardCode' => $learn['Code'] . '-G' . $grade];
                }
            } else {
                $standards = [['standardCode' => $learn['Code']]];
            }


            $learnLink->setField('Standards',  $standards);
            $learnLink->setField('GradeLevel', $gradeLevels[0]);
            $learnLink->setField('Title',      $learn['Name']);
            $learnLink->setField('URL',        $learn['URL']);
            $learnLink->setField('VendorID', $khanAcademyID);
            $learnLink->save();
        }

        print count($learns) . ' learns populated<br>';
    } else {
        print 'Skipped... learns already loaded<br>';
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
            $standards = [];

            $learnLink = new LearnLink();
            if (preg_match("/CCSS.Math.Content.(\\d+\\-\\d+|\\d+|).*.*.*/u", $learn['Standard code'], $gradeLevel)) {
                $gradeLevel = $gradeLevel[1];
            } else if (preg_match("/CCSS.ELA-Literacy.\\w+.(\\d+\\-\\d+|\\d+)/u", $learn['Standard code'], $gradeLevel)) {
                $gradeLevel = $gradeLevel[1];
            }

            $gradeLevels = preg_replace_callback('/(\d+)-(\d+)/', function($m) {
                return implode(',', range($m[1], $m[2]));
            }, $gradeLevel);

            if (!is_array($gradeLevels)) {
                if (strpos($gradeLevels, ',')) {
                    $gradeLevels = explode(',', $gradeLevels);
                } else {
                    $gradeLevels = [$gradeLevels];
                }
            }

            if (count($gradeLevels) > 1) {
                foreach($gradeLevels as $grade) {
                    $standards[] = ['standardCode' => $learn['Standard code'] . '-G' . $grade];
                }
            } else {
                $standards = [['standardCode' => $learn['Standard code']]];
            }


            $learnLink->setField('Standards',  $standards);
            $learnLink->setField('GradeLevel', $gradeLevels[0]);
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
populateKhanAcademyLearns();