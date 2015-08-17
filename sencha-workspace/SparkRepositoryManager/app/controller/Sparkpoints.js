Ext.define('SparkRepositoryManager.controller.Sparkpoints', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.window.MessageBox'
    ],


    stores: [
        'sparkpoints.ContentAreas',
        'sparkpoints.Sparkpoints',
        'sparkpoints.Edges',
        'sparkpoints.Alignments',
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
            sparkpointDiscardButton: 'srm-sparkpoints-sparkpointpanel button#discard',
            sparkpointSaveButton: 'srm-sparkpoints-sparkpointpanel button#save',
            sparkpointForm: 'srm-sparkpoints-sparkpointform',
            sparkpointAbbreviationField: 'srm-sparkpoints-sparkpointform field[name=abbreviation]',
            sparkpointCodeField: 'srm-sparkpoints-sparkpointform field[name=code]',
            sparkpointTeacherTitleField: 'srm-sparkpoints-sparkpointform field[name=teacher_title]',
            sparkpointStudentTitleField: 'srm-sparkpoints-sparkpointform field[name=student_title]',
            sparkpointRelationshipTabPanel: 'srm-sparkpoints-sparkpointpanel tabpanel',
            dependenciesTable: 'srm-sparkpoints-sparkpointdependencies',
            dependentsTable: 'srm-sparkpoints-sparkpointdependents',
            alignmentsTable: 'srm-sparkpoints-sparkpointalignments',

            documentsTable: 'srm-sparkpoints-documentstable',
            standardsTable: 'srm-sparkpoints-standardstable',
        },

        listen: {
            store: {
                '#sparkpoints.Sparkpoints': {
                    write: 'onSparkpointWrite',
                    update: 'onSparkpointUpdate'
                },
                '#sparkpoints.Edges': {
                    load: 'onSparkpointEdgesLoad'
                }
            }
        },

        control: {
            mainPanel: {
                selectedcontentareachange: 'onSelectedContentAreaChange',
                selectedsparkpointchange: 'onSelectedSparkpointChange',
                selecteddocumentchange: 'onSelectedDocumentChange',
                selectedstandardchange: 'onSelectedStandardChange'
            },
            contentAreasTable: {
                beforeselect: 'onContentAreaBeforeSelect',
                selectionchange: 'onContentAreaSelectionChange',
                canceledit: 'onContentAreaCancelEdit'
            },
            'srm-sparkpoints-contentareastable button[action=create]': {
                click: 'onCreateContentAreaClick'
            },
            sparkpointsTable: {
                beforedeselect: 'onSparkpointTableBeforeDeselect',
                selectionchange: 'onSparkpointTableSelectionChange'
            },
            'srm-sparkpoints-grid button[action=create]': {
                click: 'onCreateSparkpointClick'
            },
            sparkpointForm: {
                dirtychange: 'onSparkpointDirtyChange',
                validitychange: 'onSparkpointValidityChange'
            },
            sparkpointAbbreviationField: {
                blur: 'onSparkpointAbbreviationFieldBlur'
            },
            sparkpointTeacherTitleField: {
                blur: 'onSparkpointTeacherTitleFieldBlur'
            },
            sparkpointDiscardButton: {
                click: 'onSparkpointDiscardClick'
            },
            sparkpointSaveButton: {
                click: 'onSparkpointSaveClick'
            },

            documentsTable: {
                boxready: 'onDocumentsTableReady',
                selectionchange: 'onDocumentSelectionChange'
            },
            'srm-sparkpoints-standardstable jarvus-searchfield': {
                change: 'onStandardsSearchChange'
            },
            standardsTable: {
                selectionchange: 'onStandardSelectionChange',
                sparkpointalignclick: 'onStandardSparkpointAlignClick'
            }
        }
    },


    onCreateContentAreaClick: function() {
        var contentAreasTable = this.getContentAreasTable(),
            parentContentArea = contentAreasTable.getSelection()[0] || contentAreasTable.getRootNode();

        if (parentContentArea.get('leaf')) {
            parentContentArea.set('children', []);
            parentContentArea.set('leaf', false);
        }

        parentContentArea.expand(false, function() {
            contentAreasTable.getPlugin('cellediting').startEdit(
                parentContentArea.appendChild({
                    leaf: true,
                    title: ''
                }),
                0 // first column
            );
        });
    },

    onContentAreaBeforeSelect: function(rowModel, record) {
        if (record.phantom) {
            return false;
        }
    },

    onContentAreaSelectionChange: function(selModel, contentAreas) {
        this.getMainPanel().setSelectedContentArea(contentAreas[0] || null);
    },

    onSelectedContentAreaChange: function(mainPanel, contentArea) {
        var contentAreaPanel = this.getContentAreaPanel();

        if (contentArea) {
            this.getSparkpointsSparkpointsStore().filter('content_area_id', contentArea.getId());
            contentAreaPanel.enable();
            contentArea.expand();
        } else {
            contentAreaPanel.disable();
        }
    },

    onContentAreaCancelEdit: function(cellEditingPlugin, context) {
        var record = context.record,
            parent = record.parentNode;

        if (record.phantom) {
            record.remove();

            if (!parent.childNodes.length) {
                parent.set('leaf', true);
            }
        }
    },

    onCreateSparkpointClick: function() {
        var sparkpointsTable = this.getSparkpointsTable(),
            contentArea = this.getContentAreasTable().getSelection()[0],
            sparkpoint;

        if (!contentArea) {
            return;
        }

        sparkpoint = sparkpointsTable.getStore().insert(0, { })[0];

        // set content_area_id after instantiating record so it is treated as a dirty value
        sparkpoint.set('content_area_id', contentArea.getId());

        sparkpointsTable.setSelection(sparkpoint);
        
        this.getSparkpointAbbreviationField().focus(true);
    },

    onSparkpointTableBeforeDeselect: function(sparkpointTable, sparkpoint) {
        if (this.getSparkpointForm().isDirty()) {
            Ext.Msg.alert('Unsaved changes', '<p>You have unsaved changes in the sparkpoint editor.</p><p>Please save or discard them before moving to another sparkpoint</p>');
            return false;
        }
    },

    onSparkpointTableSelectionChange: function(selModel, sparkpoints) {
        this.getMainPanel().setSelectedSparkpoint(sparkpoints[0] || null);
    },

    onSelectedSparkpointChange: function(mainPanel, sparkpoint) {
        var me = this,
            selModel = me.getSparkpointsTable().getSelectionModel(),
            sparkpointPanel = me.getSparkpointPanel();

        if (sparkpoint) {
            selModel.select(sparkpoint);
    
            me.getSparkpointForm().loadRecord(sparkpoint);
            sparkpointPanel.enable();
    
            me.getDependenciesTable().setRootNode({
                expanded: true,
                source_sparkpoint: sparkpoint
            });
    
            me.getDependentsTable().setRootNode({
                expanded: true,
                target_sparkpoint: sparkpoint
            });
    
            me.getSparkpointsEdgesStore().filter([{
                property: 'sparkpoint_id',
                value: sparkpoint.getId()
            }]);
        } else {
            selModel.deselectAll();
            sparkpointPanel.disable();
        }

        me.getAlignmentsTable().setSparkpoint(sparkpoint);
    },

    onSparkpointEdgesLoad: function(edgesStore) {
        var dependenciesRootNode = this.getDependenciesTable().getRootNode(),
            dependentsRootNode = this.getDependentsTable().getRootNode(),
            sparkpoint = dependenciesRootNode.get('source_sparkpoint'),
            sparkpointId = sparkpoint.getId(),
            dependenciesNodes = [],
            dependentsNodes = [];

        if (!sparkpoint) {
            return;
        }

        edgesStore.each(function(edge) {
            var sourceId = edge.get('source_sparkpoint_id'),
                targetId = edge.get('target_sparkpoint_id');

            if (edge.get('rel_type') != 'dependency') {
                return;
            }

            if (sparkpointId == sourceId) {
                dependenciesNodes.push(Ext.applyIf({leaf: true}, edge.getData()));
            } else if (sparkpointId == targetId) {
                dependentsNodes.push(Ext.applyIf({leaf: true}, edge.getData()));
            }
        });

        dependenciesRootNode.appendChild(dependenciesNodes);
        dependentsRootNode.appendChild(dependentsNodes);
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

    onSparkpointAbbreviationFieldBlur: function(abbreviationField) {
        var codeField = this.getSparkpointCodeField(),
            abbreviation = abbreviationField.getValue(),
            contentArea = this.getContentAreasTable().getSelection()[0];

        if (!codeField.getValue() && abbreviation) {
            codeField.setValue( (contentArea ? contentArea.get('code') + '.' : '') + abbreviation);
        }
    },

    onSparkpointTeacherTitleFieldBlur: function(teacherTitleField) {
        var studentTitleField = this.getSparkpointStudentTitleField(),
            teacherTitle = teacherTitleField.getValue();

        if (!studentTitleField.getValue() && teacherTitle) {
            studentTitleField.setValue(teacherTitle);
        }
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

    onSparkpointWrite: function(sparkpointsStore, operation) {
        var contentAreasStore = this.getContentAreasTable().getStore(),
            records = operation.getRecords(),
            recordsLen = records.length,
            i = 0, record, contentArea;

        if (operation.getAction() == 'create') {
            for (; i < recordsLen; i++) {
                record = records[i];
                contentArea = contentAreasStore.getById(record.get('content_area_id'));
                contentArea.set('sparkpoints_count', contentArea.get('sparkpoints_count') + 1);
            }
        }
    },

    onSparkpointUpdate: function(sparkpointsStore, sparkpoint, operation) {
        var sparkpointForm = this.getSparkpointForm(),
            loadedSparkpoint = sparkpointForm.getRecord();

        if (operation == 'commit' && sparkpoint === loadedSparkpoint) {
            // re-load record after commit to reset form dirty tracking and load any server-modified values
            sparkpointForm.loadRecord(sparkpoint);
        }
    },

    onDocumentsTableReady: function(documentsTable) {
        var store = documentsTable.getStore();

        if (!store.isLoaded() || !store.isLoading()) {
            store.load();
        }
    },

    onDocumentSelectionChange: function(selModel, documents) {
        this.getMainPanel().setSelectedDocument(documents[0] || null);
    },

    onSelectedDocumentChange: function(mainPanel, document) {
        var standardsTable = this.getStandardsTable(),
            standardsStore = standardsTable.getStore();

        if (document) {
            standardsStore.setRootNode(Ext.applyIf({
                expanded: true
            }, document.getData()));
        } else {
            standardsStore.setRootNode({
                expanded: true,
                children: []
            });
        }

        standardsTable.setDisabled(!document);
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
    },

    onStandardSelectionChange: function(selModel, standards) {
        this.getMainPanel().setSelectedStandard(standards[0] || null);
    },

    onSelectedStandardChange: function(mainPanel, standard) {
        var selModel = this.getStandardsTable().getSelectionModel();

        if (standard) {
            selModel.select(standard);
            standard.expand();
        } else {
            selModel.deselectAll();
        }
    },

    onStandardSparkpointAlignClick: function(standardsTable, standard) {
        this.getAlignmentsTable().createAlignment(standard);
    }
});