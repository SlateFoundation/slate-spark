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

    onDeleteClick: function(grid, rec) {
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

    onComboSpecialKey: function(lookupCombo, ev) {
        if (ev.getKey() == ev.ENTER) {
            this.doCreateAlignmentFromCombo();
        }
    },

    onAddClick: function() {
        this.doCreateAlignmentFromCombo();
    },

    doCreateAlignmentFromCombo: function() {
        var lookupCombo = this.lookupReference('lookupCombo'),
            standard = lookupCombo.getSelectedRecord();

        this.getView().createAlignment(standard, function(alignment, success) {
            if (success) {
                lookupCombo.clearValue();
            }
        });
    }
});