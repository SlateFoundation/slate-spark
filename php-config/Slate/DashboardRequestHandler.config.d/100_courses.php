<?php

namespace Slate;

if (!empty($_SESSION['User'])) {
    $sparkCourseLinks = [];

    foreach ($_SESSION['User']->CurrentCourseSections AS $Section) {
        $sparkCourseLinks[] = [
            '_id' => $Section->Code,
            '_label' => $Section->getTitle(),
            '_shortLabel' => $Section->Code,
            '_icon' => UI\Adapters\Courses::getIcon($Section),
            '_href' => $GLOBALS['Session']->hasAccountLevel('Teacher') ?
                "/spark/classroom/teacher#$Section->Code:gps" :
                "/spark/classroom/student#$Section->Code::"
        ];
    }

    DashboardRequestHandler::$sources[] = [
        'My Courses' => [
            '_icon' => 'courses',
            '_children' => $sparkCourseLinks
        ]
    ];
}