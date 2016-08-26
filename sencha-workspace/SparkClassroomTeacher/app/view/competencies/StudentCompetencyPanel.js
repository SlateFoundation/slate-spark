/**
 * A floating panel that displays Student Sparkpoint phase details and provides override options for finishing phases.
 *
 * ## Events
 * loadstudentsparkpoint: fired when the popover is loading a different student from the parent grid.
 */
Ext.define('SparkClassroomTeacher.view.competencies.StudentCompetencyPanel', {
    extend: 'SparkClassroom.column.panel.Panel',
    xtype: 'spark-studentcompetency-popover',

    config: {
        cls: 'spark-studentcompetency-popover',

        modal: {
            style: 'opacity: 0'
        },

        hideOnMaskTap: true,

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
                                            '<input data-phase="{phase}" class="{[ values.finished ? "finished" : "not-finished" ]}" type="checkbox"{[ values.disabled ? " disabled" : "" ]}{[ values.checked ? " checked" : "" ]}>',
                                            '<span class="phase-name">{phase}</span>',
                                        '</label>',
                                        '<span class="phase-status">{status}</span>',
                                    '</td>',
                                    '<td class="expected-col">',
                                        '<tpl if="Ext.isEmpty(expected) == false">',
                                            'Day <strong class="{[ this.getPaceCls(values.expected, values.actual) ]}">{expected}</strong>',
                                        '<tpl else>',
                                            '&mdash;',
                                        '</tpl>',
                                    '</td>',
                                    '<td class="actual-col">',
                                        '<tpl if="Ext.isEmpty(actual) == false">',
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
                            }

                            if (expected > actual) {
                                return 'is-ahead';
                            }

                            if (expected < actual) {
                                return 'is-behind';
                            }

                            return '';
                        }
                    }
                ]
            }, {
                xtype: 'textareafield',
                cls: 'popover-describe-field',
                margin: 16
            }, {
                xtype: 'button',
                margin: 16,
                ui: 'action',
                cls: 'give-credit-button',
                text: 'Give Credit'
            }, {
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
                }, {
                    text: 'Add Next Up',
                    cls: 'add-next-up-button'
                }]
            }
        ]
    }
})