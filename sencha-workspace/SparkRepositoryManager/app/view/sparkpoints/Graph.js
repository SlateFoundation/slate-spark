/**
 * TODO:
 * - Eliminate double-bagging component in container
 */
Ext.define('SparkRepositoryManager.view.sparkpoints.Graph', {
    extend:   'Ext.container.Container',
    xtype:    'srm-sparkpoints-graph',
    requires: [
        'SparkRepositoryManager.view.sparkpoints.Dag'
    ],

    title:  'Graph',
    layout: 'fit',
    padding: 20,

    items: [{
        xtype:    'srm-sparkpoints-dag',
        // TODO: settings -> config?
        settings: {
            nodes: {
                code: {
                    marginWidth:  8,
                    marginHeight: 10
                },
                title: {
                    marginWidth:  8,
                    marginHeight: 5
                },
                rect:  {
                    height: 50,
                    width: 50,
                    stroke: '#00a1b1',
                    'stroke-width': 2
                },
                dot:  {
                    radius: 6,
                    fill: '#00737e',
                    marginHeight: 5,
                    marginWidth: 8
                }
            },
            highlightedNodes: {
                code: {
                    'font-weight': 'bold'
                },
                rect: {
                    height: 50,
                    width: 50,
                    fill: '#9ad8da',
                    stroke: '#00a1b1',
                    'stroke-width': 4
                }
            },
            edges: {
                color: '#00737e',
                arrow_height: 8
            }
        },
        dag:      {
            nodes: {
                '1': {code: 'Select a sparkpoint', teacher_title: '', dependencies_count: 0 }
            },
            edges: []
        },

        computeLayout: 'maxupordown'
        //computeLayout: 'topdown'
        //computeLayout: 'bottomup'

    }]
});
