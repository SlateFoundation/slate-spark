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
            // TODO wire up this example module info box

            xtype: 'component',
            cls: 'spark-panel spark-work-learn-module-intro',
            data: {
                moduleTitle: 'Module Title <small>Module Code</small>',
                moduleDescription: 'This is a description or intro to the module, written by the instructor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer accumsan libero purus, eget tincidunt nisi sagittis aliquet.'
            },
            tpl: [
                '<h3 class="spark-panel-title">{moduleTitle}</h3>',
                '<p>{moduleDescription}</p>'
            ]
        },{
            layout: 'accordion',
            items: [
                {
                    // TODO example module learn group
                    // just add another of these items for each group

                    expanded: true,

                    xtype: 'container',
                    title: 'Module Group Name <small>Module Code</small>', // TODO if no group name available, number the groups sequentially: 'Group 1', 'Group 2'
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
                },
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