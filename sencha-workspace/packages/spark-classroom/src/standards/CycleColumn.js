Ext.define('SparkClassroom.standards.CycleColumn', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-standards-cyclecolumn',

    config: {
        defaultEditor: {
            xtype: 'checkboxfield'
        },

        align: 'center',
        trueText: '<i class="fa fa-check"></i>',
        falseText: '&mdash;',
        undefinedText: '?',

        cell: {
            xtype: 'booleancell',
            baseCls: 'spark-standards-cyclecell',
            encodeHtml: false,
            bind: {
                cls: '{completionCls}'
            }
        },
    }
});