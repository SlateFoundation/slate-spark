<?php

namespace Emergence\ActiveRecord\Fields;

class Integer extends AbstractField
{
    public static function getAliases()
    {
        return ['integer', 'int', 'bigint', 'smallint', 'mediumint', 'tinyint'];
    }

    public static function unserialize($string)
    {
        return (int)$string;
    }
}
