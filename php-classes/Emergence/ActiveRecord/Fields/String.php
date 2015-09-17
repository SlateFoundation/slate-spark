<?php

namespace Emergence\ActiveRecord\Fields;

class String extends AbstractField
{
    public static function getAliases()
    {
        return ['string', 'varchar'];
    }
}
