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
                flex: 1,

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
            }
        ]
    }
});