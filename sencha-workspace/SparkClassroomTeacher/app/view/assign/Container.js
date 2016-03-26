/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.Container', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-assign-ct',
    requires: [
        'SparkClassroomTeacher.view.assign.TabBar',
        'SparkClassroom.widget.SparkpointField'
    ],


     /**
     * @event selectedsparkpointchange
     * Fires when the user selects a sparkpoint
     * @parem {SparkClassroomTeacher.view.assign.learns.Container} learnsCt
     * @param {String} selectedSparkpoint The newly selected sparkpoint code
     * @param {String/null} oldSelectedSparkpoint The previously selected sparkpoint code
     */


    config: {
        selectedSparkpoint: null,

        autoDestroy: false,
        items: [
            {
                docked: 'top',
                xtype: 'container',
                cls: 'content-card-inline',
                margin: 0,
                items: [
                    {
                        xtype: 'spark-sparkpointfield',
                        label: 'Assign for Sparkpoint',
                        labelAlign: 'left',
                        labelWidth: 175,
                        labelCls: null
                    }
                ]
            },
            {
                docked: 'top',
                xtype: 'spark-teacher-assign-tabbar'
            }
        ]
    },

    updateSelectedSparkpoint: function(selectedSparkpoint, oldSelectedSparkpoint) {
        this.fireEvent('selectedsparkpointchange', this, selectedSparkpoint, oldSelectedSparkpoint);
    }
});