/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.points.learn.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-assign-points-learn-grid',

    config: {
        // height: 500,
        // layout: 'fit',
        titleBar: false,
        // scrollable: false,
        // infinite: false,
        // variableHeights: false,
        store: 'assign.Learn',
        columns:[
            {
                dataIndex: 'Standards',
                text: 'Standards',
                flex: 1,
                tpl: '{[values.Standards ? values.Standards.join(", ") : ""]}',
                cell: {
                    encodeHtml: false
                }
            },
            {
                dataIndex: 'Grade',
                width: 30,
                text: 'Grade'
            },
            {

                dataIndex: 'Title',
                width: 100,
                text: 'Playist'
            },
            {
                dataIndex: 'Link',
                width: 100,
                text: 'Url'
            },
            {
                dataIndex: 'Vendor',
                width: 100,
                text: 'Vendor',
                renderer: function(v, r) {
                    return '<img src="http://placehold.it/25x25">'+v;
                },
                cell: {
                    encodeHtml: false
                }
            },
            {
                dataIndex: 'DOK',
                width: 30,
                text: 'DOK'
            },
            {
                dataIndex: 'Category',
                text: 'Category',
                width: 100
            },
            {
                dataIndex: 'SRating',
                text: 'ActiveRating',
                width: 60,
                renderer: function(v, r) {
                    return r.get('SRating') + ' ' + r.get('TRating');
                },
                cell: {
                    encodeHtml: false
                }
            },
            {
                dataIndex: 'Attachment',
                width: 100,
                text: 'Attachment'
            },
            {
                dataIndex: 'Assign',
            
                text: 'Url',
                width: 100,
                renderer: function(v, r) {
                    var number = Math.floor((Math.random() * 4) + 1);
                    return [
                        '<input type="radio" '+(number == 1 ? 'checked' : '')+'>',
                        '<input type="radio" '+(number == 2 ? 'checked' : '')+'>',
                        '<input type="radio" '+(number == 3 ? 'checked' : '')+'>',
                        '<input type="radio" '+(number == 4 ? 'checked' : '')+'>'
                    ].join('');
                },
                cell: {
                    flex: 1,
                    encodeHtml: false
                }
            },
            {
                dataIndex: 'Flag',
                width: 100,
                text: 'Issue',
                renderer: function(v, r) {
                    return '<img src="http://placehold.it/25x25">';
                },
                cell: {
                    encodeHtml: false
                }
            }
        ]
    },
    
    // createContainer: function() {
    //     debugger
    //     return Ext.factory({
    //         xtype: 'container',
    //         scrollable: {
    //             y: false,
    //             x: false
    //         }
    //     });
    // },
});