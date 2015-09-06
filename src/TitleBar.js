/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.TitleBar', {
    extend: 'Ext.Toolbar',
    xtype: 'spark-titlebar',
    requires: [
        'Ext.field.Select'
    ],

    config: {
        cls: 'spark-titlebar',
        items: [
            {
                xtype: 'selectfield',
                store: 'Sections',
                displayField: 'Title',
                autoSelect: false,
                valueField: 'ID',
                itemId: 'sectionSelect',
                labelCls: 'visually-hidden',
                cls: 'spark-course-selector',
                label: 'Course Section'
            }
        ]
    }
});