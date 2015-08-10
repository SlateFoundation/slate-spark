<?php

HttpProxy::relayRequest([
    'url' => 'http://127.0.0.1:3000',
    'forwardHeaders' => [
        'Content-Type',
        'Prefer',
        'Range-Unit',
        'Range'
    ]
]);