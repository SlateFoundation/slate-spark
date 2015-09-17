<?php

namespace Emergence\ActiveRecord\Fields;

use Emergence\Database\SqlConnectionInterface;

interface FieldInterface
{
    public static function getSqlDefinition(SqlConnectionInterface $connection);
    public static function sqlEncode($input, SqlConnectionInterface $connection);
    public static function sqlDecode($string, SqlConnectionInterface $connection);
}
