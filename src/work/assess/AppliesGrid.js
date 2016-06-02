/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.assess.AppliesGrid', {
    extend: 'SparkClassroom.EditableGrid',
    xtype: 'spark-work-assess-appliesgrid',
    requires: [
        'Ext.data.ChainedStore',
        'Jarvus.plugin.GridFlex',
        'Jarvus.plugin.GridHeight',
        'SparkClassroom.column.StudentRating',
        'SparkClassroom.column.StudentComment'
    ],

    config: {
        plugins: [
            'gridflex',
            'gridheight'
        ],
        titleBar: null,
        emptyText: 'Once some Applies have been marked completed, you’ll be able to rate them here.',
        columns:[
            {
                dataIndex: 'title',
                text: 'Apply',
                flex: 1
            },
            {
                xtype: 'spark-column-studentrating'
            },
            {
                xtype: 'spark-column-studentcomment'
            }
        ],

        store: {
            type: 'chained',
            source: 'work.Applies',
            filters: [
                {
                    filterFn: function(apply) {
                        return apply.get('selected');
                    }
                }
            ]
        }
    }
});