Ext.define('SparkClassroomTeacher.view.gps.Container', {
    extend: 'Ext.Container',
    xtype: 'spark-gps',
    cls: 'spark-gps',
    requires: [
        'SparkClassroom.widget.SparkpointField',
        'SparkClassroomTeacher.view.gps.StudentList',
        'SparkClassroomTeacher.view.gps.Waitlist',
        'SparkClassroomTeacher.view.gps.Priorities'
    ],

    config: {
        selectedStudent: null,
        items: [
            {
                xtype: 'toolbar',
                cls: 'spark-gps-toolbar',
                border: 0,
                items: [
                    {
                        xtype: 'button',
                        iconCls: 'fa fa-check-circle',
                        text: 'Select Multiple',
                        listeners: {
                            tap: {
                                fn: function() {
                                    Ext.getBody().down('.spark-gps').toggleCls('has-multiselect');
                                    this.toggleCls('x-button-pressed'); // enableToggle is 6.0.2+
                                }
                            }
                        }
                    },
                    {
                        xtype: 'spacer'
                    },
                    {
                        xtype: 'component',
                        cls: 'spark-gps-selection-status',
                        tpl: '{n} student<tpl if="n != 1">s</tpl> selected: ',
                        data: { n: 0 }
                    },
                    {
                        margin: '0 8',
                        xtype: 'spark-sparkpointfield',
                        placeHolder: 'Assign Sparkpoint'
                        // suggestionsList: {
                        //     store: 'SparkpointsLookup'
                        // }
                    },
                    {
                        xtype: 'selectfield',
                        placeHolder: 'Move Phase',
                        autoSelect: false,
                        options: [
                            { text: 'Learn and Practice' },
                            { text: 'Conference' },
                            { text: 'Apply' },
                            { text: 'Assess' }
                        ]
                    }
                ]
            },
            {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'start'
                },
                items: [
                    {
                        itemId: 'phasesCt',
                        xtype: 'container',
                        flex: 4,
                        cls: 'spark-gps-list-group',
                        layout: 'hbox',
                        defaults: {
                            xtype: 'spark-gps-studentlist',
                            grouped: true,
                            flex: 1
                        },
                        items: [
                            {
                                itemId: 'learnList',

                                store: 'gps.Learn',
                                title: 'Learn and Practice'
                            },
                            {
                                itemId: 'conferenceList',

                                store: 'gps.Conference',
                                title: 'Conference'
                            },
                            {
                                itemId: 'applyList',

                                store: 'gps.Apply',
                                title: 'Apply'
                            },
                            {
                                itemId: 'assessList',

                                store: 'gps.Assess',
                                title: 'Assess'
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        cls: 'spark-gps-list-group',
                        flex: 1,
                        items: [
                            {
                                itemId: 'priorityList',

                                xtype: 'spark-teacher-priorities',
                                title: 'Priorities',
                                emptyText: 'No priorities',
                                deferEmptyText: false,
                                grouped: true
                            },
                            {
                                itemId: 'helpList',

                                xtype: 'spark-waitlist',
                                title: 'Help',
                                emptyText: 'No open help&nbsp;requests',
                                deferEmptyText: false
                            }
                        ]
                    }
                ]

            }
        ]
    }
});