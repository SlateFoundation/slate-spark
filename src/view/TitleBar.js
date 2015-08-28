/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.view.TitleBar', {
    extend: 'Ext.Toolbar',
    xtype: 'spark-titlebar',
    cls: 'spark-titlebar',

    requires: [
        'Ext.Title',
        'Ext.field.Select',
        'SparkClassroom.store.Sections'
    ],

    config: {
        items: [
            {
                xtype: 'selectfield',
                store: { 
                    xclass: 'SparkClassroom.store.Sections' 
                },
                displayField: 'Title',
                valueField: 'ID',
                itemId: 'testSelect',
                labelCls: 'visually-hidden',
                cls: 'spark-course-selector',
                label: 'Course Section'
            }
        ]
    }
});