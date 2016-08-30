Ext.define('SparkClassroomTeacher.view.work.conference.StudentsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-teacher-work-conference-studentsgrid',
    requires: [
        'Ext.data.ChainedStore',
        'Ext.grid.cell.Widget',
        'Ext.field.Number',
        'Jarvus.plugin.GridFlex',
        'Jarvus.plugin.GridHeight'
    ],


    config: {
        plugins: [
            'gridflex',
            'gridheight'
        ],
        titleBar: null,
        mode: 'MULTI',
        items: [
            {
                docked: 'bottom',
                xtype: 'container',
                padding: '8 10 8 18',
                items: [
                    {
                        xtype: 'selectfield',
                        displayField: 'student_name',
                        valueField: 'user_id',
                        autoSelect: false,
                        placeHolder: 'Add a student…',
                        store: {
                            type: 'chained',
                            source: 'gps.ActiveStudents',
                            filters: [
                                {
                                    filterFn: function(r) {
                                        return (
                                            r.get('active_phase') == 'conference' &&
                                            r.get('conference_start_time') &&
                                            !r.get('conference_group_id')
                                        );
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        ],
        store: {
            type: 'chained',
            source: 'gps.ActiveStudents',
            filters: [{
                property: 'conference_group_id',
                value: 0
            }]
        },
        columns: [
            {
                flex: 1,
                dataIndex: 'student_name',
                text: 'Student'
            },
            {
                width: 80,
                dataIndex: 'conference_feedback_count',
                text: 'Feedback Left',
                align: 'center',
                cell: { encodeHtml: false, align: 'center' },
                tpl: '<tpl if="conference_feedback_count">{conference_feedback_count}<tpl else>&mdash;</tpl>'
            },
            {
                width: 80,
                dataIndex: 'conference_mastery_check_score',
                text: 'Mastery Score',
                align: 'center',
                cell: {
                    xtype: 'widgetcell',
                    widget: {
                        xtype: 'numberfield',
                        inputCls: 'input-mastery-score',
                        minValue: 0,
                        maxValue: 100,
                        maxLength: 3,
                        stepValue: 1,
                        clearIcon: false,
                        placeHolder: '95',
                        style: { textAlign: 'center' },
                        listeners: {
                            buffer: 500,
                            change: function(scoreField, score) {
                                var studentSparkpoint = this.getParent().getRecord();

                                if (Ext.isEmpty(score)) {
                                    score = null;
                                }

                                if (score !== null && (score < 0 || score > 100)) {
                                    Ext.Msg.alert('Mastery Check Score', 'Enter a number between 0 and 100 for mastery check score');
                                    return;
                                }

                                studentSparkpoint.set('conference_mastery_check_score', score);

                                if (studentSparkpoint.dirty) {
                                    studentSparkpoint.save();
                                }
                            }
                        }
                    }
                }
            },
            {
                width: 64,
                dataIndex: 'conference_completed_time',
                text: 'Ready',
                align: 'center',
                cell: { encodeHtml: false, align: 'center' },
                tpl: '<tpl if="conference_completed_time"><i class="fa fa-check"></i><tpl else>&mdash;</tpl>'
            },
            {
                width: 48,
                sortable: false,
                cell: { encodeHtml: false, align: 'center' },
                tpl: '<i class="fa fa-times-circle item-remove-btn"></i>',
            }
        ]
    },

    onItemTap: function(ev, t) {
        if (ev.getTarget('.item-remove-btn')) {
            this.fireEvent('itemdismisstap', this, Ext.get(t).component);
            return;
        }

        if (ev.getTarget('.input-mastery-score')) {
            return;
        }

        this.callParent(arguments);
    }
});