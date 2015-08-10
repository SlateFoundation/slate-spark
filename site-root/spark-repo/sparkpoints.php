<?php

global $include;

$include = !empty($_GET['include']) ? explode(',', $_GET['include']) : [];


function convertSparkpoint(&$sparkpoint) {
    global $include;

    $sparkpoint['grade_level'] = substr($sparkpoint['grade_level'], 1, -1); // TODO: grade_level shouldn't be an array
    $sparkpoint['metadata'] = json_decode($sparkpoint['metadata'], true);

    if (in_array('sparkpoints_edges', $include)) {
        $sparkpoint['sparkpoints_edges'] = iterator_to_array(
            PostgresPDO::query(
                'SELECT * FROM sparkpoints_edges WHERE :sparkpoint_id IN (target_sparkpoint_id, source_sparkpoint_id)',
                [
                    ':sparkpoint_id' => $sparkpoint['id']
                ]
            )
        );
        
        foreach ($sparkpoint['sparkpoints_edges'] AS &$edge) {
            $edge['metadata'] = json_decode($edge['metadata'], true);
        }
    }
}


// handle route /
if (!$sparkpointId = array_shift(Site::$pathStack)) {
    $where = [];

    if (!empty($_GET['content_area_id']) && ctype_digit($_GET['content_area_id'])) {
        $where[] = 'content_area_id = ' . $_GET['content_area_id'];
    }

    $query = '
        SELECT sparkpoints.*,
               count(CASE WHEN source_sparkpoint_id = sparkpoints.id THEN 1 END) AS dependencies_count,
               count(CASE WHEN target_sparkpoint_id = sparkpoints.id THEN 1 END) AS dependents_count,
               count(DISTINCT sparkpoint_standard_alignments.id) AS alignments_count
          FROM sparkpoints
     LEFT JOIN sparkpoints_edges ON rel_type = \'dependency\' AND sparkpoints.id IN (source_sparkpoint_id, target_sparkpoint_id)
     LEFT JOIN sparkpoint_standard_alignments ON sparkpoint_standard_alignments.sparkpoint_id = sparkpoints.id
    ';

    if (count($where)) {
        $query .= ' WHERE ('. implode(') AND (', $where) .')';
    }

    $query .= ' GROUP BY sparkpoints.id';
    $query .= ' ORDER BY sparkpoints.grade_level, sparkpoints.code';

    $sparkpoints = PostgresPDO::query($query);

    // convert generator to an array so we can transform some of its values before responding
    $sparkpoints = iterator_to_array($sparkpoints);
    foreach ($sparkpoints AS &$sparkpoint) {
        convertSparkpoint($sparkpoint);
    }

    JSON::respond($sparkpoints);
}


// get requested sparkpoint
$sparkpoint = PostgresPDO::query('SELECT * FROM sparkpoints WHERE id = :id', [
    ':id' => $sparkpointId
])->current();

if (!$sparkpoint) {
    JSON::error('Sparkpoint not found', 404);
}


// handle route /{documentId}
if (empty(Site::$pathStack[0])) {
    convertSparkpoint($sparkpoint);
    JSON::respond($sparkpoint);
}


// bad request
JSON::error('Unsupported request', 400);