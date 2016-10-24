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
                xtype: 'container',
                items: [
                    {
                        xtype: 'checkboxfield',
                        cls: 'spark-toggle-student-multiselect',
                        name: 'spark-toggle-student-multiselect',
                        labelAlign: 'left',
                        width: 130,
                        labelWidth: 130,
                        label: 'Student Multiselect' // TODO: This is for testing student multiselect, and should be removed as it is a placeholder.
                    },
                    {
                        xtype: 'component',
                        cls: 'spark-gps-selection-status',
                        tpl: '{n} student<tpl if="n != 1">s</tpl> selected. &ensp; <a href="#">Deselect All</a>',
                        data: { n: 0 }
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        cls: 'spark-gps-selection-operations',
                        defaults: {
                            autoSelect: false,
                            margin: '0 16 0 0'
                        },
                        items: [
                            {
                                xtype: 'selectfield',
                                placeHolder: 'Select Sparkpoint',
                                options: [
                                    { text: '[Use Sparkpoint picker here]' },
                                    { text: '[Examples:]' },
                                    { text: 'MATH.G6.G.1' },
                                    { text: 'MATH.H6.H.3' },
                                    { text: 'SCIENCE.J5.K.1' }
                                ]
                            },
                            {
                                xtype: 'selectfield',
                                placeHolder: 'Move Phase',
                                options: [
                                    { text: 'Learn and Practice' },
                                    { text: 'Conference' },
                                    { text: 'Apply' },
                                    { text: 'Assess' }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                xtype: 'spark-work-timer',
                margin: '24 0 0'
            }
        ]
    }
});