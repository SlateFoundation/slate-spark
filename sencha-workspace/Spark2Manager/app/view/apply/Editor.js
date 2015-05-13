Ext.define('Spark2Manager.view.apply.Editor', {
    requires: [
        'Spark2Manager.widget.DurationField',

        'Ext.form.Panel',
        'Ext.layout.container.Anchor',
        'Ext.form.FieldSet',
        'Ext.layout.container.VBox',
        'Ext.form.field.TextArea',
        'Spark2Manager.plugin.FieldReplicator',
        'Ext.form.field.Text',
        'Ext.form.field.Tag',
        'Ext.Array',
        'Ext.layout.container.Fit'
    ],
    extend:   'Ext.panel.Panel',

    xtype: 's2m-apply-editor',

    config: {
        layout:     {
            type: 'vbox',
            align: 'stretch'
        },
        scrollable: true,
        record: null
    },

    items: [{
        xtype: 'fieldset',

        id: 'details-fieldset',

        title:      'Project Details',
        layout:     'anchor',
        flex:       1,
        scrollable: true,

        items: [{
            xtype:        'tagfield',
            fieldLabel:   'Standards Met',
            labelAlign:   'top',
            displayField: 'standardCode',
            valueField:   'standardCode',
            store:        'StandardCodes',
            anchor: '100%',
            grow: true,
            multiSelect:  true,
            getModelData: function () {
                return {
                    'Standards': Ext.Array.map(this.valueStore.collect('standardCode'), function (code) {
                        return {
                            standardCode: code
                        }
                    })
                };
            },
            renderer:     function (val, col, record) {
                val = record.get('Standards');

                if (!Array.isArray(val)) {
                    return '';
                }

                return val.map(function (standard) {
                    return standard.standardCode || standard;
                }).join(', ');
            }
        }, {
            xtype: 'form',
            id:    'details-form',
            grow:  true,
            items: [{
                xtype:      'durationfield',
                fieldLabel: 'Time Estimate',
                labelAlign: 'top',
                duration:   90
            }]
        }]
    }, {
        xtype: 'fieldset',

        id: 'todos-fieldset',

        title:      'Todos',
        layout:     'anchor',
        padding:    10,
        flex:       1,
        scrollable: true,

        defaultType: 'textfield',

        items: [{
            anchor: '100%',
            xtype:         'textarea',
            plugins:       ['fieldreplicator'],
            triggerAction: 'all',
            labelAlign:    'top',
            emptyText:     'Type your todo here. When you are done typing, press tab to enter another.',
            listeners: {
                blur: function() {
                    if (this.isDirty()) {
                        console.warn('We need to save a todo sir!');
                    }
                }
            }
        }]
    }, {
        xtype: 'fieldset',

        id: 'links-fieldset',

        title:       'Links',
        layout:      'anchor',
        defaultType: 'textfield',
        padding:     10,
        flex:        1,
        scrollable:  true,

        items: [{
            anchor: '100%',
            xtype:         'textfield',
            plugins:       ['fieldreplicator'],
            triggerAction: 'all',
            labelAlign:    'top',
            emptyText:     'Enter your link URL here. Press tab to enter another.',
            listeners: {
                blur: function() {
                    if (this.isDirty()) {
                        console.error('We need to save a link sir!');
                    }
                }
            }
        }]
    }],

    applyRecord: function(rec) {
        debugger;

        var me = this,
            detailsFieldset = me.down('#details-fieldset');

        detailsFieldset.setTitle(rec.get('Title'));
        detailsFieldset.down('tagfield').setValue(rec.get('Standards'));

        console.log(rec.get('Standards'));
    }
});