/**
 * TODO:
 * - Eliminate double-bagging component in container
 */
Ext.define('SparkRepositoryManager.view.sparkpoints.Graph', {
    extend:   'Ext.container.Container',
    xtype:    'srm-sparkpoints-graph',
    requires: [
        'Jarvus.draw.DagContainer',
        'Jarvus.draw.layout.MaxUpOrDown',
        'Jarvus.draw.layout.TopDown',
        'Jarvus.draw.layout.BottomUp'
    ],

    title:  'Graph',
    layout: 'fit',

    items: [{
        xtype:    'jarvus-draw-dagcontainer',
        // TODO: settings -> config?
        settings: {
            nodes: {
                label: {
                    marginWidth:  10,
                    marginHeight: 5
                },
                rect:  {
                    width:  50,
                    height: 50,
                    stroke: 'green'
                }
            }
        },
        dag:      {
            nodes: {
                '1': { label: 'Count to 100 by ones and by tens. K.CC.1', highlighted: 1 },
                '2': { label: 'Number permanence K.CC.4a' },
                '3': { label: 'Understand how to stop counting K.CC.4b' },
                '4': { label: 'Do you have a problem with counting? K.G.1,2' },
                '5': { label: 'Get help. Call 1-800-GAMBLING KG.G.3,4' },
                '6': { label: 'Math K.CC.2' },
                '7': { label: 'Hard Math K.CC.3'},
                '8': { label: 'Harder Math K.CC.4c' }
            },
            edges: [
                [3, 5],
                [2, 7],
                [4, 6],
                [6, 8],
                [2, 4],
                [5, 7],
                [1, 3],
                [2, 8],
                [1, 2],
                [7, 8],
                [3, 4]
            ]
        },

        computeLayout: 'maxupordown'
        //computeLayout: 'topdown'
        //computeLayout: 'bottomup'

    }]
});
