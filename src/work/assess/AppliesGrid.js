/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.assess.AppliesGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-work-assess-appliesgrid',
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
        emptyText: 'Once some Applies have been marked completed, you’ll be able to rate them here.',
        columns:[
            {
                dataIndex: 'title',
                text: 'Apply',
                flex: 1
            },
            {
                dataIndex: 'Rating',
                width: 130,
                text: 'Rating',
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
                dataIndex: 'Comment',
                text: 'Comment',
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