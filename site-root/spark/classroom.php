<?php

switch (Site::$pathStack[0]) {
    case 'teacher':
        $GLOBALS['Session']->requireAccountLevel('Staff');
        $appName = 'SparkClassroomTeacher';
        break;
    case 'student':
        $GLOBALS['Session']->requireAuthentication();

        if ($GLOBALS['Session']->Person->AccountLevel != 'Student') {
            return RequestHandler::throwUnauthorizedError('You must be logged in as a student to access Spark for Students');
        }

        $appName = 'SparkClassroomStudent';
        break;
    default:
        return RequestHandler::throwNotFoundError();
}

Sencha_RequestHandler::respond("app/$appName/ext", array(
    'App' => Sencha_App::getByName($appName)
    ,'mode' => 'production'
));