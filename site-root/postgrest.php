<?php

HttpProxy::relayRequest([
    'url' => 'http://'.PostgresPDO::$host.':3000',
    'forwardHeaders' => [
        'Content-Type',
        'Prefer',
        'Range-Unit',
        'Range'
    ]
]);