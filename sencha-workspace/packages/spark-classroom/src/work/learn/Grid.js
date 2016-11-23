/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.learn.Grid', {
    extend: 'Ext.grid.Grid',
    xtype: 'spark-work-learn-grid',
    requires: [
        'Jarvus.plugin.GridFlex',
        'Jarvus.plugin.GridHeight',
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
        allowToggleComplete: true,

        plugins: [
            'gridflex',
            'gridheight'
        ],
        emptyText: 'No Learns to show for this Sparkpoint.',
        grouped: true,
        titleBar: null,
        items: [{
            xtype: 'container',
            layout: {
                type: 'hbox',
                pack: 'center'
            },
            items: [{
                xtype: 'spark-work-learn-progressbanner',
                hidden: true
            }]
        }],
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