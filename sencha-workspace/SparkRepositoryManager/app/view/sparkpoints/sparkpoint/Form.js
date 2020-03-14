Ext.define('SparkRepositoryManager.view.sparkpoints.sparkpoint.Form', {
    extend: 'Ext.form.Panel',
    xtype: 'srm-sparkpoints-sparkpointform',
    requires: [
        'Ext.tab.Panel',
        'Ext.form.CheckboxGroup',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.form.field.Checkbox',
        'SparkRepositoryManager.field.LevelSlider'
    ],


    trackResetOnLoad: true,

    fieldDefaults: {
        msgTarget: 'under'
    },

    defaults: {
        anchor: '100%'
    },

    items: [{
        xtype: 'textfield',
        fieldLabel: 'Abbr',
        labelWidth: 50,
        name: 'abbreviation',
        allowBlank: false
    }, {
        xtype: 'textfield',
        fieldLabel: 'Code',
        labelWidth: 50,
        name: 'code',
        allowBlank: false
    // },{
    //     xtype: 'srm-field-levelslider',
    //     fieldLabel: 'Target Level Range'
    // },{
    //     xtype: 'checkboxgroup',
    //     items: [{
    //         boxLabel: 'Anchor',
    //         name: 'anchor',
    //         inputValue: true
    //     },{
    //         boxLabel: 'Power',
    //         name: 'power',
    //         inputValue: true
    //     }]
    }, {
        // TODO: move to own panel below grids maybe?
        xtype: 'textarea',
        fieldLabel: 'Editor Memo',
        labelAlign: 'top',
        name: 'editor_memo'
    }, {
        xtype: 'tabpanel',
        defaults: {
            bodyPadding: 10,
            tabConfig: {
                flex: 1
            },
            layout: 'anchor',
            defaults: {
                xtype: 'textarea',
                anchor: '100%',
                labelAlign: 'top',
                height: 100
            }
        },
        items: [{
            title: 'For teachers',
            items: [{
                fieldLabel: 'Teacher Title',
                name: 'teacher_title',
                allowBlank: false,
                regex: /^[^\r\n]+$/,
                regexText: 'Title cannot contain line breaks'
            }, {
                fieldLabel: 'Teacher Description',
                name: 'teacher_description'
            }]
        }, {
            title: 'For students',
            items: [{
                fieldLabel: 'Student Title',
                name: 'student_title',
                allowBlank: false,
                regex: /^[^\r\n]+$/,
                regexText: 'Title cannot contain line breaks'
            }, {
                fieldLabel: 'Student Description',
                name: 'student_description'
            }]
        }]
    }]
});
