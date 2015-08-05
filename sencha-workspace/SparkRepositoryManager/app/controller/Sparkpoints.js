Ext.define('SparkRepositoryManager.controller.Sparkpoints', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.window.MessageBox'
    ],


    stores: [
        'sparkpoints.Sparkpoints',
        'sparkpoints.Dependencies',
        'sparkpoints.Dependents',
        'StandardDocuments',
        'DocumentStandards'
    ],

    config: {
        refs: {
            mainPanel: 'srm-sparkpoints-panel',

            contentAreasTable: 'srm-sparkpoints-contentareastable',
            contentAreaPanel: 'srm-sparkpoints-contentareapanel',
            sparkpointsTable: 'srm-sparkpoints-grid',
            sparkpointPanel: 'srm-sparkpoints-sparkpointpanel',
            sparkpointForm: 'srm-sparkpoints-sparkpointform',
            sparkpointDiscardButton: 'srm-sparkpoints-sparkpointform button#discard',
            sparkpointSaveButton: 'srm-sparkpoints-sparkpointform button#save',

            documentsTable: 'srm-sparkpoints-documentstable',
            standardsTable: 'srm-sparkpoints-standardstable',
        },

        control: {
            contentAreasTable: {
                boxready: 'onContentAreasTableReady',
                select: 'onContentAreaSelect'
            },
            'srm-sparkpoints-contentareastable button[action=create]': {
                click: 'onCreateContentAreaClick'
            },
            sparkpointsTable: {
                beforedeselect: 'onSparkpointBeforeDeselect',
                select: 'onSparkpointSelect'
            },
            'srm-sparkpoints-grid button[action=create]': {
                click: 'onCreateSparkpointClick'
            },
            sparkpointForm: {
                dirtychange: 'onSparkpointDirtyChange',
                validitychange: 'onSparkpointValidityChange'
            },
            sparkpointDiscardButton: {
                click: 'onSparkpointDiscardClick'
            },
            sparkpointSaveButton: {
                click: 'onSparkpointSaveClick'
            },

            documentsTable: {
                boxready: 'onDocumentsTableReady',
                select: 'onDocumentSelect'
            },
            'srm-sparkpoints-standardstable jarvus-searchfield': {
                change: 'onStandardsSearchChange'
            }
        }
    },


    onContentAreasTableReady: function(contentAreasTable) {
        var store = contentAreasTable.getStore();

        if (!store.isLoaded() || !store.isLoading()) {
            store.load();
        }
    },

    onCreateContentAreaClick: function() {
        var contentAreasTable = this.getContentAreasTable();

        contentAreasTable.getPlugin('cellediting').startEdit(
            contentAreasTable.getRootNode().appendChild({
                leaf: true,
                title: ''
            }),
            0 // first column
        );
    },

    onContentAreaSelect: function(contentAreasTable, contentArea) {
        this.getSparkpointsSparkpointsStore().filter('content_area_id', contentArea.getId());
        this.getContentAreaPanel().enable();
    },

    onCreateSparkpointClick: function() {
        var sparkpointsTable = this.getSparkpointsTable(),
            contentArea = this.getContentAreasTable().getSelection()[0],
            sparkpoint;

        sparkpoint = sparkpointsTable.getStore().insert(0, { })[0];

        // set content_area_id after instantiating record so it is treated as a dirty value
        sparkpoint.set('content_area_id', contentArea.getId());

        sparkpointsTable.setSelection(sparkpoint);
    },

    onSparkpointBeforeDeselect: function(sparkpointTable, sparkpoint) {
        if (this.getSparkpointForm().isDirty()) {
            Ext.Msg.alert('Unsaved changes', '<p>You have unsaved changes in the sparkpoint editor.</p><p>Please save or discard them before moving to another sparkpoint</p>');
            return false;
        }
    },

    onSparkpointSelect: function(sparkpointsTable, sparkpoint) {
        this.getSparkpointForm().loadRecord(sparkpoint);
        this.getSparkpointPanel().enable();
    },

    onSparkpointDirtyChange: function(sparkpointForm, dirty) {
        var valid = sparkpointForm.isValid();

        this.getSparkpointDiscardButton().setDisabled(!dirty && !sparkpointForm.getRecord().phantom);
        this.getSparkpointSaveButton().setDisabled(!valid || !dirty);
    },

    onSparkpointValidityChange: function(sparkpointForm, valid) {
        var dirty = sparkpointForm.isDirty();

        this.getSparkpointDiscardButton().setDisabled(!dirty && !sparkpointForm.getRecord().phantom);
        this.getSparkpointSaveButton().setDisabled(!valid || !dirty);
    },

    onSparkpointDiscardClick: function() {
        var me = this,
            sparkpointForm = me.getSparkpointForm(),
            sparkpoint = sparkpointForm.getRecord(),
            phantom = sparkpoint.phantom;

        sparkpointForm.reset(phantom);
        
        if (phantom) {
            me.getSparkpointsTable().getStore().remove(sparkpoint);
            me.getSparkpointPanel().disable();
        }
    },

    onSparkpointSaveClick: function() {
        this.getSparkpointForm().updateRecord();
    },

    onDocumentsTableReady: function(documentsTable) {
        var store = documentsTable.getStore();

        if (!store.isLoaded() || !store.isLoading()) {
            store.load();
        }
    },

    onDocumentSelect: function(documentsTable, document) {
        this.getDocumentStandardsStore().setRootNode(Ext.applyIf({
            expanded: true
        }, document.getData()));
    },

    onStandardsSearchChange: function(field, query) {
        var store = this.getStandardsTable().getStore(),
            queryRe = Ext.String.createRegex(query, false, false);

        Ext.suspendLayouts();

        if (query) {
            store.filter({
                id: 'search',
                filterFn: function(node) {
                    if (node.isLeaf()) {
                        return queryRe.test(node.get('asn_id'))
                               || queryRe.test(node.get('code'))
                               || queryRe.test(node.get('alt_code'))
                               || queryRe.test(node.get('title'));
                    }

                    var children = node.childNodes,
                        len = children && children.length,
                        i = 0;
                        
                    for (; i < len; i++) {
                        if (children[i].get('visible')) {
                            return true;
                        }
                    }
                }
            });
        } else {
            store.clearFilter();
        }

        Ext.resumeLayouts(true);
    }
});