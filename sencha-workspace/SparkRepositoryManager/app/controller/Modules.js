/**
 * The Modules controller manages the Modules section of the application where
 * staff can add and edit modules
 *
 * ## Responsibilities
 * - Add modules
 * - Edit modules
 */
Ext.define('SparkRepositoryManager.controller.Modules', {
    extend: 'Ext.app.Controller',
    requires: [
        'SparkRepositoryManager.model.Module',
        'Ext.window.Toast'
    ],


    // mutable state
    config: {
        module: null,
        suspended: false
    },


    // dependencies
    models: [
        'GuidingQuestion',
        'ConferenceResource',
        'ApplyProject'
    ],

    stores: [
        'Modules',
        'ContentItems'
    ],

    views: [
        'modules.editor.QuestionForm',
        'modules.editor.ResourceForm',
        'modules.editor.ApplyForm'
    ],

    // component references
    refs: [

        // top level containers
        {
            ref: 'moduleCt',
            selector: 's2m-modules-panel'
        }, {
            ref: 'moduleTreepanel',
            selector: 's2m-modules-navigator treepanel'
        }, {
            ref: 'moduleEditor',
            selector: 's2m-modules-editor'
        }, {
            ref: 'moduleMeta',
            selector: 's2m-modules-editor form#modules-meta-info'
        },

        // editor panel
        {
            ref: 'publishButton',
            selector: 's2m-modules-editor button[action="publish"]'
        }, {
            ref: 'globalCheckbox',
            selector: 's2m-modules-editor checkbox[name="global"]'
        },

        // intro tab
        {
            ref: 'sparkpointsCombo',
            selector: 's2m-modules-editor-intro combo[name="sparkpoints"]'
        }, {
            ref: 'sparkpointGrid',
            selector: 's2m-modules-editor-intro grid#sparkpoint-grid'
        }, {
            ref: 'phaseStartFieldContainer',
            selector: 's2m-modules-editor-intro fieldcontainer#phase_start'
        }, {
            ref: 'directionsTextarea',
            selector: 's2m-modules-editor-intro textarea[name="directions"]'
        },

        // tabs
        {
            ref: 'learnsSelectorModuleGrid',
            selector: 's2m-modules-editor-learn s2m-modules-multiselector grid#module-grid'
        }, {
            ref: 'questionsSelectorModuleGrid',
            selector: 's2m-modules-editor-questions s2m-modules-multiselector grid#module-grid'
        }, {
            ref: 'resourcesSelectorModuleGrid',
            selector: 's2m-modules-editor-resources s2m-modules-multiselector grid#module-grid'
        }, {
            ref: 'appliesSelectorModuleGrid',
            selector: 's2m-modules-editor-apply s2m-modules-multiselector grid#module-grid'
        }, {
            ref: 'questionForm',
            selector: 's2m-modules-editor-questionform',
            xtype: 's2m-modules-editor-questionform',
            autoCreate: true
        }, {
            ref: 'resourceForm',
            selector: 's2m-modules-editor-resourceform',
            xtype: 's2m-modules-editor-resourceform',
            autoCreate: true
        }, {
            ref: 'applyForm',
            selector: 's2m-modules-editor-applyform',
            xtype: 's2m-modules-editor-applyform',
            autoCreate: true
        }

    ],


    // entry points
    control: {

        // top level containers
        's2m-modules-panel': {
            moduleupdate: 'onModuleUpdate'
        },
        's2m-modules-navigator button[action="add-new-module"]': {
            click: 'onNewModuleClick'
        },
        's2m-modules-navigator treepanel': {
            select: 'onTreepanelSelect'
        },
        '#modules-meta-info field': {
            change: 'onModuleMetaFieldChange'
        },

        // editor panel
        's2m-modules-editor button[action="publish"]': {
            click: 'onPublishButtonClick'
        },
        's2m-modules-editor checkbox[name="global"]': {
            change: 'onModuleMetaFieldChange'
        },
        's2m-modules-editor combo[name="content_area_id"]': {
            boxready: 'onContentAreaBoxReady',
            change: 'onContentAreaChange'
        },

        // intro tab
        's2m-modules-editor-intro grid#sparkpoint-grid': {
            boxready: 'onSparkpointGridBoxready'
        },
        's2m-modules-editor-intro button[action="add-sparkpoint"]': {
            click: 'onAddSparkpointClick'
        },
        's2m-modules-editor-intro fieldcontainer#phase_start textfield': {
            change: 'onPhaseStartFieldChange'
        },
        's2m-modules-editor-intro textarea[name="directions"]': {
            change: 'onModuleMetaFieldChange'
        },

        // other tabs
        's2m-modules-multiselector grid#module-grid': {
            boxready: 'onModuleGridBoxready'
        },

        // forms
        's2m-modules-editor-learn button[action="add-learn"]': {
            click: 'onAddLearnButtonClick'
        },
        's2m-modules-editor-questions button[action="add-question"]': {
            click: 'onAddQuestionButtonClick'
        },
        's2m-modules-editor-questionform button[action="save"]': {
            click: 'onQuestionFormSaveClick'
        },
        's2m-modules-editor-resources button[action="add-resource"]': {
            click: 'onAddResourceButtonClick'
        },
        's2m-modules-editor-resourceform button[action="save"]': {
            click: 'onResourceFormSaveClick'
        },
        's2m-modules-editor-apply button[action="add-apply"]': {
            click: 'onAddApplyButtonClick'
        },
        's2m-modules-editor-applyform button[action="save"]': {
            click: 'onApplyFormSaveClick'
        }
    },


    // controller templates method overrides
    init: function() {
    //    var me = this;

    //    me.getContentItemsStore().load({
    //        params: {
    //            sparkpoint_ids: 'M1000564' // eslint-disable-line camelcase
    //        }
    //    });


    //    if (me.getModule() === null) {
    //        me.setModule(Ext.create('SparkRepositoryManager.model.Module', {}));
    //    }
    },

    // config handlers
    updateModule: function(module) {
        this.loadModule(module);
    },


    // event handlers
    onModuleUpdate: function(container, module) {
        console.log('Module has been updated!'); // eslint-disable-line no-console
        console.log(module); // eslint-disable-line no-console
        // module.save();
//        console.log(module.getData()); // eslint-disable-line no-console
    },

    onNewModuleClick: function() {
        var me = this;

        me.setModule(Ext.create('SparkRepositoryManager.model.Module', {}));
        me.getModuleEditor().setDisabled(false);
        me.getModuleTreepanel().getSelectionModel().deselectAll();
    },

    onTreepanelSelect: function(treepanel, record) {
        var me = this,
            editor = me.getModuleEditor();

        if (editor.isDisabled()) {
            editor.setDisabled(false);
        }
        me.setModule(record);
    },

    onPublishButtonClick: function() {
        var me = this,
            module = me.getModule();

        // TODO: How are we going to handle this?
        module.set('published', new Date());

        me.saveModule();

    },

    onModuleMetaFieldChange: function(field, val) {
        var me = this,
            fieldName = field.getName(),
            module = me.getModule();

        if (fieldName !== 'code') {
            module.set(field.getName(), val);
            me.saveModule();
        }
    },

    onContentAreaChange: function(combo, val) {
        this.getSparkpointsCombo().getStore().load({
            params: {
                content_area_id: val    // eslint-disable-line camelcase
            }
        });
    },

    onContentAreaBoxReady: function(combo) {
        var store = combo.getStore();

        if (!store.isLoaded() && !store.isLoading()) {
            combo.getStore().load();
        }
    },

    onPhaseStartFieldChange: function(field, val) {
        var me = this,
            fieldName = field.getName(),
            module = me.getModule(),
            phaseStart = module.get('phase_start') || {};

        phaseStart[fieldName] = val;
        module.set('phase_start', phaseStart);
        me.saveModule();

    },

    // event handlers - Intro tab
    onSparkpointGridBoxready: function(grid) {
        var me = this;

        grid.getStore().addListener({
            datachanged: Ext.bind(me.updateSparkpoints, me),
            update: Ext.bind(me.updateSparkpoints, me)
        });
    },

    onAddSparkpointClick: function() {
        var me = this,
            sparkpoint = me.getSparkpointsCombo().getSelection(),
            store = me.getSparkpointGrid().getStore();

        if (sparkpoint) {
            store.add(sparkpoint);
        }
    },

    // event handlers - Other tabs
    onModuleGridBoxready: function(grid) {
        var me = this,
            itemType = grid.up('s2m-modules-multiselector').itemType.field;

        grid.getStore().addListener({
            datachanged: Ext.bind(me.updateSparkpointItems, me, [itemType, grid]),
            update: Ext.bind(me.updateSparkpointItems, me, [itemType, grid])
        });
    },

    onAddLearnButtonClick: function() {
        console.log('onAddLearnButtonClick'); // eslint-disable-line no-console
    },

    onAddQuestionButtonClick: function() {
        var me = this,
            win = me.getQuestionForm(),
            form = win.down('form');

        form.reset();
        win.show();
    },

    onAddResourceButtonClick: function() {
        var me = this,
            win = me.getResourceForm(),
            form = win.down('form');

        form.reset();
        win.show();
    },

    onAddApplyButtonClick: function() {
        var me = this,
            win = me.getApplyForm(),
            form = win.down('form');

        form.reset();
        win.show();
    },

    onQuestionFormSaveClick: function() {
        var me = this,
            win = me.getQuestionForm(),
            form = win.down('form'),
            vals = form.getForm().getValues(),
            model = me.getGuidingQuestionModel(),
            record = model.create(vals),
            store = me.getQuestionsSelectorModuleGrid().getStore();

        record.save({
            success: function(rec) {
                store.add(me.convertFieldNames(rec.getData()));
            },
            failure: function() {
                Ext.toast('ERROR: question could not be saved');
            }
        });

        form.reset();
        win.close()
    },

    onResourceFormSaveClick: function() {
        var me = this,
            win = me.getResourceForm(),
            form = win.down('form'),
            vals = form.getForm().getValues(),
            model = me.getConferenceResourceModel(),
            record = model.create(vals),
            store = me.getResourcesSelectorModuleGrid().getStore();

        record.save({
            success: function(rec) {
                store.add(me.convertFieldNames(rec.getData()));
            },
            failure: function() {
                Ext.toast('ERROR: resource could not be saved');
            }
        });

        form.reset();
        win.close()
    },

    onApplyFormSaveClick: function() {
        var me = this,
            win = me.getApplyForm(),
            form = win.down('form'),
            vals = form.getForm().getValues(),
            model = me.getApplyProjectModel(),
            record = model.create(vals),
            store = me.getAppliesSelectorModuleGrid().getStore();

        record.save({
            success: function(rec) {
                store.add(me.convertFieldNames(rec.getData()));
            },
            failure: function() {
                Ext.toast('ERROR: apply could not be saved');
            }
        });

        form.reset();
        win.close()
    },


    // custom controller methods
    loadModule: function(module) {
        var me = this,
            meta = me.getModuleMeta(),
            phaseStart = module.get('phase_start') || {},
            phaseStartCnt = me.getPhaseStartFieldContainer(),
            sparkpoints = module.get('sparkpoints') || [],
            learns = module.get('learns') || [],
            questions = module.get('conference_questions') || [],
            resources = module.get('conference_resources') || [],
            applies = module.get('applies') || [];

        console.log('loading record'); // eslint-disable-line no-console, /* TODO: remove this */
        console.log(module.getData()); // eslint-disable-line no-console, /* TODO: remove this */

        me.setSuspended(true);

        // meta fields
        meta.loadRecord(module);
        me.getGlobalCheckbox().setValue(module.get('global'));
        me.getPublishButton().setDisabled(module.get('published'));

        // intro tab
        me.getSparkpointGrid().getStore().loadData(sparkpoints);
        me.getDirectionsTextarea().setValue(module.get('directions'));
        phaseStartCnt.down('field[name="LP"]').setValue(phaseStart.LP);
        phaseStartCnt.down('field[name="C"]').setValue(phaseStart.C);
        phaseStartCnt.down('field[name="Ap"]').setValue(phaseStart.Ap);
        phaseStartCnt.down('field[name="As"]').setValue(phaseStart.As);
        phaseStartCnt.down('field[name="Total"]').setValue(phaseStart.Total);

        // other tabs
        me.getLearnsSelectorModuleGrid().getStore().loadData(learns);
        me.getQuestionsSelectorModuleGrid().getStore().loadData(questions);
        me.getResourcesSelectorModuleGrid().getStore().loadData(resources);
        me.getAppliesSelectorModuleGrid().getStore().loadData(applies);

        me.setSuspended(false);
        console.log('loaded record'); // eslint-disable-line no-console
    },

    saveModule: function() {
        var me = this,
            module = me.getModule(),
            phantom = module.phantom,
            err, e;

        if (!me.getSuspended()) {

            console.log('saving module'); // eslint-disable-line no-console

            // do not send id field if this is a new record
            module.getField('id').persist = !phantom;

            module.save({
                callback: function(record, operation, success) {
                    if (success) {
                        me.loadModule(module);
                        if (phantom) {
                            me.getModulesStore().load();
                        }
                    } else {
                        err = operation.error;

                        if (err && err.response && err.response.responseText) {
                            e = Ext.decode(operation.error.response.responseText, true);

                            if (e && e.error && e.error.message) {
                                Ext.toast('ERROR: ' + e.error.message);
                            } else {
                                Ext.toast('ERROR: unknown error');
                            }

                        } else {
                            Ext.toast('ERROR: unknown error');
                        }
                    }
                }
            });

        }
    },

    updateSparkpoints: function() {
        var me = this,
            module = me.getModule(),
            sparkpoints = me.getSparkpointGrid().getStore().getRange(),
            sparkpointsLength = sparkpoints.length,
            sparkpointIds = [],
            moduleSparkpoints = [],
            i = 0;

        for (; i<sparkpointsLength; i++) {
            sparkpointIds.push(sparkpoints[i].get('id'));
            moduleSparkpoints.push(sparkpoints[i].getData());
        }

        if (module !== null) {
            module.set('sparkpoints', moduleSparkpoints);
            me.saveModule();
        }

        me.getContentItemsStore().load({
            params: {
                sparkpoint_ids: sparkpointIds.join() // eslint-disable-line camelcase
            }
        });

    },

    onResourcesAddSparkpointClick: function() {
        console.log('onResourcesAddSparkpointClick'); // eslint-disable-line no-console
    },

    updateSparkpointItems: function(itemType, grid) {
        var me = this,
            module = me.getModule(),
            sparkpointItems = grid.getStore().getRange(),
            sparkpointItemsLength = sparkpointItems.length,
            moduleItems= [],
            i = 0;

        for (; i<sparkpointItemsLength; i++) {
            moduleItems.push(sparkpointItems[i].getData());
        }

        if (module !== null) {
            module.set(itemType, moduleItems);
            me.saveModule();
        }
    },

    // convert Emergence camelcase field names to lowercase used by spark-api
    convertFieldNames: function(obj) {
        var keys = Object.keys(obj),
            keysLength = keys.length,
            newObj = {},
            i = 0,
            key;

        for (; i < keysLength; i++) {
            key = keys[i];
            newObj[key.toLowerCase()] = obj[key];
        }

        return newObj;
    }

});
