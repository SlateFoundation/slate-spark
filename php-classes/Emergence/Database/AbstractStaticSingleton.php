<?php

namespace Emergence\Database;

abstract class AbstractStaticSingleton
{
    public static function __callStatic($method, $arguments)
    {
        $connectionClass = static::$connectionClass;
        return call_user_func_array([$connectionClass::getDefaultInstance(), $method], $arguments);
    }
}