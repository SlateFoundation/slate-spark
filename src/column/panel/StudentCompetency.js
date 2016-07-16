Ext.define('SparkClassroom.column.panel.StudentCompetency', {
    extend: 'SparkClassroom.column.panel.Panel',
    xtype: 'spark-studentcompetency-popover',

    config: {
        cls: 'spark-studentcompetency-popover',
        items: [
            {
                xtype: 'component',
                data: {
                    studentName: 'Christophe Alfano',
                    sparkpointCode: 'K-ESS2-2',
                    paceCls: 'is-not-started',
                    paceDesc: 'Not Started Yet',
                    phases: [
                        {
                            phase: 'Learn',
                            status: '0/6',
                            expected: 1
                        }
                    ]
                },
                tpl: [
                    '<table class="spark-studentcompetency-popover-table">',
                        '<thead>',
                            '<tr>',
                                '<th class="cycle-col">',
                                    '<div class="student-name">{studentName}</div>',
                                    '<div class="sparkpoint-code"><span class="{paceCls}">{sparkpointCode}</strong>',
                                '</th>',
                                '<th class="expected-col">Expected Day of Completion</th>',
                                '<th class="actual-col">{paceDesc}</th>',
                            '</tr>',
                        '</thead>',
                        '<tbody>',
                            '<tpl for="phases">',
                                '<tr>',
                                    '<td class="cycle-col">',
                                        '<label class="phase-checkbox">',
                                            '<input type="checkbox">',
                                            '<span class="phase-name">{phase}:</span>',
                                        '</label>',
                                        '<span class="phase-status">{status}</span>',
                                    '</td>',
                                    '<td class="expected-col">',
                                        'Day <strong class="is-on-pace">{expected}</strong>',
                                    '</td>',
                                    '<td class="actual-col">',
                                        '<tpl if="{actual}>Day <strong class="{actualCls}">{actual}</strong></tpl>',
                                    '</td>',
                                '</tr>',
                            '</tpl>',
                        '</tbody>',
                    '</table>'
                ]
            }
        ]
    }
})