<?php
	
namespace Slate;

$sparkLinks = [];

if (!empty($_SESSION['User'])) {
    $courseLinks = [];
    $sparkCourseLinks = [];

    foreach ($_SESSION['User']->CurrentCourseSections AS $Section) {
        $slateCourseLinks[] = [
            '_id' => $Section->Code,
        	'_label' => $Section->getTitle(),
			'_shortLabel' => $Section->Code,
    		'_icon' => UI\Adapters\Courses::getIcon($Section),
			'_href' => $Section->getUrl()
        ];
        
        $sparkCourseLinks[] = [
            '_id' => $Section->Code,
        	'_label' => $Section->getTitle(),
			'_shortLabel' => $Section->Code,
    		'_icon' => UI\Adapters\Courses::getIcon($Section),
			'_href' => $GLOBALS['Session']->hasAccountLevel('Teacher') ?
                "/app/SparkClassroomTeacher/build/production/index.html#$Section->Code:gps" :
                "/app/SparkClassroomStudent/build/production/index.html#$Section->Code::work"
        ];
    }

    DashboardRequestHandler::$sources[] = [
        'Temporary Workflow Courses' => $slateCourseLinks,
        'Spark Courses (beta)' => $sparkCourseLinks
    ];
}


    
//DashboardRequestHandler::$sources[] = UI\Adapters\Courses::class;
DashboardRequestHandler::$sources[] = UI\Adapters\GoogleApps::class;
DashboardRequestHandler::$sources[] = UI\Adapters\Canvas::class;
DashboardRequestHandler::$sources[] = UI\Tools::class;
DashboardRequestHandler::$sources[] = [UI\Adapters\ManageSlate::class, 'getManageLinks'];
DashboardRequestHandler::$sources[] = UI\Adapters\User::class;