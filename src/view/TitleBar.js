/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.view.TitleBar', {
    extend: 'Ext.Toolbar',
    xtype: 'spark-titlebar',
    cls: 'spark-titlebar',

    requires: [
        'Ext.Title',
        'Ext.field.Select'
    ],

    config: {
        items: [
            {
                xtype: 'selectfield',
                cls: 'spark-course-selector',
                label: 'Course Section',
                labelCls: 'visually-hidden',
                options: [
                    { text: 'BIO1-009', value: 'bio1-009' },
                    { text: 'ENG1-009', value: 'eng1-009' },
                    { text: 'AMHIST-008', value: 'amhist-008' }
                ]
            }
        ]
    }
});