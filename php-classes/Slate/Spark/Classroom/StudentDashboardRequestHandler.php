<?php

namespace Slate\Spark\Classroom;

use Emergence\WebApps\SenchaApp;

class StudentDashboardRequestHandler extends \Emergence\Site\RequestHandler
{
    public static $userResponseModes = [
        'application/json' => 'json',
        'text/csv' => 'csv'
    ];


    public static function handleRequest()
    {
        switch ($action = static::shiftPath()) {
            case '':
            case false:
                return static::handleDashboardRequest();

            case 'bootstrap':
                return static::handleBootstrapRequest();

            default:
                return static::throwNotFoundError();
        }
    }

    public static function handleDashboardRequest()
    {
        $GLOBALS['Session']->requireAuthentication();

        return static::sendResponse(SenchaApp::load('SparkClassroomStudent')->render());
    }

    public static function handleBootstrapRequest()
    {
        $GLOBALS['Session']->requireAuthentication();

        return static::respond('bootstrap', [
            'user' => $GLOBALS['Session']->Person
        ]);
    }
}
