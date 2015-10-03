/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.NavBar', {
    extend: 'SparkClassroom.NavBar',
    xtype: 'spark-student-navbar',
    requires: [
        'Ext.field.Text',
        'Ext.dataview.List',
        'Slate.proxy.API',
        'SparkClassroom.model.Sparkpoint'
    ],

    config: {
        selectedSparkpoint: null,
        sparkpointQuery: null,
        sparkpointsList: {
            itemId: 'sparkpointsList',

            xtype: 'list',
            cls: 'spark-navbar-sparkpoint-selector-list',
            left: 0,
            width: 350,
            height: 450,

            grouped: true,
            itemTpl: [
                '<span cls="sparkpoint-code">{code}</span>',
                '<tpl if="recommended">',
                    '<span class="sparkpoint-recommended"></span>',
                '</tpl>',
                '<tpl if="completed_date">',
                    '<span class="sparkpoint-completed-date">{completed_date:date("m/d/y")}</span>',
                '</tpl>',
                '<tpl if="student_title">',
                    '<span class="sparkpoint-title">{student_title}</span>',
                '</tpl>'
            ],
            store: {
                type: 'store',
                groupField: 'group',
                model: 'SparkClassroom.model.Sparkpoint',
                proxy: 'slate-api'
            }
        },

        control: {
            'textfield#sparkpointSelector': {
                focus: 'onSparkpointFieldFocus',
                change: { fn: 'onSparkpointFieldChange', buffer: 250 }
            }
        },

        layout: {
            type: 'hbox',
            pack: 'center'
        },

        items: [
            {
                itemId: 'sparkpointSelector',

                xtype: 'textfield',
                cls: 'spark-navbar-sparkpoint-selector',
                label: 'Sparkpoint',
                labelCls: 'visually-hidden',
                placeHolder: 'Select Sparkpoints'
            },
            {
                xtype: 'label',
                cls: 'spark-navbar-timer',
                html: '5 days'
            },
            {
                xtype: 'component',
                flex: 1
            },
            {
                text: 'Classwork',
                itemId: 'work'
            },
            {
                text: 'Standards',
                itemId: 'standards'
            },
            {
                text: 'GPS',
                itemId: 'gps'
            },
            {
                text: 'Activity',
                itemId: 'activity'
            },
            {
                text: 'Help',
                itemId: 'help'
            }
        ]
    },

    applySparkpointsList: function(config, oldList) {
        return Ext.factory(config, Ext.dataview.List, oldList);
    },

    updateSparkpointsList: function(sparkpointsList) {
        sparkpointsList.on({
            scope: this,
            select: 'onSparkpointsListSelect'
        });
    },

    updateSparkpointQuery: function(query) {
        var requestConfig = {};

        if (query) {
            requestConfig.url = '/spark/fusebox/sparkpoints';
            requestConfig.params = {
                q: query
            };
        } else {
            requestConfig.url = '/spark/suggested-sparkpoints';
        }

        this.getSparkpointsList().getStore().load(requestConfig);
    },

    updateSelectedSparkpoint: function(sparkpoint, oldSparkpoint) {
        var me = this,
            sparkpointSelector = me.down('#sparkpointSelector');

        sparkpointSelector.setValue(sparkpoint.getId());
        sparkpointSelector.fireEvent('sparkpointselect', sparkpointSelector, sparkpoint, oldSparkpoint);
    },

    onSparkpointFieldFocus: function(sparkpointField) {
        var me = this,
            sparkpointsList = me.getSparkpointsList();

        sparkpointsList.setVisibility(false);

        if (!sparkpointsList.getParent()) {
            (me.up('{getScrollable()}') || Ext.Viewport).add(sparkpointsList);
        }

        sparkpointsList.show();
        sparkpointsList.alignTo(sparkpointField, 'tl-bl');

        me.setSparkpointQuery(sparkpointField.getValue()||'');

        sparkpointsList.setVisibility(true);
    },

    onSparkpointFieldChange: function(sparkpointField, value) {
        this.setSparkpointQuery(value);
    },

    onSparkpointsListSelect: function(sparkpointsList, sparkpoint) {
        this.setSelectedSparkpoint(sparkpoint);
        sparkpointsList.hide();
    }
});