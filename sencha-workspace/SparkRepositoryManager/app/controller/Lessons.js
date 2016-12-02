/**
 * The Lessons controller manages the Lessons section of the application where
 * staff can add and edit lessons
 *
 * ## Responsibilities
 * - Add lessons
 * - Edit lessons
 */
Ext.define('SparkRepositoryManager.controller.Lessons', {
    extend: 'Ext.app.Controller',
    requires: [
        'SparkRepositoryManager.model.Lesson',
        'Ext.window.Toast'
    ],


    // mutable state
    config: {
        lesson: null,
        suspended: false
    },


    // dependencies
    models: [
        'LearnLink',
        'GuidingQuestion',
        'ConferenceResource',
        'ApplyProject'
    ],

    stores: [
        'Lessons',
        'ContentItems',
        'lesson.LearnContent',
        'lesson.QuestionContent',
        'lesson.ResourceContent',
        'lesson.ApplyContent'
    ],

    views: [
        'lessons.editor.LearnForm',
        'lessons.editor.QuestionForm',
        'lessons.editor.ResourceForm',
        'lessons.editor.ApplyForm'
    ],

    // component references
    refs: [

        // top level containers
        {
            ref: 'lessonCt',
            selector: 's2m-lessons-panel'
        }, {
            ref: 'lessonTreepanel',
            selector: 's2m-lessons-navigator treepanel'
        }, {
            ref: 'lessonEditor',
            selector: 's2m-lessons-editor'
        }, {
            ref: 'lessonEditorTabPanel',
            selector: 's2m-lessons-editor tabpanel'
        }, {
            ref: 'lessonMeta',
            selector: 's2m-lessons-editor form#lessons-meta-info'
        },

        // editor panel
        {
            ref: 'publishButton',
            selector: 's2m-lessons-editor button[action="publish"]'
        }, {
            ref: 'globalCheckbox',
            selector: 's2m-lessons-editor checkbox[name="global"]'
        },

        // intro tab
        {
            ref: 'sparkpointsCombo',
            selector: 's2m-lessons-editor-intro combo[name="sparkpoints"]'
        }, {
            ref: 'sparkpointGrid',
            selector: 's2m-lessons-editor-intro grid#sparkpoint-grid'
        }, {
            ref: 'phaseStartFieldContainer',
            selector: 's2m-lessons-editor-intro fieldcontainer#phase_start'
        }, {
            ref: 'directionsTextarea',
            selector: 's2m-lessons-editor-intro textarea[name="directions"]'
        },

        // tabs
        {
            ref: 'learnsSelectorLessonGrid',
            selector: 's2m-lessons-editor-learn s2m-lessons-multiselector grid#lesson-grid'
        }, {
            ref: 'learnsRequiredTextfield',
            selector: 's2m-lessons-editor-learn field[name="learns_required"]'
        }, {
            ref: 'questionsSelectorLessonGrid',
            selector: 's2m-lessons-editor-questions s2m-lessons-multiselector grid#lesson-grid'
        }, {
            ref: 'resourcesSelectorLessonGrid',
            selector: 's2m-lessons-editor-resources s2m-lessons-multiselector grid#lesson-grid'
        }, {
            ref: 'resourcesSelectorSparkpointsGrid',
            selector: 's2m-lessons-editor-resources s2m-lessons-multiselector grid#sparkpoints-grid'
        }, {
            ref: 'appliesSelectorLessonGrid',
            selector: 's2m-lessons-editor-apply s2m-lessons-multiselector grid#lesson-grid'
        }, {
            ref: 'learnForm',
            selector: 's2m-lessons-editor-learnform',
            xtype: 's2m-lessons-editor-learnform',
            autoCreate: true
        }, {
            ref: 'questionForm',
            selector: 's2m-lessons-editor-questionform',
            xtype: 's2m-lessons-editor-questionform',
            autoCreate: true
        }, {
            ref: 'resourceForm',
            selector: 's2m-lessons-editor-resourceform',
            xtype: 's2m-lessons-editor-resourceform',
            autoCreate: true
        }, {
            ref: 'applyForm',
            selector: 's2m-lessons-editor-applyform',
            xtype: 's2m-lessons-editor-applyform',
            autoCreate: true
        }

    ],


    // entry points
    listen: {
        store: {
            '#ContentItems': {
                beforeload: 'onContentItemsStoreBeforeLoad',
                loadcomplete: 'onContentItemsStoreLoadComplete'
            }
        }
    },

    control: {

        // top level containers
        's2m-lessons-navigator button[action="add-new-lesson"]': {
            click: 'onNewLessonClick'
        },
        's2m-lessons-navigator treepanel': {
            select: 'onTreepanelSelect'
        },
        '#lessons-meta-info field': {
            change: 'onLessonMetaFieldChange'
        },

        // editor panel
        's2m-lessons-editor button[action="clone"]': {
            click: 'onCloneButtonClick'
        },
        's2m-lessons-editor button[action="publish"]': {
            click: 'onPublishButtonClick'
        },
        's2m-lessons-editor checkbox[name="global"]': {
            change: 'onLessonMetaFieldChange'
        },
        's2m-lessons-editor combo[name="content_area_id"]': {
            boxready: 'onContentAreaBoxReady',
            change: 'onContentAreaChange'
        },

        // intro tab
        's2m-lessons-editor-intro grid#sparkpoint-grid': {
            boxready: 'onSparkpointGridBoxready'
        },
        's2m-lessons-editor-intro button[action="add-sparkpoint"]': {
            click: 'onAddSparkpointClick'
        },
        's2m-lessons-editor-intro fieldcontainer#phase_start textfield': {
            change: 'onPhaseStartFieldChange'
        },
        's2m-lessons-editor-intro textarea[name="directions"]': {
            change: 'onLessonMetaFieldChange'
        },

        // other tabs
        's2m-lessons-editor-learn field[name="learns_required"]': {
            change: 'onLessonMetaFieldChange'
        },
        's2m-lessons-multiselector grid#lesson-grid': {
            boxready: 'onLessonGridBoxready',
            groupclicked: 'onLessonGridGroupClick'
        },

        // forms
        's2m-lessons-editor-learn button[action="add-learn"]': {
            click: 'onAddLearnButtonClick'
        },
        's2m-lessons-editor-learnform button[action="save"]': {
            click: 'onLearnFormSaveClick'
        },
        's2m-lessons-editor-learn button[action="add-learn-group"]': {
            click: 'onAddLearnGroupButtonClick'
        },
        's2m-lessons-editor-questions button[action="add-question"]': {
            click: 'onAddQuestionButtonClick'
        },
        's2m-lessons-editor-questionform button[action="save"]': {
            click: 'onQuestionFormSaveClick'
        },
        's2m-lessons-editor-resources button[action="add-resource"]': {
            click: 'onAddResourceButtonClick'
        },
        's2m-lessons-editor-resourceform button[action="save"]': {
            click: 'onResourceFormSaveClick'
        },
        's2m-lessons-editor-apply button[action="add-apply"]': {
            click: 'onAddApplyButtonClick'
        },
        's2m-lessons-editor-applyform button[action="save"]': {
            click: 'onApplyFormSaveClick'
        }
    },


    // config handlers
    updateLesson: function(lesson) {
        var me = this;

        me.loadLesson(lesson);
        me.refreshContentItems(lesson.get('sparkpoints'));
    },


    // event handlers - stores
    onContentItemsStoreBeforeLoad: function() {
        var me = this,
            tabpanel = me.getLessonEditorTabPanel(),
            grid = tabpanel.getActiveTab().down('#sparkpoints-grid');

        if (grid) {
            grid.getView().findFeature('grouping').disable();
        }

        me.getLessonTreepanel().disable();
        tabpanel.disable()
    },

    onContentItemsStoreLoadComplete: function() {
        var me = this,
            tabpanel = me.getLessonEditorTabPanel(),
            grid = tabpanel.getActiveTab().down('#sparkpoints-grid');

        if (grid) {
            grid.getView().findFeature('grouping').enable();
        }

        me.getLessonTreepanel().enable();
        tabpanel.enable()
    },

    onLessonSparkpointGridStoreUpdate: function() {
        var me = this,
            lesson = me.getLesson(),
            sparkpoints = me.getSparkpointGrid().getStore().getRange(),
            sparkpointsLength = sparkpoints.length,
            lessonSparkpoints = [],
            i = 0;

        if (!me.getSuspended()) {

            for (; i<sparkpointsLength; i++) {
                lessonSparkpoints.push(sparkpoints[i].getData());
            }

            if (lesson !== null) {
                lesson.set('sparkpoints', lessonSparkpoints);
                me.saveLesson();
            }
        }
    },

    onLessonSparkpointGridStoreDataChanged: function() {
        var me = this,
            lesson = me.getLesson(),
            sparkpoints = me.getSparkpointGrid().getStore().getRange(),
            sparkpointsLength = sparkpoints.length,
            sparkpointIds = [],
            lessonSparkpoints = [],
            sparkpoint,
            i = 0;

        if (!me.getSuspended()) {

            for (; i<sparkpointsLength; i++) {
                sparkpoint = sparkpoints[i];
                lessonSparkpoints.push(sparkpoint.getData());

                // add sparkpoint id to array used for ContentItems store url parameter
                sparkpointIds.push(sparkpoints[i].get('id'));
            }

            if (lesson !== null) {
                lesson.set('sparkpoints', lessonSparkpoints);
                me.saveLesson();
            }

            me.refreshContentItems(lesson.get('sparkpoints'));
        }
    },

    // event handlers - navigator
    onNewLessonClick: function() {
        var me = this;

        me.setLesson(Ext.create('SparkRepositoryManager.model.Lesson', {}));
        me.getLessonEditor().setDisabled(false);
        me.getLessonTreepanel().getSelectionModel().deselectAll();
    },

    onTreepanelSelect: function(treepanel, record) {
        var me = this,
            editor = me.getLessonEditor();

        if (editor.isDisabled()) {
            editor.setDisabled(false);
        }
        me.setLesson(record);
    },

    // event handlers - editor
    onCloneButtonClick: function() {
        var me = this,
            lesson = me.getLesson(),
            clone = lesson.copy(null);  // clone the record but no id

        clone.set('published', null);
        clone.set('modified', null);
        clone.set('sparkpoint_id', null);

        me.setLesson(clone);
        me.saveLesson();
    },

    onPublishButtonClick: function() {
        var me = this,
            lesson = me.getLesson();

        // TODO: How are we going to handle this?
        lesson.set('published', new Date());

        me.saveLesson();
    },

    onLessonMetaFieldChange: function(field, val) {
        var me = this,
            fieldName = field.getName(),
            lesson = me.getLesson();

        if (fieldName !== 'code') {
            lesson.set(field.getName(), val);
            me.saveLesson();
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

    // event handlers - Intro tab
    onSparkpointGridBoxready: function(grid) {
        var me = this;

        grid.getStore().addListener({
            datachanged: Ext.bind(me.onLessonSparkpointGridStoreDataChanged, me),
            update: Ext.bind(me.onLessonSparkpointGridStoreUpdate, me)
        });
    },

    onAddSparkpointClick: function() {
        var me = this,
            sparkpoint = me.getSparkpointsCombo().getSelection(),
            store = me.getSparkpointGrid().getStore();

        if (sparkpoint) {
            // reduce the sparkpoint to an object containing id and code
            sparkpoint = me.objectSkim(sparkpoint.getData(), ['id', 'code']);

            // add the willBeEvaluated attribute
            Ext.apply(sparkpoint, { willBeEvaluated: false });

            store.add(sparkpoint);
        }
    },

    onPhaseStartFieldChange: function(field, val) {
        var me = this,
            fieldName = field.getName(),
            lesson = me.getLesson(),
            phaseStart = lesson.get('phase_start') || {};

        phaseStart[fieldName] = val;
        lesson.set('phase_start', phaseStart);
        me.saveLesson();
    },

    // event handlers - Other tabs
    onLessonGridBoxready: function(grid) {
        var me = this,
            itemType = grid.up('s2m-lessons-multiselector').itemType.field,
            store = grid.getStore();

        // This reloads lesson data in case this grid was not drawn when current lesson was loaded
        if (!store.isLoaded()) {
            me.loadLesson(me.getLesson());
        }

        store.addListener({
            datachanged: Ext.bind(me.updateSparkpointItems, me, [itemType, grid]),
            update: Ext.bind(me.updateSparkpointItems, me, [itemType, grid])
        });
    },

    onLessonGridGroupClick: function(grid) {
        console.log('---------------onLessonGridGroupClick----------------');
    },

    onAddLearnButtonClick: function() {
        var me = this,
            win = me.getLearnForm(),
            form = win.down('form');

        form.reset();
        win.show();
    },

    onAddLearnGroupButtonClick: function() {
        var me = this,
            grid = me.getLearnsSelectorLessonGrid(),
            store = grid.getStore(),
            groups = store.getGroups(),
            group = 'UNNAMED GROUP',
            groupCnt = 0;

        me.setSuspended(true);

        if (groups) {
            groupCnt++;
            group = 'Group '+ groupCnt;

            while (groups.containsKey(group)) {
                groupCnt++;
                group = 'Group '+ groupCnt;
            }
        }

        store.addSorted(Ext.create('Ext.data.Model', {
            lessongroup: group,
            fusebox_id: -1,  // eslint-disable-line camelcase
            title: 'dummy'
        }));
        store.group({ property: 'lessongroup' });

        me.setSuspended(false);
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

    onLearnFormSaveClick: function() {
        var me = this,
            win = me.getLearnForm(),
            form = win.down('form'),
            vals = form.getForm().getValues(),
            model = me.getLearnLinkModel(),
            record = model.create(vals),
            store = me.getLearnsSelectorLessonGrid().getStore();

        record.save({
            success: function(rec) {
                store.add(me.convertFieldNames(rec.getData()));
            },
            failure: function() {
                Ext.toast('ERROR: learn could not be saved');
            }
        });

        form.reset();
        win.close()
    },

    onQuestionFormSaveClick: function() {
        var me = this,
            win = me.getQuestionForm(),
            form = win.down('form'),
            vals = form.getForm().getValues(),
            model = me.getGuidingQuestionModel(),
            record = model.create(vals),
            store = me.getQuestionsSelectorLessonGrid().getStore();

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
            store = me.getResourcesSelectorLessonGrid().getStore();

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
            store = me.getAppliesSelectorLessonGrid().getStore();

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
    loadLesson: function(lesson) {
        var me = this,
            meta = me.getLessonMeta(),
            phaseStart = lesson.get('phase_start') || {},
            phaseStartCnt = me.getPhaseStartFieldContainer(),
            sparkpoints = lesson.get('sparkpoints') || [],
            learns = lesson.get('learns') || [],
            questions = lesson.get('conference_questions') || [],
            resources = lesson.get('conference_resources') || [],
            applies = lesson.get('applies') || [];

        console.log('loading record'); // eslint-disable-line no-console, /* TODO: remove this */
        console.log(lesson.getData()); // eslint-disable-line no-console, /* TODO: remove this */

        me.setSuspended(true);

        // meta fields
        meta.loadRecord(lesson);
        me.getGlobalCheckbox().setValue(lesson.get('global'));
        me.getPublishButton().setDisabled(lesson.get('published'));

        // intro tab
        me.getSparkpointGrid().getStore().loadData(sparkpoints);
        me.getDirectionsTextarea().setValue(lesson.get('directions'));
        phaseStartCnt.down('field[name="LP"]').setValue(phaseStart.LP);
        phaseStartCnt.down('field[name="C"]').setValue(phaseStart.C);
        phaseStartCnt.down('field[name="Ap"]').setValue(phaseStart.Ap);
        phaseStartCnt.down('field[name="As"]').setValue(phaseStart.As);
        phaseStartCnt.down('field[name="Total"]').setValue(phaseStart.Total);

        // other tabs
        me.getLearnsSelectorLessonGrid().getStore().loadData(me.transformNestedGroupRecords(learns));
        //me.getLearnsRequiredTextfield().setValue(lesson.get('learns_required'));

        me.getQuestionsSelectorLessonGrid().getStore().loadData(questions);
        me.getResourcesSelectorLessonGrid().getStore().loadData(resources);
        me.getAppliesSelectorLessonGrid().getStore().loadData(applies);

        me.setSuspended(false);
        console.log('loaded record'); // eslint-disable-line no-console
    },

    saveLesson: function() {
        var me = this,
            lesson = me.getLesson(),
            phantom = lesson.phantom,
            err, e;

        if (!me.getSuspended()) {

            console.log('saving lesson'); // eslint-disable-line no-console
            console.log(lesson); // eslint-disable-line no-console, /* TODO: remove this */

            // do not send id field if this is a new record
            lesson.getField('id').persist = !phantom;

            lesson.save({
                callback: function(record, operation, success) {
                    if (success) {
                        me.loadLesson(lesson);
                        if (phantom) {
                            me.getLessonsStore().load({
                                callback: Ext.bind(me.syncNavigatorSelection, me)
                            });
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

    refreshContentItems: function(sparkpoints) {
        var me = this,
            sparkpointIds = [],
            sparkpointsLength,
            i = 0;

        if (sparkpoints && sparkpoints.length) {

            sparkpointsLength = sparkpoints.length;

            for (; i<sparkpointsLength; i++) {
                sparkpointIds.push(sparkpoints[i].id);
            }

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
            lesson = me.getLesson(),
            sparkpointItemsStore = grid.getStore(),
            sparkpointItems = sparkpointItemsStore.getRange(),
            sparkpointItemsLength = sparkpointItems.length,
            lessonItems = [],
            lessonGroups = [],
            groupsFieldName,
            i = 0, item;

        if (sparkpointItemsStore.isGrouped()) {

            for (; i<sparkpointItemsLength; i++) {
                item = me.objectSkim(sparkpointItems[i].getData(), [
                    'fusebox_id', 'resource_id', 'isRequired', 'isRecommended', 'lessongroup'
                ]);

                if (lessonGroups.indexOf(item.lessongroup) === -1) {
                    lessonGroups.push(item.lessongroup);
                }

                if (item.fusebox_id !== -1) {    // exclude dummy records needed for empty groups

                    if (item.isRequired) {
                        item.assignment = 'required';
                    } else if (item.isRecommended) {
                        item.assignment = 'recommended';
                    } else {
                        item.assignment = null;
                    }

                    // group ordering starts at 1
                    // eslint-disable-next-line camelcase
                    item.group_id = lessonGroups.indexOf(item.lessongroup) + 1;

                    lessonItems.push(me.objectSkim(item, [
                        'fusebox_id', 'resource_id', 'assignment', 'group_id'
                    ]));
                }
            }

            // transform array of group names into array of group objects
            for (i=0; i<lessonGroups.length; i++) {
                lessonGroups[i] = {
                    id: i+1,                  // eslint-disable-line camelcase
                    title: lessonGroups[i]     // eslint-disable-line camelcase
                };
            }

            /*
             * The groups field uses the singular of the fieldname so rather than write:
             * lesson.set(itemType + '_groups', lessonGroups);
             * we'll check for an ending "s" and cut it off if it exists
             */
            groupsFieldName = itemType.charAt(itemType.length - 1) === 's' ? itemType.slice(0, -1) : itemType;
            lesson.set(groupsFieldName + '_groups', lessonGroups);

        } else {
            for (; i<sparkpointItemsLength; i++) {
                lessonItems.push(me.objectSkim(sparkpointItems[i].getData(), [
                    'fusebox_id', 'title', 'url', 'question', 'dok'
                ]));
            }
        }

        if (lesson !== null) {
            lesson.set(itemType, lessonItems);
            me.saveLesson();
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
    },


    // return a reduced version of the object with only the specified attributes
    objectSkim: function(obj, attributes) {
        var newObj = {},
            attributesLength = attributes.length,
            i = 0, key;

        for (; i<attributesLength; i++) {
            key = attributes[i];
            newObj[key] = obj[key];
        }
        return newObj;
    },

    // make sure the lesson that is loaded is also selected in the navigator
    syncNavigatorSelection: function() {
        var me = this,
            lesson = this.getLesson(),
            treepanel = me.getLessonTreepanel();

        if (treepanel.getSelection()[0] !== lesson) {
            treepanel.getSelectionModel().select(treepanel.getStore().indexOf(lesson), false, false);
        }
    },

    transformNestedGroupRecords: function(jsonData) {
        var recs = [],
            lessonGroups,
            lessonGroupsLength,
            lessonGroupName,
            lessonGroup,
            lessonGroupLength,
            i, r, rec;

        if (jsonData !== null && typeof jsonData === 'object' && !Array.isArray(jsonData)) {
            lessonGroups = Object.keys(jsonData);
            lessonGroupsLength = lessonGroups.length;

            for (i=0; i<lessonGroupsLength; i++) {  // loop through groups
                lessonGroupName = lessonGroups[i];
                lessonGroup = jsonData[lessonGroupName];

                if (Array.isArray(lessonGroup)) {   // lessonGroup should be an array of record data objects
                    lessonGroupLength = lessonGroup.length;

                    if (lessonGroupLength === 0) {
                        // add a dummy record if this is an empty group
                        recs.push({
                            lessongroup: lessonGroupName,
                            fusebox_id: -1,  // eslint-disable-line camelcase
                            title: 'dummy'
                        });
                    } else {
                        for (r=0; r<lessonGroupLength; r++) {
                            rec = lessonGroup[r];
                            rec.lessongroup = lessonGroupName;   // set the lessongroup field
                            recs.push(rec)
                        }
                    }
                }
            }

        } else {
            // eslint-disable-next-line no-console
            console.warn('invalid group data received.  Expected object, found ' + (Array.isArray(jsonData) ? 'array' : typeof jsonData));
        }

        return recs;
    }

});
