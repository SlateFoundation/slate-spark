/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.work.assess.AppliesGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-student-work-assess-appliesgrid',
    requires: [
        'Ext.data.ChainedStore',
        'Jarvus.plugin.GridFlex',
        'Jarvus.plugin.GridHeight'
    ],

    config: {
        plugins: [
            'gridflex',
            'gridheight'
        ],
        titleBar: null,
        emptyText: 'Once some applies have been marked completed, you&rsquo;ll be able to rate them here',
        columns:[
            {
                xtype: 'templatecolumn',
                cell: { encodeHtml: false },
                tpl: [
                    '<div class="spark-grid-row-title">{title}</div>',
                    '<tpl if="instructions"><div class="spark-grid-row-detail">{instructions}</div></tpl>'
                ],
                text: 'Apply'
            },
            {
                dataIndex: 'Rating',
                width: 130,
                text: 'Rating',
                cell: {
                    encodeHtml: false
                },
                tpl: [
                    '<select>',
                        '<option>5</option>',
                        '<option>4</option>',
                        '<option>3</option>',
                        '<option>2</option>',
                        '<option>1</option>',
                    '</select>'
                ]
            },
            {
                dataIndex: 'Comment',
                text: 'Comment',
                flex: 1,
                cell: {
                    encodeHtml: false
                },
                tpl: [
                    '<input style="width: 100%" value="{comment:htmlEncode}">'
                ]
            }
        ],

        store: {
            type: 'chained',
            source: 'work.Applies',
            filters: [
                {
                    filterFn: function(apply) {
                        console.log(apply);
                        return apply.get('completed');
                    }
                }
            ]
        }
    }
});