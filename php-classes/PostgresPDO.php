<?php

/**
 * TODO:
 * - Generators are kind of limited (no total, can't re-iterate). Maybe put in the work to implement a proper iterable so we can be
 *   lazy about reading and instantiating results still but support more array-like operations
 */

class PostgresPDO
{
    public static $host = 'localhost';
    public static $port = 5432;
    public static $database = 'spark';
    public static $username = 'spark';
    public static $password = 'SparkPoint2015';

    protected static $connection;
    public static function getConnection()
    {
        if (!static::$connection) {
            static::$connection = new PDO(
                sprintf(
                    'pgsql:host=%s;port=%u;dbname=%s;user=%s;password=%s',
                    static::$host,
                    static::$port,
                    static::$database,
                    static::$username,
                    static::$password
                )
            );

            static::$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }

        return static::$connection;
    }

    public static function quote($value)
    {
        return static::getConnection()->quote($value);
    }

    public static function query($query, $params = [])
    {
        $statement = static::getConnection()->prepare($query);

        $statement->execute($params);

        try {
            while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
                yield $row;
            }
        } finally {
            $statement->closeCursor();
        }
    }
}