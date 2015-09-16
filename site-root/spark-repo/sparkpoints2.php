<?php

global $include;

$include = !empty($_GET['include']) ? explode(',', $_GET['include']) : [];


function convertSparkpoint(&$sparkpoint) {
    global $include;

    if (!empty($sparkpoint['grade_level'])) {
        $sparkpoint['grade_level'] = substr($sparkpoint['grade_level'], 1, -1); // TODO: grade_level shouldn't be an array
    }

    if (!empty($sparkpoint['metadata'])) {
        $sparkpoint['metadata'] = json_decode($sparkpoint['metadata'], true);
    }
    
    if (in_array('sparkpoints_edges_old', $include)) {
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

    if (in_array('sparkpoints_edges_old', $include)) {
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
    
    if (in_array('sparkpoints_edges_complete', $include)) {
            
        // prepare query parts
        $select = [];
        $from = [];
        $where = [];
        
        $select[] = 'e.id AS edge_id';
        $select[] = 'e.target_sparkpoint_id';
        $select[] = 'e.source_sparkpoint_id';
        $select[] = 'e.rel_type';
        $select[] = 's.*';
        
        $from[] = 'sparkpoints_edges e';
        $from[] = 'sparkpoints s';
        
        $where[] = ':sparkpoint_id IN (e.target_sparkpoint_id, e.source_sparkpoint_id)';  
        $where[] = 's.id = CASE'
            .' WHEN e.target_sparkpoint_id=:sparkpoint_id THEN e.source_sparkpoint_id'
            .' WHEN e.source_sparkpoint_id=:sparkpoint_id THEN e.target_sparkpoint_id'
            .' END';
            
        // build query
        $query = 'SELECT ' . implode(', ', $select);
        $query .= ' FROM ' . implode(', ', $from);
        $query .= ' WHERE ('. implode(') AND (', $where) .')';

        // execute query and return results
        $sparkpoints_edges = PostgresPDO::query($query,[':sparkpoint_id' => $sparkpoint['id']]);
        
        $sparkpoint['sparkpoints_edges'] = iterator_to_array($sparkpoints_edges);
            
        foreach ($sparkpoint['sparkpoints_edges'] AS &$edge) {
            $edge['metadata'] = json_decode($edge['metadata'], true);
        }
    }    
}


function getEdges($sparkpoints) {
    $edges = [];
    $result = [];
    
    foreach($sparkpoints as $sparkpoint) {
        
        $sparkpoints_edges = iterator_to_array(
            PostgresPDO::query(
                'SELECT * FROM sparkpoints_edges WHERE rel_type=\'dependency\''
                .' AND :sparkpoint_id IN (target_sparkpoint_id, source_sparkpoint_id)',
                [
                    ':sparkpoint_id' => $sparkpoint['id']
                ]
            )
        );
        
        foreach ($sparkpoints_edges AS $rec) {
            $result[$rec["id"]] = $rec;
        }
    }
    
    foreach ($result as $rec) {
        $edges[] = [$rec['target_sparkpoint_id'],$rec['source_sparkpoint_id']];
    }
    
    return $edges;
}


// handle route /
if (!$sparkpointId = array_shift(Site::$pathStack)) {

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {

        $sparkpoints = [];

        foreach (JSON::getRequestData() AS $requestData) {
            $set = [];

            foreach (['code', 'abbreviation', 'teacher_title', 'student_title'] AS $requiredField) {
                if (!empty($requestData[$requiredField])) {
                    $set[$requiredField] = $requestData[$requiredField];
                } else {
                    JSON::error($requiredField . ' required', 400);
                }
            }

            foreach (['teacher_description', 'student_description', 'editor_memo'] AS $optionalField) {
                if (!empty($requestData[$optionalField])) {
                    $set[$optionalField] = $requestData[$optionalField];
                }
            }

            if (!empty($requestData['content_area_id']) && is_int($requestData['content_area_id'])) {
                $set['content_area_id'] = $requestData['content_area_id'];
            } else {
                JSON::error('content_area_id required', 400);
            }

            $sparkpoints[] = PostgresPDO::insert('sparkpoints', $set, '*');
        }

        JSON::respond($sparkpoints);

    } elseif ($_SERVER['REQUEST_METHOD'] == 'PATCH') {

        $sparkpoints = [];

        foreach (JSON::getRequestData() AS $requestData) {
            $set = [];

            if (empty($requestData['id']) || !is_int($requestData['id'])) {
                JSON::error('id required', 400);
            }

            foreach (['code', 'abbreviation', 'teacher_title', 'student_title', 'teacher_description', 'student_description', 'editor_memo'] AS $optionalField) {
                if (!empty($requestData[$optionalField])) {
                    $set[$optionalField] = $requestData[$optionalField];
                }
            }

            if (!empty($requestData['content_area_id']) && is_int($requestData['content_area_id'])) {
                $set['content_area_id'] = $requestData['content_area_id'];
            }

            $sparkpoints[] = PostgresPDO::update('sparkpoints', $set, ['id' => $requestData['id']], '*');
        }

        JSON::respond($sparkpoints);

    } elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE') {

        $sparkpoints = [];

        foreach (JSON::getRequestData() AS $requestData) {
            if (empty($requestData['id']) || !is_int($requestData['id'])) {
                JSON::error('id required', 400);
            }

            PostgresPDO::delete('sparkpoint_standard_alignments', ['sparkpoint_id' => $requestData['id']]);
            PostgresPDO::delete('sparkpoints_edges', $requestData['id'] . ' IN (source_sparkpoint_id, target_sparkpoint_id)');

            $sparkpoints[] = PostgresPDO::delete('sparkpoints', ['id' => $requestData['id']], '*');
        }

        JSON::respond($sparkpoints);

    } elseif ($_SERVER['REQUEST_METHOD'] == 'GET') {

        // prepare query parts
        $select = [];
        $join = [];
        $where = [];
        $group = [];
        $order = ['sparkpoints.grade_level', 'sparkpoints.code'];

        if ($_SERVER['HTTP_PREFER'] == 'return=minimal') {
            $select[] = 'sparkpoints.id';
            $select[] = 'sparkpoints.code';
        } else {
            $select[] = 'sparkpoints.*';
            $select[] = 'count(CASE WHEN source_sparkpoint_id = sparkpoints.id THEN 1 END) AS dependencies_count';
            $select[] = 'count(CASE WHEN target_sparkpoint_id = sparkpoints.id THEN 1 END) AS dependents_count';
            $select[] = 'count(DISTINCT sparkpoint_standard_alignments.id) AS alignments_count';

            $join[] = 'LEFT JOIN sparkpoints_edges ON rel_type = \'dependency\' AND sparkpoints.id IN (source_sparkpoint_id, target_sparkpoint_id)';
            $join[] = 'LEFT JOIN sparkpoint_standard_alignments ON sparkpoint_standard_alignments.sparkpoint_id = sparkpoints.id';

            $group[] = 'sparkpoints.id';
        }

        if (!empty($_GET['content_area_id']) && ctype_digit($_GET['content_area_id'])) {
            $where[] = 'content_area_id = ' . $_GET['content_area_id'];
        }

        if (!empty($_GET['q'])) {
            $where[] = 'code LIKE ' . PostgresPDO::quote('%' . $_GET['q'] . '%');
        }


        // build query
        $query = 'SELECT ' . implode(', ', $select) . ' FROM sparkpoints ' . implode(' ', $join);

        if (count($where)) {
            $query .= ' WHERE ('. implode(') AND (', $where) .')';
        }

        if (count($group)) {
            $query .= ' GROUP BY ' . implode(', ', $group);
        }

        if (count($order)) {
            $query .= ' ORDER BY ' . implode(', ', $order);
        }

        $query .= ' LIMIT 20';

        // execute query and return results
        $sparkpoints = PostgresPDO::query($query);

        // convert generator to an array so we can transform some of its values before responding
        $sparkpoints = iterator_to_array($sparkpoints);
        foreach ($sparkpoints AS &$sparkpoint) {
            convertSparkpoint($sparkpoint);
        }

        $result = [
            'sparkpoints' => $sparkpoints,
            'edges' => getEdges($sparkpoints)
        ];
        //JSON::respond($sparkpoints);

        JSON::respond($result);
        

    } else {

        JSON::error('Only GET/POST/PATCH/DELETE supported for this route', 405);

    }
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