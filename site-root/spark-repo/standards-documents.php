<?php

// TODO: remove the big aggregate fields and just select *?
$summaryColumns = ['id','asn_id','title','full_title','subject','jurisdiction','grades','groups_count','standards_count'];

function convertDocument(&$document) {
    foreach (['grades'] AS $arrayColumn) {
        if ($document[$arrayColumn][0] == '{') {
            $document[$arrayColumn] = explode(',', substr($document[$arrayColumn], 1, -1));
        }
    }
}


// handle route /
if (!$document_asn_id = array_shift(Site::$pathStack)) {
    $documents = PostgresPDO::query('SELECT '.implode(',', $summaryColumns).' FROM standards_documents');
    
    // convert generator to an array so we can transform some of its values before responding
    $documents = iterator_to_array($documents);
    foreach ($documents AS &$document) {
        convertDocument($document);
    }
    
    JSON::respond($documents);
}


// get requested document
$document = PostgresPDO::query('SELECT '.implode(',', $summaryColumns).' FROM standards_documents WHERE asn_id = :asn_id', [
    ':asn_id' => $document_asn_id
])->current();

if (!$document) {
    JSON::error('Document not found', 404);
}


// handle route /{documentId}
if (empty(Site::$pathStack[0])) {
    convertDocument($document);
    JSON::respond($document);
}


#// handle route /{documentId}/children
#if (Site::$pathStack[0] == 'children') {
#    JSON::respond(
#        PostgresPDO::query('SELECT children FROM standards_documents WHERE asn_id = :document_asn_id', [
#            ':document_asn_id' => $document_asn_id
#        ])->current()['children'],
#        [
#            'encode' => false // we're supplying already-encoded JSON
#        ]
#    );
#}

// handle route /{documentId}/children
if (Site::$pathStack[0] == 'children') {
    JSON::respond(
        PostgresPDO::query(
            '
                SELECT asn_id,
                       code,
                       title,
                       parent_asn_id,
                       COUNT(sparkpoint_standard_alignments) AS alignments_count
                  FROM standards
             LEFT JOIN sparkpoint_standard_alignments USING (asn_id)
                 WHERE document_asn_id = :document_asn_id
                 GROUP BY asn_id
                 ORDER BY parent_sort_order
            ',
            [
                ':document_asn_id' => $document_asn_id
            ]
        )
    );
}


// bad request
JSON::error('Unsupported request', 400);