<?php

namespace Emergence\ActiveRecord;

use PDO;

abstract class MysqlRecord extends AbstractSqlRecord
{
/*
    private $connection;

    public function getConnection()
    {
        if (!self::$connection) {
            $config = \Site::getConfig('mysql');

            $dsn = 'mysql:dbname=' . $config['database'];

            if (!empty($config['socket'])) {
                $dsn .= ';unix_socket=' . $config['socket'];
            } else {
                $dsn .= ';host=' . $config['host'] ?: 'localhost';
                $dsn .= ';port=' . $config['port'] ?: 3306;
            }

            self::$connection = new PDO($dsn, $config['username'], $config['password']);

            self::$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }

        return self::$connection;
    }
*/
    //public function setConnection();
#    public function save()
#    {
#        print("save()\n");
#    }
}
