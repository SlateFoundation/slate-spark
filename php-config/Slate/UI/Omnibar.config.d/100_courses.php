<?php

namespace Slate\UI;


if (!empty($_SESSION['User'])) {
    $sparkCourseLinks = [];

    foreach ($_SESSION['User']->CurrentCourseSections AS $Section) {
        $sparkCourseLinks[] = [
            '_id' => $Section->Code,
            '_label' => $Section->getTitle(),
            '_shortLabel' => $Section->Code,
            '_icon' => Adapters\Courses::getIcon($Section),
            '_href' => $GLOBALS['Session']->hasAccountLevel('Teacher') ?
                "/spark/classroom/teacher#$Section->Code:gps" :
                "/spark/classroom/student#$Section->Code::"
        ];
    }

    Omnibar::$sources[] = [
        'My Courses' => [
            '_icon' => 'courses',
            '_children' => $sparkCourseLinks
        ]
    ];
}