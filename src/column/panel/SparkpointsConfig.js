Ext.define('SparkClassroom.column.panel.SparkpointsConfig', {
    extend: 'Ext.MessageBox',
    xtype: 'spark-sparkpointsconfig-window',

    config: {
        cls: 'spark-sparkpointsconfig-window',
        title: 'Manage Alexandra’s Sparkpoints',
        width: 640,
        items: [
            {
                xtype: 'component',
                data: {
                    sparkpoints: [
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
                        }
                    ]
                },
                tpl: [
                    '<table>',
                        '<thead>',
                            '<tr>',
                                '<th>Current</th>',
                                '<th colspan="5">Expected Completion</th>',
                                '<th>&nbsp;</th>',
                            '</tr>',
                            '<tr>',
                                '<th>&nbsp;</th>',
                                '<th>L&amp;P</th>',
                                '<th>C</th>',
                                '<th>Ap</th>',
                                '<th>As</th>',
                                '<th>Day of<br>Completion</th>',
                                '<th>&nbsp;</th>',
                            '</tr>',
                        '</thead>',
                        '<tbody>',
                            '<tpl for="sparkpoints">',
                                '<tr>',
                                    '<th>{code}</th>',
                                    '<td><input class="field-control" value="{L}"></td>',
                                    '<td><input class="field-control" value="{C}"></td>',
                                    '<td><input class="field-control" value="{Ap}"></td>',
                                    '<td><input class="field-control" value="{As}"></td>',
                                    '<td><input class="field-control" value="{completion}"></td>',
                                    '<td><span class="fa fa-lg fa-times-circle-o"></span> <span class="fa fa-lg fa-bars"></span></td>',
                                '</tr>',
                            '</tpl>',
                        '</tbody>',
                    '</table>'
                ]
            },
            {
                xtype: 'button',
                text: 'Close',
                listeners: {
                    element: 'element',
                    click: function() {
                        this.up('spark-sparkpointsconfig-window').destroy();
                    }
                }
            }
        ]
    }
});