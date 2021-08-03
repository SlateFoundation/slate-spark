<?php

namespace Slate\Courses;

use DB;
use Slate\Courses\Section;

$tableName = Section::$tableName;
$columnName = 'SparkJuniorConfig';
$columnDefinition = "VARCHAR(255) NULL DEFAULT NULL AFTER `LocationID`";


// skip if sections table not generated yet
if (!static::tableExists($tableName)) {
    print("Skipping migration because table `$tableName` doesn't exist yet\n");
    return static::STATUS_SKIPPED;
}

// create column
print("Adding column `$tableName`.`$columnName`");
DB::nonQuery(
    "ALTER TABLE `$tableName` ADD COLUMN `$columnName` $columnDefinition"
);

return static::STATUS_EXECUTED;
