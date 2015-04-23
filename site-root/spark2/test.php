<?php

namespace Spark2;

function randomString($pre = '', $post = '')
{
    return $pre . rtrim(base64_encode(md5(microtime())),"=") . $post;
}

function randomStandardCode()
{
    return implode('.', [
        'CCSS',
        array_rand(['ELA-Literacy', 'Math']),
        array_rand(range('A', 'Z')),
        array_rand(range(1, 12)),
        array_rand(range(1, 12)),
        array_rand(range('a', 'z'))]);
}

function randomGradeLevel()
{
    $gradeLevel = new GradeLevel();

    foreach (GradeLevel::$allGrades as $grade) {
        $gradeLevel->setGrade($grade, rand(0,1) == 1);
    }

    return $gradeLevel;
}

function testVendor()
{
    print "<h1>Vendors</h1>";

    $vendors = Vendor::getAll();

    $vendor = new Vendor();
    $vendor->setField('Name', randomString());
    $vendor->setField('Description', randomString());
    $vendor->setField('LogoURL', 'http://' . randomString());
    $vendor->save();

    $vendorDomain = new VendorDomain();
    $vendorDomain->setField('VendorID', $vendor->ID);
    $vendorDomain->setField('Domain', randomString() . '.com');
    $vendorDomain->setField('ContextClass', 'ApplyLink');
    $vendorDomain->save();

    foreach($vendors as $vendor) {
        print "<h2>" . $vendor->Name ."</h2><ul>";

        foreach($vendor->Domains as $vendorDomain) {
            print "<li>" . $vendorDomain->Domain . "</li>";
        }

        print "</ul>";
    }

    print "<hr>";
}

function testAssessmentType()
{
    print "<h1>AssessmentTypes</h1>";

    $assessmentTypes = AssessmentType::getAll();
    foreach($assessmentTypes as $assessmentType) {
        print "<b>" . $assessmentType->Name . ":</b><br>" . $assessmentType->Description . "<br><br>\n";
    }

    $assessmentType = new AssessmentType();
    $assessmentType->Name = randomString();
    $assessmentType->Description = randomString("This is an Assessment Type based upon: ", "it's the best one of all.");
    $assessmentType->save();

    print "<hr>";
}

function testGuidingQuestion()
{
    print "<h1>GuidingQuestions</h1><ul></ul>";

    $guidingQuestions = GuidingQuestion::getAll();
    foreach($guidingQuestions as $guidingQuestion) {
        print "<li>" . $guidingQuestion->Question . "</li>\n";
    }

    $guidingQuestion = new GuidingQuestion();
    $guidingQuestion->Question = "Did you know that... " . randomString() . "?";
    $guidingQuestion->save();

    print "</ul><hr>";
}

function testGradeLevel() {
    print "<h1>GradeLevel</h1>";

    $gradeLevel = new GradeLevel();;
    //K-3
    $gradeLevel->addGrade('K');
    $gradeLevel->addGrade('1');
    $gradeLevel->addGrade('2');
    $gradeLevel->addGrade('3');

    //7-9
    $gradeLevel->addGrade('7');
    $gradeLevel->addGrade('8');
    $gradeLevel->addGrade('9');

    //11-12
    $gradeLevel->addGrade('11');
    $gradeLevel->addGrade('12');

    print $gradeLevel->getGradeRange();

    $gradeLevel->ContextClass = 'Standard';
    $gradeLevel->ContextID = 1;
    $gradeLevel->save();

    print "<br><hr>";
}

function testStandard() {
    $standard = new Standard();
    $standard->Code = randomStandardCode();
    $standard->AltCode = randomStandardCode();
    $standard->IntCode = randomStandardCode();
    $standard->Title = randomString();
    $standard->Description = "Competency in being able to " . $standard->Title . " at some kind of level.";

    if (strpos($standard->Code, 'Math')) {
        $standard->Subject = 'Math';
    } else {
        $standard->Subject = 'English';
    }

    $standard->StandardsBody = 'CCSS';
    $standard->Source = 'Made up';
    $standard->ASN = randomString();
    $standard->save();

    $gradeLevel = randomGradeLevel();
    $gradeLevel->ContextClass = 'Standard';
    $gradeLevel->ContextID = $standard->ID;
    $gradeLevel->save();

    return $standard;
}

function testStandardMapping($standard) {
    // TODO: Implement this
}

function testStandardRef() {
    $standardRef = new StandardRef();
    $standardA = testStandard();
    $standardB = testStandard();
    $standardRef->StandardCodeA = $standardA->Code;
    $standardRef->StandardCodeB = $standardB->Code;
    $standardRef->save();
}

function testStandards() {
    print "<h1>Standards</h1>";

    $testStandard = testStandard();
    $testStandardMapping = testStandardMapping($testStandard);
    $testStandardRef = testStandardRef();

    print "<hr>";
}

function testRating() {
    print "<h1>Ratings</h1>";

    $testStandard = testStandard();
    $testRating1 = new Rating();
    $testRating1->ContextClass = $testStandard->Class;
    $testRating1->ContextID = $testStandard->ID;
    $testRating1->Rating = rand(0, 10);
    $testRating1->save();

    $testRating2 = new Rating();
    $testRating2->ContextClass = $testStandard->Class;
    $testRating2->ContextID = $testStandard->ID;
    $testRating2->Rating = rand(0, 10);
    $testRating2->save();

    $testRating3 = Rating::getByID($testRating2->ID);

    print 'Upsert: ' . ($testRating3->Rating == $testRating2->Rating ? 'Failed' : 'Succeeded');
    print "<hr>";
}

testVendor();
testAssessmentType();
testGuidingQuestion();
testGradeLevel();
testStandards();
testRating();
