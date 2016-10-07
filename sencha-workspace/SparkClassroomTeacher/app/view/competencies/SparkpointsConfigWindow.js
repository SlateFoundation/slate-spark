Ext.define('SparkClassroomTeacher.view.competencies.SparkpointsConfigWindow', {
    extend: 'Ext.MessageBox',
    xtype: 'spark-sparkpointsconfig-window',

    config: {
        cls: 'spark-sparkpointsconfig-window',
        width: 640,
        zIndex: 998, // Puts it below Ext.Msg.alert and other dialogs
        hideOnMaskTap: true,
        style: 'overflow-y:auto; overflow-x:hidden;', // workaround - scrollable config not working

        buttons: [
            {
                text: 'Done',
                ui: 'action',
                cls: 'sparkpointsconfig-done-button'
            }
        ],

        items: [
            {
                xtype: 'component',
                cls: 'sparkpointsconfig-table current',
                tpl: [
                    '<table>',
                        '<thead>',
                            '<tr>',
                                '<th class="remove-col">Standard</th>',
                                '<td class="sparkpoint-col">&nbsp;</td>',
                                '<th colspan="4" class="col-legend">Expected Completion</th>',
                                '<th>&nbsp;</th>',
                            '</tr>',
                            '<tr class="group-header">',
                                '<th class="remove-col remove-cell"><span class="group-title">Current</span></th>',
                                '<th>&nbsp;</th>',
                                '<th>L&amp;P</th>',
                                '<th>C</th>',
                                '<th>Ap</th>',
                                '<th>As</th>',
                                '<th>&nbsp;</th>',
                            '</tr>',
                        '</thead>',
                        '<tbody>',
                            '<tpl for=".">',
                                '<tr class="sparkpoint-row" data-student-sparkpointid="{student_sparkpointid}">',
                                    '<td class="remove-cell">',
                                    '</td>',
                                    '<th>{sparkpoint}</th>',
                                    '<tpl for="phases">',
                                        '<td class="{[ values.finished || values.checked ? "phase-cell is-credit-given" : "phase-cell" ]}">',
                                            '<input class="completion-checkbox override-field {[ values.finished ? "finished" : "not-finished" ]}" type="checkbox" disabled {[ values.checked ? "checked" : "" ]} data-phase="{phase}">',
                                            '<input class="expected-completion field-control" type="number" min="1" step="1" data-phase="{phase}" value="{expected}">',
                                            '<div class="actual-completion {[ this.getPaceCls(values) ]}">{[ Ext.isEmpty(values.actual) ? "" : "Day " + values.actual ]}</div>',
                                        '</td>',
                                    '</tpl>',
                                    '<td>&nbsp;</td>',
                                '</tr>',
                            '</tpl>',
                        '</tbody>',
                    '</table>',
                    {
                        getPaceCls: function (data) {
                            var expected = data.expected,
                                actual = data.actual,
                                completed = data.checked;

                            if (!completed) {
                                return 'is-incomplete';
                            }

                            if (expected === actual) {
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
            },
            {
                xtype: 'component',
                cls: 'sparkpointsconfig-table active',
                tpl: [
                    '<table>',
                        '<thead>',
                            '<tr class="group-header">',
                                '<th class="remove-col remove-cell"><span class="group-title">Active</span></th>',
                                '<td class="sparkpoint-col">&nbsp;</td>',
                                '<td colspan="5">&nbsp;</td>',
                            '</tr>',
                        '</thead>',
                        '<tbody>',
                            '<tpl for=".">',
                                '<tr class="sparkpoint-row" data-student-sparkpointid="{student_sparkpointid}">',
                                    '<td class="remove-cell">',
                                        '<button class="plain" action="row-remove">',
                                            '<span class="fa fa-times-circle"></span>',
                                        '</button>',
                                    '</td>',
                                    '<th>{sparkpoint}</th>',
                                    '<tpl for="phases">',
                                        '<td class="{[ values.finished || values.checked ? "phase-cell is-credit-given" : "phase-cell" ]}">',
                                            '<input class="completion-checkbox override-field {[ values.finished ? "finished" : "not-finished" ]}" type="checkbox" disabled {[ values.checked ? "checked" : "" ]} data-phase="{phase}">',
                                            '<input class="expected-completion field-control" type="number" min="1" step="1" data-phase="{phase}" value="{expected}">',
                                            '<div class="actual-completion {[ this.getPaceCls(values) ]}">{[ Ext.isEmpty(values.actual) ? "" : "Day " + values.actual ]}</div>',
                                        '</td>',
                                    '</tpl>',
                                    '<td class="reorder-cell">',
                                        '<div class="row-reorder-buttons">',
                                            '<button class="plain" action="row-reorder-up" {[ this.checkDisabled("up", xindex, xcount) ]}>',
                                                '<i class="fa fa-arrow-up" title="Move Up"></i>',
                                            '</button>',
                                            '<button class="plain" action="row-reorder-down" {[ this.checkDisabled("down", xindex, xcount) ]}>',
                                                '<i class="fa fa-arrow-down" title="Move Down"></i>',
                                            '</button>',
                                        '</div>',
                                    '</td>',
                                '</tr>',
                            '</tpl>',
                        '</tbody>',
                    '</table>',
                    {
                        checkDisabled: function (direction, index, count) {
                            if (direction === 'up' && index === 1) {
                                return 'disabled';
                            } else if (direction === 'down' && index === count) {
                                return 'disabled';
                            }

                            return '';
                        },

                        getPaceCls: function (data) {
                            var expected = data.expected,
                                actual = data.actual,
                                completed = data.checked;

                            if (!completed) {
                                return 'is-incomplete';
                            }

                            if (expected === actual) {
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
            },
            {
                xtype: 'spark-sparkpointfield',
                padding: '8 24',
                placeHolder: 'Search for a Sparkpoint',
                width: '100%'
            },
            {
                xtype: 'component',
                cls: 'sparkpointsconfig-table queue',
                tpl: [
                    '<table>',
                    '<thead>',
                        '<tr class="group-header">',
                            '<th class="remove-col remove-cell"><span class="group-title">On Queue</span></th>',
                            '<td class="sparkpoint-col">&nbsp;</td>',
                            '<td colspan="5">&nbsp;</td>',
                        '</tr>',
                    '</thead>',
                    '<tbody>',
                        '<tpl for=".">',
                            '<tr class="sparkpoint-row" data-student-sparkpointid="{student_sparkpointid}">',
                                '<td class="remove-cell">',
                                    '<button class="plain" action="row-remove">',
                                        '<span class="fa fa-times-circle"></span>',
                                    '</button>',
                                '</td>',
                                '<th>{sparkpoint}</th>',
                                '<tpl for="phases">',
                                    '<td class="phase-cell">',
                                        '<input class="expected-completion field-control" type="number" min="1" step="1" data-phase="{phase}" value="{expected}">',
                                    '</td>',
                                '</tpl>',
                                '<td class="reorder-cell">',
                                    '<div class="row-reorder-buttons">',
                                        '<button class="plain" action="row-reorder-up" {[ this.checkDisabled("up", xindex, xcount) ]}>',
                                            '<i class="fa fa-arrow-up" title="Move Up"></i>',
                                        '</button>',
                                        '<button class="plain" action="row-reorder-down" {[ this.checkDisabled("down", xindex, xcount) ]}>',
                                            '<i class="fa fa-arrow-down" title="Move Down"></i>',
                                        '</button>',
                                    '</div>',
                                '</td>',
                            '</tr>',
                        '</tpl>',
                    '</tbody>',
                    '</table>',
                    {
                        checkDisabled: function(direction, index, count) {
                            if (direction === 'up' && index === 1) {
                                return 'disabled';
                            } else if (direction === 'down' && index === count) {
                                return 'disabled';
                            }

                            return '';
                        },

                        getPaceCls: function(data) {
                            var expected = data.expected,
                                actual = data.actual,
                                completed = data.checked;

                            if (!completed) {
                                return 'is-incomplete';
                            }

                            if (expected === actual) {
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
            }
        ]
    }
});