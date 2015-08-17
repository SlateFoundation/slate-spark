/**
 * TODO:
 * - Implement add UI here
 */
Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.AlignmentsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.srm-sparkpoints-sparkpointalignments',
    requires: [
        'SparkRepositoryManager.model.SparkpointAlignment'
    ],

    control: {
        '#': {
            deleteclick: 'onDeleteClick'
        },
        'combo': {
            beforequery: 'onComboBeforeQuery',
            change: 'onComboChange',
            specialKey: 'onComboSpecialKey'
        },
        'button[action=add]': {
            click: 'onAddClick'
        }
    },

    onDeleteClick: function(grid,rec) {
        var gridPanel = this.getView(),
            sparkpoint = gridPanel.getSparkpoint();

        Ext.Msg.confirm('Deleting Alignment', 'Are you sure you want to delete this alignment?', function(btn) {
            if (btn != 'yes') {
                return;
            }

            gridPanel.mask('Deleting…');
            rec.erase({
                success: function() {
                    sparkpoint.set('alignments_count', sparkpoint.get('alignments_count') - 1);
                    gridPanel.unmask();
                }
            });
        });
    },

    onComboBeforeQuery: function(queryPlan) {
        var alignmentsStore = this.getView().getStore(),
            excludeAsnIds = alignmentsStore.collect('asn_id');

        queryPlan.combo.getStore().filterBy(function(standard) {
            return excludeAsnIds.indexOf(standard.getId()) == -1;
        });
    },

    onComboChange: function(lookupCombo) {
        this.lookupReference('addButton').setDisabled(!lookupCombo.getSelectedRecord());
    },

    onComboSpecialKey: function(combo, e) {
        if (e.getKey() == e.ENTER) {
            this.addRecord();
        }
    },

    onAddClick: function() {
        this.addRecord();
    },

    addRecord: function() {
        var me = this,
            gridPanel = me.getView(),
            lookupCombo = me.lookupReference('lookupCombo'),
            sparkpoint = gridPanel.getSparkpoint(),
            standard = lookupCombo.getSelectedRecord(),
            alignment = standard && Ext.create('SparkRepositoryManager.model.SparkpointAlignment', {
                asn_id: standard.getId(),
                sparkpoint_id: sparkpoint.getId()
            });

        if (!alignment) {
            return;
        }

        gridPanel.mask('Saving…');
        alignment.save({
            success: function() {
                gridPanel.getStore().add(alignment);
                lookupCombo.clearValue();
                gridPanel.unmask();
                sparkpoint.set('alignments_count', sparkpoint.get('alignments_count') + 1);
            },
            failure: function(edge, operation) {
                var response = operation.getError().response,
                    responseData = response.getResponseHeader('Content-Type') == 'application/json' && Ext.decode(response.responseText, true),
                    message = (responseData && responseData.message) || 'An unknown failure occured, please try again later or contact your technical support';

                Ext.Msg.alert('Failed to save alignment', message.replace(/.*ERROR:\s*/, ''));
                gridPanel.unmask();
            }
        });
    }
});
