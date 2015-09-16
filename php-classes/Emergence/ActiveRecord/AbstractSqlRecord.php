<?php

namespace Emergence\ActiveRecord;

use PDO;

abstract class AbstractSqlRecord extends AbstractActiveRecord implements SqlConnectionInterface
{
    public static $tableName;

    public static function getTableName()
    {
        return static::$tableName;
    }

    public static function getByField($field, $value)
    {
        $statement = static::getConnection()->prepare(sprintf(
            'SELECT * FROM %s WHERE %s = :value LIMIT 1',
            static::quoteIdentifier(static::getTableName()),
            static::quoteIdentifier($field)
        ));

        $statement->execute([':value' => $value]);

        try {
            return $statement->fetch(PDO::FETCH_ASSOC);
        } finally {
            $statement->closeCursor();
        }
    }
}