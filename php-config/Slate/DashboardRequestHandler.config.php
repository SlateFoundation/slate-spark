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


    
//DashboardRequestHandler::$sources[] = UI\Adapters\Courses::class;
DashboardRequestHandler::$sources[] = UI\Adapters\GoogleApps::class;
DashboardRequestHandler::$sources[] = UI\Adapters\Canvas::class;
DashboardRequestHandler::$sources[] = UI\Tools::class;
DashboardRequestHandler::$sources[] = [UI\Adapters\ManageSlate::class, 'getManageLinks'];
DashboardRequestHandler::$sources[] = UI\Adapters\User::class;

if ($GLOBALS['Session']->hasAccountLevel('Teacher')) {
    DashboardRequestHandler::$sources[] = [
        'Manage Slate' => [
            'Narrative Reports' => '/manage#progress/narratives'
        ]
    ];
}