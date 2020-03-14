Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.Alignments', {
    extend: 'Ext.grid.Panel',
    xtype: 'srm-sparkpoints-sparkpointalignments',
    requires: [
        'SparkRepositoryManager.view.sparkpoints.sparkpoint.AlignmentsController',
        'SparkRepositoryManager.field.StandardLookup',
        'SparkRepositoryManager.column.Standard'
    ],


    controller: 'srm-sparkpoints-sparkpointalignments',

    config: {
        sparkpoint: null
    },

    title: 'Alignments',

    store: 'sparkpoints.Alignments',

    rootVisible: false,
    useArrows: true,
    singleExpand: true,
    hideHeaders: true,
    viewConfig: {
        emptyText: 'None declared yet'
    },

    columns: [{
        flex: 1,

        xtype: 'srm-standardcolumn'
    }, {
        width: 24,

        xtype: 'actioncolumn',
        items: [
            {
                action: 'delete',
                iconCls: 'sparkpoint-alignment-delete glyph-danger',
                glyph: 0xf056, // fa-minus-circle
                tooltip: 'Remove this standard as aligned'
            }
        ]
    }],

    dockedItems: [{
        dock: 'bottom',

        xtype: 'toolbar',
        items: [{
            reference: 'lookupCombo',
            flex: 1,

            xtype: 'srm-field-standardlookup'
        }, {
            reference: 'addButton',

            xtype: 'button',
            action: 'add',
            disabled: true,
            text: 'Add'
        }]
    }],

    updateSparkpoint: function(sparkpoint) {
        var store = this.getStore();

        if (sparkpoint) {
            store.filter([{
                property: 'sparkpoint_id',
                value: sparkpoint.getId()
            }]);
        } else {
            store.clearFilter(true);
            store.removeAll();
        }
    },

    createAlignment: function(standard, callback, scope) {
        var me = this,
            sparkpoint = me.getSparkpoint(),
            alignment = standard && Ext.create('SparkRepositoryManager.model.SparkpointAlignment', {
                'asn_id': standard.getId(),
                'sparkpoint_id': sparkpoint.getId()
            });

        if (!alignment) {
            return;
        }

        me.mask('Saving…');
        alignment.save({
            success: function() {
                me.getStore().add(alignment);
                sparkpoint.set('alignments_count', sparkpoint.get('alignments_count') + 1);
                me.unmask();

                Ext.callback(callback, scope, [alignment, true]);
            },
            failure: function(edge, operation) {
                // TODO: test if decoding JSON here is necessary, apikit should be handling it
                var response = operation.getError().response,
                    responseData = response.getResponseHeader('Content-Type') === 'application/json' && Ext.decode(response.responseText, true),
                    message = responseData && responseData.message || 'An unknown failure occured, please try again later or contact your technical support';

                Ext.Msg.alert('Failed to save alignment', message.replace(/.*ERROR:\s*/, ''));
                me.unmask();

                Ext.callback(callback, scope, [alignment, false]);
            }
        });
    }
});