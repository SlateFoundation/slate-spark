/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.model.SparkpointEdge', {
    extend: 'Ext.data.Model',


    fields: [
        'id',
        'target_sparkpoint_id',
        'source_sparkpoint_id',
        'rel_type',
        'metadata',
        'other_sparkpoint',
        { name: 'other_sparkpoint_code', mapping: 'other_sparkpoint.code' }
    ]
});