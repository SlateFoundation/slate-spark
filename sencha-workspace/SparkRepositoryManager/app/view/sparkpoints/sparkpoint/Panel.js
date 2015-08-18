Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.Panel', {
    extend: 'Ext.panel.Panel',
    xtype: 'srm-sparkpoints-sparkpointpanel',
    requires: [
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.Form',
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.Dependencies',
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.Dependents',
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.Alignments',

        'Ext.tab.Panel',
        'Ext.form.FieldSet'
    ],

    title: 'Selected Sparkpoint: K.CC.1',

    disabled: true,
    scrollable: 'y',
    bodyPadding: 10,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    stateful: true,
    stateId: 'srm-sparkpoints-sparkpointpanel',

    dockedItems: [{
        dock: 'top',

        xtype: 'toolbar',
        defaults: {
            xtype: 'button',
            disabled: true
        },
        items: [{
            glyph: 0xf00d, // fa-times
            text: 'Discard changes',
            itemId: 'discard'
        },'->',{
            glyph: 0xf00c, // fa-check
            text: 'Save changes',
            itemId: 'save'
        }]
    }],

    items: [{
        xtype: 'srm-sparkpoints-sparkpointform'
    },{
        xtype: 'tabpanel',
        defaults: {
            tabConfig: {
                flex: 1
            }
        },
        items: [{
            xtype: 'srm-sparkpoints-sparkpointdependencies'
        },{
            xtype: 'srm-sparkpoints-sparkpointdependents'
        },{
            xtype: 'srm-sparkpoints-sparkpointalignments'
        }]
    },{
        xtype: 'fieldset',
        title: 'Advanced',
        collapsible: true,
        collapsed: true,
        layout: 'anchor',
        defaults: {
            anchor: '100%'
        },
        items: [{
            xtype: 'button',
            itemId: 'delete',
            text: 'Delete this sparkpoint'
        }]
    }]
});