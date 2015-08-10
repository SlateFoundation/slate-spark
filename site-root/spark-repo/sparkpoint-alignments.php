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

    if (in_array('standard', $include) && $sparkpointId) {
        $record['standard'] = PostgresPDO::query(
            'SELECT * FROM standards_nodes WHERE asn_id = :asn_id',
            [
                ':asn_id' => $record['asn_id']
            ]
        )->current();
    }
};


// handle route /
if (!$recordId = array_shift(Site::$pathStack)) {
    $where = [];

    if ($sparkpointId) {
        $where[] = 'sparkpoint_id = ' . $sparkpointId;
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