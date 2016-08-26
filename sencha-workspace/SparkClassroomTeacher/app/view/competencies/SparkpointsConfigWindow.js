Ext.define('SparkClassroomTeacher.view.competencies.SparkpointsConfigWindow', {
    extend: 'Ext.MessageBox',
    xtype: 'spark-sparkpointsconfig-window',

    config: {
        cls: 'spark-sparkpointsconfig-window',
        width: 640,
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
                cls: 'sparkpointsconfig-table-current',
                tpl: [
                    '<table>',
                        '<thead>',
                            '<tr>',
                                '<th><strong>Current</strong></th>',
                                '<th colspan="4"><strong>Expected Completion</strong></th>',
                                '<th colspan="2">&nbsp;</th>',
                            '</tr>',
                            '<tr class="col-legend-row">',
                                '<th>&nbsp;</th>',
                                '<th class="col-legend">L&amp;P</th>',
                                '<th class="col-legend">C</th>',
                                '<th class="col-legend">Ap</th>',
                                '<th class="col-legend">As</th>',
                                '<th>&nbsp;</th>',
                            '</tr>',
                        '</thead>',
                        '<tbody>',
                            '<tpl for=".">',
                                '<tr class="sparkpoint-row" data-student-sparkpointid="{student-sparkpointid}">',
                                    '<th>{code}</th>',
                                    '<td><input class="field-control pace-field" type="number" min="0" step="1" data-phase="Learn" value="{L}"></td>',
                                    '<td><input class="field-control pace-field" type="number" min="0" step="1" data-phase="Conference" value="{C}"></td>',
                                    '<td><input class="field-control pace-field" type="number" min="0" step="1" data-phase="Apply" value="{Ap}"></td>',
                                    '<td><input class="field-control pace-field" type="number" min="0" step="1" data-phase="Assign" value="{As}"></td>',
                                    '<td>',
                                        '<button class="plain" action="row-remove">',
                                            '<span class="fa fa-lg fa-times-circle"></span>',
                                        '</button>',
                                        '&ensp;',
                                        '<button class="plain" action="row-drag">',
                                            '<span class="fa fa-lg fa-bars"></span>',
                                        '</button>',
                                    '</td>',
                                '</tr>',
                            '</tpl>',
                        '</tbody>',
                    '</table>'
                ]
            },
            {
                xtype: 'searchfield',
                margin: '18 0',
                placeHolder: 'Search for a Sparkpoint',
                width: '100%'
            },
            {
                xtype: 'component',
                cls: 'sparkpointsconfig-table-queue',
                tpl: [
                    '<table>',
                        '<thead>',
                            '<tr>',
                                '<th><strong>On Queue</strong></th>',
                                '<th class="col-legend">L&amp;P</th>',
                                '<th class="col-legend">C</th>',
                                '<th class="col-legend">Ap</th>',
                                '<th class="col-legend">As</th>',
                                '<th>&nbsp;</th>',
                            '</tr>',
                        '</thead>',
                        '<tbody>',
                            '<tpl for=".">',
                                '<tr class="sparkpoint-row" data-student-sparkpointid="{student-sparkpointid}">',
                                    '<th>{code}</th>',
                                    '<td><input class="field-control pace-field" data-phase="Learn" value="{L}"></td>',
                                    '<td><input class="field-control pace-field" data-phase="Conference" value="{C}"></td>',
                                    '<td><input class="field-control pace-field" data-phase="Apply" value="{Ap}"></td>',
                                    '<td><input class="field-control pace-field" data-phase="Assign" value="{As}"></td>',
                                    '<td><span class="fa fa-lg fa-times-circle"></span>&ensp;<span class="fa fa-lg fa-bars"></span></td>',
                                '</tr>',
                            '</tpl>',
                        '</tbody>',
                    '</table>'
                ]
            }
        ]
    }
});