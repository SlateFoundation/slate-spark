/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.TitleBar', {
    extend: 'Ext.Toolbar',
    xtype: 'spark-titlebar',
    requires: [
        'Ext.field.Select',
        'SparkClassroom.work.Timer'
    ],

    config: {
        cls: 'spark-titlebar',
        items: [
            {
                width: 480,

                xtype: 'selectfield',
                itemId: 'sectionSelect',
                cls: 'spark-course-selector',

                labelCls: 'visually-hidden',
                label: 'Course Section',
                placeHolder: 'Select Class',

                store: 'Sections',
                valueField: 'Code',
                displayField: 'Title',
                autoSelect: false,

                usePicker: false,
                defaultTabletPickerConfig: {
                    cls: 'spark-course-picker',
                    width: null
                }
            },
            {
                xtype: 'spacer'
            },
            {
                xtype: 'spark-work-timer',
                hidden: !location.search.match(/\WenableK1(\W|$)/)
            }
        ]
    }
});