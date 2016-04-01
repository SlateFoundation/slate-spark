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
     * @param {SparkClassroomTeacher.view.assign.learns.Container} learnsCt
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
                cls: 'spark-assign-sparkpoint-ct',
                layout: {
                    type: 'hbox',
                    pack: 'end'
                },
                items: [
                    {
                        xtype: 'spark-sparkpointfield',
                        label: 'Assign for Sparkpoint',
                        labelAlign: 'left',
                        labelWidth: 152,
                        labelCls: null,
                        width: 440
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