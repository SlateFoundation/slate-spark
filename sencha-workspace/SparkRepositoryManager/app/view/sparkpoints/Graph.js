/**
 * TODO:
 * - Eliminate double-bagging component in container
 */
Ext.define('SparkRepositoryManager.view.sparkpoints.Graph', {
    extend: 'Ext.container.Container',
    xtype: 'srm-sparkpoints-graph',
    requires: [
        'Jarvus.draw.DagContainer',
        'Jarvus.draw.layout.MaxUpOrDown',
        'Jarvus.draw.layout.TopDown',
        'Jarvus.draw.layout.BottomUp'
    ],

    title: 'Graph',
    layout: 'fit',

    items: [{
        xtype: 'jarvus-draw-dagcontainer',
        // TODO: settings -> config?
        settings: {
            nodes: {
                label: {
                    marginWidth: 10,
                    marginHeight: 5
                },
                rect: {
                    width: 50,
                    height: 50,
                    stroke: 'green'
                }
            }
        },
        dag: {
            nodes : {
                // TODO: I think we just want to remove the link stuff... we can listen for events in controller
                '1':{'link':'javascript:alert(\"Link 1\")','label': 'You can custom'},
                '2':{'link':'javascript:alert(\"Link 2\")','label': 'an ExtJs drawComponent'},
                '3':{'link':'javascript:alert(\"Link 3\")','label': 'the component like',"highlighted":1},
                '4':{'link':'javascript:alert(\"Link 4\")','label': 'and every cell'},
                '5':{'link':'javascript:alert(\"Link 5\")','label': 'and animations'},
                '6':{'link':'javascript:alert(\"Link 6\")','label': 'in a lot of'},
                '7':{'link':'javascript:alert(\"Link 7\")','label': 'different ways.'},
                '8':{'link':'javascript:alert(\"Link 8\")','label': 'Do it like you want !'}
            },
            edges : [ [3,5],[2,7],[4,6],[6,8],[2,4],[5,7],[1,3],[2,8],[1,2],[7,8],[3,4] ]
        },

        computeLayout: 'maxupordown'
        //computeLayout: 'topdown'
        //computeLayout: 'bottomup'

    }]
});
