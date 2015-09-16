<?php

namespace Emergence\Database;

class Postgres extends AbstractStaticSingleton
{
    public static $connectionClass = PostgresConnection::class;
}