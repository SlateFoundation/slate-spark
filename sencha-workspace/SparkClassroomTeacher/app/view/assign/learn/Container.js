/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.learn.Container', {
    extend: 'Ext.Container',
    xtype: 'spark-assign-learn',
    requires: [
        'SparkClassroomTeacher.view.assign.learn.Grid'
    ],

    config: {
        title: 'Learn &amp; Practice',
        items: [
            {
                xtype: 'selectfield',
                label: 'Number of Learns required for CCSS.ELA.3.CC.4.A',
                options: [
                    {text: 'Between 1-2', value: 1},
                    {text: 'Between 3-7', value: 1},
                    {text: 'Between 8-12', value: 1}
                ]
            },
            {
                xtype: 'container',
                layout: 'hbox',
                items: [
                    {
                        xtype: 'spark-assign-learn-grid',
                        width: '75%'
                    },
                    {
                        xtype: 'container',
                        width: '25%',
                        layout: 'vbox',
                        items: [
                            {
                                xtype: 'titlebar',
                                title: 'Discussion'
                            },
                            {
                                xtype: 'component',
                                tpl: [
                                    '<tpl for=".">',
                                        '{Name}<br>{Created}<br>{Description}',
                                    '</tpl>'
                                ],
                                data: [
                                    {Name: 'Al Motley Jr', Created: '12/05/15 5:47pm',  Description: 'This is a teacher\'s comment'},
                                    {Name: 'Ali Wiest', Created: '12/05/15 5:47pm',  Description: 'This is a teacher\'s comment'}
                                ]
                            },
                            {
                                xtype: 'textareafield',
                                placeHolder: 'Write a comment about this learn and press enter'
                            }
                        ]
                    }
                ]
            }
        ]
    }
});
