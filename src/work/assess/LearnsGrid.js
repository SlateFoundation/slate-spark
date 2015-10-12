/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.assess.LearnsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-work-assess-learnsgrid',
    requires: [
        'Ext.data.ChainedStore',
        'Jarvus.plugin.GridFlex',
        'Jarvus.plugin.GridHeight',
        'SparkClassroom.column.Link'
    ],

    config: {
        plugins: [
            'gridflex',
            'gridheight'
        ],
        titleBar: null,
        emptyText: 'Once some Learns have been marked completed, you’ll be able to rate them here.',

        columns:[
            {
                xtype: 'spark-link-column',
                text: 'Learn'
            },
            {
                dataIndex: 'rating',
                width: 112,
                text: 'Your Rating',
                cell: {
                    encodeHtml: false
                },
                tpl: [
                    '<select class="field-control">',
                        '<option>10</option>',
                        '<option>9</option>',
                        '<option>8</option>',
                        '<option>7</option>',
                        '<option>6</option>',
                        '<option>5</option>',
                        '<option>4</option>',
                        '<option>3</option>',
                        '<option>2</option>',
                        '<option>1</option>',
                    '</select>'
                ]
            },
            {
                dataIndex: 'comment',
                text: 'Comments',
                flex: 1,
                cell: {
                    encodeHtml: false
                },
                tpl: [
                    '<input class="field-control" style="width: 100%" value="{comment:htmlEncode}">'
                ]
            }
        ],

        store: {
            type: 'chained',
            source: 'work.Learns',
            filters: [
                {
                    filterFn: function(learn) {
                        return learn.get('completed');
                    }
                }
            ]
        }
    }
});