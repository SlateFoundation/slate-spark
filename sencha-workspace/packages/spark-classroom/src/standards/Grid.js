Ext.define('SparkClassroom.standards.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-standards-grid',
    requires: [
        'Jarvus.plugin.GridHeight',
        'SparkClassroom.standards.CycleColumn',
        'Ext.app.ViewModel'
    ],

    config: {
        cls: 'spark-standards-grid',
        plugins: [
            'gridheight'
        ],
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
            { text: 'Sparkpoint',   dataIndex: 'code',          width: 120 },
            { text: 'Title',        dataIndex: 'title',         flex: 1 },
            { text: 'L&amp;P',      dataIndex: 'learn',         width: 64, xtype: 'spark-standards-cyclecolumn' },
            { text: 'C',            dataIndex: 'conference',    width: 64, xtype: 'spark-standards-cyclecolumn' },
            { text: 'A',            dataIndex: 'apply',         width: 64, xtype: 'spark-standards-cyclecolumn' },
            { text: 'A',            dataIndex: 'assess',        width: 64, xtype: 'spark-standards-cyclecolumn' }
        ],

        store: {
            fields: [ 'code', 'title', 'learn', 'conference', 'apply', 'assess' ],
            data: [
                {
                    code: 'GK.CC.1',
                    title: 'Count to 100 by ones and by tens.',
                    learn: true, conference: true, apply: true, assess: true
                },
                {
                    code: 'GK.CC.2',
                    title: 'Count forward beginning from a given number within the known sequence (instead of having to begin at 1).',
                    learn: true, conference: true, apply: true, assess: true
                },
                {
                    code: 'GK.CC.3',
                    title: 'Write numbers from 0 to 20. Represent a number of objects with a written numeral 0-20 (with 0 representing a count of no objects).',
                    learn: true, conference: true, apply: true, assess: true
                },
                {
                    code: 'GK.CC.4.a',
                    title: 'When counting objects, say the number names in the standard order, pairing each object with one and only one number name and each number name with one and only one object.',
                    learn: true, conference: true, apply: false, assess: false
                },
                {
                    code: 'GK.CC.4.b',
                    title: 'Understand that the last number name said tells the number of objects counted. The number of objects is the same regardless of their arrangement or the order in which they were counted.',
                    learn: false, conference: false, apply: false, assess: false
                },
                {
                    code: 'GK.CC.4.c',
                    title: 'Understand that each successive number name refers to a quantity that is one larger.',
                    learn: false, conference: false, apply: false, assess: false
                },
                {
                    code: 'GK.CC.5',
                    title: 'Count to answer "how many?" questions about as many as 20 things arranged in a line, a rectangular array, or a circle, or as many as 10 things in a scattered configuration; given a number from 1—20, count out that many objects.',
                    learn: false, conference: false, apply: false, assess: false
                },
                {
                    code: 'GK.CC.6',
                    title: 'Identify whether the number of objects in one group is greater than, less than, or equal to the number of objects in another group, e.g., by using matching and counting strategies.',
                    learn: false, conference: false, apply: false, assess: false
                },
                {
                    code: 'GK.CC.7',
                    title: 'Compare two numbers between 1 and 10 presented as written numerals.',
                    learn: false, conference: false, apply: false, assess: false
                }
            ]
        }
    }
});