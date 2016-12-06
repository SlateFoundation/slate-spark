Ext.define('SparkClassroom.work.learn.Container', {
    extend: 'Ext.Container',
    xtype: 'spark-work-learn',
    requires: [
        'SparkClassroom.work.learn.ProgressBanner',
        'SparkClassroom.work.learn.Grid',
        'Jarvus.layout.Accordion'
    ],

    config: {
        allowToggleComplete: true,

        layout: {
            type: 'accordion',
            allowMultipleExpandedItems: true
        },
        itemId: 'learnAccordian',
        defaultType: 'spark-work-learn-grid',
        defaults: {
            expanded: true
        },

        items: [{
            docked: 'top',
            xtype: 'component',
            itemId: 'lessonIntro',
            cls: 'spark-panel spark-work-learn-module-intro',
            hidden: true,
            tpl: [
                '<h3 class="spark-panel-title">{title}</h3>',
                '<p>{directions}</p>'
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