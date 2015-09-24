<?php

// parse request
$include = !empty($_GET['include']) ? explode(',', $_GET['include']) : [];


// declare record converter
$convertRecord = function(&$record) use ($include) {

};


// handle route /
if (!$recordId = array_shift(Site::$pathStack)) {

    if ($_SERVER['REQUEST_METHOD'] == 'GET') {

        // prepare query parts
        $select = [];
        $join = [];
        $where = [];
        $group = [];
        $order = ['standards.code'];

        if ($_SERVER['HTTP_PREFER'] == 'return=minimal') {
            $select[] = 'standards.asn_id';
            $select[] = 'standards.code';
            $select[] = 'standards.document_asn_id';
        } else {
            $select[] = 'standards.*';
            $select[] = 'COUNT(sparkpoint_standard_alignments) AS alignments_count';

            $join[] = 'LEFT JOIN sparkpoint_standard_alignments USING (asn_id)';

            $group[] = 'standards.asn_id';
        }

        if (!empty($_GET['document_asn_id'])) {
            $where[] = 'document_asn_id = ' . PostgresPDO::quote($_GET['document_asn_id']);
        }

        if (!empty($_GET['q'])) {
            $where[] = 'code LIKE ' . PostgresPDO::quote('%' . $_GET['q'] . '%');
        }


        // build query
        $query = 'SELECT ' . implode(', ', $select) . ' FROM standards ' . implode(' ', $join);

        if (count($where)) {
            $query .= ' WHERE ('. implode(') AND (', $where) .')';
        }

        if (count($group)) {
            $query .= ' GROUP BY ' . implode(', ', $group);
        }

        if (count($order)) {
            $query .= ' ORDER BY ' . implode(', ', $order);
        }


        // execute query and return results
        $records = PostgresPDO::query($query);

        // convert generator to an array so we can transform some of its values before responding
        $records = iterator_to_array($records);
        foreach ($records AS &$record) {
            $convertRecord($record);
        }

        JSON::respond($records);

    } else {

        JSON::error('Only GET supported for this route', 405);

    }
}


// get requested record
$record = PostgresPDO::query('SELECT * FROM standards WHERE asn_id = :asn_id', [
    ':asn_id' => $recordId
])->current();

if (!$record) {
    JSON::error('Record not found', 404);
}


// handle route /{asn_id}
if (empty(Site::$pathStack[0])) {
    $convertRecord($record);
    JSON::respond($record);
}


// bad request
JSON::error('Unsupported request', 400);