<?php

namespace Spark2;

class AssessmentType extends \ActiveRecord
{
    public static $tableName = 's2_assessment_types';

    public static $singularNoun = 'assessment-type';
    public static $pluralNoun = 'assessment-types';

    public static $collectionRoute = '/spark2/assessment-types';

    public static $fields = [
        'Name',
        'Description'
    ];
}
