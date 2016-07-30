Ext.define('SparkClassroom.column.panel.StudentCompetency', {
    extend: 'SparkClassroom.column.panel.Panel',
    xtype: 'spark-studentcompetency-popover',

    config: {
        cls: 'spark-studentcompetency-popover',
        referenceHolder: true,
        items: [
            {
                xtype: 'component',
                reference: 'popoverTable',
                data: {
                    studentName: 'Christophe Alfano',
                    sparkpointCode: 'K-ESS2-2',
                    paceCls: 'is-not-started',
                    paceDesc: 'Not Started Yet',
                    phases: [
                        {
                            phase: 'Learn',
                            status: '0/6',
                            expected: 1,
                            actual: 1
                        },
                        {
                            phase: 'Conference',
                            status: 'Waiting',
                            expected: 2,
                            actual: 3
                        },
                        {
                            phase: 'Apply',
                            status: 'Not Started',
                            expected: 4,
                            actual: 3
                        },
                        {
                            phase: 'Assess',
                            status: 'Not Started',
                            expected: 5
                        }
                    ]
                },
                tpl: [
                    '<table class="spark-studentcompetency-popover-table">',
                        '<thead>',
                            '<tr>',
                                '<th class="cycle-col">',
                                    '<div class="student-name">{studentName}</div>',
                                    '<div class="sparkpoint-code">{sparkpointCode}</div>',
                                '</th>',
                                '<th class="expected-col">Expected Completion</th>',
                                '<th class="actual-col"><span class="{paceCls}">{paceDesc}</span></th>',
                            '</tr>',
                        '</thead>',
                        '<tbody>',
                            '<tpl for="phases">',
                                '<tr>',
                                    '<td class="cycle-col">',
                                        '<label class="phase-checkbox">',
                                            '<input type="checkbox">',
                                            '<span class="phase-name">{phase} </span>',
                                        '</label>',
                                        '<span class="phase-status">{status}</span>',
                                    '</td>',
                                    '<td class="expected-col">',
                                        'Day <strong class="is-on-pace">{expected}</strong>',
                                    '</td>',
                                    '<td class="actual-col">',
                                        '<tpl if="{actual}">',
                                            'Day <strong class="{[ this.getPaceCls(values.expected, values.actual) ]}">{actual}</strong>',
                                        '<tpl else>',
                                            '&mdash;',
                                        '</tpl>',
                                    '</td>',
                                '</tr>',
                            '</tpl>',
                        '</tbody>',
                    '</table>',
                    {
                        getPaceCls: function(expected, actual) {
                            if (expected == actual) {
                                return 'is-on-pace';
                            } else if (expected > actual) {
                                return 'is-ahead';
                            } else if (expected < actual) {
                                return 'is-behind';
                            } else {
                                return '';
                            }
                        }
                    }
                ]
            },
            {
                xtype: 'textareafield',
                label: 'Please explain how Christopher earned credit:',
                margin: 16
            },
            {
                xtype: 'button',
                margin: 16,
                ui: 'action',
                text: 'Give Credit'
            },
            {
                xtype: 'container',
                layout: 'hbox',
                margin: 16,
                defaults: {
                    flex: 1,
                    xtype: 'button',
                    ui: 'action'
                },
                items: [
                    {
                        text: 'Add to Queue',
                        margin: '0 16 0 0'
                    },
                    {
                        text: 'Add Next Up'
                    }
                ]
            }
        ],
        listeners: {
            initialize: {
                fn: function(){
                    var activityStore = Ext.getStore('Activities'),
                        sparkData = activityStore.findRecord('sparkpoint_id', this.getDataIndex()).getData();

                    this.lookupReference('popoverTable').updateData({

                    });
                }
            }
        }
    }
})