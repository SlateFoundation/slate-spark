<?php

namespace Emergence\ActiveRecord\Fields;

interface FieldInterface
{
    public static function getAliases();
    public static function initConfig(array $config);
    public static function serialize($input);
    public static function unserialize($string);
}
