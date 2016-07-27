Ext.define('SparkClassroom.column.panel.SparkpointsConfig', {
    extend: 'Ext.MessageBox',
    xtype: 'spark-sparkpointsconfig-window',

    config: {
        cls: 'spark-sparkpointsconfig-window',
        title: 'Manage Alexandra’s Sparkpoints',
        width: 640,
        buttons: [
            {
                text: 'Done',
                ui: 'action',
                listeners: {
                    element: 'element',
                    click: function() {
                        this.up('spark-sparkpointsconfig-window').destroy();
                    }
                }
            }
        ],
        items: [
            {
                xtype: 'component',
                data: [
                    {
                        code: 'SCI.G5.LS1-1',
                        L: 1,
                        C: 2,
                        Ap: 4,
                        As: 5,
                        completion: 6
                    },
                    {
                        code: 'SCI.G9-12.ESS.1-2',
                        L: 2,
                        C: 3,
                        Ap: 4,
                        As: 5,
                        completion: 6
                    },
                    {
                        code: 'SS.G9-12.6.2.C.3.d',
                        L: 3,
                        C: 4,
                        Ap: 5,
                        As: 6,
                        completion: 6
                    }
                ],
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
                                '<th class="col-legend">Overall</th>',
                                '<th>&nbsp;</th>',
                            '</tr>',
                        '</thead>',
                        '<tbody>',
                            '<tpl for=".">',
                                '<tr>',
                                    '<th>{code}</th>',
                                    '<td><input class="field-control" value="{L}"></td>',
                                    '<td><input class="field-control" value="{C}"></td>',
                                    '<td><input class="field-control" value="{Ap}"></td>',
                                    '<td><input class="field-control" value="{As}"></td>',
                                    '<td><input class="field-control" value="{completion}"></td>',
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
                data: [
                    {
                        code: 'SCI.G5.LS1-1',
                        L: 2,
                        C: 3,
                        Ap: 5,
                        As: 6,
                        completion: 6
                    },
                    {
                        code: 'SCI.G9-12.ESS.1-2',
                        L: 2,
                        C: 3,
                        Ap: 4,
                        As: 5,
                        completion: 5
                    },
                    {
                        code: 'SS.G9-12.6.2.C.3.d',
                        L: 3,
                        C: 4,
                        Ap: 5,
                        As: 7,
                        completion: 7
                    }
                ],
                tpl: [
                    '<table>',
                        '<thead>',
                            '<tr>',
                                '<th><strong>On Queue</strong></th>',
                                '<th class="col-legend">L&amp;P</th>',
                                '<th class="col-legend">C</th>',
                                '<th class="col-legend">Ap</th>',
                                '<th class="col-legend">As</th>',
                                '<th class="col-legend">Overall</th>',
                                '<th>&nbsp;</th>',
                            '</tr>',
                        '</thead>',
                        '<tbody>',
                            '<tpl for=".">',
                                '<tr>',
                                    '<th>{code}</th>',
                                    '<td><input class="field-control" value="{L}"></td>',
                                    '<td><input class="field-control" value="{C}"></td>',
                                    '<td><input class="field-control" value="{Ap}"></td>',
                                    '<td><input class="field-control" value="{As}"></td>',
                                    '<td><input class="field-control" value="{completion}"></td>',
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