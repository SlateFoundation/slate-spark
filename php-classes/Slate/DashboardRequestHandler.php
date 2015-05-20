<?php

namespace Slate;

class DashboardRequestHandler extends \RequestHandler
{
    public static function handleRequest()
    {
        $GLOBALS['Session']->requireAuthentication();
        header("Location: /app/Spark2Manager/production");
        die();
    }
}