<?php

namespace Spark2;

class GuidingQuestionsRequestHandler extends \RecordsRequestHandler
{
    public static $recordClass = GuidingQuestion::class;

    public static function handleBrowseRequest($options = [], $conditions = [], $responseID = null, $responseData = [])
    {
        return parent::handleBrowseRequest($options, $conditions, $responseID, $responseData);
    }
}
