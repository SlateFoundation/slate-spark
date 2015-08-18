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
                    width:  50,
                    height: 50,
                    stroke: 'green'
                },
                dot:  {
                    radius: 6,
                    fill: 'red',
                    marginHeight: 5,
                    marginWidth: 8
                }
            }
        },
        dag:      {
            nodes: {
                '1': {
                    code: 'NJ.ART.GK-2.1.1.2.A.1',
                    teacher_title: 'Original choreography and improvisation of movement sequences begins with basic understanding of the elements of dance.',
                    dependencies_count: 1
                },
                '2': {
                    code: 'NJ.ART.GK-2.1.1.2.A.1',
                    teacher_title: 'Identify the elements of dance in planned and improvised dance sequences.',
                    dependencies_count: 1
                },
                '3': {
                    code: 'NJ.ART.GK-2.1.1.2.A.2',
                    teacher_title: 'Original movement is generated through improvisational skills and techniques.',
                    dependencies_count: 5
                },
                '4': {
                    code: 'NJ.ART.GK-2.1.1.2.A.2',
                    teacher_title: 'Use improvisation to discover.',
                    dependencies_count: 2
                },
                '5': {
                    code: 'NJ.ART.GK-2.1.1.2.A.3',
                    teacher_title: 'There are distinct differences between pedestrian movements and formal training in dance.',
                    dependencies_count: 4
                },
                '6': {
                    code: 'NJ.ART.GK-2.1.1.2.A.3',
                    teacher_title: 'There are distinct differences between pedestrian movements and formal training in dance.',
                    dependencies_count: 0
                },
                '7': {
                    code: 'NJ.ART.GK-2.1.1.2.A.3',
                    teacher_title: 'Demonstrate the difference between pantomime, pedestrian movement, abstract gesture, and dance movement.',
                    dependencies_count: 1
                },
                '8': {
                    code: 'NJ.ART.GK-2.1.1.2.A.4',
                    teacher_title: 'The coordination and isolation of different body parts is dependent on the dynamic alignment of the body while standing and moving.',
                    dependencies_count: 2
                }
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
