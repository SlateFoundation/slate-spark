<?php

namespace Emergence\Database;

/**
 * A static singleton wrapper that can be configured to use whatever the site's primary connection should be
 */
class Primary extends AbstractStaticSingleton
{
    public static $connectionClass = MysqlConnection::class;
}