Ext.define('SparkRepositoryManager.view.sparkpoints.Panel', {
    extend: 'Ext.panel.Panel',
    xtype: 'srm-sparkpoints-panel',
    requires: [
        'SparkRepositoryManager.view.sparkpoints.ContentAreasTable',
        'SparkRepositoryManager.view.sparkpoints.ContentAreaPanel',
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.Panel',
        'SparkRepositoryManager.view.sparkpoints.standards.StandardsTable'
    ],

    config: {
        selectedSparkpoint: null,
        selectedStandard: null
    },

    cls: ['no-sparkpoint-selected', 'no-standard-selected'],

    layout: 'border',

    items: [{
        region: 'south',
        split: true,
        collapsible: true,

        xtype: 'panel',
        title: 'Standards',
        height: 300,
        stateful: true,
        stateId: 'srm-sparkpoints-standardsct',
        layout: 'border',
        items: [{
            region: 'west',
            split: true,
            collapsible: true,

            xtype: 'srm-sparkpoints-documentstable',
            width: 450
        },{
            region: 'center',

            xtype: 'srm-sparkpoints-standardstable',
        }]
    },{
        region: 'west',
        split: true,

        xtype: 'srm-sparkpoints-contentareastable',
        width: 300,
        collapsible: true
    },{
        region: 'east',
        split: true,
        collapsible: true,

        xtype: 'srm-sparkpoints-sparkpointpanel',
        width: 400
    },{
        region: 'center',

        xtype: 'srm-sparkpoints-contentareapanel'
    }],

    updateSelectedSparkpoint: function(sparkpoint, oldSparkpoint) {
        var me = this;

        if (sparkpoint && !oldSparkpoint) {
            me.addCls('sparkpoint-selected').removeCls('no-sparkpoint-selected');
        }

        if (!sparkpoint) {
            me.addCls('no-sparkpoint-selected').removeCls('sparkpoint-selected');
        }

        me.fireEvent('selectedsparkpointchange', me, sparkpoint, oldSparkpoint);
    },

    updateSelectedStandard: function(standard, oldStandard) {
        var me = this;

        if (standard && !oldStandard) {
            me.addCls('standard-selected').removeCls('no-standard-selected');
        }

        if (!standard) {
            me.addCls('no-standard-selected').removeCls('standard-selected');
        }

        me.fireEvent('selectedstandardchange', me, standard, oldStandard);
    }
});