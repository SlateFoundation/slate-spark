Ext.define('SparkClassroomTeacher.app.competencies.column.panel.StudentCompetency', {
    extend: 'SparkClassroom.column.panel.Panel',
    xtype: 'spark-studentcompetency-popover',

    config: {
        cls: 'spark-studentcompetency-popover',
        items: [
            {
                xtype: 'component',
                cls: 'studentcompetency-popover-table',
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
                                            '<input class="{[ values.finished ? "finished" : "not-finished" ]}" type="checkbox"{[ values.finished ? " disabled checked" : "" ]}>',
                                            '<span class="phase-name">{phase}</span>',
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
            },{
                xtype: 'textareafield',
                cls: 'popover-describe-field',
                margin: 16
            },{
                xtype: 'button',
                margin: 16,
                ui: 'action',
                cls: 'give-credit-button',
                text: 'Give Credit'
            },{
                xtype: 'container',
                layout: 'hbox',
                margin: 16,
                defaults: {
                    flex: 1,
                    xtype: 'button',
                    ui: 'action'
                },
                items: [{
                    text: 'Add to Queue',
                    margin: '0 16 0 0',
                    cls: 'add-to-queue-button'
                },{
                    text: 'Add Next Up',
                    cls: 'add-next-up-button'
                }]
            }
        ]
    }
})