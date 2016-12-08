Ext.define('SparkClassroom.work.learn.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-work-learn-grid',
    requires: [
        'Jarvus.plugin.GridHeight',

        /* global SparkClassroom */
        'SparkClassroom.column.Completed',
        'SparkClassroom.column.LearnLink',
        'SparkClassroom.column.DOK',
        'SparkClassroom.column.LearnType',
        'SparkClassroom.column.Rating',
        'SparkClassroom.column.Score',
        'SparkClassroom.column.Attachment',
        'SparkClassroom.work.learn.ProgressBanner'
    ],

    config: {
        progressBanner: true,

        allowToggleComplete: true,

        plugins: [
            'gridheight'
        ],

        emptyText: 'No Learns to show for this Sparkpoint.',
        grouped: true,
        titleBar: null,

        columns: [
            {
                xtype: 'spark-completed-column',
                requireLaunched: true
            },
            {
                xtype: 'spark-learnlink-column',
                text: 'Learn',
                flex: 2
            },
            {
                xtype: 'spark-dok-column'
            },
            {
                xtype: 'spark-learntype-column'
            },
            {
                xtype: 'spark-rating-column'
            },
            {
                xtype: 'spark-score-column'
            }
            // TODO: enable when attachments are available
            // {
            //     dataIndex: 'attachments',
            //     xtype: 'spark-attachment-column'
            // }
        ],

        store: 'work.Learns'
    },

    applyProgressBanner: function(config, oldProgressBanner) {
        if (config === true) {
            config = {};
        }

        return Ext.factory(config, SparkClassroom.work.learn.ProgressBanner, oldProgressBanner);
    },

    updateProgressBanner: function(progressBanner, oldProgressBanner) {
        var container = this.container;

        if (oldProgressBanner) {
            container.remove(oldProgressBanner.getParent());
        }

        if (progressBanner) {
            container.insertFirst({
                docked: 'top',
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    pack: 'center'
                },
                items: progressBanner
            });
        }
    },

    updateAllowToggleComplete: function(allowToggleComplete) {
        var columns = this.getColumns(),
            columnsLen = columns.length,
            i = 0, column;

        for (; i < columnsLen; i++) {
            column = columns[i];
            if (column.isXType('spark-completed-column')) {
                column.setAllowToggle(allowToggleComplete);
                break;
            }
        }
    }
});