Ext.define('SparkClassroom.standards.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-standards-grid',
    cls: 'spark-standards-grid',
    requires: [
        'SparkClassroom.plugin.GridFlex',
        'SparkClassroom.standards.CycleColumn'
    ],

    config: {
        plugins: [
            'gridflex'
        ],
        height: 500,
        grouped: true,
        titleBar: null,
        itemConfig: {
            viewModel: {
                formulas: {
                    completionCls: function(get) {
                        // TODO get this cell's appropriate value, if possible?
                        // right now I can only figure out how to pull a named value from the entire record

                        return 'spark-standards-cycle-cell' + (get('record.learn') ? ' is-complete' : '');
                    }
                }
            }
        },
        columns: [
            { text: 'Standard', dataIndex: 'title',         flex: 1 },
            { text: 'L&amp;P',  dataIndex: 'learn',         width: 64, xtype: 'spark-standards-cyclecolumn' },
            { text: 'C',        dataIndex: 'conference',    width: 64, xtype: 'spark-standards-cyclecolumn' },
            { text: 'A',        dataIndex: 'apply',         width: 64, xtype: 'spark-standards-cyclecolumn' },
            { text: 'A',        dataIndex: 'assess',        width: 64, xtype: 'spark-standards-cyclecolumn' }
        ],

        store: {
            fields: [ 'title', 'learn', 'conference', 'apply', 'assess' ],
            data: [
                {
                    title: 'Interpret the structure of expressions',
                    learn: true, conference: true, apply: false, assess: false
                },
                {
                    title: 'Write expression in equivalent forms to solve problems',
                    learn: true, conference: true, apply: true, assess: false
                },
                {
                    title: 'Understand the relationship between zeros and factors of polynomials',
                    learn: true, conference: true, apply: true, assess: true
                },
                {
                    title: 'Use polynomial identities to solve problems',
                    learn: true, conference: true, apply: false, assess: false
                },
                {
                    title: 'Rewrite rational expressions',
                    learn: false, conference: false, apply: false, assess: false
                },
                {
                    title: 'Create equations that describe numbers or relationships',
                    learn: false, conference: false, apply: false, assess: false
                },
                {
                    title: 'Solve equations and inequalities in one variable',
                    learn: true, conference: true, apply: true, assess: true
                }
            ]
        }
    }
});