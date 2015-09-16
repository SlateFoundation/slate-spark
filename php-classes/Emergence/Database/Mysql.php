<?php

namespace Emergence\Database;

class Mysql extends AbstractStaticSingleton
{
    public static $connectionClass = MysqlConnection::class;
}