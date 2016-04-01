Ext.define('SparkClassroom.widget.SparkpointSuggestions', {
    extend: 'Ext.dataview.List',
    xtype: 'spark-sparkpointsuggestions',
    requires: [
        'SparkClassroom.store.SparkpointsLookup'
    ],


    config: {
        cls: 'spark-navbar-sparkpoint-selector-list',
        left: 0,
        width: 350,
        height: 450,

        store: {
            type: 'spark-sparkpointslookup'
        },
        grouped: true,
        itemTpl: [
            '<div class="flex-ct">',
                '<div class="sparkpoint-code flex-1">{code}</div>',

                '<tpl if="recommended">',
                    '<div class="sparkpoint-recommended"></div>',
                '</tpl>',
                '<tpl if="assess_finish_time">',
                    '<div class="sparkpoint-completed-date">{assess_finish_time:date("n/j/y")}</div>',
                '</tpl>',
                '<tpl if="student_title">',
                    '</div>', // close flex container
                    '<div class="sparkpoint-title">{student_title}', // open description container
                '</tpl>',
            '</div>' // close flex or description
        ],
        emptyText: '<p>No suggestions available.</p><p>Type a code or part of the title to find Sparkpoints.</p>'
    }
});