<?php

namespace Emergence\ActiveRecord\Fields;

abstract class AbstractField implements FieldInterface
{
    public static function initConfig(array $config)
    {
        return $config;
    }

    public static function serialize($input)
    {
        return (string)$input;
    }

    public static function unserialize($string)
    {
        return $string;
    }
}
