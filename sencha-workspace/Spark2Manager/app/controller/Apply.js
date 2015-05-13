Ext.define('Spark2Manager.controller.Apply', {
    requires: [
        'Spark2Manager.store.ApplyProjects',
        'Spark2Manager.view.StandardPicker',
        'Ext.tip.QuickTipManager'
    ],

    extend: 'Ext.app.Controller',

    refs: [{
            ref:      'panel',
            selector: 's2m-apply-panel'
        }, {
           ref:      'gridpanel',
           selector: 's2m-apply-panel gridpanel'
    }],

    config: {
        control: {
            's2m-apply-panel': {
                activate: 'onPanelActivate'
            },
            's2m-apply-panel button[action=add]': {
                click: 'onAddClick'
            },
            's2m-apply-panel button[action=delete]': {
                click: 'onDeleteClick'
            },
            's2m-apply-panel button[action=align]': {
                click: 'onAlignClick'
            }
        }
    },

    stores: [
        'ApplyProjects'
    ],

    /**
     * Called when the view is created
     */
    init: function() {
        Ext.tip.QuickTipManager.init();
        Ext.tip.QuickTipManager.disable();
    },

    onPanelActivate: function() {
        this.getApplyProjectsStore().load();
    },

    onAddClick: function() {
        var me = this,
            newApplyProject = me.getApplyProjectsStore().insert(0, {}),
            plugin = me.getPanel().down('gridpanel').getPlugin('cellediting');

            plugin.startEdit(newApplyProject[0], 0);
    },

    onDeleteClick: function() {
        var me = this,
            panel = me.getGridpanel(),
            rowEditing = panel.plugins[0],
            selectionModel = panel.getSelectionModel(),
            selection = selectionModel.getSelection()[0],
            applyProjectsStore = me.getApplyProjectsStore(),
            title = selection.get('Title'),
            descriptiveText =  title || 'this apply project';

        Ext.Msg.confirm('Are you sure?', 'Are you sure that you want to delete ' + descriptiveText + '?', function(response) {
            if (response === 'yes') {
                rowEditing.cancelEdit();

                applyProjectsStore.remove(selection);

                if (applyProjectsStore.getCount() > 0) {
                    selectionModel.select(0);
                }
            }
        });
    },

    onAlignClick: function() {
        var me = this,
            panel = me.getGridpanel(),
            tagField = me.getPanel().down('s2m-apply-editor').down('tagfield'),
            record = panel.getSelection()[0],

            standards = tagField.getValue().map(function(standard) {
                return standard.standardCode ? standard : { standardCode: standard };
            }),

            standardsPicker = new Ext.create('Spark2Manager.view.StandardPicker', {
                standards: standards,
                record: record,
                listeners: {
                    'alignstandards': 'onAlignStandards',
                    scope: me
                }
            });

        standardsPicker.show();
    },

    onAlignStandards: function(record, standards) {
        var me = this,
            panel = me.getGridpanel(),
            rowEditing = panel.getPlugin('rowediting'),
            editor = rowEditing.getEditor(),
            isEditing = rowEditing.editing,
            tagField,
            record;

        if (isEditing) {
            // HACK: @themightychris what's a better way to get a reference to the tagfield in the roweditor?
            tagField = editor.getRefItems()[0];
            tagField.setValue(standards.map(function(standard) {
                return standard.standardCode;
            }));
        } else {
            record = panel.getSelection()[0];
            record.set('Standards', standards);
        }
    }
});
