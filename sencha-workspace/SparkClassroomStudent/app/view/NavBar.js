/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.NavBar', {
    extend: 'SparkClassroom.NavBar',
    xtype: 'spark-student-navbar',
    requires: [
        'Ext.field.Text',
        'Ext.dataview.List',
        'SparkClassroom.widget.SparkpointField',
        'SparkClassroom.widget.SparkpointSuggestions'
    ],

    config: {
        selectedSparkpoint: null,
        sparkpointQuery: null,
        sparkpointsList: true,

        control: {
            'spark-sparkpointfield': {
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
                xtype: 'spark-sparkpointfield'
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
                itemId: 'standards',
                disabled: true
            },
            {
                text: 'GPS',
                itemId: 'gps',
                disabled: true
            },
            {
                text: 'Activity',
                itemId: 'activity',
                disabled: true
            },
            {
                text: 'Help',
                itemId: 'help',
                disabled: true
            }
        ]
    },

    applySparkpointsList: function(config, oldList) {
        if (config === true) {
            config = {};
        }

        return Ext.factory(config, SparkClassroom.widget.SparkpointSuggestions, oldList);
    },

    updateSparkpointsList: function(sparkpointsList) {
        sparkpointsList.on({
            scope: this,
            select: 'onSparkpointsListSelect'
        });
    },

    updateSparkpointQuery: function(query) {
        var loadConfig = {};

        if (query) {
            loadConfig.url = '/spark/api/sparkpoints/autocomplete';
            loadConfig.params = {
                q: query
            };
        }

        this.getSparkpointsList().getStore().load(loadConfig);
    },

    updateSelectedSparkpoint: function(sparkpoint, oldSparkpoint) {
        var me = this,
            sparkpointSelector = me.down('spark-sparkpointfield');

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