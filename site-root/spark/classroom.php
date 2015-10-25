<?php

switch (Site::$pathStack[0]) {
    case 'teacher':
        $GLOBALS['Session']->requireAccountLevel('Staff');
        $appName = 'SparkClassroomTeacher';
        break;
    case 'student':
        $appName = 'SparkClassroomStudent';
        break;
    default:
        RequestHandler::throwNotFoundError();
}

Sencha_RequestHandler::respond("app/$appName/ext", array(
    'App' => Sencha_App::getByName($appName)
    ,'mode' => 'production'
));