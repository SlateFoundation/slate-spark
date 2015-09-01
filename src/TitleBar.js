/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.TitleBar', {
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
                store: 'Sections',
                displayField: 'Title',
                valueField: 'ID',
                itemId: 'sectionSelect',
                labelCls: 'visually-hidden',
                cls: 'spark-course-selector',
                label: 'Course Section'
            }
        ]
    }
});