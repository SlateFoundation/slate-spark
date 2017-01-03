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
    public static $username = 'fusebox';
    public static $password;
    public static $application_name = 'spark-fusebox';

    protected static $connection;
    public static function getConnection()
    {
        if (!static::$connection) {
            static::$connection = new PDO(
                sprintf(
                    'pgsql:host=%s;port=%u;dbname=%s;user=%s;password=%s;application_name=%s',
                    static::$host,
                    static::$port,
                    static::$database,
                    static::$username,
                    static::$password,
                    static::$application_name
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

    public static function insert($table, $values = [], $returning = null)
    {
        $query = 'INSERT INTO ' . $table;

        if ($values) {
            $query .= ' (' . implode(',', array_keys($values)) . ')';
            $query .= ' VALUES (' . implode(',', array_map([__CLASS__, 'quote'], array_values($values))) . ')';
        } else {
            $query .= ' DEFAULT VALUES';
        }

        if ($returning) {
            $query .= ' RETURNING ' . (is_array($returning) ? implode(',', $returning) : $returning);
        }

        return static::query($query)->current();
    }

    public static function update($table, $values, $where = [], $returning = null)
    {
        $query = 'UPDATE ' . $table . ' SET';

        $query .= ' (' . implode(',', array_keys($values)) . ')';
        $query .= ' = (' . implode(',', array_map([__CLASS__, 'quote'], array_values($values))) . ')';

        if ($where) {
            if (is_array($where)) {
                $conditions = [];

                foreach ($where AS $key => $value) {
                    if (is_string($key)) {
                        $conditions[] = $key . ' = ' . static::quote($value);
                    } else {
                        $conditions[] = $value;
                    }
                }

                $where = '(' . implode(') AND (', $conditions) . ')';
            }

            $query .= ' WHERE ' . $where;
        }

        if ($returning) {
            $query .= ' RETURNING ' . (is_array($returning) ? implode(',', $returning) : $returning);
        }

        return static::query($query)->current();
    }

    public static function delete($table, $where = [], $returning = null)
    {
        $query = 'DELETE FROM ' . $table;

        if ($where) {
            if (is_array($where)) {
                $conditions = [];

                foreach ($where AS $key => $value) {
                    if (is_string($key)) {
                        $conditions[] = $key . ' = ' . static::quote($value);
                    } else {
                        $conditions[] = $value;
                    }
                }

                $where = '(' . implode(') AND (', $conditions) . ')';
            }

            $query .= ' WHERE ' . $where;
        }

        if ($returning) {
            $query .= ' RETURNING ' . (is_array($returning) ? implode(',', $returning) : $returning);
        }

        return static::query($query)->current();
    }
}