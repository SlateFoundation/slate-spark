<?php

use Emergence\Database\Postgres;

function convertContentArea(&$contentArea) {
#    foreach (['grades'] AS $arrayColumn) {
#        if ($contentArea[$arrayColumn][0] == '{') {
#            $contentArea[$arrayColumn] = explode(',', substr($contentArea[$arrayColumn], 1, -1));
#        }
#    }
}


// handle route /
if (!count($path = array_filter(Site::$pathStack))) {

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {

        $contentAreas = [];

        foreach (JSON::getRequestData() AS $requestData) {
            $set = [];

            if (!empty($requestData['student_title'])) {
                $set['student_title'] = $requestData['student_title'];
            } else {
                JSON::error('student_title required', 400);
            }

            if (!empty($requestData['code'])) {
                $set['code'] = $requestData['code'];
            } else {
                $set['code'] = preg_replace('/[^A-Z.]/', '', strtoupper($requestData['student_title']));
            }

            if (!empty($requestData['abbreviation'])) {
                $set['abbreviation'] = $requestData['abbreviation'];
            } else {
                $set['abbreviation'] = $set['code'];
            }

            if (!empty($requestData['parentId']) && is_int($requestData['parentId'])) {
                $set['parent_id'] = $requestData['parentId'];
            }

            $contentAreas[] = PostgresPDO::insert('content_areas', $set, '*');
        }

        JSON::respond($contentAreas);

    } elseif ($_SERVER['REQUEST_METHOD'] == 'PATCH') {

        $contentAreas = [];

        foreach (JSON::getRequestData() AS $requestData) {
            $set = [];

            if (empty($requestData['id']) || !is_int($requestData['id'])) {
                JSON::error('id required', 400);
            }

            if (!empty($requestData['student_title'])) {
                $set['student_title'] = $requestData['student_title'];
            }

            if (!empty($requestData['code'])) {
                $set['code'] = $requestData['code'];
            }

            if (!empty($requestData['abbreviation'])) {
                $set['abbreviation'] = $requestData['abbreviation'];
            }

            if (!empty($requestData['parentId']) && is_int($requestData['parentId'])) {
                $set['parent_id'] = $requestData['parentId'];
            }

            $contentAreas[] = PostgresPDO::update('content_areas', $set, ['id' => $requestData['id']], '*');
        }

        JSON::respond($contentAreas);

    } elseif ($_SERVER['REQUEST_METHOD'] == 'GET') {

        $contentAreas = Postgres::selectAll([
            'table' => 'content_areas',
            'columns' => [
                'content_areas.*',
                'sparkpoints_count' => 'COUNT(sparkpoints.*)'
            ],
            'join' => [
                'LEFT JOIN sparkpoints ON sparkpoints.content_area_id = content_areas.id'
            ],
            'group' => ['content_areas.id'],
            'order' => 'path'
        ]);

        // convert generator to an array so we can transform some of its values before responding
        $contentAreas = iterator_to_array($contentAreas);
        foreach ($contentAreas AS &$contentArea) {
            convertContentArea($contentArea);
        }

        JSON::respond($contentAreas);

    } else {

        JSON::error('Only POST/GET supported for this route', 405);

    }
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
