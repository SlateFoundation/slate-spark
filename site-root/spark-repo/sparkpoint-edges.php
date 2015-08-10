<?php

// parse request
$include = !empty($_GET['include']) ? explode(',', $_GET['include']) : [];

if (!empty($_GET['sparkpoint_id']) && ctype_digit($_GET['sparkpoint_id'])) {
    $sparkpointId = $_GET['sparkpoint_id'];
} else {
    $sparkpointId = null;
}


// declare record converter
$convertRecord = function(&$record) use ($include, $sparkpointId) {

    $record['metadata'] = json_decode($record['metadata'], true);

    if (in_array('other_sparkpoint', $include) && $sparkpointId) {
        $record['other_sparkpoint'] = PostgresPDO::query(
            'SELECT * FROM sparkpoints WHERE id = :id',
            [
                ':id' => $record['source_sparkpoint_id'] == $sparkpointId ? $record['target_sparkpoint_id'] : $record['source_sparkpoint_id']
            ]
        )->current();
    }
};


// handle route /
if (!$recordId = array_shift(Site::$pathStack)) {
    $where = [];

    if ($sparkpointId) {
        $where[] = $sparkpointId . ' IN (source_sparkpoint_id, target_sparkpoint_id)';
    }

    $query = 'SELECT sparkpoints_edges.* FROM sparkpoints_edges';

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
}


// get requested record
$record = PostgresPDO::query('SELECT * FROM sparkpoints_edges WHERE id = :id', [
    ':id' => $recordId
])->current();

if (!$record) {
    JSON::error('Sparkpoint edge not found', 404);
}


// handle route /{edgeId}
if (empty(Site::$pathStack[0])) {
    $convertRecord($record);
    JSON::respond($record);
}


// bad request
JSON::error('Unsupported request', 400);