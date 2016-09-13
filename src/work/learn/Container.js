Ext.define('SparkClassroom.work.learn.Container', {
    extend: 'Ext.Container',
    xtype: 'spark-work-learn',
    requires: [
        'SparkClassroom.work.learn.ProgressBanner',
        'SparkClassroom.work.learn.Grid',
        'Jarvus.layout.Accordion'
    ],

    config: {
        itemId: 'learn',

        allowToggleComplete: true,

        items: [{
            layout: 'accordion',
            items: [
                {
                    expanded: true,
                    itemId: 'sparkpointCt',

                    xtype: 'container',
                    title: '[Select a Sparkpoint]',
                    items: [
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                pack: 'center'
                            },
                            items: [
                                {
                                    xtype: 'spark-work-learn-progressbanner',
                                    hidden: true
                                }
                            ]
                        },
                        {
                            xtype: 'spark-work-learn-grid'
                        }
                    ]
                }
            ]
        }]
    },

    updateAllowToggleComplete: function(allowToggleComplete) {
        var grids = this.query('spark-work-learn-grid'),
            gridsLen = grids.length,
            i = 0;

        for (; i < gridsLen; i++) {
            grids[i].setAllowToggleComplete(allowToggleComplete);
        }
    }
});