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
            itemId: 'lessonIntro',
            cls: 'spark-panel spark-work-learn-module-intro',
            hidden: true,
            data: {
                moduleTitle: 'Module Title <small>Module Code</small>',
                moduleDescription: 'This is a description or intro to the module, written by the instructor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer accumsan libero purus, eget tincidunt nisi sagittis aliquet.'
            },
            tpl: [
                '<h3 class="spark-panel-title">{moduleTitle}</h3>',
                '<p>{moduleDescription}</p>'
            ]
        }, {
            layout: 'accordion',
            itemId: 'learnAccordian',
            items: []
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