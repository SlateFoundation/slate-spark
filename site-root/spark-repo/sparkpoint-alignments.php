<?php

// parse request
$include = !empty($_GET['include']) ? explode(',', $_GET['include']) : [];


if (!empty($_GET['sparkpoint_id']) && preg_match('/^M[\dA-F]{7}$/', $_GET['sparkpoint_id'])) {
    $sparkpointId = $_GET['sparkpoint_id'];
} else {
    $sparkpointId = null;
}


// declare record converter
$convertRecord = function(&$record) use ($include) {

    if (!empty($record['metadata'])) {
        $record['metadata'] = json_decode($record['metadata'], true);
    }

    if (in_array('standard', $include)) {
        $record['standard'] = PostgresPDO::query(
            'SELECT * FROM standards WHERE asn_id = :asn_id',
            [
                ':asn_id' => $record['asn_id']
            ]
        )->current();
    }
};


// handle route /
if (!$recordId = array_shift(Site::$pathStack)) {

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {

        $alignments = [];

        foreach (JSON::getRequestData() AS $requestData) {
            $set = [];

            if (!empty($requestData['sparkpoint_id']) && is_int($requestData['sparkpoint_id'])) {
                $set['sparkpoint_id'] = $requestData['sparkpoint_id'];
            } else {
                JSON::error('sparkpoint_id required', 400);
            }

            if (!empty($requestData['asn_id'])) {
                $set['asn_id'] = $requestData['asn_id'];
            } else {
                JSON::error('asn_id required', 400);
            }

            try {
                $alignment = PostgresPDO::insert('sparkpoint_standard_alignments', $set, '*');
            } catch (\PDOException $e) {
                JSON::error($e->getMessage(), 500);
            }

            if (!$alignment) {
                JSON::error('Failed to write edge', 500);
            }

            $convertRecord($alignment);
            $alignments[] = $alignment;
        }

        JSON::respond($alignments);

    } elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE') {

        $alignments = [];

        foreach (JSON::getRequestData() AS $requestData) {
            if (empty($requestData['id']) || !is_int($requestData['id'])) {
                JSON::error('id required', 400);
            }

            $alignments[] = PostgresPDO::delete('sparkpoint_standard_alignments', ['id' => $requestData['id']], '*');
        }

        JSON::respond($alignments);

    } elseif ($_SERVER['REQUEST_METHOD'] == 'GET') {

        $where = [];
    
        if ($sparkpointId) {
            $where[] = "sparkpoint_id = '$sparkpointId'";
        }
    
        $query = 'SELECT sparkpoint_standard_alignments.* FROM sparkpoint_standard_alignments';
    
        if (count($where)) {
            $query .= ' WHERE ('. implode(') AND (', $where) .')';
        }
    
        $records = PostgresPDO::query($query);
    
        // convert generator to an array so we can transform some of its values before responding
        $records = iterator_to_array($records);
        foreach ($records AS &$record) {
            $convertRecord($record);
        }
    
        JSON::respond($records);

    } else {

        JSON::error('Only POST/GET/DELETE supported for this route', 405);

    }
}


// get requested record
$record = PostgresPDO::query('SELECT * FROM sparkpoint_standard_alignments WHERE id = :id', [
    ':id' => $recordId
])->current();

if (!$record) {
    JSON::error('Sparkpoint alignment not found', 404);
}


// handle route /{alignmentId}
if (empty(Site::$pathStack[0])) {
    $convertRecord($record);
    JSON::respond($record);
}


// bad request
JSON::error('Unsupported request', 400);