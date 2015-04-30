Ext.define('Spark2Manager.view.assess.Panel', {
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.selection.CellModel',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.button.Button'
    ],

    store: [
        'Assessments'
    ],

    extend: 'Ext.Container',

    xtype: 's2m-assess-panel'
});
