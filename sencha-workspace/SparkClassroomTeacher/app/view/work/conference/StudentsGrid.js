/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.work.conference.StudentsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-teacher-work-conference-studentsgrid',
    requires: [
        'Ext.data.ChainedStore',
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
                                        return r.get('phase') == 'conference' && r.get('conference_start_time') && !r.get('conference_group');
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
                property: 'conference_group',
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
                dataIndex: 'conference_mastery_score',
                text: 'Mastery Score',
                align: 'center',
                cell: {
                    encodeHtml: false,
                    align: 'center',
                    listeners: {
                        element: 'element',
                        delegate: '.input-mastery-score',
                        buffer: 500,
                        keypress: function(ev, t) {
                            this.getRecord().set('conference_mastery_score', t.value);
                        }
                    }
                   },
                tpl: '<input disabled class="field-control text-center input-mastery-score" placeholder="95" style="width: 100%" type="number" min="0" max="100" step="1" value="{conference_mastery_score:htmlEncode}">%'
            },
            {
                width: 64,
                dataIndex: 'conference_finish_time',
                text: 'Ready',
                align: 'center',
                cell: { encodeHtml: false, align: 'center' },
                tpl: '<tpl if="conference_finish_time"><i class="fa fa-check"></i><tpl else>&mdash;</tpl>'
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