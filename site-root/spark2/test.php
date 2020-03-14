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

function testVendor() {
    $vendor = new Vendor();
    $vendor->setField('Name', randomString());
    $vendor->setField('Description', randomString());
    $vendor->setField('LogoURL', 'http://' . randomString());
    $vendor->save();

    testVendorDomain($vendor);

    return $vendor;
}

function testVendorDomain($vendor) {
    $vendorDomain = new VendorDomain();
    $vendorDomain->setField('VendorID', $vendor->ID);
    $vendorDomain->setField('Domain', randomString() . '.com');
    $vendorDomain->setField('ContextClass', ApplyLink::class);
    $vendorDomain->save();

    return $vendorDomain;
}

function testVendors()
{
    print "<h1>Vendors</h1>";

    $vendors = Vendor::getAll();

    $vendor = testVendor();

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

    $gradeLevel->ContextClass = Standard::class;
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
    $gradeLevel->ContextClass = Standard::class;
    $gradeLevel->ContextID = $standard->ID;
    $gradeLevel->save();

    $standard = Standard::getByID($standard->ID);

    return $standard;
}

function testStandardMapping($standard) {
    $testStandardMapping = new StandardMapping();

    $testStandardMapping->StandardID = $standard->ID;
    $testStandardMapping->ContextClass = ApplyLink::class;
    $testApplyLink = testApplyLink(testApplyProject());
    $testStandardMapping->ContextID = $testApplyLink->ID;

    $testStandardMapping->save();

    return $testStandardMapping;
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
    $testRating1->ContextClass = Standard::class;
    $testRating1->ContextID = $testStandard->ID;
    $testRating1->Rating = rand(0, 10);
    $testRating1->save();

    $testRating2 = new Rating();
    $testRating2->ContextClass = Standard::class;
    $testRating2->ContextID = $testStandard->ID;
    $testRating2->Rating = rand(0, 10);
    $testRating2->save();

    $testRating3 = Rating::getByID($testRating2->ID);

    print 'Upsert: ' . (($testRating3->Rating == $testRating2->Rating) ? 'Succeeded' : 'Failed');

    if ($testRating3->Rating != $testRating2->Rating) {
        print '<textarea>';
        var_export($testRating1);
        var_export($testRating2);
        var_export($testRating3);
        print '</textarea>';
    }

    $testVendorRating = new Rating();
    $testVendorRating->VendorID = 1;
    $testVendorRating->Ratings = rand(0, 100000);
    $testVendorRating->ContextClass = Standard::class;
    $testVendorRating->ContextID = $testStandard->ID;
    $testVendorRating->save();

    print "<hr>";
}

function randomURL() {
    return 'http://goo.gl/' . substr(base64_encode(randomString()), 0, 20);
}

function testApplyProject() {
    $testApplyProject = new ApplyProject();
    $testApplyProject->Title = randomString('Apply Project ');
    $testApplyProject->Description = randomString("Here's what you do", "Due tomorrow!");
    $testApplyProject->DOK = rand(1, 4);
    $testApplyProject->save();

    return $testApplyProject;
}

function testApplyLink($ApplyProject) {
    $testApplyLink = new ApplyLink();
    $testApplyLink->Title = randomString();
    $testApplyLink->URL = randomURL();
    $testVendor = testVendor();
    $testApplyLink->VendorID = $testVendor->ID;
    $testApplyLink->save();

    return $testApplyLink;
}

function numToOrdinalWord($num)
{
    $first_word = ['eth', 'First', 'Second', 'Third', 'Fouth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth', 'Elevents',
        'Twelfth', 'Thirteenth', 'Fourteenth', 'Fifteenth', 'Sixteenth', 'Seventeenth', 'Eighteenth', 'Nineteenth', 'Twentieth'];
    $second_word = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty'];

    if ($num <= 20) {
        return $first_word[$num];
    }

    $first_num = substr($num, -1, 1);
    $second_num = substr($num, -2, 1);

    return $string = str_replace('y-eth', 'ieth', $second_word[$second_num] . '-' . $first_word[$first_num]);
}

function testApplyToDos($ApplyProject) {
    $howmany = rand(0, 25);
    $returnVal = [];

    for($x = 0; $x < $howmany; $x++) {
        $testApplyToDo = new ApplyToDo();
        $testApplyToDo->Order = ($x + 1);
        $testApplyToDo->Text = 'Do this ' . numToOrdinalWord($x + 1) . ' before continuing.';
        $testApplyToDo->ApplyProjectID = $ApplyProject->ID;
        $testApplyToDo->save();
        $returnVal[] = $testApplyToDo;
    }

    return $returnVal;
}

function testApplies() {
    print "<h1>Applies</h1>";
    $testApplyProject = testApplyProject();
    $testApplyLink = testApplyLink($testApplyProject);
    $testApplyToDos = testApplyToDos($testApplyProject);
    $linkProps = ['Title', 'URL', 'Vendor'];

    print '<h3>' . $testApplyProject->Title . '</h3>';
    print '<b>DOK: </b>' . $testApplyProject->DOK . '<br>';

    print '<h3>Link:</h3><ul>';
        foreach($linkProps as $key) {
            print "<li>$key: " . $testApplyLink->{$key} . "</li>";
        }
    print '</ul>';

    print '<h3>Todos:</h3><ol>';

    foreach($testApplyToDos as $todo) {
        print '<li>' . $todo->Text . '</li>';
    }

    print '</ol><br><hr><br>';

    $testApplyProject = ApplyProject::getById($testApplyProject->ID);
}

function testTag() {
    print "<h1>Tags</h1>";

    $testTag = new Tag();
    $testTag->Tag = randomString();
    $testTag->Class = 'ApplyLink';
    $testTag->save();

    print "<hr>";

    return $testTag;
}

function testTagMap($testTag) {
    print "<h1>Tag Maps</h1>";

    $testTagMap = new TagMap();
    $testTagMap->TagID = $testTag->ID;
    $testTagMap->ContextClass = ApplyLink::class;

    $testApplyProject = testApplyProject();
    $testApplyLink = testApplyLink($testApplyProject);
    $testTagMap->ContextID = $testApplyLink->ID;

    $testTagMap->save();

    print "<hr>";

    return $testTagMap;
}

function testTags() {
    $testTag = testTag();
    $testTagMap = testTagMap($testTag);
}

testVendors();
testApplies();
testAssessmentType();
testGuidingQuestion();
testGradeLevel();
testStandards();
testRating();
testTags();
