<?php

namespace Emergence\Database;

use PDO;

class PostgresConnection extends AbstractSqlConnection
{
    protected static $defaultInstance;

    public static function createInstance($pdo = null)
    {
        $pdo = $pdo ?: [];

        if (is_array($pdo)) {
            $dsn = 'pgsql:options=\'--client_encoding=UTF8\';dbname=' . $pdo['database'];

            $dsn .= ';host=' . ($pdo['host'] ?: 'localhost');
            $dsn .= ';port=' . ($pdo['port'] ?: 5432);

            $pdo = new PDO($dsn, $pdo['username'], $pdo['password']);
        }

        return parent::createInstance($pdo);
    }
}