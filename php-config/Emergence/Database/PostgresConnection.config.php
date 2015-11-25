<?php

use Emergence\Database\PostgresConnection;

if (!PostgresConnection::hasDefaultInstance() && ($postgresConfig = Site::getConfig('postgres'))) {
    $postgresConfig['application_name'] = 'spark-repository-manager';
    PostgresConnection::setDefaultInstance($postgresConfig);
}