/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.TitleBar', {
    extend: 'Ext.Toolbar',
    xtype: 'spark-titlebar',
    requires: [
        'Ext.Title',
        'Ext.field.Select'
    ],

    config: {
        layout: {
            type: 'hbox',
            pack: 'center'
        },

        items: [
            {
                xtype: 'title',
                title: 'Matchbook Learning'
            },
            {
                xtype: 'selectfield',
                label: 'Course Section',
                labelAlign: 'top',
                options: [
                    { text: 'BIO1-009', value: 'bio1-009' },
                    { text: 'ENG1-009', value: 'eng1-009' },
                    { text: 'AMHIST-008', value: 'amhist-008' }
                ]
            },
            {
                xtype: 'component',
                html: '5 days'
            },
            {
                xtype: 'button',
                text: 'Standard Overview'
            },
            {
                xtype: 'button',
                text: 'Class GPS'
            },
            {
                xtype: 'button',
                text: 'Help'
            }
        ]
    }
});