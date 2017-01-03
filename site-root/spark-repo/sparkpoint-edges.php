<?php

// parse request
$include = !empty($_GET['include']) ? explode(',', $_GET['include']) : [];

if (!empty($_GET['sparkpoint_id']) && preg_match('/^M[\dA-F]{7}$/', $_GET['sparkpoint_id'])) {
    $sparkpointId = $_GET['sparkpoint_id'];
} else {
    $sparkpointId = null;
}


// declare record converter
$convertRecord = function(&$record) use ($include, $sparkpointId) {

    if (!empty($record['metadata'])) {
        $record['metadata'] = json_decode($record['metadata'], true);
    }

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

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {

        $edges = [];

        foreach (JSON::getRequestData() AS $requestData) {
            $set = [];

            if (!empty($requestData['rel_type'])) {
                $set['rel_type'] = $requestData['rel_type'];
            } else {
                JSON::error('rel_type required', 400);
            }

            foreach (['source_sparkpoint_id', 'target_sparkpoint_id'] AS $field) {
                if (!empty($requestData[$field]) && preg_match("/^[SM][\\dA-F]{7}$/u", $requestData[$field])) {
                    $set[$field] = $requestData[$field];
                } else {
                    JSON::error($field . ' required', 400);
                }
            }

            try {
                $edge = PostgresPDO::insert('sparkpoints_edges', $set, '*');
            } catch (\PDOException $e) {
                JSON::error($e->getMessage(), 500);
            }

            if (!$edge) {
                JSON::error('Failed to write edge', 500);
            }

            $convertRecord($edge);
            $edges[] = $edge;
        }

        JSON::respond($edges);

    } elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE') {

        $edges = [];

        foreach (JSON::getRequestData() AS $requestData) {
            if (empty($requestData['id']) || !is_int($requestData['id'])) {
                JSON::error('id required', 400);
            }

            $edges[] = PostgresPDO::delete('sparkpoints_edges', ['id' => $requestData['id']], '*');
        }

        JSON::respond($edges);

    } elseif ($_SERVER['REQUEST_METHOD'] == 'GET') {

        $where = [];

        if ($sparkpointId) {
            $where[] = "'$sparkpointId' IN (source_sparkpoint_id, target_sparkpoint_id)";
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

    } else {

        JSON::error('Only POST/GET/DELETE supported for this route', 405);

    }
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