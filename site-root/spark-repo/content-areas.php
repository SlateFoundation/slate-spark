<?php

function convertContentArea(&$contentArea) {
#    foreach (['grades'] AS $arrayColumn) {
#        if ($contentArea[$arrayColumn][0] == '{') {
#            $contentArea[$arrayColumn] = explode(',', substr($contentArea[$arrayColumn], 1, -1));
#        }
#    }
}


// handle route /
if (!count($path = array_filter(Site::$pathStack))) {
    $contentAreas = PostgresPDO::query(
        'SELECT content_areas.*,
                COUNT(sparkpoints.*) AS sparkpoints_count
           FROM content_areas
      LEFT JOIN sparkpoints
             ON sparkpoints.content_area_id = content_areas.id
          GROUP BY content_areas.id
          ORDER BY path'
    );
    
    // convert generator to an array so we can transform some of its values before responding
    $contentAreas = iterator_to_array($contentAreas);
    foreach ($contentAreas AS &$contentArea) {
        convertContentArea($contentArea);
    }
    
    JSON::respond($contentAreas);
}


// get requested document
$contentArea = PostgresPDO::query('SELECT * FROM content_areas WHERE path = :path', [
    ':path' => implode('.', $path)
])->current();

if (!$contentArea) {
    JSON::error('Content area not found', 404);
}


// handle route /{documentId}
convertContentArea($contentArea);
$contentArea['sparkpoints'] = iterator_to_array(
    PostgresPDO::query('SELECT * FROM "mock-sparkpoints" WHERE content_area_id = :content_area_id ORDER BY code, id', [
        ':content_area_id' => $contentArea['id']
    ])
);

JSON::respond($contentArea);